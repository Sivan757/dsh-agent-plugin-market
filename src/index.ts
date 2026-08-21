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
import { mountSuiteContext } from './context.js'
import { SuiteManager } from './manager.js'
import { RuntimeReconciler } from './runtime/reconciler.js'
import { inspectToolRegistry } from './runtime/tool-registry-observer.js'
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
  const runtime = new RuntimeReconciler(ctx, dataRoot)

  const reconcileMounts = (): void => {
    void (async () => {
      const snapshot = await manager.readUserCatalog()
      const diagnostics = await runtime.reconcile(snapshot.enabledSuites)
      manager.mcpDiagnostics = diagnostics.mcp
      for (const diagnostic of diagnostics.mcp) {
        ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" mcp server "${diagnostic.serverKey}": ${diagnostic.reason}`)
      }
      for (const diagnostic of diagnostics.commands) {
        if (diagnostic.reason !== '') ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" command "${diagnostic.command}": ${diagnostic.reason}`)
      }
      for (const diagnostic of diagnostics.hooks) {
        ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" hooks: ${diagnostic.reason}`)
      }
      for (const error of diagnostics.errors) {
        ctx.logger?.warn(`[dsh-agent-plugins-market] ${error.surface} reconcile failed: ${error.reason}`)
      }
    })().catch(error => {
      ctx.logger?.warn(`[dsh-agent-plugins-market] runtime reconcile failed: ${error instanceof Error ? error.message : String(error)}`)
    })
  }

  const onChanged = (): void => {
    providerControl?.invalidate()
    reconcileMounts()
  }

  const manager = new SuiteManager({ userRoot, dataRoot, onChanged })
  ctx.inject(['tools'], toolsCtx => {
    manager.setMcpToolSnapshotProvider(() => inspectToolRegistry((toolsCtx as { tools: unknown }).tools))
  })
  void manager.load().then(async () => {
    await manager.mergeSources(config.sources ?? [])
    reconcileMounts()
  })

  ctx.skills.registerProvider(control => {
    providerControl = control
    return new SuiteSkillProvider(manager)
  })

  const disposeContext = mountSuiteContext(ctx, manager)

  ctx.inject(['webServer', 'loader'], hostCtx => {
    hostCtx.effect(() => mountSuiteRoutes(hostCtx, manager), 'dsh-agent-plugins-market: http routes')
  })

  ctx.effect(
    () => () => {
      void runtime.dispose()
      disposeContext()
    },
    'dsh-agent-plugins-market: lifecycle'
  )
}
