/**
 * Suite discovery: maps one cloned repository source onto normalized suites.
 *
 * Three input layouts normalize onto the internal shape:
 * - agent-plugins.org v1: root `plugin.json` (+ `skills/`, `mcp.json`),
 *   schema-validated with spec semantics;
 * - Claude Code marketplace: root `.claude-plugin/marketplace.json` listing
 *   `plugins[].source` relative dirs (or external URLs), each suite root
 *   carrying `.claude-plugin/plugin.json` and `skills/`;
 * - Codex: `.codex-plugin/plugin.json` at a suite root, optionally declaring
 *   its own `skills` path.
 *
 * A checkout without any marketplace manifest is treated as a single-suite
 * repository when its root carries a manifest, or is scanned one level (plus
 * the conventional `plugins/` and `skills/` containers) for manifest dirs.
 */
import { readFile, readdir, stat } from 'node:fs/promises'
import { isAbsolute, join, resolve } from 'node:path'
import { expandHome, isDirectory, sanitizeId, sourcesDir } from './paths.js'
import { parseSkillFrontmatter } from './skills-parse.js'
import type { McpSuiteConfig, SourceRef, Suite, SuiteDimension, SuiteManifest, SuiteSkill, SuiteSurfaceCounts } from './types.js'
import { isRecognizedSchema, validateMcpJson, validatePluginManifest } from './validate.js'

interface MarketplaceEntry {
  name?: string
  version?: string
  description?: string
  source: string | { source?: string; url?: string }
}

const SUITE_MANIFEST_NAMES = ['plugin.json', join('.claude-plugin', 'plugin.json'), join('.codex-plugin', 'plugin.json')] as const
const CONTAINER_DIRS = ['plugins', 'skills'] as const
const DOT_DIRS = new Set(['.git', '.github', '.claude', '.sources', 'node_modules'])

/** Whether a directory contains any of the three suite manifests. */
export async function hasSuiteManifest(dir: string): Promise<boolean> {
  for (const name of SUITE_MANIFEST_NAMES) {
    if (await isFile(join(dir, name))) return true
  }
  return false
}

