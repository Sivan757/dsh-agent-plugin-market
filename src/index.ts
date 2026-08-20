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
import type { Context } from '@deepseek-ai/cordis'
import type { SkillProviderControl } from '@deepseek-ai/dsh-skill'
import { CommandMountRegistry } from './commands-mounts.js'
import { HooksMountRegistry } from './hooks-mounts.js'
import { mountSuiteContext } from './context.js'
import { SuiteManager } from './manager.js'
import { McpMountRegistry } from './mcp-mounts.js'
import { inspectToolRegistry } from './mcp-status.js'
import { resolveDataRoot, resolveUserRoot } from './paths.js'
import { mountSuiteRoutes } from './routes.js'
import { SuiteSkillProvider } from './skills-provider.js'
import type { SourceRef } from './types.js'

export const name = 'dsh-agent-plugins-market'
export const inject = ['skills', 'commands']

/** Host configuration. */
export interface Config {
  /** User-dimension suite root; defaults to `~/.dsh/agent-plugins` (`$DSH_HOME/agent-plugins`). */
  userRoot?: string
  /** Per-suite data root backing `${PLUGIN_DATA}`; defaults to `~/.dsh/agent-plugins-data`. */
  dataRoot?: string
  /** Initial repository sources, merged into the persisted state on first load. */
  sources?: SourceRef[]
}

export function apply(ctx: Context, config: Config = {}): void {
  const userRoot = resolveUserRoot(config.userRoot)
  const dataRoot = resolveDataRoot(config.dataRoot)
  let providerControl: SkillProviderControl | undefined
  const mounts = new McpMountRegistry(ctx, dataRoot)
  const commandMounts = new CommandMountRegistry(ctx)
  const hookMounts = new HooksMountRegistry(ctx)

  const reconcileMounts = (): void => {
    void (async () => {
      try {
        const diagnostics = await mounts.reconcile(await manager.enabledUserSuites())
        manager.mcpDiagnostics = diagnostics
        for (const diagnostic of diagnostics) {
          ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" mcp server "${diagnostic.serverKey}": ${diagnostic.reason}`)
        }
      } catch (error) {
        ctx.logger?.warn(`[dsh-agent-plugins-market] mcp reconcile failed: ${error instanceof Error ? error.message : String(error)}`)
      }
      try {
        const diagnostics = await commandMounts.reconcile(await manager.enabledUserSuites())
        for (const diagnostic of diagnostics) {
          if (diagnostic.reason !== '') ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" command "${diagnostic.command}": ${diagnostic.reason}`)
        }
      } catch (error) {
        ctx.logger?.warn(`[dsh-agent-plugins-market] command reconcile failed: ${error instanceof Error ? error.message : String(error)}`)
      }
      try {
        const diagnostics = await hookMounts.reconcile(await manager.enabledUserSuites())
        for (const diagnostic of diagnostics) {
          ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" hooks: ${diagnostic.reason}`)
        }
      } catch (error) {
        ctx.logger?.warn(`[dsh-agent-plugins-market] hooks reconcile failed: ${error instanceof Error ? error.message : String(error)}`)
      }
    })()
  }

  const onChanged = (): void => {
    providerControl?.invalidate()
    reconcileMounts()
  }

  const manager = new SuiteManager({ userRoot, dataRoot, onChanged })
  ctx.inject(['tools'], (toolsCtx) => {
    manager.setMcpToolSnapshotProvider(() => inspectToolRegistry((toolsCtx as { tools: unknown }).tools))
  })
  void manager.load().then(async () => {
    await manager.mergeSources(config.sources ?? [])
    reconcileMounts()
  })

  ctx.skills.registerProvider((control) => {
    providerControl = control
    return new SuiteSkillProvider(manager)
  })

  const disposeContext = mountSuiteContext(ctx, manager)

  ctx.inject(['webServer', 'loader'], (hostCtx) => {
    hostCtx.effect(() => mountSuiteRoutes(hostCtx, manager), 'dsh-agent-plugins-market: http routes')
  })

  ctx.effect(() => () => {
    void mounts.disposeAll()
    void hookMounts.disposeAll()
    commandMounts.disposeAll()
    disposeContext()
  }, 'dsh-agent-plugins-market: lifecycle')
}
