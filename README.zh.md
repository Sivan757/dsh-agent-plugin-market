# dsh-agent-plugin · 套件管理器

DeepSeek Harness 的 **套件（Agent Plugin）** 管理器。实现 [Agent Plugins v1.0.0](https://agent-plugins.org/specification) 便携包格式（`plugin.json` + `skills/` + `mcp.json` + 反向域名扩展目录），叠加仓库源式套件管理与 Web 图形界面的套件市场页。

[English](README.md) | 简体中文

## 能力

- **套件管理**：配置 git 仓库源（市场），浏览全部可发现套件，支持按源/按套件的安装、卸载、启用、禁用、刷新。
- **运行时发现**：已安装套件从 `~/.dsh/agent-plugins/.sources/<源id>/`（用户维度）与 `<项目>/.dsh/agent-plugins/.sources/<源id>/`（项目维度）发现；项目维度的套件仅在该项目内生效。
- **运行时注入**：
  - 技能（skills）——注册一个 `ctx.skills` 的 SkillProvider。项目套件 rank 250、用户套件 rank 450，各级自带 `.dsh/skills`（100/400）仍然优先。`SKILL.md` 正文中的 `${CLAUDE_PLUGIN_ROOT}` 被替换为套件根目录，Claude Code 生态的技能原样可用。严格 YAML 拒绝的 frontmatter（描述里含未加引号的 `: `）会回退到宽松按行解析；仍缺 kebab-case 名称或描述时丢弃该技能并给出逐套件诊断。
  - MCP——启用中的用户级套件，其 `mcp.json` 每个合法 server 都会通过 `ctx.plugin` 动态挂载为 `dsh-mcp-client` 子插件，工具名形如 `mcp__<套件>__<server>__<工具>`；每次启用/禁用/安装/卸载后自动对账（reconcile）。
  - 上下文——会话启动时经 `agent.inject()` 注入启用套件清单（用户级 + 项目级分段），带 `{kind:'plugin', plugin:'dsh-agent-plugin'}` 来源落入会话日志；模型可用 `agent_plugins` 工具查询套件、技能与 MCP 工具前缀。
- **套件市场页**：Web GUI 顶级导航入口（侧边栏入口 + 全幅中央列面板，采用 ssh/任务看板的中栏接管模式），含搜索、全部/已安装/未安装、分类侧栏（全部 + 每源一行，增删刷新）、套件卡片与标签计数、启停开关、刷新、卸载。

## 支持的套件布局

发现层把三种输入布局归一化为同一内部结构：

| 布局 | 清单文件 | 说明 |
| --- | --- | --- |
| agent-plugins.org v1 | `plugin.json` | 用内置 1.0.0 JSON Schema 校验，附加规范 §4 路径约束与 `$schema` 识别；`mcp.json` 逐 server 校验 |
| Claude Code 市场 | `.claude-plugin/marketplace.json` + 各套件 `.claude-plugin/plugin.json` | 只取 `plugins[].source` 相对路径条目；外链 URL 条目跳过 |
| Codex | `.codex-plugin/plugin.json` | 技能位于 `<套件>/skills/` |
| 技能集合（无清单） | 无（合成） | 扁平 `<目录>/SKILL.md` 或 `<目录>/skills/<名>/SKILL.md` 目录按目录名成为套件 |

无市场清单的检出目录按单套件仓库处理（根有清单）或扫描一层（含 `plugins/`、`skills/` 容器目录）；完全没有清单但存在扁平 `SKILL.md` 目录的检出目录成为技能集合源。

## 安装

```sh
pnpm add dsh-agent-plugin   # 在某个 dsh profile 中
```

把本包加入 profile 的 `dsh.profile.bundles`（包的 `cordis.patch.yml` 会插入对应行）：

```jsonc
// ~/.dsh/profiles/<profile>/package.json
{
  "dependencies": { "dsh-agent-plugin": "^0.1.0" },
  "dsh": { "profile": { "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-agent-plugin"] } }
}
```

重启 dsh，在 设置 → 套件市场 中管理。

## 配置仓库源

源配置持久化在 `~/.dsh/agent-plugins/state.json`。也可以用 cordis 配置预置：

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

或在市场页侧栏直接添加。`config.userRoot`（默认 `~/.dsh/agent-plugins`，尊重 `$DSH_HOME`）与 `config.dataRoot`（默认 `~/.dsh/agent-plugins-data`，即 `${PLUGIN_DATA}`）同样可配置。

源也可以**直接读取本地目录**而不克隆：`{ id: jeecg-wip, url: '/Users/me/work/jeecg-plugin', local: true }`（支持 `~/…` 展开）。本地源实时反映工作树（含未提交改动），刷新即原地重扫，移除源绝不会删除该目录。

## 项目维度

市场页管理用户维度。项目级安装：把源 clone 到 `<项目>/.dsh/agent-plugins/.sources/<源id>/`，并在 `<项目>/.dsh/agent-plugins/state.json` 记录启用项（`{"version":1,"sources":[],"installed":{"<源id>/<套件id>":{"enabled":true}}}`）。技能提供器与会话启动清单只在该项目内的会话中加载这些套件。

## 环境要求

- 必需 `ctx.skills`（dsh-skill）。
- `@deepseek-ai/dsh-mcp-client` 为可选 peer：缺失时技能与上下文注入照常，每个 MCP server 产生一条受控的挂载失败诊断。
- Web GUI ≥ 0.1.0-rc.6（市场页所用 primitives 的版本下限）。

## 安全模型

- git 源克隆走 `git` + `execFile`（无 shell），`--depth 1`，`--ff-only` 拉取，120 秒超时。本地源原地读取：不克隆、不拉取、移除时绝不删除目录。
- 变更类 HTTP 路由仅接受同源 POST，JSON 请求体上限 64 KiB。
- 便携包路径必须 `./` 开头且解析后留在套件根内（拒绝 symlink 逃逸）；`${PLUGIN_ROOT}` / `${PLUGIN_DATA}` 按套件根与数据目录展开；`${NAME}` 从进程环境展开（文档化扩展）。
- 第三方套件故障永远受控：坏清单、非法技能、逃逸 MCP 路径、不支持的传输（legacy HTTP+SSE）、MCP 挂载失败，都以逐套件诊断形式出现在市场页。
- 套件是第三方代码：其技能经宿主编排的 shell/沙箱策略执行；其 MCP server 以子进程运行，环境变量由 `dsh-mcp-client` 清洗后叠加套件声明的 env。

## 已知限制

- 项目维度的 MCP server 不挂载（按会话的工具作用域尚无宿主行）；仅用户级套件挂载 MCP。
- 技能发现无文件监听：目录变化在管理动作（安装/启用/刷新）或宿主重启后生效。
- Claude Code hooks 与 LSP 仅在卡片上计数，不执行——便携格式对它们没有运行时语义。
- 两个套件携带同名技能时按 rank 再按套件 id 先到先得——这是 dsh 注册表契约，不会静默隐藏诊断。

## Vendored 资产

`schemas/1.0.0/` 下的 JSON Schema vendored 自 [agentplugins/agent-plugins-spec](https://github.com/agentplugins/agent-plugins-spec)（spec 1.0.0 working draft）；规范要求客户端加载时不得联网取 schema。

## 开发

```sh
pnpm install
pnpm run test        # vitest 单测（fixture 套件）
pnpm run typecheck
pnpm run build       # tsc 宿主 + tsdown 客户端 + 模块加载器包装
pnpm pack            # 构建并打 tgz
```
