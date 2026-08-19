/**
 * Runtime MCP mounts: one live `dsh-mcp-client` child plugin per enabled
 * suite's mcp.json server, mounted through `ctx.plugin`.
 *
 * Mounts reconcile against the enabled-suite set: reconcile() unmounts rows
 * whose suite was disabled or removed and mounts rows that appeared. A
 * missing `@deepseek-ai/dsh-mcp-client` install, a duplicate derived
 * serverName, or a load failure is contained per server — a broken third-party
 * suite must not take the host down — and reported through the manager's
 * diagnostic list.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { Suite } from './types.js';
export interface McpMountDiagnostic {
    suiteId: string;
    serverKey: string;
    reason: string;
}
export declare class McpMountRegistry {
    private readonly ctx;
    private readonly pluginDataRoot;
    private readonly live;
    private readonly names;
    constructor(ctx: Context, pluginDataRoot: string);
    /** Mount/unmount MCP servers to match the enabled suites exactly. */
    reconcile(enabledSuites: Suite[]): Promise<McpMountDiagnostic[]>;
    /** Dispose every live mount; used at plugin teardown. */
    disposeAll(): Promise<void>;
    private mount;
    private unmount;
}
