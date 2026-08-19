import type { SuiteManifest } from '../types.js';
export type ManifestKind = 'agent-plugin-v1' | 'universal' | 'claude-code' | 'cursor' | 'kimi' | 'codex';
/** One manifest candidate: its file path and the dialect it selects. */
export interface ManifestCandidate {
    kind: ManifestKind;
    path: string;
}
/** The highest-precedence manifest file a directory carries, if any. */
export declare function detectManifest(dir: string): Promise<ManifestCandidate | undefined>;
/** Whether a directory carries any known suite manifest. */
export declare function hasSuiteManifest(dir: string): Promise<boolean>;
/** Fallback suite identity for manifest-less skill collections. */
export declare function syntheticManifestName(root: string): string;
/**
 * Parse one manifest document into a normalized SuiteManifest. The v1 dialect
 * is schema-validated (fail-closed); the others are structurally read with
 * light tolerance, and `hint` (a marketplace plugin entry) fills in gaps.
 */
export declare function readManifest(root: string, errors: string[], hint: {
    name?: string;
    version?: string;
    description?: string;
} | undefined): Promise<SuiteManifest | undefined>;
export interface MarketplaceEntry {
    name?: string;
    version?: string;
    description?: string;
    /** Claude Code: a relative path string or `{ source: 'url', url }`.
     *  Codex: `{ source: 'local', path }` or `{ source: 'remote', url }`. */
    source: string | {
        source?: string;
        url?: string;
        path?: string;
    };
}
export interface Marketplace {
    name?: string;
    entries: MarketplaceEntry[];
}
/** Read a marketplace manifest from a checkout root, or undefined when absent. */
export declare function readMarketplace(checkoutDir: string): Promise<Marketplace | undefined>;
/** Resolve one marketplace entry to a local checkout-relative directory, or
 *  `undefined` for remote-URL entries that are not present in the clone. */
export declare function marketplaceEntryDir(checkoutDir: string, entry: MarketplaceEntry): string | undefined;
/**
 * Resolve a repo-level name for source-id derivation, in precedence order:
 * marketplace plugin entry name > marketplace name > root manifest name >
 * the checkout basename. The suite repo's own JSON is authoritative; the
 * basename is only the fallback.
 */
export declare function repoName(checkoutDir: string): Promise<string>;
/** The winning manifest's declared `skills` path (string or array), or undefined. */
export declare function declaredSkillsPath(root: string): Promise<unknown>;
/** The winning manifest's inline `mcpServers`, or undefined. */
export declare function declaredMcpServers(root: string): Promise<Record<string, unknown> | undefined>;
