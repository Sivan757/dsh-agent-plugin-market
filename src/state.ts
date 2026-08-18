/**
 * Persisted suite state: configured sources and per-suite install entries.
 *
 * State is a plain JSON file at `<dimensionRoot>/state.json`. The host is the
 * only writer (through manager actions and the HTTP routes); the manager
 * re-reads the file whenever a mutation races, keeping the on-disk copy
 * authoritative like the market profile state this pattern follows.
 */
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { InstalledEntry, SourceRef, SuiteState } from './types.js'

export const EMPTY_STATE: SuiteState = { version: 1, sources: [], installed: {} }

/** Parse persisted state; unreadable or wrong-version files yield a contained empty state. */
export async function loadState(statePath: string): Promise<SuiteState> {
  try {
    const text = await readFile(statePath, 'utf8')
    const parsed: unknown = JSON.parse(text)
    if (typeof parsed !== 'object' || parsed === null) return EMPTY_STATE
    const record = parsed as Record<string, unknown>
    if (record['version'] !== 1) return EMPTY_STATE
    return normalizeState(record)
  } catch {
    return EMPTY_STATE
  }
}

function normalizeState(record: Record<string, unknown>): SuiteState {
  const sources: SourceRef[] = Array.isArray(record['sources'])
    ? (record['sources'] as unknown[]).flatMap((entry): SourceRef[] => {
        if (typeof entry !== 'object' || entry === null) return []
        const source = entry as Record<string, unknown>
        const id = typeof source['id'] === 'string' ? source['id'] : ''
        const url = typeof source['url'] === 'string' ? source['url'] : ''
        if (id === '' || url === '') return []
        const branch = typeof source['branch'] === 'string' ? source['branch'] : undefined
        const local = source['local'] === true
        return [{ id, url, ...branch === undefined ? {} : { branch }, ...local ? { local: true } : {} }]
      })
    : []
  const installed: Record<string, InstalledEntry> = {}
  if (typeof record['installed'] === 'object' && record['installed'] !== null) {
    for (const [key, value] of Object.entries(record['installed'] as Record<string, unknown>)) {
      if (typeof value !== 'object' || value === null) continue
      const entry = value as Record<string, unknown>
      installed[key] = {
        enabled: entry['enabled'] === true,
        lockCommit: typeof entry['lockCommit'] === 'string' ? entry['lockCommit'] : undefined,
        installedAt: typeof entry['installedAt'] === 'string' ? entry['installedAt'] : new Date(0).toISOString(),
      }
    }
  }
  return { version: 1, sources, installed }
}

/** Persist state atomically through a sibling-temp rename. */
export async function saveState(statePath: string, state: SuiteState): Promise<void> {
  await mkdir(dirname(statePath), { recursive: true })
  const temp = `${statePath}.${process.pid}.tmp`
  await writeFile(temp, `${JSON.stringify(state, null, 2)}\n`, 'utf8')
  await rename(temp, statePath)
}
