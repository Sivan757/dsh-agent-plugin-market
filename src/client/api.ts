/** Typed fetch helpers over the host's `/api/agent-plugin/*` routes. */

export interface SourceOverview {
  id: string
  url: string
  branch?: string
  cloned: boolean
  lockCommit?: string
  error?: string
  suiteIds: string[]
}

export interface SuiteSurfaceCounts {
  skills: number
  mcp: number
  hooks: number
  commands: number
  agents: number
  lsp: number
}

export interface SuiteCardData {
  sourceId: string
  suiteId: string
  name: string
  version?: string
  description?: string
  keywords: string[]
  surfaces: SuiteSurfaceCounts
  enabled: boolean
  installed: boolean
  dimension: string
  layout: 'agent-plugin-v1' | 'claude-code' | 'codex' | 'skill-collection'
  errors: string[]
}

export interface OverviewData {
  sources: SourceOverview[]
  suites: SuiteCardData[]
  totals: { all: number; installed: number; enabled: number }
  roots: { user: string; data: string }
}

export async function fetchOverview(): Promise<OverviewData> {
  const response = await fetch('/api/agent-plugin/overview', { credentials: 'same-origin' })
  if (!response.ok) throw new Error(`overview failed: ${response.status}`)
  return response.json() as Promise<OverviewData>
}

export async function postAction(path: string, body: Record<string, unknown>): Promise<void> {
  const response = await fetch(`/api/agent-plugin/${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = await response.json() as { ok: boolean; error?: string }
  if (!response.ok || payload.ok !== true) {
    throw new Error(payload.error ?? `request failed: ${response.status}`)
  }
}
