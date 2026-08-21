/**
 * Select source checkouts for a catalog dimension.
 *
 * User catalogs include only configured sources. Project catalogs additionally
 * retain unmanaged checkout ids because project install state can authorize
 * them without duplicating source configuration.
 */
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { expandHome, isDirectory, sourcesDir } from '../paths.js'
import type { SourceRef, Suite, SuiteDimension } from '../types.js'
import { discoverSuitesInSource } from './suite-scanner.js'

/** Discover suites from the selected configured or project checkouts. */
export async function discoverSourceList(sources: SourceRef[], dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]> {
  const checkoutRoot = sourcesDir(dimensionRoot)
  const listed = new Set(sources.map(source => source.id))
  const checkouts = sources.map(source => ({
    sourceId: source.id,
    checkout: source.local === true ? expandHome(source.url) : join(checkoutRoot, source.id)
  }))
  if (dimension === 'project') {
    try {
      for (const entry of await readdir(checkoutRoot, { withFileTypes: true })) {
        if (!entry.isDirectory() || entry.name.startsWith('.') || listed.has(entry.name)) continue
        checkouts.push({ sourceId: entry.name, checkout: join(checkoutRoot, entry.name) })
      }
    } catch {
      // A missing project checkout root has no unmanaged project sources.
    }
  }
  const discovered = await Promise.all(
    checkouts.map(async ({ sourceId, checkout }) => {
      if (!(await isDirectory(checkout))) return []
      return discoverSuitesInSource(checkout, sourceId, dimension)
    })
  )
  return discovered.flat()
}
