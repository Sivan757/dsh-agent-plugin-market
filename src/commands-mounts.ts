/**
 * Claude Code command compatibility: `commands/*.md` of enabled suites
 * register as dsh slash commands.
 *
 * A CC command is a prompt template the model executes (its body carries
 * `$ARGUMENTS` and execution rules), so the handler maps it onto the
 * harness's follow-up mechanism: the template with `$ARGUMENTS` substituted
 * becomes one durable user-role follow-up message on the receiving agent.
 * Registrations reconcile on every enable/disable/install/uninstall; a
 * broken command file or an unavailable `ctx.commands` is contained per
 * command and reported as a diagnostic.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { Context } from '@deepseek-ai/cordis'
import { parse as parseYaml } from 'yaml'
import { stripFrontmatter } from './skills-parse.js'
import type { Suite } from './types.js'

export interface CommandMountDiagnostic {
  suiteId: string
  command: string
  reason: string
}

interface CommandSpec {
  name: string
  description: string
  body: string
}

interface CommandsHost {
  commands?: {
    register(definition: {
      name: string
      description: string
      handler(invocation: { agent: unknown; rawInput: string }): { kind: 'success'; text: string } | { kind: 'error'; text: string }
    }): () => void
  }
}

interface InboxAgent {
  followup(message: { content: Array<{ type: string; text: string }>; source: unknown }): void
}

const COMMAND_NAME = /^[a-z][a-z0-9_-]*$/

export class CommandMountRegistry {
  private readonly live = new Map<string, () => void>()

  constructor(private readonly ctx: Context) {}

  /** Register/unregister suite commands to match the enabled suites exactly. */
  async reconcile(enabledSuites: Suite[]): Promise<CommandMountDiagnostic[]> {
    const diagnostics: CommandMountDiagnostic[] = []
    const wanted = new Map<string, CommandSpec & { suiteId: string }>()
    for (const suite of enabledSuites) {
      for (const spec of await readCommands(suite.root)) {
        const key = `${suite.id}/${spec.name}`
        wanted.set(key, { ...spec, suiteId: suite.id })
      }
    }
    for (const [key, disposer] of [...this.live]) {
      if (!wanted.has(key)) {
        disposer()
        this.live.delete(key)
      }
    }
    const host = this.ctx as unknown as CommandsHost
    if (typeof host.commands?.register !== 'function') {
      if (wanted.size > 0) diagnostics.push({ suiteId: '', command: '', reason: 'ctx.commands is not available in this profile' })
      return diagnostics
    }
    for (const [key, spec] of wanted) {
      if (this.live.has(key)) continue
      try {
        const disposer = host.commands.register({
          name: spec.name,
          description: spec.description,
          handler: (invocation) => {
            const agent = invocation.agent as InboxAgent
            const text = [
              `[Agent Plugins 命令 /${spec.name}（来自 ${spec.suiteId}）]`,
              '',
              spec.body.replaceAll('$ARGUMENTS', invocation.rawInput.trim()),
            ].join('\n')
            agent.followup({ content: [{ type: 'text', text }], source: { kind: 'plugin', plugin: 'dsh-agent-plugins-market' } })
            return { kind: 'success', text: `/${spec.name} 已转交模型执行（${spec.suiteId}）` }
          },
        })
        this.live.set(key, disposer)
      } catch (error) {
        diagnostics.push({ suiteId: spec.suiteId, command: spec.name, reason: error instanceof Error ? error.message : String(error) })
      }
    }
    return diagnostics
  }

  /** Dispose every registered command; used at plugin teardown. */
  disposeAll(): void {
    for (const disposer of [...this.live.values()]) disposer()
    this.live.clear()
  }
}

/** Parse `commands/*.md` of one suite root (Claude Code format). */
export async function readCommands(root: string): Promise<CommandSpec[]> {
  let entries: string[]
  try {
    entries = await readdir(join(root, 'commands'))
  } catch {
    return []
  }
  const specs: CommandSpec[] = []
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue
    const name = entry.slice(0, -3)
    if (!COMMAND_NAME.test(name)) continue
    let text: string
    try {
      text = await readFile(join(root, 'commands', entry), 'utf8')
    } catch {
      continue
    }
    const description = commandDescription(text) ?? firstLine(text)
    if (description === undefined) continue
    specs.push({ name, description, body: stripFrontmatter(text) })
  }
  return specs
}

function commandDescription(text: string): string | undefined {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)
  if (match === null) return undefined
  try {
    const raw = parseYaml(match[1])
    if (typeof raw === 'object' && raw !== null) {
      const description = (raw as Record<string, unknown>)['description']
      if (typeof description === 'string' && description.trim() !== '') return description.trim()
    }
  } catch {
    return undefined
  }
  return undefined
}

function firstLine(text: string): string | undefined {
  const line = text.split('\n').map(line => line.trim()).find(line => line !== '')
  return line
}
