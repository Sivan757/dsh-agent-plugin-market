import { deriveServerName } from './mcp-config.js';
/** Mount the agent_plugins query tool. */
export function mountSuiteContext(ctx, manager) {
    const disposers = [];
    ctx.inject(['tools'], (toolsCtx) => {
        const tools = toolsCtx;
        if (typeof tools.tools?.register !== 'function')
            return;
        const parameters = {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['list', 'info'], description: 'list: 列出全部 Agent Plugins；info: 查看单个 Agent Plugins 详情' },
                suiteId: { type: 'string', description: 'info 动作时必填：Agent Plugins id' },
                sourceId: { type: 'string', description: 'info 动作时可选：Agent Plugins 所属仓库源 id' },
            },
            required: ['action'],
            additionalProperties: false,
        };
        const outputSchema = {
            type: 'object',
            properties: {
                suites: { type: 'array', items: { type: 'object' } },
                skills: { type: 'array', items: { type: 'object' } },
                mcpServers: { type: 'array', items: { type: 'object' } },
                note: { type: 'string' },
            },
        };
        const dispose = tools.tools.register({
            name: 'agent_plugins',
            description: '查询当前会话启用的 Agent Plugins：列出插件清单、技能与 MCP 工具前缀；技能正文通过 skill 工具加载。',
            parameters,
            renderIntent: 'generic',
            output: {
                schema: outputSchema,
                render: (_args, value) => {
                    const text = typeof value === 'string' ? value : JSON.stringify(value, null, 2);
                    return [{ type: 'text', text }];
                },
            },
            execute: async (args) => {
                const record = args;
                const action = record['action'];
                if (action === 'list')
                    return listPayload(await manager.enabledUserSuites());
                if (action === 'info')
                    return infoPayload(await manager.enabledUserSuites(), record);
                return { suites: [], skills: [], mcpServers: [], note: `unknown action ${JSON.stringify(action)}` };
            },
        });
        disposers.push(dispose);
    });
    return () => {
        for (const dispose of disposers)
            dispose();
    };
}
function listPayload(suites) {
    return {
        suites: suites.map(suite => ({
            id: suite.id,
            sourceId: suite.sourceId,
            name: suite.manifest.name,
            version: suite.manifest.version ?? null,
            description: suite.manifest.description ?? null,
            layout: suite.manifest.layout,
        })),
        skills: suites.flatMap(suite => suite.skills.map(skill => ({ suiteId: suite.id, name: skill.name, description: `[${suite.manifest.name}] ${skill.description}` }))),
        mcpServers: suites.flatMap(suite => suite.mcp === undefined
            ? []
            : Object.keys(suite.mcp.servers).map(key => ({ suiteId: suite.id, server: key, tools: `mcp__${deriveServerName(suite.id, key)}__*` }))),
        note: '技能正文通过 skill 工具按 name 加载；MCP 工具名形如 mcp__<plugin>__<server>__<tool>。',
    };
}
function infoPayload(suites, record) {
    const suiteId = record['suiteId'];
    const suite = suites.find(entry => entry.id === suiteId);
    if (suite === undefined)
        return { suites: [], skills: [], mcpServers: [], note: `未找到 Agent Plugins "${String(suiteId)}"（仅列出用户级已启用 Agent Plugins）` };
    return listPayload([suite]);
}
