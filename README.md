# dsh-agent-plugin

Agent Plugin (套件) manager for DeepSeek Harness. It implements the [Agent Plugins v1.0.0](https://agent-plugins.org/specification) portable package format — `plugin.json` + `skills/` + `mcp.json` + reverse-domain extension directories — on top of dsh's existing capability seams, adds repository-source suite management with git clone caching, and ships a market page in the Web GUI.

English | [简体中文](README.zh.md)

## What it does

- **Suite management**: configure git repository sources (marketplaces), browse every discoverable suite, install / uninstall / enable / disable / refresh, per source or per suite.
- **Runtime discovery**: installed suites are discovered from `~/.dsh/agent-plugins/.sources/<sourceId>/` (user dimension) and `<project>/.dsh/agent-plugins/.sources/<sourceId>/` (project dimension). A project's suites are only active inside that project.
- **Runtime injection**:
  - skills — one `SkillProvider` on `ctx.skills`. Project suites rank 250, user suites rank 450, so each dimension's own `.dsh/skills` (100/400) still wins. `SKILL.md` bodies are rewritten: `${CLAUDE_PLUGIN_ROOT}` becomes the suite root, so Claude Code-authored skills work verbatim. Frontmatter that strict YAML rejects (prose with unquoted `: `) falls back to a lenient line-based parse; skills that still lack a kebab-case name or a description are dropped with a per-suite diagnostic.
  - MCP — every valid `mcp.json` server of an enabled user-dimension suite is mounted as a live `dsh-mcp-client` child plugin (`ctx.plugin`); tools appear as `mcp__<suite>__<server>__<tool>`. Mounts reconcile on every enable/disable/install/uninstall.
  - context — the enabled-suite catalog (user + project sections) is injected at `agent/session-start` through `agent.inject()`, logged with the `{kind:'plugin', plugin:'dsh-agent-plugin'}` source; the `agent_plugins` tool lists suites, skills, and MCP tool prefixes.
- **Market page**: a top-level navigation entry (sidebar row + full center-column panel, the ssh/task-board takeover pattern) with search, all/installed/uninstalled tabs, a category sidebar (全部 plus one row per source, add/remove/refresh), and suite cards with surface tag counts, enable toggle, refresh, and uninstall.

## Supported suite layouts

Discovery normalizes three input layouts onto one internal shape:

| Layout | Manifest | Notes |
| --- | --- | --- |
| agent-plugins.org v1 | `plugin.json` | schema-validated (vendored 1.0.0 schemas) with spec §4 path containment and `$schema` recognition; `mcp.json` validated per server |
| Claude Code marketplace | `.claude-plugin/marketplace.json` + per-suite `.claude-plugin/plugin.json` | marketplace `plugins[].source` relative entries only; external-URL entries are skipped |
| Codex | `.codex-plugin/plugin.json` | skills live at `<suite>/skills/` |
| Skill collection (manifest-less) | none — synthetic | flat `<dir>/SKILL.md` or `<dir>/skills/<name>/SKILL.md` directories become suites with the directory name |

A checkout without a marketplace manifest is treated as one suite (manifest at the root) or scanned one level (plus `plugins/` and `skills/` containers) for manifest directories; a checkout with no manifests at all but flat `SKILL.md` directories becomes a skill-collection source.

## Install

```sh
pnpm add dsh-agent-plugin   # in a dsh profile
```

Add the bundle to the profile's `dsh.profile.bundles` (the package's `cordis.patch.yml` inserts the row):

```jsonc
// ~/.dsh/profiles/<profile>/package.json
{
  "dependencies": { "dsh-agent-plugin": "^0.1.0" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-agent-plugin"] } }
}
```

Then restart dsh and open Settings → 套件市场.

## Configure sources

Sources persist in `~/.dsh/agent-plugins/state.json`. Seed them from cordis config:

```yaml
# cordis.patch.yml
- insert:
    - id: dsh-agent-plugin
      name: 'dsh-agent-plugin'
      config:
        sources:
          - { id: agent-plugins, url: 'https://github.com/Sivan757/agent-plugins.git' }
          - { id: jeecg-skills, url: 'https://github.com/jeecgboot/skills.git' }
```

or add them in the market page's source panel. `config.userRoot` (`~/.dsh/agent-plugins` by default, honoring `$DSH_HOME`) and `config.dataRoot` (`~/.dsh/agent-plugins-data`, backing `${PLUGIN_DATA}`) are also available.

A source may also read a **local directory directly** instead of cloning: `{ id: jeecg-wip, url: '/Users/me/work/jeecg-plugin', local: true }` (`~/…` expands). Local sources reflect the working tree as it is — including uncommitted changes — refresh rescans in place, and removing the source never deletes the directory.

## Project dimension

The market page manages the user dimension. For a project-scoped install, clone a source into `<project>/.dsh/agent-plugins/.sources/<sourceId>/` and record enabled suites in `<project>/.dsh/agent-plugins/state.json` (`{"version":1,"sources":[],"installed":{"<sourceId>/<suiteId>":{"enabled":true}}}`). The skill provider and the session-start catalog pick those suites up only when a session runs inside that project.

## Requirements

- `ctx.skills` (dsh-skill) is required.
- `@deepseek-ai/dsh-mcp-client` is an optional peer: without it, suites still inject skills and context, and each MCP server reports a contained mount failure.
- Web GUI ≥ 0.1.0-rc.6 (primitives exports the market page renders with).

## Security model

- Git sources are cloned through `git` via `execFile` (no shell), depth 1, `--ff-only` pulls, 120 s timeouts. Local sources are read in place: no clone, no pull, no deletion on removal.
- Mutating HTTP routes accept same-origin POSTs only; JSON bodies are capped at 64 KiB.
- Portable-suite paths must start with `./` and resolve inside the suite root (symlink escapes rejected); `${PLUGIN_ROOT}` / `${PLUGIN_DATA}` expand against the suite root and its data directory; `${NAME}` expands from the process environment (documented extension).
- A broken third-party suite never takes the host down: bad manifests, invalid skills, escaping MCP paths, unsupported transports (legacy HTTP+SSE), and MCP mount failures are per-suite diagnostics surfaced on the market page.
- Suites are third-party code: their skills run through the harness's existing shell/sandbox policy, and their MCP servers run as child processes with the ambient env scrubbed by `dsh-mcp-client` plus the suite's declared env.

## Known limitations

- Project-dimension MCP servers are not mounted (per-session tool scoping has no host row today); only user-dimension suites mount MCP.
- Skill discovery has no file watcher: catalog changes apply after a manager action (install/enable/refresh) or a host restart.
- Claude Code hooks and LSP entries are counted on cards but not executed; the portable format has no runtime semantics for them.
- Two suites shipping the same skill name resolve first-wins by rank then suite id — the dsh registry contract, not silently shadowed diagnostics.

## Vendored assets

The `schemas/1.0.0/` JSON Schemas are vendored from [agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec) (spec 1.0.0, working draft); the specification requires clients to validate without fetching schemas at load.

## Development

```sh
pnpm install
pnpm run test        # vitest unit tests over fixture suites
pnpm run typecheck
pnpm run build       # tsc host + tsdown client + module-loader banner
pnpm pack            # build + tarball
```
