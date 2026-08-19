/**
 * Runtime suite context: the `agent_plugins` query tool.
 *
 * Skills are injected by the native skill catalog (`dsh-tool-skill` renders
 * `ctx.skills` providers into the model's `<available_skills>` catalog), so
 * this module does not inject a duplicate session-start message. The tool
 * exists for facts the catalog does not carry: enabled plugins per
 * dimension, skill names per plugin, and MCP server prefixes.
 */
import type { Context } from '@deepseek-ai/cordis';
import type { SuiteManager } from './manager.js';
/** Mount the agent_plugins query tool. */
export declare function mountSuiteContext(ctx: Context, manager: SuiteManager): () => void;
