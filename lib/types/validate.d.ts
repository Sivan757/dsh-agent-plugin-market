import type { McpSuiteConfig } from './types.js';
export declare const PLUGIN_SCHEMA_ID = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
export declare const MCP_SCHEMA_ID = "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json";
/** Validate one JSON document against a vendored schema; errors joined for surfacing. */
export declare function validateAgainstSchema(schemaId: string, document: unknown): Promise<string[]>;
/** Whether a `$schema` value selects the local v1.0.0 ruleset. */
export declare function isRecognizedSchema(value: unknown): boolean;
/**
 * Spec §4 containment: a plugin-relative path must begin with `./` and, after
 * resolution against the plugin root, stay inside the filesystem-resolved
 * plugin root. Symlinks resolving outside the root are rejected.
 * @returns `undefined` when contained, or the rejection reason.
 */
export declare function pathContainmentError(pluginRoot: string, value: string): Promise<string | undefined>;
/** Validate a plugin manifest per the vendored schema plus `$schema` recognition. */
export declare function validatePluginManifest(raw: unknown): Promise<string[]>;
export interface McpValidateOptions {
    /** Strict portable mode (`mcp.json`): `$schema` required and schema-validated.
     *  Lenient mode (`.mcp.json`, native client file): no `$schema` requirement,
     *  unknown transports skipped per server, known transports still validated. */
    strict?: boolean;
}
export declare function validateMcpJson(pluginRoot: string, raw: unknown, options?: McpValidateOptions): Promise<{
    config?: McpSuiteConfig;
    errors: string[];
}>;
/** Expand `${PLUGIN_ROOT}`, `${PLUGIN_DATA}`, and `${NAME}` (process env) in one string.
 *  Claude Code aliases `${CLAUDE_PLUGIN_ROOT}` / `${CLAUDE_PLUGIN_DATA}` and
 *  `${NAME:-default}` fallbacks are honored for unset/empty env vars. */
export declare function expandPlaceholders(value: string, pluginRoot: string, pluginData: string, env?: NodeJS.ProcessEnv): string;
/** Resolve an expanded plugin-relative cwd to an absolute path. */
export declare function resolveCwd(value: string, pluginRoot: string, pluginData: string): string;
/** Whether one absolute path equals or lies under another absolute path. */
export declare function isWithin(root: string, candidate: string): boolean;
