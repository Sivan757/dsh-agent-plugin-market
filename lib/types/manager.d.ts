import type { OverviewPayload, SourceRef, Suite, SuiteDimension } from './types.js';
export interface ManagerOptions {
    userRoot: string;
    dataRoot: string;
    onChanged: () => void;
}
export declare class SuiteManager {
    private readonly options;
    private state;
    private mutationQueue;
    private readonly statePath;
    constructor(options: ManagerOptions);
    /** Load persisted state once at plugin activation. */
    load(): Promise<void>;
    get sources(): SourceRef[];
    /** The user-dimension suite root this manager operates. */
    get userRoot(): string;
    /**
     * One suite's full detail for the market detail modal: manifest fields,
     * skill metadata, validated mcp.json servers, and per-surface file lists.
     */
    suiteDetail(sourceId: string, suiteId: string): Promise<Record<string, unknown>>;
    private readPreview;
    /** One skill's full SKILL.md text for the market detail modal. */
    skillContent(sourceId: string, suiteId: string, skillName: string): Promise<{
        name: string;
        description: string;
        content: string;
        path: string;
    }>;
    /** The full market overview: fresh discovery merged with install entries. */
    overview(): Promise<OverviewPayload>;
    /** Enabled user-dimension suites (the MCP mount input). */
    enabledUserSuites(): Promise<Suite[]>;
    /** Enabled user- and project-dimension suites for a workspace cwd. */
    enabledSuitesForCwd(cwd: string): Promise<{
        user: Suite[];
        project: Suite[];
    }>;
    /** All suites (any enabled state) of one dimension. */
    suitesForDimension(dimension: SuiteDimension, dimensionRoot: string): Promise<Suite[]>;
    /**
     * Add a source and clone it immediately. The id is derived from the suite
     * repository's own JSON (marketplace plugin entry name first, then the
     * root manifest name, then the repo basename), sanitized; collisions get a
     * numeric suffix.
     */
    addSource(input: {
        url: string;
        branch?: string;
        local?: boolean;
    }): Promise<SourceRef>;
    private uniqueSourceId;
    /**
     * Update one source's url / branch / local flag. A git source whose URL
     * changes drops its stale checkout (the next refresh clones the new URL);
     * a local source's directory is never touched.
     */
    updateSource(sourceId: string, patch: {
        url?: string;
        branch?: string;
        local?: boolean;
    }): Promise<void>;
    /** Remove a source: delete its checkout, forget its suites and install entries. */
    removeSource(sourceId: string): Promise<void>;
    /** Refresh one source checkout (pull), or every source when `sourceId` is omitted. */
    refreshSource(sourceId?: string): Promise<void>;
    /** Install a suite: the source must be cloned; the suite dir becomes an enabled install entry. */
    install(sourceId: string, suiteId: string): Promise<void>;
    /** Uninstall a suite: drop the install entry (the source clone stays for browsing). */
    uninstall(sourceId: string, suiteId: string): Promise<void>;
    /** Enable or disable an installed suite. */
    setEnabled(sourceId: string, suiteId: string, enabled: boolean): Promise<void>;
    /** Append config-seeded sources missing from state and persist; clones lazily on first refresh/install. */
    mergeSources(sources: SourceRef[]): Promise<void>;
    private setInstalled;
    private ensureClone;
    /** The filesystem location one source is read from. */
    private sourceCheckoutPath;
    private discoverDimension;
    private commandPreviews;
    private agentPreviews;
    /** Parse CC hooks.json into flat {event, matcher, command} preview entries. */
    private hooksPreviews;
    private lspPreviews;
    private enqueue;
}
