# Agent Plugins Market (dsh-agent-plugins-market)

English | [简体中文](README.md)

**Agent Plugins manager & market for DeepSeek Harness**: install, browse and inject Agent Plugins — skills, MCP servers, hooks, commands, subagents — from git repo sources, compatible with agent-plugins.org v1.0.0 portable packages and the Claude Code / Codex / Cursor / Kimi ecosystems.

![Agent Plugins Market screenshot](docs/screenshot.png)

## What it does

- **Plugin management**: configure git repository sources (markets), browse every discoverable plugin, install / uninstall / enable / disable / refresh per source or per plugin. Source ids are derived automatically from the repository manifest JSON — no manual input.
- **Runtime discovery**: installed plugins are discovered from `~/.dsh/agent-plugins/.sources/<sourceId>/` (user dimension) and `<project>/.dsh/agent-plugins/.sources/<sourceId>/` (project dimension). Local sources read the working tree directly, including uncommitted changes.
- **Runtime injection**:
  - **Skills** — a `ctx.skills` SkillProvider (project rank 250 / user rank 450); `${CLAUDE_PLUGIN_ROOT}` is substituted so Claude Code-authored skills work verbatim.
  - **MCP** — every valid `mcp.json` server of an enabled plugin mounts a live `dsh-mcp-client` child (`ctx.plugin`); tools appear as `mcp__<plugin>__<server>__<tool>`.
  - **Hooks** — a plugin's `hooks/hooks.json` mounts the `dsh-hooks-claude-code` bridge on the harness interception points.
  - **Commands / subagents** — `commands/*.md` register as dsh slash commands; `agents/*.md` register as `agent-<name>` skills.
  - **Context** — the enabled-plugin catalog (user + project sections) is injected at session start; the `agent_plugins` tool queries it.
- **Market page in the Web GUI**: source pills + search/actions, status tabs, a two-column card grid, and a plugin detail modal with previews for skills / MCP / hooks / commands / LSP.

## Supported plugin layouts

| Layout | Manifest | Notes |
| --- | --- | --- |
| agent-plugins.org v1 | `plugin.json` | vendored 1.0.0 JSON Schema validation + spec §4 path rules |
| Claude Code market | `.claude-plugin/marketplace.json` + `.claude-plugin/plugin.json` | marketplace `plugins[].source` relative paths |
| Universal | `.plugin/plugin.json` | multi-client repos (e.g. vercel-plugin) |
| Cursor | `.cursor-plugin/plugin.json` | declared skills paths |
| Kimi | `.kimi-plugin/plugin.json` | inline mcpServers |
| Codex | `.codex-plugin/plugin.json` | — |
| Skill collection (manifest-less) | none (synthetic) | flat `SKILL.md` directory collections |

One repo may carry several dialects at once (vercel/vercel-plugin ships all of them); the suite identity comes from the highest-precedence manifest while surfaces are scanned from the directories. `mcp.json` is validated strictly against the agent-plugins.org schema; `.mcp.json` is parsed leniently — top-level server-map shorthand, `type: http` / `local` / omitted `type` (stdio by `command`) normalization, `${CLAUDE_PLUGIN_ROOT}` / `${CLAUDE_PLUGIN_DATA}` / `${NAME:-default}` placeholders, and unknown transports are tolerated per server. The marketplace manifest is authoritative for the suite set; manifest-less marketplace entries that carry skills and manifest-bearing container dirs not listed there are supplemented.

## Install

```sh
pnpm add dsh-agent-plugins-market   # inside a dsh profile
```

Add the package to the profile's `dsh.profile.bundles` (the package's `cordis.patch.yml` inserts the plugin row):

```jsonc
// ~/.dsh/profiles/<profile>/package.json
{
  "dependencies": { "dsh-agent-plugins-market": "^0.4.0" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-agent-plugins-market"] } }
}
```

Restart dsh and open Settings → Agent Plugins Market.

## Configure sources

Sources persist in `~/.dsh/agent-plugins/state.json`; cordis config seeds them (and re-adds missing ids on every boot):

```yaml
- id: dsh-agent-plugins-market
  config:
    sources:
      - { id: agent-plugins, url: 'https://github.com/Sivan757/agent-plugins.git' }
      - { id: jeecg-skills, url: '/Users/me/work/jeecg-plugin', local: true }
      - { id: ui-ux-pro-max, url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git' }
```

A `local: true` source reads the directory in place (live working tree; never deleted on removal).

## Requirements

- `ctx.skills` (dsh-skill) is required.
- Optional peers: `@deepseek-ai/dsh-mcp-client` (MCP injection), `@deepseek-ai/dsh-hooks-claude-code` (hooks bridge); missing capabilities degrade gracefully.
- Web GUI ≥ 0.1.0-rc.6.

## Security model

- Git sources clone through `git` via `execFile` (no shell), depth 1, `--ff-only` pulls, 120s timeouts; local sources are read in place and never deleted.
- Mutating HTTP routes accept same-origin POSTs only; bodies capped at 64 KiB.
- Portable paths must start with `./` and resolve inside the plugin root (symlink escapes rejected); `${PLUGIN_ROOT}` / `${PLUGIN_DATA}` expand.
- Third-party failures are always contained: broken manifests, invalid skills, escaping paths, unknown MCP transports, and mount failures are per-plugin diagnostics.
- An error boundary wraps the whole market section and the detail modal: any preview render failure degrades to a notice instead of crashing the UI.

## Development

```sh
pnpm install
pnpm run test        # vitest over fixture suites + multi-dialect parsing
pnpm run typecheck
pnpm run build       # tsc host + tsdown client + module-loader banner
pnpm pack
```

## Known limitations

- Project-dimension MCP servers are not mounted (dsh has no per-session tool scope); the project dimension covers skills and context.
- Skill discovery has no file watcher: catalog changes apply after a manager action or a host restart.
- Claude Code hooks support the mapped bridge subset; LSP is counted and previewed but not executed.

## Vendored assets

The `schemas/1.0.0/` JSON Schemas are vendored from [agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec) (spec 1.0.0 working draft); the spec forbids fetching schemas at load time.
