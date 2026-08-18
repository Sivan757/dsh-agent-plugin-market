/** Typed fetch helpers over the host's `/api/agent-plugin/*` routes. */

export interface SourceOverview {
  id: string
  url: string
  branch?: string
  /** Local-directory source (read directly, never cloned or deleted). */
  local?: boolean
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

/** One skill's metadata inside a suite detail. */
export interface SuiteSkillMeta {
  name: string
  description: string
  whenToUse?: string
  path: string
}

/** One validated mcp.json server entry. */
export interface McpServerDetail {
  key: string
  type: string
  command?: string
  url?: string
  args?: string[]
  env?: Record<string, string>
  cwd?: string
  headers?: Record<string, string>
}

/** Full suite detail served by the market's detail modal. */
export interface SuiteDetail {
  sourceId: string
  suiteId: string
  name: string
  version: string | null
  description: string | null
  author: string | null
  keywords: string[]
  layout: string
  dimension: string
  root: string
  installed: boolean
  enabled: boolean
  skills: SuiteSkillMeta[]
  mcpServers: McpServerDetail[]
  hooks: number
  commands: string[]
  agents: string[]
  lsp: number
  errors: string[]
}

/** One skill's full file text. */
export interface SkillContent {
  name: string
  description: string
  content: string
  path: string
}

export async function fetchSuiteDetail(sourceId: string, suiteId: string): Promise<SuiteDetail> {
  const response = await fetch(`/api/agent-plugin/suite?sourceId=${encodeURIComponent(sourceId)}&suiteId=${encodeURIComponent(suiteId)}`, { credentials: 'same-origin' })
  if (!response.ok) throw new Error(`suite detail failed: ${response.status}`)
  return response.json() as Promise<SuiteDetail>
}

export async function fetchSkillContent(sourceId: string, suiteId: string, skill: string): Promise<SkillContent> {
  const response = await fetch(`/api/agent-plugin/skill?sourceId=${encodeURIComponent(sourceId)}&suiteId=${encodeURIComponent(suiteId)}&skill=${encodeURIComponent(skill)}`, { credentials: 'same-origin' })
  if (!response.ok) throw new Error(`skill content failed: ${response.status}`)
  return response.json() as Promise<SkillContent>
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
