import { describe, expect, it } from 'vitest'
import { buildMcpStatus, inspectToolRegistry } from '../src/mcp-status.js'
import type { Suite } from '../src/types.js'

function suite(overrides: Partial<Suite> = {}): Suite {
  return {
    sourceId: 'codex-plugin',
    id: 'codex',
    root: '/tmp/codex',
    manifest: { layout: 'codex', path: '/tmp/codex/.codex-plugin/plugin.json', id: 'codex', name: 'codex' },
    skills: [],
    mcp: {
      schema: 'native-client',
      servers: {
        app: { type: 'stdio', command: 'node', args: ['server.mjs'], env: { API_TOKEN: 'secret' } },
        docs: { type: 'streamable-http', url: 'https://example.test/mcp', headers: { Authorization: 'Bearer secret' } }
      }
    },
    surfaces: { skills: 0, mcp: 2, hooks: 0, commands: 0, agents: 0, lsp: 0 },
    dimension: 'user',
    enabled: true,
    installedAt: new Date().toISOString(),
    errors: [],
    ...overrides
  }
}

describe('MCP status aggregation', () => {
  it('reports plugin servers, redacts secrets, and observes direct servers', () => {
    const payload = buildMcpStatus(
      [suite()],
      [{ suiteId: 'codex', serverKey: 'docs', reason: 'connection refused' }],
      [
        { name: 'mcp__codex__app__read_file', description: 'Read a file' },
        { name: 'mcp__filesystem__read_file', description: 'Read a file' }
      ]
    )
    expect(payload.totals).toMatchObject({ all: 3, connected: 2, failed: 1 })
    const app = payload.entries.find(entry => entry.serverKey === 'app')!
    expect(app.state).toBe('connected')
    expect(app.tools.map(tool => tool.name)).toEqual(['read_file'])
    expect(app.config).toMatchObject({ env: { API_TOKEN: '[redacted]' } })
    const docs = payload.entries.find(entry => entry.serverKey === 'docs')!
    expect(docs.state).toBe('failed')
    expect(docs.reason).toBe('connection refused')
    const direct = payload.entries.find(entry => entry.kind === 'direct')!
    expect(direct.name).toBe('filesystem')
    expect(direct.tools[0]?.name).toBe('read_file')
  })

  it('reads MCP tools from the optional tool-layer snapshot adapter', () => {
    const runtime = {
      layers: {
        merge: (_scope: undefined, pick: (layer: { tools: { entries: () => Array<[string, unknown]> } }) => unknown) =>
          pick({
            tools: {
              entries: () => [
                ['mcp__filesystem__read_file', { description: 'Read a file' }],
                ['bash', { description: 'Shell' }]
              ]
            }
          })
      }
    }
    expect(inspectToolRegistry(runtime)).toEqual([{ name: 'mcp__filesystem__read_file', description: 'Read a file' }])
  })

  it('omits MCP servers from uninstalled or disabled suites', () => {
    const disabled = suite({ enabled: false })
    const uninstalled = suite({ installedAt: undefined })
    expect(buildMcpStatus([disabled, uninstalled], [], []).entries).toEqual([])
  })

  it('reports enabled plugin servers with no observed tools as degraded', () => {
    const payload = buildMcpStatus([suite({ mcp: { schema: 'native-client', servers: { app: { type: 'stdio', command: 'node' } } } })], [], [])
    expect(payload.entries[0]?.state).toBe('degraded')
    expect(payload.entries[0]?.tools).toEqual([])
  })
})
