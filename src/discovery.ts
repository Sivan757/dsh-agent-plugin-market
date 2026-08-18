/**
 * Suite discovery facade: maps a repository checkout (or a configured source
 * list) onto normalized suites.
 *
 * Pipeline: the manifest layer (src/discovery/manifests.ts) detects which
 * suite-manifest dialects a root carries and resolves names; the roots step
 * decides where suites live (marketplace entries, a single root, container
 * scans, or manifest-less skill collections); the surface layer
 * (src/discovery/surfaces.ts) scans skills/commands/agents/hooks/lsp/mcp.
 *
 * The public API of this module is the discovery contract importers depend
 * on: discoverSuitesInSource, discoverSourceList, listMdFiles,
 * discoverLspEntries, and the new repoName for source-id derivation.
 */
import { readFile, readdir } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
import { expandHome, isDirectory, sanitizeId, sourcesDir } from './paths.js'
import type { McpSuiteConfig, SourceRef, Suite, SuiteDimension, SuiteManifest, SuiteSkill, SuiteSurfaceCounts } from './types.js'
import {
  declaredSkillsPath,
  detectManifest,
  marketplaceEntryDir,
  readManifest,
  readMarketplace,
  repoName,
  syntheticManifestName,
  type Marketplace,
  type MarketplaceEntry,
} from './discovery/manifests.js'
import {
  countSurfaces,
  discoverLspEntries,
  discoverMcp,
  discoverSkills,
  listMdFiles,
  type LspEntry,
} from './discovery/surfaces.js'

export { repoName, listMdFiles, discoverLspEntries }
export type { LspEntry }

const CONTAINER_DIRS = ['plugins', 'external_plugins', 'skills'] as const
const DOT_DIRS = new Set(['.git', '.github', '.claude', '.cursor', '.kimi', '.plugin', '.sources', 'node_modules'])

/** Discover every suite under one cloned source checkout. */
export async function discoverSuitesInSource(checkoutDir: string, sourceId: string, dimension: SuiteDimension): Promise<Suite[]> {
  const roots = await suiteRoots(checkoutDir)
  const suites: Suite[] = []
  for (const root of roots) {
    const suite = root.dir === undefined
      ? remoteSuite(sourceId, dimension, root)
      : await readSuite(root.dir, sourceId, dimension, root.hint)
    if (suite !== undefined) suites.push(suite)
  }
  return suites
}

interface SuiteHint {
  name?: string
  version?: string
  description?: string
}

interface SuiteRoot {
  dir?: string
  hint?: SuiteHint
  remoteUrl?: string
}

/**
 * Resolve the suite roots of one checkout. A marketplace manifest is the
 * authoritative list: local entries (relative paths, Codex `{source:
 * 'local', path}`) surface when they carry a manifest or skills, container
 * paths recurse into nested plugin dirs, and remote-URL entries become
 * metadata-only remote suites. Manifest-bearing container dirs the
 * marketplace did not list (e.g. official example plugins) are supplemented.
 * Without a marketplace: a single-suite root, a recursive manifest/skill
 * scan, or a manifest-less skill collection applies.
 */
async function suiteRoots(checkoutDir: string): Promise<SuiteRoot[]> {
  const marketplace = await readMarketplace(checkoutDir)
  if (marketplace !== undefined && marketplace.entries.length > 0) {
    const roots: SuiteRoot[] = []
    const seen = new Set<string>()
    for (const entry of marketplace.entries) {
      const hint = { name: entry.name, version: entry.version, description: entry.description }
      const dir = marketplaceEntryDir(checkoutDir, entry)
      if (dir === undefined) {
        const remoteUrl = typeof entry.source === 'object' ? entry.source?.url : undefined
        // Dedupe by entry name, not URL: one remote repo can host several
        // plugins that each appear as their own marketplace entry.
        const entryName = typeof entry.name === 'string' && entry.name !== '' ? entry.name : remoteUrl
        if (remoteUrl !== undefined && entryName !== undefined && !seen.has(entryName)) {
          roots.push({ hint, remoteUrl })
          seen.add(entryName)
        }
        continue
      }
      await collectRoot(dir, hint, roots, seen)
    }
    for (const container of CONTAINER_DIRS) {
      const containerDir = join(checkoutDir, container)
      if (!await isDirectory(containerDir)) continue
      for (const child of await listChildDirs(containerDir)) {
        if (!seen.has(child) && await hasSuiteManifest(child)) roots.push({ dir: child })
      }
    }
    return roots
  }
  if (await hasSuiteManifest(checkoutDir)) return [{ dir: checkoutDir }]
  const found: SuiteRoot[] = []
  await collectRoot(checkoutDir, undefined, found, new Set())
  if (found.length > 0) return found
  // Manifest-less skill collection (the flat `<root>/<name>/SKILL.md` shape).
  const collection: SuiteRoot[] = []
  for (const child of await listChildDirs(checkoutDir)) {
    if (await hasSkillFiles(child)) collection.push({ dir: child })
  }
  return collection
}

