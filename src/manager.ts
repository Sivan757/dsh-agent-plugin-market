/**
 * SuiteManager: the host-authoritative orchestrator behind the market page.
 *
 * Owns the persisted state (sources + install entries), discovery over the
 * source checkouts, and every mutating action (source add/remove/refresh,
 * install/uninstall, enable/disable). Mutations serialize through a
 * single-flight queue so concurrent HTTP actions cannot interleave state
 * writes or git operations. After every mutation it calls `onChanged()`,
 * which is where the runtime consumers (skill registry invalidation, MCP
 * mount reconciliation) pick the new enabled set up.
 */
import { mkdir, readdir } from 'node:fs/promises'
import { isDirectory } from './paths.js'
import { join } from 'node:path'
import { discoverSuitesInSource } from './discovery.js'
import { gitClone, gitHead, gitPull, gitRemove } from './git.js'
import { resolveProjectRoot, sourceCheckoutDir, sourcesDir, STATE_FILE_NAME } from './paths.js'
import { loadState, saveState, EMPTY_STATE } from './state.js'
import type { InstalledEntry, OverviewPayload, SourceOverview, SourceRef, Suite, SuiteDimension, SuiteState } from './types.js'

export interface ManagerOptions {
  userRoot: string
  dataRoot: string
  onChanged: () => void
}

export class SuiteManager {
  private state: SuiteState = EMPTY_STATE
  private mutationQueue: Promise<unknown> = Promise.resolve()
  private readonly statePath: string

  constructor(private readonly options: ManagerOptions) {
    this.statePath = join(options.userRoot, STATE_FILE_NAME)
  }

  /** Load persisted state once at plugin activation. */
  async load(): Promise<void> {
    this.state = await loadState(this.statePath)
  }

  get sources(): SourceRef[] {
    return this.state.sources
  }

  /** The user-dimension suite root this manager operates. */
  get userRoot(): string {
    return this.options.userRoot
  }

  /** The full market overview: fresh discovery merged with install entries. */
  async overview(): Promise<OverviewPayload> {
    const suites = await this.discoverDimension('user', this.options.userRoot)
    const sourceRows: SourceOverview[] = []
    for (const source of this.state.sources) {
      const checkout = sourceCheckoutDir(this.options.userRoot, source.id)
      let cloned = false
      let lockCommit: string | undefined
      let error: string | undefined
      try {
        lockCommit = await gitHead(checkout)
        cloned = true
      } catch {
        // not cloned yet (or a broken checkout); the clone attempt records its own error on refresh
      }
      const sourceSuites = suites.filter(suite => suite.sourceId === source.id)
      sourceRows.push({
        id: source.id,
        url: source.url,
        ...source.branch === undefined ? {} : { branch: source.branch },
        cloned,
        ...lockCommit === undefined ? {} : { lockCommit },
        ...error === undefined ? {} : { error },
        suiteIds: sourceSuites.map(suite => suite.id),
      })
    }
    const installed = new Set(Object.keys(this.state.installed))
    const cards = suites.map(suite => ({
      sourceId: suite.sourceId,
      suiteId: suite.id,
      name: suite.manifest.name,
      version: suite.manifest.version,
      description: suite.manifest.description,
      keywords: suite.manifest.keywords ?? [],
      surfaces: suite.surfaces,
      enabled: suite.enabled,
      installed: installed.has(installKey(suite.sourceId, suite.id)),
      dimension: suite.dimension,
      layout: suite.manifest.layout,
      errors: suite.errors,
    }))
    return {
      sources: sourceRows,
      suites: cards,
      totals: {
        all: cards.length,
        installed: cards.filter(card => card.installed).length,
        enabled: cards.filter(card => card.enabled).length,
      },
      roots: { user: this.options.userRoot, data: this.options.dataRoot },
    }
  }

  /** Enabled user-dimension suites (the MCP mount input). */
  async enabledUserSuites(): Promise<Suite[]> {
    const suites = await this.discoverDimension('user', this.options.userRoot)
    return suites.filter(suite => suite.enabled)
  }

  /** Enabled user- and project-dimension suites for a workspace cwd. */
  async enabledSuitesForCwd(cwd: string): Promise<{ user: Suite[]; project: Suite[] }> {
    const user = await this.enabledUserSuites()
    const project = (await this.discoverDimension('project', await resolveProjectRoot(cwd))).filter(suite => suite.enabled)
    return { user, project }
  }

  /** All suites (any enabled state) of one dimension. */
  async suitesForDimension(dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]> {
    return this.discoverDimension(dimension, dimensionRoot)
  }

  // ---- mutations ----

  /** Add a source and clone it immediately; clone failure is recorded as the action error. */
  async addSource(source: SourceRef): Promise<void> {
    return this.enqueue(async () => {
      if (this.state.sources.some(existing => existing.id === source.id)) {
        throw new Error(`source id "${source.id}" already exists`)
      }
      this.state = { ...this.state, sources: [...this.state.sources, source] }
      await saveState(this.statePath, this.state)
      await this.ensureClone(source)
      this.options.onChanged()
    })
  }

