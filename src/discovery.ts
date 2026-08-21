/**
 * Compatibility facade for suite discovery.
 *
 * New code should import one-checkout scanning from `catalog/suite-scanner`
 * and checkout selection from `catalog/source-catalog`. These exports remain
 * stable while existing callers migrate away from this legacy module path.
 */
import { discoverSourceList } from './catalog/source-catalog.js'
import { discoverSuitesInSource, isOutside } from './catalog/suite-scanner.js'
import { repoName } from './discovery/manifests.js'
import { discoverLspEntries, listMdFiles, type LspEntry } from './discovery/surfaces.js'

export { discoverSourceList, discoverSuitesInSource, isOutside, repoName, listMdFiles, discoverLspEntries }
export type { LspEntry }
