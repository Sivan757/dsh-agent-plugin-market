import { describe, expect, it } from 'vitest'
import { McpMountRegistry } from '../src/mcp-mounts.js'
import type { Suite } from '../src/types.js'

interface MountedPlugin {
  config: Record<string, unknown>
  disposed: boolean
}

function fakeContext(): { ctx: Record<string, unknown>; mounts: Map<string, MountedPlugin> } {
  const mounts = new Map<string, MountedPlugin>()
  const ctx: Record<string, unknown> = {
    plugin: (plugin: unknown, config: Record<string, unknown>) => {
      const serverName = config['serverName'] as string
      const mounted: MountedPlugin = { config, disposed: false }
      mounts.set(serverName, mounted)
      return {
        await: async () => {},
        dispose: async () => { mounted.disposed = true },
      }
    },
    logger: { warn: () => {} },
  }
  return { ctx, mounts }
}

function suite(id: string, serverKey: string): Suite {
  return {
    sourceId: 'demo',
    id,
    root: `/tmp/${id}`,
    manifest: { layout: 'agent-plugin-v1', path: `/tmp/${id}/plugin.json`, id, name: id },
    skills: [],
    mcp: {
      schema: 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json',
      servers: { [serverKey]: { type: 'stdio', command: 'tool' } },
    },
    surfaces: { skills: 0, mcp: 1, hooks: 0, commands: 0, agents: 0, lsp: 0 },
    dimension: 'user',
    enabled: true,
    errors: [],
  }
}

describe('McpMountRegistry', () => {
  it('mounts enabled suites and unmounts removed ones through ctx.plugin', async () => {
    const { ctx, mounts } = fakeContext()
    const registry = new McpMountRegistry(ctx as never, '/tmp/data')
    const diagnostics = await registry.reconcile([suite('alpha', 'db')])
    expect(diagnostics).toEqual([])
    expect(mounts.size).toBe(1)
    const mounted = [...mounts.values()][0]!
    expect(mounted.config['transport']).toBe('stdio')
    expect(mounted.config['serverName']).toBe('alpha__db')

    await registry.reconcile([])
    expect(mounted.disposed).toBe(true)
    expect(mounts.size).toBe(1)

    await registry.disposeAll()
  })

  it('reports duplicate derived serverNames instead of double-mounting', async () => {
    const { ctx, mounts } = fakeContext()
    const registry = new McpMountRegistry(ctx as never, '/tmp/data')
    const duplicate = suite('alpha', 'db')
    const diagnostics = await registry.reconcile([duplicate, suite('alpha!', 'db')])
    expect(diagnostics.some(diagnostic => diagnostic.reason.includes('already mounted'))).toBe(true)
    expect(mounts.size).toBe(1)
    await registry.disposeAll()
  })
})
