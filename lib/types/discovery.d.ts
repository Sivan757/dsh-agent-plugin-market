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
 * Discover every suite of one dimension's configured sources, plus manual
 * checkouts present under the dimension's `.sources/` that no source entry
 * names. Local sources read their directory directly; git sources read
 * their clone; a missing checkout contributes nothing.
 */
export declare function discoverSourceList(sources: SourceRef[], dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]>;
