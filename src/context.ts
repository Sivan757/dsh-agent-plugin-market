/**
 * Runtime suite context: catalog injection at session start and the
 * `agent_plugins` tool.
 *
 * The injected catalog is a durable user message queued through
 * `agent.inject()` on `agent/session-start` (the same path the hooks bridge
 * uses for SessionStart context), carrying the base `{kind:'plugin'}`
 * message source with `plugin: 'dsh-agent-plugin'` so transcripts attribute
 * it and it lands in the session log — model-visible means logged.
 */
import type { Context } from '@deepseek-ai/cordis'
import { deriveServerName } from './mcp-config.js'
import type { SuiteManager } from './manager.js'
import type { Suite } from './types.js'

/** Structural slice of the live Agent used at the injection boundary. */
interface InboxAgent {
  inject(message: { content: Array<{ type: string; text: string }>; source: unknown }): void
  session?: { header?: { cwd?: string } }
}

const PLUGIN_SOURCE_KIND = 'plugin'
const PLUGIN_SOURCE_ID = 'dsh-agent-plugin'

/** Render the enabled-suite catalog for one dimension section. */
function renderSection(label: string, suites: Suite[]): string {
  if (suites.length === 0) return ''
  const lines = suites.map((suite) => {
    const skills = suite.skills.map(skill => skill.name).join(', ')
    const mcp = suite.mcp === undefined ? 0 : Object.keys(suite.mcp.servers).length
    const parts = [
      `- ${suite.manifest.name}${suite.manifest.version === undefined ? '' : ` v${suite.manifest.version}`}`,
      ...(suite.manifest.description === undefined ? [] : [`  ${suite.manifest.description}`]),
      `  技能: ${skills === '' ? '(无)' : skills}`,
      `  MCP servers: ${mcp}`,
    ]
    return parts.join('\n')
  })
  return [`## ${label}`, ...lines].join('\n')
}

/** Build the injected catalog text for the enabled suites of one agent. */
function catalogText(user: Suite[], project: Suite[]): string {
  const sections = [
    '当前会话可用的套件（Agent Plugin）：',
    renderSection('用户级套件', user),
    renderSection('项目级套件', project),
    '使用 skill 工具或 agent_plugins 工具查询套件提供的技能与 MCP 工具。',
  ].filter(section => section !== '')
  return sections.join('\n\n')
}

/** Structural tool registry surface this plugin touches. */
interface ToolsRegistry {
  register(definition: {
    name: string
    description: string
    parameters: Record<string, unknown>
    renderIntent?: string
    output: {
      schema: Record<string, unknown>
      render(args: unknown, value: unknown): Array<{ type: string; text: string }>
    }
    execute(args: unknown, exec: { signal: AbortSignal }): Promise<unknown>
  }): () => void
}

/** Mount session-start injection and the agent_plugins tool. */
export function mountSuiteContext(ctx: Context, manager: SuiteManager): () => void {
  const disposers: Array<() => void> = []
  const onSessionStart = (ctx as unknown as {
    on(name: 'agent/session-start', callback: (payload: { agent: InboxAgent }) => void): () => void
  }).on('agent/session-start', ({ agent }) => {
    void (async () => {
      const cwd = (agent as InboxAgent).session?.header?.cwd
      const suites = cwd === undefined
        ? { user: await manager.enabledUserSuites(), project: [] as Suite[] }
        : await manager.enabledSuitesForCwd(cwd)
      const text = catalogText(suites.user, suites.project)
      if (text !== '') {
        agent.inject({ content: [{ type: 'text', text }], source: { kind: PLUGIN_SOURCE_KIND, plugin: PLUGIN_SOURCE_ID } })
      }
    })()
  })
  disposers.push(() => onSessionStart())

  ctx.inject(['tools'], (toolsCtx) => {
    const tools = toolsCtx as unknown as { tools: ToolsRegistry }
    if (typeof tools.tools?.register !== 'function') return
    const parameters = {
      type: 'object',
      properties: {
        action: { type: 'string', enum: ['list', 'info'], description: 'list: 列出全部套件；info: 查看单个套件详情' },
        suiteId: { type: 'string', description: 'info 动作时必填：套件 id' },
        sourceId: { type: 'string', description: 'info 动作时可选：套件所属仓库源 id' },
      },
      required: ['action'],
      additionalProperties: false,
    }
    const outputSchema = {
      type: 'object',
      properties: {
        suites: { type: 'array', items: { type: 'object' } },
        skills: { type: 'array', items: { type: 'object' } },
        mcpServers: { type: 'array', items: { type: 'object' } },
        note: { type: 'string' },
      },
    }
    const dispose = tools.tools.register({
      name: 'agent_plugins',
      description: '查询当前会话启用的套件（Agent Plugin）：列出套件清单、技能与 MCP 工具前缀；技能正文通过 skill 工具加载。',
      parameters,
      renderIntent: 'generic',
      output: {
        schema: outputSchema,
        render: (_args, value) => {
          const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
          return [{ type: 'text', text }]
        },
      },
      execute: async (args) => {
        const record = args as Record<string, unknown>
        const action = record['action']
        if (action === 'list') return listPayload(await manager.enabledUserSuites())
        if (action === 'info') return infoPayload(await manager.enabledUserSuites(), record)
        return { suites: [], skills: [], mcpServers: [], note: `unknown action ${JSON.stringify(action)}` }
      },
    })
    disposers.push(dispose)
  })

  return () => {
    for (const dispose of disposers) dispose()
  }
}

function listPayload(suites: Suite[]): Record<string, unknown> {
  return {
    suites: suites.map(suite => ({
      id: suite.id,
      sourceId: suite.sourceId,
      name: suite.manifest.name,
      version: suite.manifest.version ?? null,
      description: suite.manifest.description ?? null,
      layout: suite.manifest.layout,
    })),
    skills: suites.flatMap(suite => suite.skills.map(skill => ({ suiteId: suite.id, name: skill.name, description: skill.description }))),
    mcpServers: suites.flatMap(suite => suite.mcp === undefined
      ? []
      : Object.keys(suite.mcp.servers).map(key => ({ suiteId: suite.id, server: key, tools: `mcp__${deriveServerName(suite.id, key)}__*` }))),
    note: '技能正文通过 skill 工具按 name 加载；MCP 工具名形如 mcp__<套件>__<server>__<工具>。',
  }
}

function infoPayload(suites: Suite[], record: Record<string, unknown>): Record<string, unknown> {
  const suiteId = record['suiteId']
  const suite = suites.find(entry => entry.id === suiteId)
  if (suite === undefined) return { suites: [], skills: [], mcpServers: [], note: `未找到套件 "${String(suiteId)}"（仅列出用户级已启用套件）` }
  return listPayload([suite])
}
