import { CommandMountRegistry } from './commands-mounts.js';
import { HooksMountRegistry } from './hooks-mounts.js';
import { mountSuiteContext } from './context.js';
import { SuiteManager } from './manager.js';
import { McpMountRegistry } from './mcp-mounts.js';
import { resolveDataRoot, resolveUserRoot } from './paths.js';
import { mountSuiteRoutes } from './routes.js';
import { SuiteSkillProvider } from './skills-provider.js';
export const name = 'dsh-agent-plugins-market';
export const inject = ['skills', 'commands'];
export function apply(ctx, config = {}) {
    const userRoot = resolveUserRoot(config.userRoot);
    const dataRoot = resolveDataRoot(config.dataRoot);
    let providerControl;
    const mounts = new McpMountRegistry(ctx, dataRoot);
    const commandMounts = new CommandMountRegistry(ctx);
    const hookMounts = new HooksMountRegistry(ctx);
    const reconcileMounts = () => {
        void (async () => {
            try {
                const diagnostics = await mounts.reconcile(await manager.enabledUserSuites());
                for (const diagnostic of diagnostics) {
                    ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" mcp server "${diagnostic.serverKey}": ${diagnostic.reason}`);
                }
            }
            catch (error) {
                ctx.logger?.warn(`[dsh-agent-plugins-market] mcp reconcile failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            try {
                const diagnostics = await commandMounts.reconcile(await manager.enabledUserSuites());
                for (const diagnostic of diagnostics) {
                    if (diagnostic.reason !== '')
                        ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" command "${diagnostic.command}": ${diagnostic.reason}`);
                }
            }
            catch (error) {
                ctx.logger?.warn(`[dsh-agent-plugins-market] command reconcile failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            try {
                const diagnostics = await hookMounts.reconcile(await manager.enabledUserSuites());
                for (const diagnostic of diagnostics) {
                    ctx.logger?.warn(`[dsh-agent-plugins-market] suite "${diagnostic.suiteId}" hooks: ${diagnostic.reason}`);
                }
            }
            catch (error) {
                ctx.logger?.warn(`[dsh-agent-plugins-market] hooks reconcile failed: ${error instanceof Error ? error.message : String(error)}`);
            }
        })();
    };
    const onChanged = () => {
        providerControl?.invalidate();
        reconcileMounts();
    };
    const manager = new SuiteManager({ userRoot, dataRoot, onChanged });
    void manager.load().then(async () => {
        await manager.mergeSources(config.sources ?? []);
        reconcileMounts();
    });
    ctx.skills.registerProvider((control) => {
        providerControl = control;
        return new SuiteSkillProvider(manager);
    });
    const disposeContext = mountSuiteContext(ctx, manager);
    ctx.inject(['webServer', 'loader'], (hostCtx) => {
        hostCtx.effect(() => mountSuiteRoutes(hostCtx, manager), 'dsh-agent-plugins-market: http routes');
    });
    ctx.effect(() => () => {
        void mounts.disposeAll();
        void hookMounts.disposeAll();
        commandMounts.disposeAll();
        disposeContext();
    }, 'dsh-agent-plugins-market: lifecycle');
}
