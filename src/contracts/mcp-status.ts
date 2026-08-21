/** Browser-safe MCP status records shared by host aggregation and client rendering. */

/** A tool observed in the host MCP tool registry. */
export interface McpStatusTool {
  name: string
  description?: string
}

/** Whether an MCP row comes from a suite or direct host observation. */
export type McpStatusKind = 'plugin' | 'direct'

/** Operational state rendered for an MCP row. */
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
  tools: McpStatusTool[]
  reason?: string
}

/** The MCP status response returned by the host. */
export interface McpStatusPayload {
  entries: McpStatusEntry[]
  observedAt: string
  totals: { all: number; connected: number; degraded: number; failed: number; disabled: number }
  directObservationOnly: boolean
}
