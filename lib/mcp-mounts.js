import { toMcpMounts } from './mcp-config.js';
export class McpMountRegistry {
    ctx;
    pluginDataRoot;
    live = new Map();
    names = new Map();
    constructor(ctx, pluginDataRoot) {
        this.ctx = ctx;
        this.pluginDataRoot = pluginDataRoot;
    }
    /** Mount/unmount MCP servers to match the enabled suites exactly. */
    async reconcile(enabledSuites) {
        const wanted = new Map();
        const diagnostics = [];
        for (const suite of enabledSuites) {
            const { mounts, failures } = toMcpMounts(suite, this.pluginDataRoot);
            for (const failure of failures) {
                diagnostics.push({ suiteId: suite.id, serverKey: failure.serverKey, reason: failure.reason });
            }
            for (const mount of mounts) {
                wanted.set(mountKey(mount.suiteId, mount.serverKey), { suite, serverKey: mount.serverKey });
            }
        }
        for (const [key, live] of [...this.live]) {
            if (!wanted.has(key)) {
                await this.unmount(key, live);
                diagnostics.push({ suiteId: live.suiteId, serverKey: live.serverKey, reason: 'unmounted' });
            }
        }
        for (const [key, entry] of wanted) {
            if (this.live.has(key))
                continue;
            const reason = await this.mount(entry.suite, entry.serverKey);
            if (reason !== undefined)
                diagnostics.push({ suiteId: entry.suite.id, serverKey: entry.serverKey, reason });
        }
        return diagnostics.filter(diagnostic => diagnostic.reason !== 'unmounted');
    }
    /** Dispose every live mount; used at plugin teardown. */
    async disposeAll() {
        for (const [key, live] of [...this.live]) {
            await this.unmount(key, live);
        }
    }
    async mount(suite, serverKey) {
        const { mounts } = toMcpMounts(suite, this.pluginDataRoot);
        const request = mounts.find(mount => mount.serverKey === serverKey);
        if (request === undefined)
            return 'server no longer present in mcp.json';
        const owner = this.names.get(request.config.serverName);
        if (owner !== undefined)
            return `derived serverName "${request.config.serverName}" already mounted by ${owner}`;
        let mcpClient;
        try {
            mcpClient = await import('@deepseek-ai/dsh-mcp-client');
        }
        catch {
            return 'the @deepseek-ai/dsh-mcp-client package is not installed in this profile';
        }
        const mountCtx = this.ctx;
        if (typeof mountCtx.plugin !== 'function')
            return 'the host context does not support dynamic plugin mounting';
        try {
            const handle = mountCtx.plugin(mcpClient, request.config);
            await handle.await();
            const key = mountKey(suite.id, serverKey);
            this.live.set(key, { suiteId: suite.id, serverKey, serverName: request.config.serverName, disposer: () => handle.dispose() });
            this.names.set(request.config.serverName, `${suite.id}/${serverKey}`);
            return undefined;
        }
        catch (error) {
            return `mount failed: ${error instanceof Error ? error.message : String(error)}`;
        }
    }
    async unmount(key, live) {
        this.live.delete(key);
        this.names.delete(live.serverName);
        try {
            await live.disposer();
        }
        catch (error) {
            this.ctx.logger?.warn(`[dsh-agent-plugins-market] unmount ${live.suiteId}/${live.serverKey} failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}
function mountKey(suiteId, serverKey) {
    return `${suiteId}\u0000${serverKey}`;
}