  /** Remove a source: delete its checkout, forget its suites and install entries. */
  async removeSource(sourceId: string): Promise<void> {
    return this.enqueue(async () => {
      this.state = {
        ...this.state,
        sources: this.state.sources.filter(source => source.id !== sourceId),
        installed: Object.fromEntries(Object.entries(this.state.installed).filter(([key]) => !key.startsWith(`${sourceId}/`))),
      }
      await saveState(this.statePath, this.state)
      await gitRemove(sourceCheckoutDir(this.options.userRoot, sourceId))
      this.options.onChanged()
    })
  }

  /** Refresh one source checkout (pull), or every source when `sourceId` is omitted. */
  async refreshSource(sourceId?: string): Promise<void> {
    return this.enqueue(async () => {
      const targets = sourceId === undefined ? this.state.sources : this.state.sources.filter(source => source.id === sourceId)
      for (const source of targets) {
        const checkout = sourceCheckoutDir(this.options.userRoot, source.id)
        try {
          await gitHead(checkout)
        } catch {
          await this.ensureClone(source)
          continue
        }
        await gitPull(checkout)
      }
      this.options.onChanged()
    })
  }

  /** Install a suite: the source must be cloned; the suite dir becomes an enabled install entry. */
  async install(sourceId: string, suiteId: string): Promise<void> {
    return this.enqueue(async () => {
      const source = this.state.sources.find(entry => entry.id === sourceId)
      if (source === undefined) throw new Error(`unknown source "${sourceId}"`)
      const checkout = sourceCheckoutDir(this.options.userRoot, sourceId)
      if (!await isDirectory(checkout)) await this.ensureClone(source)
      const suites = await discoverSuitesInSource(checkout, sourceId, 'user')
      const suite = suites.find(entry => entry.id === suiteId)
      if (suite === undefined) throw new Error(`suite "${suiteId}" not found in source "${sourceId}"`)
      await this.setInstalled(sourceId, suiteId, { enabled: true, installedAt: new Date().toISOString(), lockCommit: await tryHead(checkout) })
      this.options.onChanged()
    })
  }

  /** Uninstall a suite: drop the install entry (the source clone stays for browsing). */
  async uninstall(sourceId: string, suiteId: string): Promise<void> {
    return this.enqueue(async () => {
      const key = installKey(sourceId, suiteId)
      if (this.state.installed[key] === undefined) throw new Error(`suite "${suiteId}" is not installed`)
      const { [key]: _removed, ...rest } = this.state.installed
      this.state = { ...this.state, installed: rest }
      await saveState(this.statePath, this.state)
      this.options.onChanged()
    })
  }

  /** Enable or disable an installed suite. */
  async setEnabled(sourceId: string, suiteId: string, enabled: boolean): Promise<void> {
    return this.enqueue(async () => {
      const key = installKey(sourceId, suiteId)
      const entry = this.state.installed[key]
      if (entry === undefined) throw new Error(`suite "${suiteId}" is not installed`)
      await this.setInstalled(sourceId, suiteId, { ...entry, enabled })
      this.options.onChanged()
    })
  }

  /** Append config-seeded sources missing from state and persist; clones lazily on first refresh/install. */
  async mergeSources(sources: SourceRef[]): Promise<void> {
    const existing = new Set(this.state.sources.map(source => source.id))
    const additions = sources.filter(source => !existing.has(source.id))
    if (additions.length === 0) return
    this.state = { ...this.state, sources: [...this.state.sources, ...additions] }
    await saveState(this.statePath, this.state)
  }

  private async setInstalled(sourceId: string, suiteId: string, entry: InstalledEntry): Promise<void> {
    this.state = { ...this.state, installed: { ...this.state.installed, [installKey(sourceId, suiteId)]: entry } }
    await saveState(this.statePath, this.state)
  }

  private async ensureClone(source: SourceRef): Promise<void> {
    const checkout = sourceCheckoutDir(this.options.userRoot, source.id)
    await mkdir(sourcesDir(this.options.userRoot), { recursive: true })
    await gitClone(source.url, source.branch, checkout)
  }

  private async discoverDimension(dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]> {
    const checkoutRoot = sourcesDir(dimensionRoot)
    let entries: import('node:fs').Dirent[]
    try {
      entries = await readdir(checkoutRoot, { withFileTypes: true })
    } catch {
      return []
    }
    const suites: Suite[] = []
    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name.startsWith('.')) continue
      const checkout = join(checkoutRoot, entry.name)
      const discovered = await discoverSuitesInSource(checkout, entry.name, dimension)
      for (const suite of discovered) {
        const installed = this.state.installed[installKey(suite.sourceId, suite.id)]
        suites.push({
          ...suite,
          enabled: dimension === 'user' && installed?.enabled === true,
          ...installed?.lockCommit === undefined ? {} : { lockCommit: installed.lockCommit },
          ...installed?.installedAt === undefined ? {} : { installedAt: installed.installedAt },
        })
      }
    }
    return suites
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationQueue.then(operation, operation)
    this.mutationQueue = result.catch(() => {})
    return result
  }
}

function installKey(sourceId: string, suiteId: string): string {
  return `${sourceId}/${suiteId}`
}

/** Read a checkout's HEAD when it is a git repository; other checkouts have no lock commit. */
async function tryHead(dir: string): Promise<string | undefined> {
  try {
    return await gitHead(dir)
  } catch {
    return undefined
  }
}
