/** Clone a source (depth 1, optional branch) into a not-yet-existing directory. */
export declare function gitClone(url: string, branch: string | undefined, dest: string, timeoutMs?: number): Promise<void>;
/** Fast-forward a checked-out source to its configured branch. */
export declare function gitPull(dir: string, timeoutMs?: number): Promise<void>;
/** Read the checked-out HEAD commit. */
export declare function gitHead(dir: string, timeoutMs?: number): Promise<string>;
/** Remove a source checkout tree entirely. */
export declare function gitRemove(dir: string): Promise<void>;
