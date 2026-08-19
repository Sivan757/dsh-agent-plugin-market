/**
 * Shared shapes for the dsh-agent-plugins-market Agent Plugins manager.
 *
 * A suite is the portable Agent Plugins package defined by the
 * agent-plugins.org v1.0.0 specification, plus the two dialect layouts this
 * manager normalizes as inputs (Claude Code `.claude-plugin/plugin.json` and
 * Codex `.codex-plugin/plugin.json`). Discovery maps every layout onto this
 * internal shape; runtime injection consumes only the internal shape.
 */
export {};
