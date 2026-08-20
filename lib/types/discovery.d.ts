import type { SourceRef, Suite, SuiteDimension } from './types.js';
import { repoName } from './discovery/manifests.js';
import { discoverLspEntries, listMdFiles, type LspEntry } from './discovery/surfaces.js';
export { repoName, listMdFiles, discoverLspEntries };
export type { LspEntry };
/** Discover every suite under one cloned source checkout. */
export declare function discoverSuitesInSource(checkoutDir: string, sourceId: string, dimension: SuiteDimension): Promise<Suite[]>;
/** Whether a suite root path lies outside the checkout (defense for malformed marketplace sources). */
export declare function isOutside(root: string, candidate: string): boolean;
/**
 * Discover suites for one dimension. User catalogs only read configured
 * sources: unmanaged user checkouts have no persisted identity and otherwise
 * leak stale repositories into the catalog totals. Project catalogs retain
 * unmanaged checkout ids because project state may authorize them through its
 * installed map without duplicating source configuration. All selected
 * checkouts are discovered concurrently so one large repository does not
 * serialize every other repository's scan.
 */
export declare function discoverSourceList(sources: SourceRef[], dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]>;
