import { describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, writeFile, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Catalog } from '../src/application/catalog.js'
import { SuiteSkillProvider, SUITE_PROJECT_SOURCE, SUITE_USER_SOURCE } from '../src/skills-provider.js'
import { isModelInvocable } from '@deepseek-ai/dsh-skill'

const here = dirname(fileURLToPath(import.meta.url))
const fixtures = join(here, 'fixtures')

async function installUserSuite(fixtureDir: string): Promise<{ manager: Catalog; userRoot: string; sourceId: string; suiteId: string }> {
  const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-user-'))
  const checkout = join(userRoot, '.sources', 'demo')
  await cp(fixtureDir, checkout, { recursive: true })
  const manager = new Catalog({ userRoot, dataRoot: join(userRoot, '..', 'data'), onChanged: () => {} })
  await manager.load()
  await manager.mergeSources([{ id: 'demo', url: 'file:///demo' }])
  await manager.install('demo', fixtureDir.includes('v1-suite') ? 'v1-suite' : fixtureDir.includes('bad-mcp') ? 'bad-mcp' : 'demo-one')
  return { manager, userRoot, sourceId: 'demo', suiteId: fixtureDir.includes('v1-suite') ? 'v1-suite' : 'bad-mcp' }
}

describe('SuiteSkillProvider', () => {
  it('lists enabled user suites at rank 450 and loads bodies with ${CLAUDE_PLUGIN_ROOT} substituted', async () => {
    const { manager } = await installUserSuite(join(fixtures, 'v1-suite'))
    const provider = new SuiteSkillProvider(manager)
    const candidates = await provider.list({})
    expect(candidates).toHaveLength(1)
    const candidate = candidates[0]!
    expect(candidate.name).toBe('greet')
    expect(candidate.description).toBe('[v1-suite] Greet the user and resolve bundled resources.')
    expect(candidate.source).toBe(SUITE_USER_SOURCE)
    expect(candidate.rank).toBe(450)
    expect(isModelInvocable(candidate)).toBe(true)
    const definition = await provider.get(candidate, {})
    expect(definition).toBeDefined()
    expect(definition!.content).toContain(`node ${manager.userRoot}/.sources/demo/scripts/greet.mjs`)
    expect(definition!.resourceBase).toEqual({ kind: 'directory', path: expect.stringContaining('skills/greet') })
  })

  it('does not list suites from disabled sources', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-off-'))
    const checkout = join(userRoot, '.sources', 'demo')
    await cp(join(fixtures, 'v1-suite'), checkout, { recursive: true })
    const manager = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'demo', url: 'file:///demo' }])
    await manager.install('demo', 'v1-suite')
    await manager.setEnabled('demo', 'v1-suite', false)
    const provider = new SuiteSkillProvider(manager)
    expect(await provider.list({})).toEqual([])
  })

  it('finds project-dimension suites under <project>/.dsh/agent-plugins at rank 250', async () => {
    const projectRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-proj-'))
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-u2-'))
    const projectAgentPlugins = join(projectRoot, '.dsh', 'agent-plugins')
    await cp(join(fixtures, 'v1-suite'), join(projectAgentPlugins, '.sources', 'p1', 'v1-suite'), { recursive: true })
    await mkdir(join(projectRoot, '.git'), { recursive: true })
    await writeFile(
      join(projectAgentPlugins, 'state.json'),
      JSON.stringify({ version: 1, sources: [], installed: { 'p1/v1-suite': { enabled: true, installedAt: new Date(0).toISOString() } } }),
      'utf8'
    )
    const manager = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    const provider = new SuiteSkillProvider(manager)
    const candidates = await provider.list({ cwd: projectRoot })
    expect(candidates).toHaveLength(1)
    expect(candidates[0]!.source).toBe(SUITE_PROJECT_SOURCE)
    expect(candidates[0]!.rank).toBe(250)
  })
})

