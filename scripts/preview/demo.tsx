/**
 * Static preview of the Agent Plugin Market section for the project
 * screenshot: renders the real MarketSection component with mocked data.
 */
import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { MarketSection } from '../../src/client/MarketSection.js'
import { zh } from '../../src/client/locales.js'

const MOCK_OVERVIEW = {
  sources: [
    { id: 'agent-plugins', url: '/Users/dev/agent-plugins', local: true, cloned: true, suiteIds: ['aliyunlog', 'mysql', 'postgresql', 'ticktick', 'temu-api', 'temu-dev', 'ffmpeg', 'magick', 'real-esrgan', 'withoutbg', 'prompt-forge', 'consulting-advisor', 'config-center', 'ecommerce-expert'] },
    { id: 'codex-plugin', url: 'https://github.com/openai/codex-plugin-cc', cloned: true, suiteIds: ['codex'] },
    { id: 'jeecg-skills', url: '/Users/dev/jeecg-plugin', local: true, cloned: true, suiteIds: ['jeecg-dev', 'jeecg-docs', 'jeecg-codegen'] },
    { id: 'jetbrains', url: '/Users/dev/jetbrains-mcp', local: true, cloned: true, suiteIds: ['jetbrains'] },
    { id: 'mattpocock', url: 'https://github.com/mattpocock/skills.git', cloned: true, suiteIds: ['mattpocock-skills'] },
    { id: 'ui-ux-pro-max', url: 'https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git', cloned: true, suiteIds: ['ui-ux-pro-max'] },
  ],
  suites: [
    { sourceId: 'agent-plugins', suiteId: 'mysql', name: 'mysql', version: '0.12.0', description: 'Enables AI to execute SQL queries against MySQL databases via Node.js scripts with multi-connection support for cross-database analysis.', keywords: ['mysql', 'sql'], surfaces: { skills: 1, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'claude-code', errors: [] },
    { sourceId: 'agent-plugins', suiteId: 'consulting-advisor', name: 'consulting-advisor', version: '0.1.0', description: 'Structured cross-domain consulting for problem solving and cognitive upgrade. Use when the user asks for advice, diagnosis, planning, strategy...', keywords: ['consulting'], surfaces: { skills: 1, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'claude-code', errors: [] },
    { sourceId: 'codex-plugin', suiteId: 'codex', name: 'codex', version: '1.0.6', description: 'Use Codex from Claude Code to review code or delegate tasks.', keywords: ['codex'], surfaces: { skills: 3, mcp: 0, hooks: 3, commands: 8, agents: 1, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'claude-code', errors: [] },
    { sourceId: 'jetbrains', suiteId: 'jetbrains', name: 'jetbrains', version: '2026.1.1', description: 'JetBrains IDE MCP bridge: control the IDE (IntelliJ IDEA) through its streamable-http MCP server.', keywords: ['jetbrains', 'mcp'], surfaces: { skills: 0, mcp: 1, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'agent-plugin-v1', errors: [] },
    { sourceId: 'mattpocock', suiteId: 'mattpocock-skills', name: 'mattpocock-skills', version: '1.2.3', description: "Matt Pocock's agent skills for real engineering — grilling, spec/ticket flows, TDD, code review, domain modelling and more.", keywords: ['skills', 'tdd'], surfaces: { skills: 25, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'claude-code', errors: [] },
    { sourceId: 'agent-plugins', suiteId: 'temu-api', name: 'temu-api', version: '0.1.0', description: 'Reference knowledge base for Temu Partner/OpenAPI integrations: request signing, region/gateway selection, self-developed app auth...', keywords: ['temu'], surfaces: { skills: 1, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: false, installed: false, dimension: 'user', layout: 'claude-code', errors: [] },
    { sourceId: 'jeecg-skills', suiteId: 'jeecg-dev', name: 'jeecg-dev', version: '1.0.0', description: 'JeecgBoot 开发规范（仅手动触发）：痕迹注释、代码修改日志、SVN 提交、建表规则', keywords: ['jeecg'], surfaces: { skills: 1, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'claude-code', errors: [] },
    { sourceId: 'ui-ux-pro-max', suiteId: 'ui-ux-pro-max', name: 'ui-ux-pro-max', version: '2.13.0', description: 'UI/UX design intelligence. Searchable local database with 84 styles, 192 palettes, 74 font pairings, 25 charts, and 22 stacks.', keywords: ['ui', 'ux'], surfaces: { skills: 7, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: true, installed: true, dimension: 'user', layout: 'agent-plugin-v1', errors: [] },
    { sourceId: 'agent-plugins', suiteId: 'ffmpeg', name: 'ffmpeg', version: '0.1.0', description: 'Generate, execute, and verify FFmpeg and ffprobe commands for video, audio, and image media processing.', keywords: ['ffmpeg'], surfaces: { skills: 1, mcp: 0, hooks: 0, commands: 0, agents: 0, lsp: 0 }, enabled: false, installed: false, dimension: 'user', layout: 'claude-code', errors: [] },
  ],
  totals: { all: 27, installed: 8, enabled: 7 },
  roots: { user: '/Users/dev/.dsh/agent-plugins', data: '/Users/dev/.dsh/agent-plugins-data' },
}

// Stub the data layer: overview only; other actions return ok.
globalThis.fetch = async (input: RequestInfo | URL) => {
  const url = String(input)
  if (url.includes('/overview')) {
    return { ok: true, json: async () => MOCK_OVERVIEW } as Response
  }
  return { ok: true, json: async () => ({ ok: true }) } as Response
}

const container = document.getElementById('root')
if (container !== null) {
  createRoot(container).render(h(MarketSection, { t: (key: string) => zh[key] ?? key }))
}
