import { describe, expect, it } from 'vitest'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverSuitesInSource } from '../src/discovery.js'
import { SuiteManager } from '../src/manager.js'
import { validateMcpJson, validatePluginManifest, expandPlaceholders, pathContainmentError } from '../src/validate.js'

const here = dirname(fileURLToPath(import.meta.url))
const fixtures = join(here, 'fixtures')

describe('discovery: agent-plugins.org v1 layout', () => {
  it('normalizes a single portable suite with skills and mcp', async () => {
    const suites = await discoverSuitesInSource(join(fixtures, 'v1-suite'), 'demo', 'user')
    expect(suites).toHaveLength(1)
    const suite = suites[0]!
    expect(suite.manifest.layout).toBe('agent-plugin-v1')
    expect(suite.manifest.name).toBe('v1-suite')
    expect(suite.manifest.version).toBe('1.2.3')
    expect(suite.manifest.keywords).toEqual(['fixture', 'v1'])
    expect(suite.skills.map(skill => skill.name)).toEqual(['greet'])
    expect(suite.mcp).toBeDefined()
    expect(Object.keys(suite.mcp!.servers)).toEqual(['toolbox', 'remote'])
    expect(suite.surfaces).toMatchObject({ skills: 1, mcp: 2 })
    expect(suite.errors).toEqual([])
  })
})

describe('discovery: Claude Code marketplace layout', () => {
  it('uses the marketplace manifest and skips external-url entries', async () => {
    const suites = await discoverSuitesInSource(join(fixtures, 'cc-marketplace'), 'cc', 'user')
    expect(suites.map(suite => suite.id)).toEqual(['jeecg-one', 'jeecg-two'])
    expect(suites[0]!.manifest.layout).toBe('claude-code')
    expect(suites[0]!.skills[0]!.name).toBe('jeecg-one')
  })
})

describe('discovery: containment of broken content', () => {
  it('keeps valid skills when mcp.json has escaping paths, invalidating only that server', async () => {
    const suites = await discoverSuitesInSource(join(fixtures, 'bad-mcp'), 'bad', 'user')
    expect(suites).toHaveLength(1)
    const suite = suites[0]!
    expect(suite.skills.map(skill => skill.name)).toEqual(['ok-skill'])
    expect(Object.keys(suite.mcp!.servers)).toEqual(['good'])
    expect(suite.errors.some(error => error.includes('escape'))).toBe(true)
  })

  it('drops skills with non-kebab frontmatter names', async () => {
    const suites = await discoverSuitesInSource(join(fixtures, 'bad-skill'), 'bs', 'user')
    expect(suites).toHaveLength(1)
    expect(suites[0]!.skills).toEqual([])
    expect(suites[0]!.errors.some(error => error.includes('bad-name'))).toBe(true)
  })
})

describe('validate: manifest and mcp.json', () => {
  it('accepts the recognized 1.0.0 schema', async () => {
    const errors = await validatePluginManifest({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', name: 'ok' })
    expect(errors).toEqual([])
  })

  it('rejects an unknown $schema', async () => {
    const errors = await validatePluginManifest({ $schema: 'https://example.com/other.json', name: 'ok' })
    expect(errors.some(error => error.includes('unrecognized'))).toBe(true)
  })

  it('rejects a missing name', async () => {
    const errors = await validatePluginManifest({ $schema: 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json' })
    expect(errors.some(error => error.includes('name'))).toBe(true)
  })

  it('enforces §4 path containment for stdio command', async () => {
    const { config, errors } = await validateMcpJson('/tmp/fixture-root', {
      $schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
      mcpServers: {
        bad: { type: 'stdio', command: '../outside' },
        good: { type: 'stdio', command: './bin/ok' },
      },
    })
    expect(errors.some(error => error.includes('bad'))).toBe(true)
    expect(Object.keys(config!.servers)).toEqual(['good'])
  })

  it('rejects unknown mcp.json $schema wholesale', async () => {
    const { config, errors } = await validateMcpJson('/tmp/fixture-root', {
      $schema: 'https://example.com/mcp.json',
      mcpServers: {},
    })
    expect(config).toBeUndefined()
    expect(errors.length).toBeGreaterThan(0)
  })

  it('rejects a stdio command without ./ prefix when it is a path', async () => {
    const reason = await pathContainmentError('/tmp/root', '../escape')
    expect(reason).toContain('must begin')
  })
})

describe('validate: placeholder expansion', () => {
  it('expands PLUGIN_ROOT, PLUGIN_DATA, and process env', () => {
    expect(expandPlaceholders('${PLUGIN_ROOT}/a ${PLUGIN_DATA}/b ${HOME}/c', '/p', '/d', { HOME: '/h' })).toBe('/p/a /d/b /h/c')
    expect(expandPlaceholders('${UNSET_VAR}', '/p', '/d')).toBe('')
  })
})

describe('discovery: manifest-less skill collection layout', () => {
  it('treats flat SKILL.md directories as synthetic suites', async () => {
    const suites = await discoverSuitesInSource(join(fixtures, 'flat-skills'), 'flat', 'user')
    expect(suites.map(suite => suite.id)).toEqual(['order-crud'])
    expect(suites[0]!.manifest.layout).toBe('skill-collection')
    expect(suites[0]!.skills[0]!.name).toBe('order-crud')
    expect(suites[0]!.skills[0]!.description).toContain('order CRUD code')
  })
})


describe('suite detail and skill content (market detail endpoints)', () => {
  it('lists skills, mcp servers, and file lists from the v1 fixture', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugin-det-'))
    const manager = new SuiteManager({ userRoot, dataRoot: `${userRoot}/data`, onChanged: () => {} })
    await manager.load()
    await manager.mergeSources([{ id: 'demo', url: join(fixtures, 'v1-suite'), local: true }])
    const detail = await manager.suiteDetail('demo', 'v1-suite')
    expect(detail).toMatchObject({ name: 'v1-suite', version: '1.2.3', layout: 'agent-plugin-v1' })
    expect((detail['skills'] as Array<{ name: string }>).map(skill => skill.name)).toEqual(['greet'])
    expect((detail['mcpServers'] as Array<{ key: string }>).map(server => server.key)).toEqual(['toolbox', 'remote'])
    const content = await manager.skillContent('demo', 'v1-suite', 'greet')
    expect(content.content).toContain('${CLAUDE_PLUGIN_ROOT}')
    await expect(manager.suiteDetail('demo', 'missing')).rejects.toThrow('not found')
  })
})