describe('local-directory sources (local: true)', () => {
  it('discovers, installs, injects, and never deletes the local directory', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-local-'))
    const localRepo = join(fixtures, 'v1-suite')
    const staleCheckout = join(userRoot, '.sources', 'local-repo')
    await mkdir(staleCheckout, { recursive: true })
    await writeFile(join(staleCheckout, 'sentinel'), 'keep')
    const manager = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'local-repo', url: localRepo, local: true }])
    await manager.install('local-repo', 'v1-suite')
    await manager.setEnabled('local-repo', 'v1-suite', true)
    const overview = await manager.overview()
    const source = overview.sources.find(entry => entry.id === 'local-repo')!
    expect(source.local).toBe(true)
    expect(source.cloned).toBe(true)
    expect(overview.totals).toMatchObject({ all: 1, installed: 1, enabled: 1 })
    const provider = new SuiteSkillProvider(manager)
    const candidates = await provider.list({})
    expect(candidates.map(candidate => candidate.name)).toEqual(['greet'])
    await manager.removeSource('local-repo')
    // The local directory and any stale checkout path must survive removal.
    expect(await (await import('node:fs/promises')).stat(join(staleCheckout, 'sentinel'))).toBeTruthy()
    const marker = join(localRepo, 'plugin.json')
    expect(await (await import('node:fs/promises')).stat(marker)).toBeTruthy()
    expect(await manager.overview()).toMatchObject({ totals: { all: 0, installed: 0, enabled: 0 } })
  })

  it('reports a missing local directory instead of cloning it', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-local2-'))
    const manager = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'gone', url: join(tmpdir(), 'does-not-exist-xyz'), local: true }])
    const overview = await manager.overview()
    expect(overview.sources[0]!.cloned).toBe(false)
    expect(overview.sources[0]!.error).toContain('missing')
    await expect(manager.install('gone', 'anything')).rejects.toThrow('missing')
  })
})

describe('source editing (updateSource)', () => {
  it('switches a git source to a local path without touching directories', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-edit-'))
    const manager = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'demo', url: 'https://example.com/demo.git' }])
    await manager.updateSource('demo', { url: join(fixtures, 'v1-suite'), local: true })
    const sources = manager.sources
    expect(sources).toEqual([{ id: 'demo', url: join(fixtures, 'v1-suite'), local: true }])
    const overview = await manager.overview()
    expect(overview.sources[0]!.local).toBe(true)
    expect(overview.sources[0]!.cloned).toBe(true)
  })

  it('rejects unknown source ids', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-edit2-'))
    const manager = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await expect(manager.updateSource('nope', { url: 'https://example.com/x.git' })).rejects.toThrow('unknown source')
  })
})

describe('source id auto-derivation', () => {
  it('derives a single-suite repo id from its suite manifest name', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-id-'))
    const manager = new Catalog({ userRoot, dataRoot: `${userRoot}/data`, onChanged: () => {} })
    await manager.load()
    const source = await manager.addSource({ url: join(fixtures, 'v1-suite'), local: true })
    expect(source.id).toBe('v1-suite') // manifest name, not the fixtures basename
  })

  it('prefers the suite repo JSON name even when the basename differs', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-id3-'))
    const manager = new Catalog({ userRoot, dataRoot: `${userRoot}/data`, onChanged: () => {} })
    await manager.load()
    // Local dir whose basename (misc-repo) differs from the manifest name (vercel-plugin).
    const parent = await mkdtemp(join(tmpdir(), 'id3-p-'))
    await mkdir(join(parent, 'misc-repo'))
    await cp(join(fixtures, 'cursor-only'), join(parent, 'misc-repo'), { recursive: true })
    const source = await manager.addSource({ url: join(parent, 'misc-repo'), local: true })
    expect(source.id).toBe('cursor-only') // manifest name, not basename
  })

  it('derives a multi-suite repo id from its basename and dedupes collisions', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-id2-'))
    const manager = new Catalog({ userRoot, dataRoot: `${userRoot}/data`, onChanged: () => {} })
    await manager.load()
    // Two different parents, same basename -> both derive "agent-plugins"; the second gets a suffix.
    const parentA = await mkdtemp(join(tmpdir(), 'id2-a-'))
    const parentB = await mkdtemp(join(tmpdir(), 'id2-b-'))
    await mkdir(join(parentA, 'agent-plugins'))
    await mkdir(join(parentB, 'agent-plugins'))
    const first = await manager.addSource({ url: `${parentA}/agent-plugins`, local: true })
    expect(first.id).toBe('agent-plugins')
    const second = await manager.addSource({ url: `${parentB}/agent-plugins`, local: true })
    expect(second.id).toBe('agent-plugins-2')
  })
})
