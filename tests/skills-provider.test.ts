import { describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, writeFile, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SuiteManager } from '../src/manager.js'
import { SuiteSkillProvider, SUITE_PROJECT_SOURCE, SUITE_USER_SOURCE } from '../src/skills-provider.js'
import { isModelInvocable } from '@deepseek-ai/dsh-skill'

const here = dirname(fileURLToPath(import.meta.url))
const fixtures = join(here, 'fixtures')

async function installUserSuite(fixtureDir: string): Promise<{ manager: SuiteManager; userRoot: string; sourceId: string; suiteId: string }> {
  const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-user-'))
  const checkout = join(userRoot, '.sources', 'demo')
  await cp(fixtureDir, checkout, { recursive: true })
  const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, '..', 'data'), onChanged: () => {} })
  await manager.load()
  await manager.mergeSources([{ id: 'demo', url: 'file:///demo' }])
  await manager.install('demo', fixtureDir.includes('v1-suite') ? 'v1-suite' : fixtureDir.includes('bad-mcp') ? 'bad-mcp' : 'jeecg-one')
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
    expect(candidate.source).toBe(SUITE_USER_SOURCE)
    expect(candidate.rank).toBe(450)
    expect(isModelInvocable(candidate)).toBe(true)
    const definition = await provider.get(candidate, {})
    expect(definition).toBeDefined()
    expect(definition!.content).toContain(`node ${manager.userRoot}/.sources/demo/scripts/greet.mjs`)
    expect(definition!.resourceBase).toEqual({ kind: 'directory', path: expect.stringContaining('skills/greet') })
  })

  it('does not list suites from disabled sources', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-off-'))
    const checkout = join(userRoot, '.sources', 'demo')
    await cp(join(fixtures, 'v1-suite'), checkout, { recursive: true })
    const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'demo', url: 'file:///demo' }])
    await manager.install('demo', 'v1-suite')
    await manager.setEnabled('demo', 'v1-suite', false)
    const provider = new SuiteSkillProvider(manager)
    expect(await provider.list({})).toEqual([])
  })

  it('finds project-dimension suites under <project>/.dsh/agent-plugins at rank 250', async () => {
    const projectRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-proj-'))
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-u2-'))
    const projectAgentPlugins = join(projectRoot, '.dsh', 'agent-plugins')
    await cp(join(fixtures, 'v1-suite'), join(projectAgentPlugins, '.sources', 'p1', 'v1-suite'), { recursive: true })
    await mkdir(join(projectRoot, '.git'), { recursive: true })
    await writeFile(join(projectAgentPlugins, 'state.json'), JSON.stringify({ version: 1, sources: [], installed: { 'p1/v1-suite': { enabled: true, installedAt: new Date(0).toISOString() } } }), 'utf8')
    const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
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
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-local-'))
    const localRepo = join(fixtures, 'v1-suite')
    const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
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
    // The local directory must survive removal.
    const marker = join(localRepo, 'plugin.json')
    expect(await (await import('node:fs/promises')).stat(marker)).toBeTruthy()
    expect(await manager.overview()).toMatchObject({ totals: { all: 0, installed: 0, enabled: 0 } })
  })

  it('reports a missing local directory instead of cloning it', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-local2-'))
    const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
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
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-edit-'))
    const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'demo', url: 'https://example.com/demo.git' }])
    await manager.updateSource('demo', { url: '/Users/sivan/workspace/jeecg-plugin', local: true })
    const sources = manager.sources
    expect(sources).toEqual([{ id: 'demo', url: '/Users/sivan/workspace/jeecg-plugin', local: true }])
    const overview = await manager.overview()
    expect(overview.sources[0]!.local).toBe(true)
    expect(overview.sources[0]!.cloned).toBe(true)
  })

  it('rejects unknown source ids', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-edit2-'))
    const manager = new SuiteManager({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await manager.load()
    await expect(manager.updateSource('nope', { url: 'https://example.com/x.git' })).rejects.toThrow('unknown source')
  })
})
