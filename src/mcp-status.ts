import { deriveServerName } from './mcp-config.js'
import type { McpServer, Suite } from './types.js'

/** A tool observed in the host tool registry. */
export interface McpToolSnapshot {
  name: string
  description?: string
}

export type McpStatusKind = 'plugin' | 'direct'
export type McpStatusState = 'connected' | 'degraded' | 'failed' | 'disabled'

/** One MCP service row for the status surface. */
export interface McpStatusEntry {
  id: string
  name: string
  kind: McpStatusKind
  state: McpStatusState
  source?: string
  suiteId?: string
  serverKey?: string
  transport: string
  endpoint?: string
  config?: Record<string, unknown>
  tools: Array<{ name: string; description?: string }>
  reason?: string
}

export interface McpStatusPayload {
  entries: McpStatusEntry[]
  observedAt: string
  totals: { all: number; connected: number; degraded: number; failed: number; disabled: number }
  directObservationOnly: boolean
}

interface McpDiagnostic {
  suiteId: string
  serverKey: string
  reason: string
}

/** Build status rows from discovered plugin MCP definitions and observed tool names. */
export function buildMcpStatus(suites: Suite[], diagnostics: McpDiagnostic[], observed: readonly McpToolSnapshot[]): McpStatusPayload {
  const entries: McpStatusEntry[] = []
  const claimedServers = new Set<string>()
  const knownServerNames = new Set<string>()
  for (const suite of suites) {
    if (suite.mcp === undefined || suite.installedAt === undefined || !suite.enabled) continue
    for (const serverKey of Object.keys(suite.mcp.servers)) knownServerNames.add(deriveServerName(suite.id, serverKey))
  }
  const diagnosticsByKey = new Map(diagnostics.map(diagnostic => [`${diagnostic.suiteId}\u0000${diagnostic.serverKey}`, diagnostic]))
  const observedByServer = groupObservedTools(observed, knownServerNames)

  for (const suite of suites) {
    // This is an operational inventory, not a configuration audit: suite MCP
    // definitions only appear after their suite is both installed and enabled.
    if (suite.mcp === undefined || suite.installedAt === undefined || !suite.enabled) continue
    for (const [serverKey, server] of Object.entries(suite.mcp.servers)) {
      const serverName = deriveServerName(suite.id, serverKey)
      const tools = observedByServer.get(serverName) ?? []
      claimedServers.add(serverName)
      const diagnostic = diagnosticsByKey.get(`${suite.id}\u0000${serverKey}`)
      const state: McpStatusState = diagnostic !== undefined
        ? 'failed'
        : tools.length > 0
          ? 'connected'
          : 'degraded'
      entries.push({
        id: `plugin:${suite.sourceId}/${suite.id}/${serverKey}`,
        name: serverName,
        kind: 'plugin',
        state,
        source: suite.manifest.name,
        suiteId: suite.id,
        serverKey,
        transport: server.type,
        endpoint: endpointOf(server),
        config: redactConfig(server),
        tools: tools.map(tool => ({ name: tool.name, ...tool.description === undefined ? {} : { description: tool.description } })),
        ...diagnostic === undefined ? {} : { reason: diagnostic.reason },
      })
    }
  }

  for (const [serverName, tools] of observedByServer) {
    if (claimedServers.has(serverName)) continue
    entries.push({
      id: `direct:${serverName}`,
      name: serverName,
      kind: 'direct',
      state: 'connected',
      transport: 'observed',
      tools: tools.map(tool => ({ name: tool.name, ...tool.description === undefined ? {} : { description: tool.description } })),
    })
  }

  const totals = {
    all: entries.length,
    connected: entries.filter(entry => entry.state === 'connected').length,
    degraded: entries.filter(entry => entry.state === 'degraded').length,
    failed: entries.filter(entry => entry.state === 'failed').length,
    disabled: entries.filter(entry => entry.state === 'disabled').length,
  }
  return { entries, observedAt: new Date().toISOString(), totals, directObservationOnly: true }
}

function groupObservedTools(observed: readonly McpToolSnapshot[], knownServerNames: ReadonlySet<string>): Map<string, McpToolSnapshot[]> {
  const grouped = new Map<string, McpToolSnapshot[]>()
  for (const tool of observed) {
    if (!tool.name.startsWith('mcp__')) continue
    let serverName: string | undefined
    let rawName: string | undefined
    // Plugin server names contain `__` themselves (`suite__server`), so use
    // known names first and choose the longest matching namespace.
    for (const candidate of knownServerNames) {
      const prefix = `mcp__${candidate}__`
      if (tool.name.startsWith(prefix) && (serverName === undefined || candidate.length > serverName.length)) {
        serverName = candidate
        rawName = tool.name.slice(prefix.length)
      }
    }
    if (serverName === undefined) {
      const parts = tool.name.split('__')
      if (parts.length < 3) continue
      serverName = parts[1]
      rawName = parts.slice(2).join('__')
    }
    if (serverName === undefined || rawName === undefined || rawName === '') continue
    const list = grouped.get(serverName) ?? []
    list.push({ name: rawName, ...tool.description === undefined ? {} : { description: tool.description } })
    grouped.set(serverName, list)
  }
  return grouped
}

function endpointOf(server: McpServer): string {
  if (server.type === 'stdio') return [server.command, ...(server.args ?? [])].join(' ')
  return server.url
}

const SENSITIVE_KEY = /(authorization|token|secret|password|credential|api[-_]?key)/i

function redactConfig(value: McpServer): Record<string, unknown> {
  return redactValue(value) as Record<string, unknown>
}

function redactValue(value: unknown, key = ''): unknown {
  if (SENSITIVE_KEY.test(key)) return '[redacted]'
  if (Array.isArray(value)) return value.map(item => redactValue(item))
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [childKey, redactValue(childValue, childKey)]))
  }
  return value
}

/** Read model-facing MCP tool names from the dsh-tools runtime when available.
 * The registry intentionally has no public listing API in rc.6; this adapter
 * uses only the runtime's stable `layers.merge(...).tools.entries()` data shape
 * and safely returns an empty observation when another host changes it. */
export function inspectToolRegistry(runtime: unknown): McpToolSnapshot[] {
  if (typeof runtime !== 'object' || runtime === null) return []
  const layers = (runtime as { layers?: unknown }).layers
  if (typeof layers !== 'object' || layers === null) return []
  const merge = (layers as { merge?: unknown }).merge
  if (typeof merge !== 'function') return []
  const empty = { entries: (): Array<[string, unknown]> => [] }
  try {
    const visible = (merge as (scope: undefined, pick: (layer: { tools?: typeof empty }) => typeof empty) => typeof empty).call(layers, undefined, layer => layer.tools ?? empty)
    const output: McpToolSnapshot[] = []
    for (const [name, definition] of visible.entries()) {
      if (!name.startsWith('mcp__')) continue
      const description = typeof definition === 'object' && definition !== null && typeof (definition as { description?: unknown }).description === 'string'
        ? (definition as { description: string }).description
        : undefined
      output.push({ name, ...description === undefined ? {} : { description } })
    }
    return output
  } catch {
    return []
  }
}