async function isFile(path: string): Promise<boolean> {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

/** Discover every suite under one cloned source checkout. */
export async function discoverSuitesInSource(checkoutDir: string, sourceId: string, dimension: SuiteDimension): Promise<Suite[]> {
  const roots = await suiteRoots(checkoutDir)
  const suites: Suite[] = []
  for (const [root, marketplaceHint] of roots) {
    const suite = await readSuite(root, sourceId, dimension, marketplaceHint)
    if (suite !== undefined) suites.push(suite)
  }
  return suites
}

interface MarketplaceHint {
  name?: string
  version?: string
  description?: string
}

/**
 * Resolve the suite roots of one checkout. A marketplace manifest is the
 * authoritative list; otherwise a single-suite root or a flat/manifest-dir
 * scan applies.
 */
async function suiteRoots(checkoutDir: string): Promise<Array<[string, MarketplaceHint | undefined]>> {
  const marketplace = await readMarketplace(checkoutDir)
  if (marketplace !== undefined) {
    const roots: Array<[string, MarketplaceHint | undefined]> = []
    for (const entry of marketplace.entries) {
      if (typeof entry.source === 'string') {
        const dir = resolve(checkoutDir, entry.source)
        if (await hasSuiteManifest(dir)) {
          roots.push([dir, { name: entry.name, version: entry.version, description: entry.description }])
        }
      }
      // External URL sources are not present in the clone; the overview
      // records them as unavailable, so discovery skips them here.
    }
    return roots
  }
  if (await hasSuiteManifest(checkoutDir)) return [[checkoutDir, undefined]]
  const found: Array<[string, MarketplaceHint | undefined]> = []
  for (const child of await listChildDirs(checkoutDir)) {
    if (await hasSuiteManifest(child)) found.push([child, undefined])
  }
  if (found.length > 0) return found
  for (const container of CONTAINER_DIRS) {
    const containerDir = join(checkoutDir, container)
    if (!await isDirectory(containerDir)) continue
    for (const child of await listChildDirs(containerDir)) {
      if (await hasSuiteManifest(child)) found.push([child, undefined])
    }
  }
  if (found.length > 0) return found
  // Manifest-less skill collection (the flat `<root>/<name>/SKILL.md` shape
  // older skill repos ship): each top-level directory carrying a SKILL.md —
  // at its root or under `skills/` — becomes a synthetic suite.
  const collection: Array<[string, MarketplaceHint | undefined]> = []
  for (const child of await listChildDirs(checkoutDir)) {
    if (await hasSkillFiles(child)) collection.push([child, undefined])
  }
  return collection
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

async function readMarketplace(checkoutDir: string): Promise<{ entries: MarketplaceEntry[] } | undefined> {
  const path = join(checkoutDir, '.claude-plugin', 'marketplace.json')
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch {
    return undefined
  }
  try {
    const parsed: unknown = JSON.parse(text)
    if (typeof parsed !== 'object' || parsed === null) return undefined
    const plugins = (parsed as Record<string, unknown>)['plugins']
    if (!Array.isArray(plugins)) return undefined
    return { entries: plugins as MarketplaceEntry[] }
  } catch {
    return undefined
  }
}

/** Read one suite root into the normalized shape, or `undefined` when no manifest parses. */
async function readSuite(root: string, sourceId: string, dimension: SuiteDimension, hint: MarketplaceHint | undefined): Promise<Suite | undefined> {
  const errors: string[] = []
  const manifest = await readManifest(root, errors, hint) ?? await syntheticManifest(root)
  if (manifest === undefined) {
    // A directory without a parseable manifest is not addressable; the
    // discovery walk records nothing and the overview omits it.
    return undefined
  }
  const skills = await discoverSkills(root, errors)
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

async function readManifest(root: string, errors: string[], hint: MarketplaceHint | undefined): Promise<SuiteManifest | undefined> {
  const v1Path = join(root, 'plugin.json')
  if (await isFile(v1Path)) {
    let raw: unknown
    try {
      raw = JSON.parse(await readFile(v1Path, 'utf8'))
    } catch (error) {
      errors.push(`plugin.json unparsable: ${error instanceof Error ? error.message : String(error)}`)
      return undefined
    }
    const problems = await validatePluginManifest(raw)
    errors.push(...problems.map(problem => `plugin.json: ${problem}`))
    const record = raw as Record<string, unknown>
    const schema = record['$schema']
    const name = typeof record['name'] === 'string' && record['name'] !== '' ? record['name'] : hint?.name ?? rootName(root)
    const author = record['author'] as { name?: string; url?: string } | undefined
    return {
      layout: 'agent-plugin-v1',
      path: v1Path,
      id: sanitizeId(name),
      name,
      version: typeof record['version'] === 'string' ? record['version'] : undefined,
      description: typeof record['description'] === 'string' ? record['description'] : hint?.description,
      author: author?.name ?? (typeof record['homepage'] === 'string' ? record['homepage'] : undefined),
      keywords: Array.isArray(record['keywords']) ? (record['keywords'] as unknown[]).filter((entry): entry is string => typeof entry === 'string') : [],
      ...isRecognizedSchema(schema) ? { schemaVersion: schema as string } : {},
    }
  }
  for (const [relative, layout] of [[join('.claude-plugin', 'plugin.json'), 'claude-code'], [join('.codex-plugin', 'plugin.json'), 'codex']] as const) {
    const path = join(root, relative)
    if (!await isFile(path)) continue
    let record: Record<string, unknown>
    try {
      record = JSON.parse(await readFile(path, 'utf8')) as Record<string, unknown>
    } catch (error) {
      errors.push(`${relative} unparsable: ${error instanceof Error ? error.message : String(error)}`)
      return undefined
    }
    const name = typeof record['name'] === 'string' && record['name'] !== '' ? record['name'] : hint?.name ?? rootName(root)
    const author = record['author'] as { name?: string; url?: string } | undefined
    return {
      layout,
      path,
      id: sanitizeId(name),
      name,
      version: typeof record['version'] === 'string' ? record['version'] : hint?.version,
      description: typeof record['description'] === 'string' ? record['description'] : hint?.description,
      author: author?.name ?? (typeof record['homepage'] === 'string' ? record['homepage'] : undefined),
      keywords: Array.isArray(record['keywords']) ? (record['keywords'] as unknown[]).filter((entry): entry is string => typeof entry === 'string') : [],
    }
  }
  return undefined
}

function rootName(root: string): string {
  const base = root.split(/[\\/]/).at(-1) ?? 'plugin'
  return base
}

/** Manifest-less directories still produce a synthetic suite identity. */
async function syntheticManifest(root: string): Promise<SuiteManifest | undefined> {
  if (!await hasSkillFiles(root)) return undefined
  const name = rootName(root)
  return {
    layout: 'skill-collection',
    path: join(root, 'SKILL.md'),
    id: sanitizeId(name),
    name,
  }
}

/** Discover SKILL.md files under the suite's skills directory (immediate children only, spec §7.1). */
async function discoverSkills(root: string, errors: string[]): Promise<SuiteSkill[]> {
  const skills: SuiteSkill[] = []
  const rootSkill = join(root, 'SKILL.md')
  if (await isFile(rootSkill)) {
    const parsed = await parseOneSkill(rootSkill, root, rootName(root), errors)
    if (parsed !== undefined) skills.push(parsed)
  }
  const skillsDir = join(root, 'skills')
  if (!await isDirectory(skillsDir)) return skills
  for (const child of await listChildDirs(skillsDir)) {
    const name = child.split(/[\\/]/).at(-1) ?? ''
    const parsed = await parseOneSkill(join(child, 'SKILL.md'), child, name, errors)
    if (parsed !== undefined) skills.push(parsed)
  }
  return skills
}

/** Parse one SKILL.md into a SuiteSkill with fail-closed diagnostics, or `undefined`. */
async function parseOneSkill(file: string, directory: string, fallbackName: string, errors: string[]): Promise<SuiteSkill | undefined> {
  if (!await isFile(file)) return undefined
  let text: string
  try {
    text = await readFile(file, 'utf8')
  } catch (error) {
    errors.push(`skill "${fallbackName}": unreadable SKILL.md (${error instanceof Error ? error.message : String(error)})`)
    return undefined
  }
  const parsed = parseSkillFrontmatter(text, undefined)
  if (typeof parsed === 'string') {
    errors.push(`skill "${fallbackName}": ${parsed}`)
    return undefined
  }
  return {
    name: parsed.name,
    directory,
    file,
    description: parsed.description,
    ...parsed.whenToUse === undefined ? {} : { whenToUse: parsed.whenToUse },
    invocation: parsed.invocation,
  }
}

async function discoverMcp(root: string, errors: string[]): Promise<McpSuiteConfig | undefined> {
  const path = join(root, 'mcp.json')
  if (!await isFile(path)) return undefined
  let raw: unknown
  try {
    raw = JSON.parse(await readFile(path, 'utf8'))
  } catch (error) {
    errors.push(`mcp.json unparsable: ${error instanceof Error ? error.message : String(error)}`)
    return undefined
  }
  const result = await validateMcpJson(root, raw)
  errors.push(...result.errors)
  return result.config
}

async function countSurfaces(root: string, skills: SuiteSkill[], mcp: McpSuiteConfig | undefined): Promise<SuiteSurfaceCounts> {
  let hooks = 0
  for (const relative of [join('hooks', 'hooks.json'), 'hooks.json'] as const) {
    hooks += await countHookEntries(join(root, relative))
  }
  const commands = await countMdFiles(join(root, 'commands'))
  const agents = await countMdFiles(join(root, 'agents'))
  const lsp = (await discoverLspEntries(root)).length
  return {
    skills: skills.length,
    mcp: mcp === undefined ? 0 : Object.keys(mcp.servers).length,
    hooks,
    commands,
    agents,
    lsp,
  }
}

export interface LspEntry {
  name: string
  path: string
}

/** LSP definitions: `.claude-plugin/lsp/*.json` plus reverse-domain `lsp/` dirs. */
export async function discoverLspEntries(root: string): Promise<LspEntry[]> {
  const entries: LspEntry[] = []
  try {
    const claudeLsp = join(root, '.claude-plugin', 'lsp')
    for (const entry of await readdir(claudeLsp)) {
      if (!entry.endsWith('.json')) continue
      entries.push({ name: entry.slice(0, -5), path: join(claudeLsp, entry) })
    }
  } catch {
    // no .claude-plugin/lsp directory
  }
  try {
    for (const entry of await readdir(root, { withFileTypes: true })) {
      if (!entry.isDirectory() || !/^[a-z0-9-]+(\.[a-z0-9-]+){2,}$/.test(entry.name)) continue
      const lspDir = join(root, entry.name, 'lsp')
      let names: string[]
      try {
        names = await readdir(lspDir)
      } catch {
        continue
      }
      for (const name of names) {
        entries.push({ name, path: join(lspDir, name) })
      }
    }
  } catch {
    // unreadable root contributes no LSP entries
  }
  return entries
}

async function countHookEntries(path: string): Promise<number> {
  let text: string
  try {
    text = await readFile(path, 'utf8')
  } catch {
    return 0
  }
  try {
    const parsed: unknown = JSON.parse(text)
    if (typeof parsed !== 'object' || parsed === null) return 0
    const hooks = (parsed as Record<string, unknown>)['hooks']
    if (typeof hooks !== 'object' || hooks === null) return 0
    return Object.values(hooks as Record<string, unknown>).reduce((total: number, entries: unknown) => total + (Array.isArray(entries) ? entries.length : 0), 0)
  } catch {
    return 0
  }
}

async function countMdFiles(dir: string): Promise<number> {
  return (await listMdFiles(dir)).length
}

/** File names under a suite's commands/ or agents/ directory. */
export async function listMdFiles(dir: string): Promise<string[]> {
  let entries: string[]
  try {
    entries = await readdir(dir)
  } catch {
    return []
  }
  return entries.filter(name => name.endsWith('.md')).sort()
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
