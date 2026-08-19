import type { Context } from '@deepseek-ai/cordis';
import type { Suite } from './types.js';
export interface CommandMountDiagnostic {
    suiteId: string;
    command: string;
    reason: string;
}
interface CommandSpec {
    name: string;
    description: string;
    body: string;
    hint?: string;
}
export declare class CommandMountRegistry {
    private readonly ctx;
    private readonly live;
    constructor(ctx: Context);
    /** Register/unregister suite commands and agent-commands to match the enabled suites exactly. */
    reconcile(enabledSuites: Suite[]): Promise<CommandMountDiagnostic[]>;
    /** Dispose every registered command; used at plugin teardown. */
    disposeAll(): void;
}
/** Parse `commands/*.md` of one suite root (Claude Code format). */
export declare function readCommands(root: string): Promise<CommandSpec[]>;
/** Parse `agents/*.md` of one suite root into `agent-<name>` commands so
 *  subagents are selectable from the slash-command menu, grouped by the
 *  `agent-` prefix (the harness command UI has no group headers). */
export declare function readAgents(root: string): Promise<CommandSpec[]>;
export {};