/** Collect one root, recursing through container dirs (nested `plugins/`
 *  bundles) up to four levels so Codex runtime layouts
 *  (`plugins/<bundle>/plugins/<name>`) are reached. */
async function collectRoot(dir: string, hint: SuiteHint | undefined, out: SuiteRoot[], seen: Set<string>, depth = 0): Promise<void> {
  if (depth > 4 || seen.has(dir)) return
  if (await hasSuiteManifest(dir) || await hasSkillFiles(dir)) {
    out.push({ dir, hint })
    seen.add(dir)
    return
  }
  for (const child of await listChildDirs(dir)) {
    await collectRoot(child, hint, out, seen, depth + 1)
  }
}

/** Whether a directory carries any known suite manifest. */
async function hasSuiteManifest(dir: string): Promise<boolean> {
  return (await detectManifest(dir)) !== undefined
}

/** Whether a directory carries skill files in the flat or bundled shape. */
async function hasSkillFiles(dir: string): Promise<boolean> {
  if (await isFile(join(dir, 'SKILL.md'))) return true
  const skillsDir = join(dir, 'skills')
  if (!await isDirectory(skillsDir)) return false
  for (const child of await listChildDirs(skillsDir)) {
    if (await isFile(join(child, 'SKILL.md'))) return true
  }
  return false
}

async function listChildDirs(dir: string): Promise<string[]> {
  let entries: import('node:fs').Dirent[]
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  return entries
    .filter(entry => entry.isDirectory() && !DOT_DIRS.has(entry.name) && !entry.name.startsWith('.'))
    .map(entry => join(dir, entry.name))
}

/** Read one suite root into the normalized shape, or `undefined` when no manifest parses. */
async function readSuite(root: string, sourceId: string, dimension: SuiteDimension, hint: SuiteHint | undefined): Promise<Suite | undefined> {
  const errors: string[] = []
  const manifest = await readManifest(root, errors, hint) ?? await syntheticManifest(root)
  if (manifest === undefined) return undefined
  const declared = await declaredSkillsPath(root)
  const skills = await discoverSkills(root, errors, declared)
  const mcp = await discoverMcp(root, errors)
  const surfaces = await countSurfaces(root, skills, mcp)
  return {
    sourceId,
    id: manifest.id,
    root,
    manifest,
    skills,
    ...mcp === undefined ? {} : { mcp },
    surfaces,
    dimension,
    enabled: false,
    errors,
  }
}

/** Metadata-only suite for a marketplace entry whose content lives in a
 *  remote repository that is not part of this clone. */
function remoteSuite(sourceId: string, dimension: SuiteDimension, root: SuiteRoot): Suite {
  const name = root.hint?.name ?? 'remote-plugin'
  return {
    sourceId,
    id: sanitizeId(name),
    root: '',
    manifest: {
      layout: 'remote',
      path: '',
      id: sanitizeId(name),
      name,
      version: root.hint?.version,
      description: root.hint?.description,
    },
    skills: [],
    surfaces: { skills: 0, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 },
    dimension,
    enabled: false,
    remote: { url: root.remoteUrl ?? '' },
    errors: [],
  }
}

/** Manifest-less directories still produce a synthetic suite identity. */
async function syntheticManifest(root: string): Promise<SuiteManifest | undefined> {
  if (!await hasSkillFiles(root)) return undefined
  const name = syntheticManifestName(root)
  return {
    layout: 'skill-collection',
    path: join(root, 'SKILL.md'),
    id: sanitizeId(name),
    name,
  }
}

async function isFile(path: string): Promise<boolean> {
  try {
    return (await (await import('node:fs/promises')).stat(path)).isFile()
  } catch {
    return false
  }
}

/** Whether a suite root path lies outside the checkout (defense for malformed marketplace sources). */
export function isOutside(root: string, candidate: string): boolean {
  return isAbsolute(candidate) ? !candidate.startsWith(root) : false
}

/**
 * Discover every suite of one dimension's configured sources, plus manual
 * checkouts present under the dimension's `.sources/` that no source entry
 * names. Local sources read their directory directly; git sources read
 * their clone; a missing checkout contributes nothing.
 */
export async function discoverSourceList(sources: SourceRef[], dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]> {
  const checkoutRoot = sourcesDir(dimensionRoot)
  const bySource = new Map<string, Suite[]>()
  const listed = new Set(sources.map(source => source.id))
  try {
    for (const entry of await readdir(checkoutRoot, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.name.startsWith('.') || listed.has(entry.name)) continue
      bySource.set(entry.name, await discoverSuitesInSource(join(checkoutRoot, entry.name), entry.name, dimension))
    }
  } catch {
    // a missing checkout root simply has no manual checkouts
  }
  for (const source of sources) {
    const checkout = source.local === true ? expandHome(source.url) : join(checkoutRoot, source.id)
    if (!await isDirectory(checkout)) continue
    bySource.set(source.id, await discoverSuitesInSource(checkout, source.id, dimension))
  }
  return [...bySource.values()].flat()
}
