import type { SkillCandidate, SkillDefinition, SkillLookupOptions, SkillProvider } from '@deepseek-ai/dsh-skill';
import type { SuiteManager } from './manager.js';
export declare const SUITE_PROJECT_SOURCE = "agent-plugin-project";
export declare const SUITE_USER_SOURCE = "agent-plugin-user";
export declare class SuiteSkillProvider implements SkillProvider {
    private readonly manager;
    readonly name = "agent-plugin";
    constructor(manager: SuiteManager);
    list(options: SkillLookupOptions): Promise<SkillCandidate[]>;
    /** Parse `agents/*.md` of one suite into agent-definition candidates. */
    private agentsOf;
    get(candidate: SkillCandidate, options: SkillLookupOptions): Promise<SkillDefinition | undefined>;
    private candidateFor;
    private locate;
    private locateProject;
}
