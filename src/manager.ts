/**
 * Compatibility facade for the former SuiteManager entry point.
 *
 * New host code can migrate to `application/catalog.ts` directly. This facade
 * preserves the existing class name and method surface while delegating state,
 * discovery, mutations, and snapshots to the Catalog application module.
 */
import type { McpStatusPayload } from './contracts/mcp-status.js'
import type { OverviewPayload, SourceProgress, SourceOverview, SkillContent, SuiteDetail } from './contracts/market.js'
import { Catalog, type CatalogOptions, type CatalogSnapshot } from './application/catalog.js'
import type { McpToolSnapshot } from './mcp-status.js'
import type { InstalledEntry, SourceRef, Suite, SuiteDimension } from './types.js'

/** Construction options retained for callers of the legacy facade. */
export type ManagerOptions = CatalogOptions

export class SuiteManager {
  private readonly catalog: Catalog

  constructor(options: ManagerOptions) {
    this.catalog = new Catalog(options)
  }

  /** Install the host tool snapshot provider used by MCP status queries. */
  setMcpToolSnapshotProvider(provider: () => readonly McpToolSnapshot[]): void {
    this.catalog.setMcpToolSnapshotProvider(provider)
  }

  /** Latest MCP mount diagnostics, retained for the host reconcile callback. */
  get mcpDiagnostics(): Array<{ suiteId: string; serverKey: string; reason: string }> {
    return this.catalog.mcpDiagnostics
  }

  set mcpDiagnostics(value: Array<{ suiteId: string; serverKey: string; reason: string }>) {
    this.catalog.mcpDiagnostics = value
  }

  /** Read the MCP status projection. */
  async mcpStatus(): Promise<McpStatusPayload> {
    return this.catalog.mcpStatus()
  }

  /** Load persisted state once at plugin activation. */
  async load(): Promise<void> {
    return this.catalog.load()
  }

  get sources(): SourceRef[] {
    return this.catalog.sources
  }

  /** The user-dimension suite root. */
  get userRoot(): string {
    return this.catalog.userRoot
  }

  /** Read a coherent user-dimension catalog snapshot. */
  async readUserCatalog(): Promise<CatalogSnapshot> {
    return this.catalog.readUserCatalog()
  }

  /** Read a coherent project-dimension catalog snapshot. */
  async readProjectCatalog(cwd: string): Promise<CatalogSnapshot> {
    return this.catalog.readProjectCatalog(cwd)
  }

  /** Read one suite's detail projection. */
  async suiteDetail(sourceId: string, suiteId: string): Promise<SuiteDetail> {
    return this.catalog.suiteDetail(sourceId, suiteId)
  }

  /** Read one skill's full content. */
  async skillContent(sourceId: string, suiteId: string, skillName: string): Promise<SkillContent> {
    return this.catalog.skillContent(sourceId, suiteId, skillName)
  }

  /** Read the full market overview. */
  async overview(): Promise<OverviewPayload> {
    return this.catalog.overview()
  }

  /** Enabled user-dimension suites. */
  async enabledUserSuites(): Promise<Suite[]> {
    return this.catalog.enabledUserSuites()
  }

  /** Enabled user- and project-dimension suites for a workspace cwd. */
  async enabledSuitesForCwd(cwd: string): Promise<{ user: Suite[]; project: Suite[] }> {
    return this.catalog.enabledSuitesForCwd(cwd)
  }

  /** All suites in one dimension. */
  async suitesForDimension(dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]> {
    return this.catalog.suitesForDimension(dimension, dimensionRoot)
  }

  /** Subscribe to completed catalog mutations. */
  subscribe(listener: () => void): () => void {
    return this.catalog.subscribe(listener)
  }

  /** Add a source. */
  async addSource(input: { url: string; branch?: string; local?: boolean }): Promise<SourceRef> {
    return this.catalog.addSource(input)
  }

  /** Begin source mutation progress. */
  beginSourceState(sourceId: string, step: string, cloned: boolean): void {
    this.catalog.beginSourceState(sourceId, step, cloned)
  }

  /** Advance source mutation progress. */
  updateSourceStep(step: string): void {
    this.catalog.updateSourceStep(step)
  }

  /** End source mutation progress. */
  endSourceState(): void {
    this.catalog.endSourceState()
  }

  /** Read source mutation progress. */
  sourceProgress(): SourceProgress {
    return this.catalog.sourceProgress()
  }

  /** Update a source. */
  async updateSource(sourceId: string, patch: { url?: string; branch?: string; local?: boolean }): Promise<void> {
    return this.catalog.updateSource(sourceId, patch)
  }

  /** Remove a source. */
  async removeSource(sourceId: string): Promise<void> {
    return this.catalog.removeSource(sourceId)
  }

  /** Refresh one source or all sources. */
  async refreshSource(sourceId?: string): Promise<void> {
    return this.catalog.refreshSource(sourceId)
  }

  /** Install a suite. */
  async install(sourceId: string, suiteId: string): Promise<void> {
    return this.catalog.install(sourceId, suiteId)
  }

  /** Uninstall a suite. */
  async uninstall(sourceId: string, suiteId: string): Promise<void> {
    return this.catalog.uninstall(sourceId, suiteId)
  }

  /** Enable or disable an installed suite. */
  async setEnabled(sourceId: string, suiteId: string, enabled: boolean): Promise<void> {
    return this.catalog.setEnabled(sourceId, suiteId, enabled)
  }

  /** Merge config-seeded sources into persisted user state. */
  async mergeSources(sources: SourceRef[]): Promise<void> {
    return this.catalog.mergeSources(sources)
  }
}

/** Keep the internal type import available to declaration consumers during migration. */
export type { InstalledEntry, SourceOverview }
