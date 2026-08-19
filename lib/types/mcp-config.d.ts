import type { StdioConfig, StreamableHttpConfig } from '@deepseek-ai/dsh-mcp-client';
import type { Suite } from './types.js';
export interface McpMountRequest {
    suiteId: string;
    serverKey: string;
    config: StdioConfig | StreamableHttpConfig;
}
export interface McpMountFailure {
    serverKey: string;
    reason: string;
}
/**
 * Build one mount request per supported mcp.json server.
 * @returns mount requests plus per-server failures (unsupported transport,
 *   invalid server key, or derived serverName collision candidates are
 *   checked by the mount registry, not here).
 */
export declare function toMcpMounts(suite: Suite, pluginDataRoot: string): {
    mounts: McpMountRequest[];
    failures: McpMountFailure[];
};
/**
 * Derive a stable, unique-ish `dsh-mcp-client` serverName from the suite and
 * server ids: `${suiteId}__${serverKey}` sanitized, truncated to 32 chars
 * with a deterministic 12-hex suffix when the join exceeds the budget (the
 * same deterministic-hash policy the MCP client uses for long tool names).
 */
export declare function deriveServerName(suiteId: string, serverKey: string): string;
