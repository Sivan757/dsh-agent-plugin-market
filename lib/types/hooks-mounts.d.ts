import type { Context } from '@deepseek-ai/cordis';
import type { Suite } from './types.js';
export interface HooksMountDiagnostic {
    suiteId: string;
    reason: string;
}
export declare class HooksMountRegistry {
    private readonly ctx;
    private readonly live;
    constructor(ctx: Context);
    /** Mount/unmount one bridge per suite to match the enabled suites exactly. */
    reconcile(enabledSuites: Suite[]): Promise<HooksMountDiagnostic[]>;
    /** Dispose every live bridge; used at plugin teardown. */
    disposeAll(): Promise<void>;
    private mount;
    private unmount;
}
/** The first existing CC hook config of a suite root. */
export declare function hookConfigPath(root: string): Promise<string | undefined>;
