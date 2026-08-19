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
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { parseSkillFrontmatter, stripFrontmatter } from './skills-parse.js';
const COMMAND_NAME = /^[a-z][a-z0-9_-]*$/;
export class CommandMountRegistry {
    ctx;
    live = new Map();
    constructor(ctx) {
        this.ctx = ctx;
    }
    /** Register/unregister suite commands and agent-commands to match the enabled suites exactly. */
    async reconcile(enabledSuites) {
        const diagnostics = [];
        const wanted = new Map();
        for (const suite of enabledSuites) {
            for (const spec of [...await readCommands(suite.root), ...await readAgents(suite.root)]) {
                const key = `${suite.id}/${spec.name}`;
                wanted.set(key, { ...spec, suiteId: suite.id, suiteName: suite.manifest.name });
            }
        }
        for (const [key, disposer] of [...this.live]) {
            if (!wanted.has(key)) {
                disposer();
                this.live.delete(key);
            }
        }
        const host = this.ctx;
        if (typeof host.commands?.register !== 'function') {
            if (wanted.size > 0)
                diagnostics.push({ suiteId: '', command: '', reason: 'ctx.commands is not available in this profile' });
            return diagnostics;
        }
        for (const [key, spec] of wanted) {
            if (this.live.has(key))
                continue;
            try {
                const disposer = host.commands.register({
                    name: spec.name,
                    description: `[${spec.suiteName}] ${spec.description}`,
                    ...spec.hint === undefined ? {} : { input: { hint: spec.hint } },
                    handler: (invocation) => {
                        const agent = invocation.agent;
                        const text = [
                            `[Agent Plugins 命令 /${spec.name}（来自 ${spec.suiteId}）]`,
                            '',
                            spec.body.replaceAll('$ARGUMENTS', invocation.rawInput.trim()),
                        ].join('\n');
                        agent.followup({ content: [{ type: 'text', text }], source: { kind: 'plugin', plugin: 'dsh-agent-plugins-market' } });
                        return { kind: 'success', text: `/${spec.name} 已转交模型执行（${spec.suiteId}）` };
                    },
                });
                this.live.set(key, disposer);
            }
            catch (error) {
                diagnostics.push({ suiteId: spec.suiteId, command: spec.name, reason: error instanceof Error ? error.message : String(error) });
            }
        }
        return diagnostics;
    }
    /** Dispose every registered command; used at plugin teardown. */
    disposeAll() {
        for (const disposer of [...this.live.values()])
            disposer();
        this.live.clear();
    }
}
/** Parse `commands/*.md` of one suite root (Claude Code format). */
export async function readCommands(root) {
    let entries;
    try {
        entries = await readdir(join(root, 'commands'));
    }
    catch {
        return [];
    }
    const specs = [];
    for (const entry of entries) {
        if (!entry.endsWith('.md'))
            continue;
        const name = entry.slice(0, -3);
        if (!COMMAND_NAME.test(name))
            continue;
        let text;
        try {
            text = await readFile(join(root, 'commands', entry), 'utf8');
        }
        catch {
            continue;
        }
        const meta = commandMeta(text);
        const description = meta?.description ?? firstLine(text);
        if (description === undefined)
            continue;
        specs.push({ name, description, hint: meta?.hint, body: stripFrontmatter(text) });
    }
    return specs;
}
/** Parse `agents/*.md` of one suite root into `agent-<name>` commands so
 *  subagents are selectable from the slash-command menu, grouped by the
 *  `agent-` prefix (the harness command UI has no group headers). */
export async function readAgents(root) {
    let entries;
    try {
        entries = await readdir(join(root, 'agents'));
    }
    catch {
        return [];
    }
    const specs = [];
    for (const entry of entries) {
        if (!entry.endsWith('.md'))
            continue;
        const name = `agent-${entry.slice(0, -3)}`;
        if (!COMMAND_NAME.test(name))
            continue;
        let text;
        try {
            text = await readFile(join(root, 'agents', entry), 'utf8');
        }
        catch {
            continue;
        }
        const parsed = parseSkillFrontmatter(text, name);
        const description = typeof parsed === 'string' ? parsed : parsed.description;
        if (description === undefined)
            continue;
        specs.push({ name, description, hint: '子代理', body: stripFrontmatter(text) });
    }
    return specs;
}
function commandMeta(text) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
    if (match === null)
        return undefined;
    try {
        const raw = parseYaml(match[1]);
        if (typeof raw !== 'object' || raw === null)
            return undefined;
        const record = raw;
        const meta = {};
        const description = record['description'];
        if (typeof description === 'string' && description.trim() !== '')
            meta.description = description.trim();
        const hint = record['argument-hint'];
        if (typeof hint === 'string' && hint.trim() !== '')
            meta.hint = hint.trim();
        return meta;
    }
    catch {
        return undefined;
    }
}
function firstLine(text) {
    const line = text.split('\n').map(line => line.trim()).find(line => line !== '');
    return line;
}
