import { describe, expect, it } from 'vitest'
import { deriveServerName, toMcpMounts } from '../src/mcp-config.js'
import type { Suite } from '../src/types.js'

function suite(overrides: Partial<Suite> = {}): Suite {
  return {
    sourceId: 'demo',
    id: 'my-suite',
    root: '/tmp/my-suite',
    manifest: { layout: 'agent-plugin-v1', path: '/tmp/my-suite/plugin.json', id: 'my-suite', name: 'My Suite' },
    skills: [],
    surfaces: { skills: 0, mcp: 1, hooks: 0, commands: 0, agents: 0, lsp: 0 },
    dimension: 'user',
    enabled: true,
    errors: [],
    mcp: {
      schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
      servers: {
        db: { type: 'stdio', command: './bin/db', args: ['--root', '${PLUGIN_ROOT}'], env: { CACHE: '${PLUGIN_DATA}/cache' }, cwd: './data' },
        web: { type: 'streamable-http', url: 'https://example.com/mcp', headers: { Authorization: 'Bearer ${MCP_TOKEN}' } },
        legacy: { type: 'sse', url: 'https://example.com/sse' },
      },
    },
    ...overrides,
  }
}

describe('mcp-config: suite mcp.json → dsh-mcp-client rows', () => {
  it('maps stdio and streamable-http, skipping legacy SSE with a reason', () => {
    const { mounts, failures } = toMcpMounts(suite(), '/tmp/data')
    expect(mounts.map(mount => mount.config.serverName)).toEqual(['my-suite__db', 'my-suite__web'])
    expect(failures).toEqual([{ serverKey: 'legacy', reason: expect.stringContaining('HTTP+SSE') }])
    const db = mounts[0]!.config as Record<string, unknown>
    expect(db['transport']).toBe('stdio')
    expect(db['command']).toBe('/tmp/my-suite/bin/db')
    expect(db['args']).toEqual(['--root', '/tmp/my-suite'])
    expect(db['env']).toEqual({ CACHE: '/tmp/data/my-suite/cache' })
    expect(db['cwd']).toBe('/tmp/my-suite/data')
    const web = mounts[1]!.config as Record<string, unknown>
    expect(web['transport']).toBe('streamable-http')
    expect(web['headers']).toEqual({ Authorization: 'Bearer ' })
  })
})

describe('mcp-config: serverName derivation', () => {
  it('joins sanitized ids with __', () => {
    expect(deriveServerName('my-suite', 'db')).toBe('my-suite__db')
    expect(deriveServerName('My Suite!', 'DB 1')).toBe('My_Suite__DB_1')
  })

  it('truncates over-budget names with a deterministic hash suffix', () => {
    const long = deriveServerName('a'.repeat(40), 'b'.repeat(40))
    expect(long.length).toBe(32)
    expect(long.endsWith('-')).toBe(false)
    expect(deriveServerName('a'.repeat(40), 'b'.repeat(40))).toBe(long)
  })
})
