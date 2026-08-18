/**
 * Suite detail modal: click one suite card to browse its internals.
 *
 * Sections: manifest overview, the skill list (each skill expands to its
 * SKILL.md body through the safe MarkdownText renderer), the validated
 * mcp.json servers (each expands to its full config), command/subagent file
 * lists, hook/LSP counts, and validation diagnostics.
 */
import { createElement as h, useEffect, useState, type ReactNode } from 'react'
import { Button, Modal, MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'
import { fetchSkillContent, fetchSuiteDetail, type McpServerDetail, type SuiteDetail } from './api.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import type { Translate } from './index.js'
import css from './market.module.css'

export interface SuiteDetailModalProps {
  t: Translate
  sourceId: string
  suiteId: string
  onClose: () => void
}

export function SuiteDetailModal({ t, sourceId, suiteId, onClose }: SuiteDetailModalProps): ReactNode {
  const [detail, setDetail] = useState<SuiteDetail | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [openSkill, setOpenSkill] = useState<string | undefined>(undefined)
  const [skillText, setSkillText] = useState<string | undefined>(undefined)
  const [skillLoading, setSkillLoading] = useState(false)
  const [openMcp, setOpenMcp] = useState<string | undefined>(undefined)
  const [openPreview, setOpenPreview] = useState<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    setDetail(undefined)
    setError(undefined)
    fetchSuiteDetail(sourceId, suiteId)
      .then(value => { if (!cancelled) setDetail(value) })
      .catch(reason => { if (!cancelled) setError(reason instanceof Error ? reason.message : String(reason)) })
    return () => { cancelled = true }
  }, [sourceId, suiteId])

  const toggleSkill = async (name: string): Promise<void> => {
    if (openSkill === name) {
      setOpenSkill(undefined)
      return
    }
    setOpenSkill(name)
    setSkillLoading(true)
    setSkillText(undefined)
    try {
      const content = await fetchSkillContent(sourceId, suiteId, name)
      setSkillText(content.content)
    } catch (reason) {
      setSkillText(`⚠ ${reason instanceof Error ? reason.message : String(reason)}`)
    } finally {
      setSkillLoading(false)
    }
  }

  const toggleMcp = (key: string): void => {
    setOpenMcp(openMcp === key ? undefined : key)
  }

  const layoutLabel = detail === undefined
    ? ''
    : detail.layout === 'agent-plugin-v1' ? t('layoutV1') : detail.layout === 'claude-code' ? t('layoutCC') : detail.layout === 'codex' ? t('layoutCodex') : t('layoutSkills')

  return h(Modal, {
    open: true,
    onClose,
    title: detail === undefined ? t('detailTitle') : `${detail.name}${detail.version === null ? '' : ` v${detail.version}`}`,
    description: detail === undefined ? undefined : t('detailHint'),
    closeLabel: t('cancel'),
    className: css.detailDialog,
    contentClassName: css.detailBody,
    footer: h('div', { className: css.modalFooter },
      h(Button, { variant: 'ghost', onClick: onClose }, t('cancel')),
    ),
    children: h(ErrorBoundary, {
      fallback: boundaryError => h('div', { className: css.warnLine }, `${t('actionFail')}: ${boundaryError.message}`),
      children: error !== undefined
      ? h('div', { className: css.warnLine }, error)
      : detail === undefined
        ? h('div', { className: css.empty }, t('loading'))
        : h('div', { className: css.detailSections },
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, t('overviewSection')),
              h('div', { className: css.detailGrid },
                h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('sourceLabel')), h('span', { className: css.detailValue }, detail.sourceId)),
                h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('dimensionLabel')), h('span', { className: css.detailValue }, detail.dimension === 'user' ? t('dimensionUser') : t('dimensionProject'))),
                h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('layoutLabel')), h('span', { className: css.detailValue }, layoutLabel)),
                h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('statusLabel')), h('span', { className: detail.enabled ? css.okState : css.detailValue }, detail.installed ? (detail.enabled ? t('installedBadge') : t('disabledLabel')) : t('notInstalledLabel'))),
                detail.author === null ? null : h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('authorLabel')), h('span', { className: css.detailValue }, detail.author)),
                detail.keywords.length === 0 ? null : h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('keywordsLabel')), h('span', { className: css.detailValue }, detail.keywords.join(', '))),
              ),
              detail.description === null ? null : h('p', { className: css.detailDesc }, detail.description),
              h('div', { className: css.detailCell }, h('span', { className: css.detailKey }, t('rootLabel')), h('span', { className: css.mono }, detail.root)),
            ),
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('skillsSection')} (${detail.skills.length})`),
              detail.skills.length === 0
                ? h('div', { className: css.sidebarEmpty }, '—')
                : detail.skills.map(skill => h('div', { key: skill.name, className: css.detailItem },
                    h('button', {
                      type: 'button',
                      className: openSkill === skill.name ? css.detailItemOpen : css.detailItemRow,
                      onClick: () => { void toggleSkill(skill.name) },
                    },
                      h('span', { className: css.detailItemName }, skill.name),
                      h('span', { className: css.detailItemDesc }, skill.description),
                      h('span', { className: css.detailChevron }, openSkill === skill.name ? '▾' : '▸'),
                    ),
                    openSkill !== skill.name ? null : h('div', { className: css.skillContent },
                      skillLoading ? t('loading') : h(MarkdownText, { text: skillText ?? '' }),
                    ),
                  )),
            ),
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('mcpSection')} (${detail.mcpServers.length})`),
              detail.mcpServers.length === 0
                ? h('div', { className: css.sidebarEmpty }, '—')
                : detail.mcpServers.map(server => h('div', { key: server.key, className: css.detailItem },
                    h('button', {
                      type: 'button',
                      className: openMcp === server.key ? css.detailItemOpen : css.detailItemRow,
                      onClick: () => toggleMcp(server.key),
                    },
                      h('span', { className: css.detailItemName }, server.key),
                      h('span', { className: css.detailItemDesc }, mcpSummary(server)),
                      h('span', { className: css.detailChevron }, openMcp === server.key ? '▾' : '▸'),
                    ),
                    openMcp !== server.key ? null : h('pre', { className: css.mono }, JSON.stringify(server, null, 2)),
                  )),
            ),
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('commandsSection')} (${detail.commands.length})`),
              detail.commands.length === 0 ? h('div', { className: css.sidebarEmpty }, '—')
                : detail.commands.map(command => h(PreviewRow, {
                  key: `c:${command.name}`,
                  t,
                  name: `/${command.name}`,
                  description: command.description,
                  open: openPreview === `c:${command.name}`,
                  onToggle: () => setOpenPreview(openPreview === `c:${command.name}` ? undefined : `c:${command.name}`),
                  children: h(MarkdownText, { text: command.content }),
                })),
            ),
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('agentsSection')} (${detail.agents.length})`),
              detail.agents.length === 0 ? h('div', { className: css.sidebarEmpty }, '—')
                : detail.agents.map(agent => h(PreviewRow, {
                  key: `a:${agent.name}`,
                  t,
                  name: agent.name,
                  description: agent.description,
                  open: openPreview === `a:${agent.name}`,
                  onToggle: () => setOpenPreview(openPreview === `a:${agent.name}` ? undefined : `a:${agent.name}`),
                  children: h(MarkdownText, { text: agent.content }),
                })),
            ),
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('hooksLabel')} (${detail.hooks.count})`),
              detail.hooks.count === 0 ? h('div', { className: css.sidebarEmpty }, '—')
                : detail.hooks.entries.map((hook, index) => h(PreviewRow, {
                  key: `h:${index}`,
                  t,
                  name: hook.event,
                  description: hook.command,
                  open: openPreview === `h:${index}`,
                  onToggle: () => setOpenPreview(openPreview === `h:${index}` ? undefined : `h:${index}`),
                  children: h('pre', { className: css.mono }, JSON.stringify(hook, null, 2)),
                })),
            ),
            h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('lspSection')} (${detail.lsp.length})`),
              detail.lsp.length === 0 ? h('div', { className: css.sidebarEmpty }, '—')
                : detail.lsp.map(entry => h(PreviewRow, {
                  key: `l:${entry.name}`,
                  t,
                  name: entry.name,
                  open: openPreview === `l:${entry.name}`,
                  onToggle: () => setOpenPreview(openPreview === `l:${entry.name}` ? undefined : `l:${entry.name}`),
                  children: h('pre', { className: css.mono }, entry.content),
                })),
            ),
            detail.errors.length === 0 ? null : h('section', { className: css.detailSection },
              h('h4', { className: css.detailHead }, `${t('errors')} (${detail.errors.length})`),
              detail.errors.map((entry, index) => h('div', { key: index, className: css.warnLine }, entry)),
            ),
          ),
      }),
  })
}

function mcpSummary(server: McpServerDetail): string {
  if (server.type === 'stdio') return server.command ?? server.type
  return server.url ?? server.type
}

function PreviewRow(props: {
  t: Translate
  name: string
  description?: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}): ReactNode {
  const { t: _t, name, description, open, onToggle, children } = props
  return h('div', { className: css.detailItem },
    h('button', {
      type: 'button',
      className: open ? css.detailItemOpen : css.detailItemRow,
      onClick: onToggle,
    },
      h('span', { className: css.detailItemName }, name),
      description === undefined ? null : h('span', { className: css.detailItemDesc }, description),
      h('span', { className: css.detailChevron }, open ? '▾' : '▸'),
    ),
    open ? h('div', { className: css.skillContent }, children) : null,
  )
}
