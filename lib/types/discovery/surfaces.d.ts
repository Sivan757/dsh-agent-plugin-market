import type { McpSuiteConfig, SuiteSkill, SuiteSurfaceCounts } from '../types.js';
/** Discover SKILL.md files under the suite's skills directory, up to 3 levels deep. */
export declare function discoverSkills(root: string, errors: string[], declared?: unknown): Promise<SuiteSkill[]>;
/** Read the suite's MCP config: `mcp.json` or `.mcp.json`, else the winning manifest's inline `mcpServers`. */
export declare function discoverMcp(root: string, errors: string[]): Promise<McpSuiteConfig | undefined>;
/** Count surfaces for a suite; mcp counts only validated servers. */
export declare function countSurfaces(root: string, skills: SuiteSkill[], mcp: McpSuiteConfig | undefined): Promise<SuiteSurfaceCounts>;
export interface LspEntry {
    name: string;
    path: string;
}
/** LSP definitions: `.claude-plugin/lsp/*.json` plus reverse-domain `lsp/` dirs. */
export declare function discoverLspEntries(root: string): Promise<LspEntry[]>;
/** File names under a suite's commands/ or agents/ directory. */
export declare function listMdFiles(dir: string): Promise<string[]>;
