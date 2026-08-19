/** Source checkouts live under `<dimensionRoot>/.sources/<sourceId>/`. */
export declare const SOURCES_DIR_NAME = ".sources";
/** Per-suite mutable data directory (the `${PLUGIN_DATA}` placeholder). */
export declare const DATA_DIR_NAME = "data";
export declare const STATE_FILE_NAME = "state.json";
/** Expand a leading `~/` (or `~\` on Windows) to the home directory; other values pass through. */
export declare function expandHome(path: string): string;
/** Resolve the harness home (`$DSH_HOME` or `~/.dsh`). */
export declare function resolveDshHome(): string;
/** Resolve the user-dimension suite root. */
export declare function resolveUserRoot(configUserRoot?: string): string;
/** Resolve the suite data root hosting `${PLUGIN_DATA}` directories. */
export declare function resolveDataRoot(configDataRoot?: string): string;
/** Resolve a project root from a workspace cwd: nearest ancestor with `.git`. */
export declare function findProjectRoot(cwd: string): Promise<string>;
/** Resolve the project-dimension suite root for a workspace cwd. */
export declare function resolveProjectRoot(cwd: string): Promise<string>;
/** Source checkout directory for one source id. */
export declare function sourcesDir(dimensionRoot: string): string;
/** Source checkout directory for one source id. */
export declare function sourceCheckoutDir(dimensionRoot: string, sourceId: string): string;
/** Per-suite data directory for `${PLUGIN_DATA}`. */
export declare function suiteDataDir(dataRoot: string, suiteId: string): string;
/** Async existence probe that follows symlinks for a final component. */
export declare function isDirectory(path: string): Promise<boolean>;
/** Sanitize a plugin or server id into `[a-z0-9-]` (lowercased). */
export declare function sanitizeId(raw: string): string;
/** Derive a source id from a repository URL or local path: last path segment, `.git` stripped. */
export declare function deriveSourceId(url: string): string;
