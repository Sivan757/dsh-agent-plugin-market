import { useEffect, useState, type ReactNode } from 'react'
import { createElement as h } from 'react'
import { Button, Modal } from '@deepseek-ai/dsh-client-ui-primitives'
import type { Translate } from './index.js'
import { fetchMcpStatus, type McpStatusEntry, type McpStatusPayload } from './api.js'
import { SearchFilterToolbar, type SearchFilterToolbarView } from './SearchFilterToolbar.js'
import { deriveMcpStatusViewModel, type McpStatusFilter } from './features/mcp-status/mcp-status-view-model.js'
import css from './mcp-status.module.css'

interface McpStatusPanelProps {
  t: Translate
}

type Filter = McpStatusFilter
type ViewMode = SearchFilterToolbarView

const EMPTY_STATUS: McpStatusPayload = {
  entries: [],
  observedAt: '',
  totals: { all: 0, connected: 0, degraded: 0, failed: 0, disabled: 0 },
  directObservationOnly: true
}

/** DSH-native MCP inventory: click a service card for a standard Modal detail. */
export function McpStatusPanel({ t }: McpStatusPanelProps): ReactNode {
  const [payload, setPayload] = useState<McpStatusPayload>(EMPTY_STATUS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>(undefined)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const [selected, setSelected] = useState<McpStatusEntry | undefined>(undefined)

  const refresh = (): void => {
    setLoading(true)
    setError(undefined)
    fetchMcpStatus()
      .then(setPayload)
      .catch(caught => {
        setError(caught instanceof Error ? caught.message : String(caught))
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refresh()
  }, [])

  const viewModel = deriveMcpStatusViewModel(payload, filter, search)
  const { activeEntries, filtered, filterCounts, visibleTotals } = viewModel

  return h(
    'div',
    { className: css.surface },
    h(
      'header',
      { className: css.header },
      h('div', {}, h('h2', { className: css.title }, t('mcpStatusTitle'))),
      h(
        'div',
        { className: css.headerActions },
        visibleTotals.failed > 0
          ? h('span', { className: css.errorSummary, title: `${visibleTotals.failed} ${t('mcpFailed')}` }, h('span', { className: css.summaryDotRed }), visibleTotals.failed)
          : null,
        h(Button, { variant: 'ghost', size: 'sm', onClick: refresh, disabled: loading, title: t('refresh') }, '↻')
      )
    ),
    h(SearchFilterToolbar, {
      className: css.toolbar,
      search,
      searchLabel: t('mcpSearch'),
      searchPlaceholder: t('mcpSearch'),
      onSearchChange: setSearch,
      filters: (['all', 'plugin', 'direct'] as Filter[]).map(kind => ({
        id: kind,
        label: filterLabel(t, kind),
        count: filterCounts[kind],
        icon: h(McpFilterIcon, { kind }),
        active: filter === kind,
        onSelect: () => setFilter(kind)
      })),
      view,
      gridLabel: t('grid'),
      listLabel: t('list'),
      onViewChange: nextView => setView(nextView)
    }),
    error !== undefined
      ? h('div', { className: css.error }, error, h(Button, { variant: 'ghost', size: 'sm', onClick: refresh }, t('mcpRetry')))
      : loading && activeEntries.length === 0
        ? h('div', { className: css.empty }, t('loading'))
        : filtered.length === 0
          ? h('div', { className: css.empty }, t('mcpEmpty'))
          : h(
              'div',
              { className: view === 'grid' ? css.grid : css.list },
              filtered.map(entry => h(McpCard, { key: entry.id, entry, t, onClick: () => setSelected(entry) }))
            ),
    selected === undefined ? null : h(McpDetailModal, { entry: selected, t, onClose: () => setSelected(undefined) })
  )
}

function McpCard({ entry, t, onClick }: { entry: McpStatusEntry; t: Translate; onClick: () => void }): ReactNode {
  return h(
    'button',
    { type: 'button', className: css.card, onClick },
    h(
      'div',
      { className: css.cardTop },
      h('span', {
        className: `${css.statusDot} ${css[`status${entry.state}`]}`,
        title: stateLabel(t, entry.state),
        'aria-label': stateLabel(t, entry.state)
      }),
      h('span', { className: css.service }, h('span', { className: css.name }, entry.name)),
      h('span', { className: css.toolCount }, `${t('mcpTools')} ${entry.tools.length}`)
    ),
    h('p', { className: css.endpoint }, entry.endpoint ?? t('mcpObservedEndpoint')),
    h(
      'div',
      { className: css.meta },
      h(McpSourceBadge, { kind: entry.kind, label: entry.kind === 'plugin' ? (entry.source ?? '—') : t('mcpDirect'), t }),
      h('span', { className: css.transport }, entry.transport)
    ),
    entry.reason === undefined ? null : h('p', { className: css.cardReason }, entry.reason)
  )
}

function McpSourceBadge({ kind, label, t }: { kind: 'plugin' | 'direct'; label: string; t: Translate }): ReactNode {
  return h('span', { className: kind === 'plugin' ? css.sourcePlugin : css.sourceDirect }, h(McpSourceIcon, { kind }), h('span', {}, kind === 'plugin' ? label : t('mcpDirect')))
}

function McpSourceIcon({ kind }: { kind: 'plugin' | 'direct' }): ReactNode {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true } as const
  return kind === 'plugin'
    ? h(
        'svg',
        common,
        h('path', {
          d: 'M6 2.5v2H4A1.5 1.5 0 0 0 2.5 6v2h2a1.5 1.5 0 1 1 0 3h-2v2A1.5 1.5 0 0 0 4 14.5h2v-2a1.5 1.5 0 1 1 3 0v2h2a1.5 1.5 0 0 0 1.5-1.5v-2h-2a1.5 1.5 0 1 1 0-3h2V6A1.5 1.5 0 0 0 11 4.5H9v-2a1.5 1.5 0 1 0-3 0Z'
        })
      )
    : h('svg', common, h('circle', { cx: 8, cy: 5, r: 2.2 }), h('path', { d: 'M3.5 13c.6-2.2 2.1-3.3 4.5-3.3s3.9 1.1 4.5 3.3' }))
}

function McpFilterIcon({ kind }: { kind: Filter }): ReactNode {
  if (kind === 'plugin') return h(McpSourceIcon, { kind: 'plugin' })
  if (kind === 'direct') return h(McpSourceIcon, { kind: 'direct' })
  return h(
    'svg',
    { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true },
    h('path', { d: 'M2.5 5 8 2.5 13.5 5 8 7.5 2.5 5Zm0 3L8 10.5 13.5 8M2.5 11 8 13.5 13.5 11' })
  )
}

function McpDetailModal({ entry, t, onClose }: { entry: McpStatusEntry; t: Translate; onClose: () => void }): ReactNode {
  return h(Modal, {
    open: true,
    onClose,
    title: entry.name,
    description: t('mcpServiceDetail'),
    closeLabel: t('cancel'),
    className: css.detailDialog,
    contentClassName: css.detailBody,
    footer: h('div', { className: css.modalFooter }, h(Button, { variant: 'ghost', onClick: onClose }, t('cancel'))),
    children: h(
      'div',
      { className: css.detail },
      h(
        'div',
        { className: css.detailMeta },
        h(McpSourceBadge, { kind: entry.kind, label: entry.kind === 'plugin' ? (entry.source ?? '—') : t('mcpDirect'), t }),
        h('span', { className: css.transport }, entry.transport),
        h('span', { className: `${css.state} ${css[`state${entry.state}`]}` }, stateLabel(t, entry.state))
      ),
      entry.reason === undefined ? null : h('div', { className: css.reason }, entry.reason),
      h(
        'section',
        { className: css.detailSection },
        h('h4', { className: css.detailHead }, t('mcpConfig')),
        entry.config === undefined
          ? h('div', { className: css.detailEmpty }, t('mcpDirectConfigUnavailable'))
          : h('pre', { className: css.config }, JSON.stringify(entry.config, null, 2))
      ),
      h(
        'section',
        { className: css.detailSection },
        h('h4', { className: css.detailHead }, `${t('mcpTools')} (${entry.tools.length})`),
        entry.tools.length === 0
          ? h('div', { className: css.detailEmpty }, t('mcpNoTools'))
          : h(
              'div',
              { className: css.toolList },
              entry.tools.map((tool, index) =>
                h(
                  'div',
                  { key: tool.name, className: css.tool },
                  h('span', { className: css.toolIndex }, String(index + 1).padStart(2, '0')),
                  h('span', { className: css.toolName }, tool.name),
                  h('span', { className: css.toolDescription }, tool.description ?? '')
                )
              )
            )
      )
    )
  })
}

function filterLabel(t: Translate, kind: Filter): string {
  if (kind === 'plugin') return t('mcpPlugin')
  if (kind === 'direct') return t('mcpDirect')
  return t('mcpAll')
}

function stateLabel(t: Translate, state: McpStatusEntry['state']): string {
  if (state === 'connected') return t('mcpConnected')
  if (state === 'degraded') return t('mcpDegraded')
  if (state === 'failed') return t('mcpFailed')
  return t('mcpDisabled')
}
