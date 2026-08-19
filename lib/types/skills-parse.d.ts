import type { SkillInvocationPolicy } from '@deepseek-ai/dsh-skill';
export interface ParsedSkillFrontmatter {
    name: string;
    description: string;
    whenToUse?: string;
    invocation: SkillInvocationPolicy;
}
/** Kebab-case skill names only, matching the shipped provider's rule. */
export declare function isSkillName(name: string): boolean;
/**
 * Normalize a display-style skill name into kebab-case (e.g. "Presentations"
 * → "presentations"), or `undefined` when nothing usable remains.
 */
export declare function normalizeSkillName(name: string): string | undefined;
/**
 * Parse skill frontmatter with the shipped provider's fail-closed semantics.
 * @returns the parsed frontmatter, or a rejection string explaining why the
 *   skill must be dropped from discovery.
 */
export declare function parseSkillFrontmatter(text: string, expectedName: string | undefined): ParsedSkillFrontmatter | string;
/** Strip the frontmatter block, returning the instruction body. */
export declare function stripFrontmatter(text: string): string;
