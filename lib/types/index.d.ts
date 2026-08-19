/**
 * dsh-agent-plugins-market host entry: the Agent Plugins Market manager.
 *
 * Function plugin (named exports, no default export). It registers one skill
 * provider feeding enabled suites into `ctx.skills`, reconciles enabled
 * suites' `mcp.json` servers into live `dsh-mcp-client` mounts, injects the
 * enabled-suite catalog at session start, registers the `agent_plugins`
 * tool, and mounts the market page's HTTP routes on the web server.
 *
 * Requires `ctx.skills` (the dsh skill registry). The MCP client package is
 * optional at runtime: without it, suites still load their skills and the
 * manager reports a per-server mount failure.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { SourceRef } from './types.js';
export declare const name = "dsh-agent-plugins-market";
export declare const inject: string[];
/** Host configuration. */
export interface Config {
    /** User-dimension suite root; defaults to `~/.dsh/agent-plugins` (`$DSH_HOME/agent-plugins`). */
    userRoot?: string;
    /** Per-suite data root backing `${PLUGIN_DATA}`; defaults to `~/.dsh/agent-plugins-data`. */
    dataRoot?: string;
    /** Initial repository sources, merged into the persisted state on first load. */
    sources?: SourceRef[];
}
export declare function apply(ctx: Context, config?: Config): void;
