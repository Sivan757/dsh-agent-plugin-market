/**
 * Skill provider feeding installed suites into `ctx.skills`.
 *
 * One provider serves both dimensions. Ranks sit between the shipped
 * filesystem roots so each dimension's own skills still win:
 * project suites (250) lose to the project's `.dsh/skills` (100) and
 * `.agents/skills` (200) but beat custom (300); user suites (450) lose to
 * the user's own `~/.dsh/skills` (400) and beat `~/.agents/skills` (500).
 *
 * Bodies are rewritten on load: `${CLAUDE_PLUGIN_ROOT}` (which Claude Code
 * authors write into skill prose) is substituted with the suite root, and the
 * resource base points at the skill directory, so CC-authored skills work
 * verbatim under the harness.
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { SkillCandidate, SkillDefinition, SkillLookupOptions, SkillProvider, SkillSource } from '@deepseek-ai/dsh-skill'
import type { SuiteManager } from './manager.js'
import { loadState } from './state.js'
import { resolveProjectRoot, STATE_FILE_NAME } from './paths.js'
import { discoverSourceList } from './discovery.js'
import { parseSkillFrontmatter, stripFrontmatter } from './skills-parse.js'
import type { Suite, SuiteSkill } from './types.js'

export const SUITE_PROJECT_SOURCE = 'agent-plugin-project' satisfies SkillSource
export const SUITE_USER_SOURCE = 'agent-plugin-user' satisfies SkillSource
const PROJECT_RANK = 250
const USER_RANK = 450

interface SkillLocator {
  file: string
  directory: string
  suiteRoot: string
}

interface LocatedSkill {
  rank: number
  source: SkillSource
  suite: Suite
  skill: SuiteSkill
}

export class SuiteSkillProvider implements SkillProvider {
  readonly name = 'agent-plugin'

  constructor(private readonly manager: SuiteManager) {}

  async list(options: SkillLookupOptions): Promise<SkillCandidate[]> {
    const located = await this.locate(options.cwd)
    located.sort((a, b) => a.rank - b.rank || a.suite.id.localeCompare(b.suite.id) || a.skill.name.localeCompare(b.skill.name))
    return located.map(entry => this.candidateFor(entry))
  }

  async get(candidate: SkillCandidate, options: SkillLookupOptions): Promise<SkillDefinition | undefined> {
    const locator = candidate.locator as SkillLocator
    let text: string
    try {
      text = await readFile(locator.file, 'utf8')
    } catch {
      return undefined
    }
    const parsed = parseSkillFrontmatter(text, candidate.name)
    if (typeof parsed === 'string') return undefined
    const content = stripFrontmatter(text).replaceAll('${CLAUDE_PLUGIN_ROOT}', locator.suiteRoot)
    return {
      name: parsed.name,
      description: parsed.description,
      ...parsed.whenToUse === undefined ? {} : { whenToUse: parsed.whenToUse },
      invocation: parsed.invocation,
      source: candidate.source,
      provider: this.name,
      resourceBase: { kind: 'directory', path: locator.directory },
      path: locator.file,
      content,
    }
  }

  private candidateFor(entry: LocatedSkill): SkillCandidate {
    return {
      name: entry.skill.name,
      description: entry.skill.description,
      ...entry.skill.whenToUse === undefined ? {} : { whenToUse: entry.skill.whenToUse },
      invocation: entry.skill.invocation,
      source: entry.source,
      provider: this.name,
      rank: entry.rank,
      locator: { file: entry.skill.file, directory: entry.skill.directory, suiteRoot: entry.suite.root } satisfies SkillLocator,
      path: entry.skill.file,
      resourceBase: { kind: 'directory', path: entry.skill.directory },
    }
  }

  private async locate(cwd: string | undefined): Promise<LocatedSkill[]> {
    const located: LocatedSkill[] = []
    const userSuites = await this.manager.enabledUserSuites()
    for (const suite of userSuites) {
      for (const skill of suite.skills) {
        located.push({ rank: USER_RANK, source: SUITE_USER_SOURCE, suite, skill })
      }
    }
    if (cwd !== undefined) {
      located.push(...await this.locateProject(cwd))
    }
    return located
  }

  private async locateProject(cwd: string): Promise<LocatedSkill[]> {
    const projectRoot = await resolveProjectRoot(cwd)
    const state = await loadState(join(projectRoot, STATE_FILE_NAME))
    const located: LocatedSkill[] = []
    const suites = await discoverSourceList(state.sources, 'project', projectRoot)
    for (const suite of suites) {
      if (state.installed[`${suite.sourceId}/${suite.id}`]?.enabled !== true) continue
      for (const skill of suite.skills) {
        located.push({ rank: PROJECT_RANK, source: SUITE_PROJECT_SOURCE, suite, skill })
      }
    }
    return located
  }
}
