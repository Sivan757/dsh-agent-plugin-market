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
