/** Pure MCP status filtering and count derivation. */
import type { McpStatusEntry, McpStatusPayload } from '../../api.js'

/** MCP status list filter. */
export type McpStatusFilter = 'all' | 'plugin' | 'direct'

/** Derived MCP list data used by the status screen. */
export interface McpStatusViewModel {
  activeEntries: McpStatusEntry[]
  filtered: McpStatusEntry[]
  filterCounts: { all: number; plugin: number; direct: number }
  visibleTotals: { all: number; connected: number; failed: number }
}

interface SearchableEntry {
  entry: McpStatusEntry
  haystack: string
}

const searchableCache = new WeakMap<McpStatusPayload, SearchableEntry[]>()

/** Derive active rows, filter counts, and visible rows in one pass. */
export function deriveMcpStatusViewModel(payload: McpStatusPayload, filter: McpStatusFilter, search: string): McpStatusViewModel {
  const searchable = searchableFor(payload)
  const activeEntries = searchable.map(item => item.entry)
  const filterCounts = { all: 0, plugin: 0, direct: 0 }
  let connected = 0
  let failed = 0
  const filtered: McpStatusEntry[] = []
  const needle = search.trim().toLowerCase()

  for (const item of searchable) {
    const entry = item.entry
    filterCounts.all++
    filterCounts[entry.kind]++
    if (entry.state === 'connected') connected++
    if (entry.state === 'failed') failed++
    if (filter !== 'all' && entry.kind !== filter) continue
    if (needle !== '' && !item.haystack.includes(needle)) continue
    filtered.push(entry)
  }

  return {
    activeEntries,
    filtered,
    filterCounts,
    visibleTotals: { all: activeEntries.length, connected, failed }
  }
}

function searchableFor(payload: McpStatusPayload): SearchableEntry[] {
  const cached = searchableCache.get(payload)
  if (cached !== undefined) return cached
  const searchable = payload.entries
    .filter(entry => entry.state !== 'disabled')
    .map(entry => ({
      entry,
      haystack: `${entry.name} ${entry.source ?? ''} ${entry.endpoint ?? ''} ${entry.transport}`.toLowerCase()
    }))
  searchableCache.set(payload, searchable)
  return searchable
}
