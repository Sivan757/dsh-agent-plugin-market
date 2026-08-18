/**
 * The 套件市场 section: search + status tabs over the host's
 * `/api/agent-plugin/*` routes, a repository-source sidebar, and suite cards
 * with install / enable-toggle / refresh / uninstall actions.
 *
 * The section is the sole owner of its copy and layout: primitives provide
 * controls and CSS-module classes provide the market chrome, matching the
 * settings-dialog convention.
 */
import { createElement as h, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  Button,
  Input,
  Modal,
  Pill,
  StateDot,
  Toast,
  Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { fetchOverview, postAction, type OverviewData, type SourceOverview, type SuiteCardData } from './api.js'
import type { Translate } from './index.js'
import css from './market.module.css'

export interface MarketSectionProps {
  t: Translate
}

type Tab = 'all' | 'installed' | 'uninstalled'
type ViewMode = 'grid' | 'list'

interface ToastState {
  key: number
  message: string
}

interface ConfirmState {
  kind: 'uninstall' | 'removeSource'
  sourceId: string
  suiteId?: string
}

const EMPTY_OVERVIEW: OverviewData = { sources: [], suites: [], totals: { all: 0, installed: 0, enabled: 0 }, roots: { user: '', data: '' } }

export function MarketSection({ t }: MarketSectionProps): ReactNode {
  const [overview, setOverview] = useState<OverviewData>(EMPTY_OVERVIEW)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [view, setView] = useState<ViewMode>('grid')
  const [busy, setBusy] = useState<string | undefined>(undefined)
  const [toast, setToast] = useState<ToastState | undefined>(undefined)
  const [confirm, setConfirm] = useState<ConfirmState | undefined>(undefined)

  const refresh = useCallback(async () => {
    try {
      setOverview(await fetchOverview())
    } catch {
      setToast({ key: Date.now(), message: t('loadFail') })
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const action = useCallback(async (key: string, path: string, body: Record<string, unknown>): Promise<boolean> => {
    setBusy(key)
    try {
      await postAction(path, body)
      await refresh()
      return true
    } catch (error) {
      setToast({ key: Date.now(), message: `${t('actionFail')}: ${error instanceof Error ? error.message : String(error)}` })
      return false
    } finally {
      setBusy(undefined)
    }
  }, [refresh, t])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return overview.suites.filter((suite) => {
      if (tab === 'installed' && !suite.installed) return false
      if (tab === 'uninstalled' && suite.installed) return false
      if (needle === '') return true
      const haystack = `${suite.name} ${suite.description ?? ''} ${suite.keywords.join(' ')}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [overview, search, tab])

  const openUninstall = useCallback((suite: SuiteCardData) => {
    setConfirm({ kind: 'uninstall', sourceId: suite.sourceId, suiteId: suite.suiteId })
  }, [])

  const openRemoveSource = useCallback((source: SourceOverview) => {
    setConfirm({ kind: 'removeSource', sourceId: source.id })
  }, [])

  const confirmAction = useCallback(async () => {
    if (confirm === undefined) return
    if (confirm.kind === 'uninstall' && confirm.suiteId !== undefined) {
      await action(`u:${confirm.suiteId}`, 'uninstall', { sourceId: confirm.sourceId, suiteId: confirm.suiteId })
    } else if (confirm.kind === 'removeSource') {
      await action(`s:${confirm.sourceId}`, 'sources/remove', { id: confirm.sourceId })
    }
    setConfirm(undefined)
  }, [confirm, action])

  return h('div', { className: css.market },
    h('header', { className: css.header },
      h('div', { className: css.titleRow },
        h('h2', { className: css.title }, t('nav')),
        h('div', { className: css.searchWrap },
          h(Input, { placeholder: t('searchPh'), value: search, onChange: event => setSearch((event.target as HTMLInputElement).value) })),
      ),
      h('div', { className: css.tabRow },
        h(TabButton, { t, active: tab === 'all', label: `${t('tabAll')} ${overview.totals.all}`, onClick: () => setTab('all') }),
        h(TabButton, { t, active: tab === 'installed', label: `${t('tabInstalled')} ${overview.totals.installed}`, onClick: () => setTab('installed') }),
        h(TabButton, { t, active: tab === 'uninstalled', label: `${t('tabUninstalled')} ${overview.totals.all - overview.totals.installed}`, onClick: () => setTab('uninstalled') }),
        h('div', { className: css.spacer }),
        h(Button, {
          variant: 'ghost', size: 'sm',
          onClick: () => setView(view === 'grid' ? 'list' : 'grid'),
        }, view === 'grid' ? t('list') : t('grid')),
      ),
    ),
    h('div', { className: css.body },
      h(SourcesPanel, {
        t, sources: overview.sources, busy, action, openRemoveSource,
        onAdd: async (id, url, branch, local) => {
          const ok = await action(`s:add:${id}`, 'sources/add', { id, url, ...branch === '' ? {} : { branch }, ...local ? { local: true } : {} })
          if (ok) {
            setSearch('')
          }
          return ok
        },
        onRefreshAll: async () => { await action('s:refresh:all', 'sources/refresh', {}) },
      }),
      h('main', { className: view === 'grid' ? css.grid : css.list },
        loading
          ? h('div', { className: css.empty }, '…')
          : filtered.length === 0
            ? h('div', { className: css.empty }, tab === 'installed' ? t('installedEmpty') : t('empty'))
            : filtered.map(suite => h(SuiteCard, {
              key: `${suite.sourceId}/${suite.suiteId}`,
              t, suite,
              busy: busy !== undefined,
              onInstall: () => { void action(`i:${suite.suiteId}`, 'install', { sourceId: suite.sourceId, suiteId: suite.suiteId }) },
              onToggle: () => { void action(`e:${suite.suiteId}`, 'set-enabled', { sourceId: suite.sourceId, suiteId: suite.suiteId, enabled: !suite.enabled }) },
              onRefresh: () => { void action(`r:${suite.suiteId}`, 'sources/refresh', { id: suite.sourceId }) },
              onUninstall: () => openUninstall(suite),
            })),
      ),
    ),
    toast === undefined ? null : h(Toast, { key: toast.key, text: toast.message, onDone: () => setToast(undefined) }),
    confirm === undefined ? null : h(Modal, {
      open: true,
      onClose: () => setConfirm(undefined),
      title: confirm.kind === 'uninstall' ? t('uninstallConfirmTitle') : t('removeSourceConfirmTitle'),
      closeLabel: t('cancel'),
      description: confirm.kind === 'uninstall' ? t('uninstallConfirmDesc') : t('removeSourceConfirmDesc'),
      footer: h('div', { className: css.modalFooter },
        h(Button, { variant: 'ghost', onClick: () => setConfirm(undefined) }, t('cancel')),
        h(Button, { variant: 'primary', onClick: () => { void confirmAction() } }, t('confirm')),
      ),
    }),
  )
}

function TabButton({ t: _t, active, label, onClick }: { t: Translate; active: boolean; label: string; onClick: () => void }): ReactNode {
  return h('button', { type: 'button', className: active ? css.tabActive : css.tab, onClick }, label)
}

function SourcesPanel(props: {
  t: Translate
  sources: SourceOverview[]
  busy: string | undefined
  action: (key: string, path: string, body: Record<string, unknown>) => Promise<boolean>
  openRemoveSource: (source: SourceOverview) => void
  onAdd: (id: string, url: string, branch: string, local: boolean) => Promise<boolean>
  onRefreshAll: () => Promise<void>
}): ReactNode {
  const { t } = props
  const [adding, setAdding] = useState(false)
  const [local, setLocal] = useState(false)
  const [id, setId] = useState('')
  const [url, setUrl] = useState('')
  const [branch, setBranch] = useState('')
  return h('aside', { className: css.sidebar },
    h('div', { className: css.sidebarHead },
      h('h3', { className: css.sidebarTitle }, t('market')),
      h(Button, { variant: 'ghost', size: 'sm', onClick: () => { void props.onRefreshAll() } }, t('refreshAll')),
      h(Button, { variant: 'ghost', size: 'sm', onClick: () => setAdding(!adding) }, t('addSource')),
    ),
    adding ? h('div', { className: css.addForm },
      h('div', { className: css.modeRow },
        h(TabButton, { t, active: !local, label: t('sourceModeGit'), onClick: () => setLocal(false) }),
        h(TabButton, { t, active: local, label: t('sourceModeLocal'), onClick: () => setLocal(true) }),
      ),
      h(Input, { placeholder: t('sourceIdPh'), value: id, onChange: event => setId((event.target as HTMLInputElement).value) }),
      h(Input, { placeholder: local ? t('sourceUrlLocalPh') : t('sourceUrlPh'), value: url, onChange: event => setUrl((event.target as HTMLInputElement).value) }),
      local ? null : h(Input, { placeholder: t('branchPh'), value: branch, onChange: event => setBranch((event.target as HTMLInputElement).value) }),
      h(Button, {
        variant: 'primary', size: 'sm',
        disabled: props.busy !== undefined,
        onClick: () => { void props.onAdd(id.trim(), url.trim(), branch.trim(), local).then(ok => { if (ok) { setId(''); setUrl(''); setBranch(''); setAdding(false) } }) },
      }, t('add')),
    ) : null,
    props.sources.length === 0
      ? h('div', { className: css.sidebarEmpty }, '—')
      : props.sources.map(source => h('div', { key: source.id, className: css.sourceRow },
        h('div', { className: css.sourceMain },
          h('span', { className: css.sourceName }, source.id),
          h('span', { className: css.sourceCount }, String(source.suiteIds.length)),
          h(StateDot, { state: source.cloned ? 'done' : 'ongoing' }),
          h('span', { className: css.sourceStatus },
            source.local === true ? `${t('sourceLocal')} · ${source.cloned ? t('sourceCloned') : t('sourceNotCloned')}` : (source.cloned ? t('sourceCloned') : t('sourceNotCloned'))),
        ),
        h('div', { className: css.sourceActions },
          h(Button, {
            variant: 'ghost', size: 'sm', title: t('refresh'),
            disabled: props.busy !== undefined || !source.cloned,
            onClick: () => { void props.action(`s:${source.id}`, 'sources/refresh', { id: source.id }) },
          }, '↻'),
          h(Button, {
            variant: 'ghost', size: 'sm', title: t('remove'),
            onClick: () => props.openRemoveSource(source),
          }, '🗑'),
        ),
      )),
  )
}

function SuiteCard(props: {
  t: Translate
  suite: SuiteCardData
  busy: boolean
  onInstall: () => void
  onToggle: () => void
  onRefresh: () => void
  onUninstall: () => void
}): ReactNode {
  const { t, suite, busy } = props
  const tags: Array<[string, number]> = ([
    [t('surfaceSkills'), suite.surfaces.skills],
    [t('surfaceMcp'), suite.surfaces.mcp],
    [t('surfaceHooks'), suite.surfaces.hooks],
    [t('surfaceCommands'), suite.surfaces.commands],
    [t('surfaceAgents'), suite.surfaces.agents],
    [t('surfaceLsp'), suite.surfaces.lsp],
  ] as Array<[string, number]>).filter(([, count]) => count > 0)
  const layoutLabel = suite.layout === 'agent-plugin-v1' ? t('layoutV1') : suite.layout === 'claude-code' ? t('layoutCC') : suite.layout === 'codex' ? t('layoutCodex') : t('layoutSkills')
  return h('article', { className: css.card },
    h('div', { className: css.cardTop },
      h('div', { className: css.cardTitle },
        h('span', { className: css.cardName }, suite.name),
        suite.version === undefined ? null : h(Pill, { className: css.cardVersion }, `v${suite.version}`),
      ),
      h('div', { className: css.cardActions },
        suite.installed
          ? h('button', {
            type: 'button',
            title: suite.enabled ? t('disable') : t('enable'),
            className: suite.enabled ? css.toggleOn : css.toggleOff,
            disabled: busy,
            onClick: props.onToggle,
            'aria-pressed': suite.enabled,
          }, suite.enabled ? '●' : '○')
          : h(Button, {
            variant: 'primary', size: 'sm', disabled: busy,
            onClick: props.onInstall,
          }, t('install')),
        suite.installed ? h(Button, { variant: 'ghost', size: 'sm', title: t('refresh'), disabled: busy, onClick: props.onRefresh }, '↻') : null,
        suite.installed ? h(Button, { variant: 'ghost', size: 'sm', title: t('uninstall'), disabled: busy, onClick: props.onUninstall }, '🗑') : null,
      ),
    ),
    h('p', { className: css.cardDesc }, suite.description ?? ''),
    h('div', { className: css.cardMeta },
      suite.dimension === 'user' ? h(Pill, { className: css.badge }, t('dimensionUser')) : h(Pill, { className: css.badge }, t('dimensionProject')),
      h(Pill, { className: css.badge }, layoutLabel),
      suite.installed ? h(Pill, { className: suite.enabled ? css.badgeOn : css.badge }, t('installedBadge')) : null,
      ...tags.map(([label, count]) => h(Pill, { key: label, className: css.badge }, `${label} ${count}`)),
      suite.errors.length === 0 ? null : h(Tooltip, {
        label: suite.errors.slice(0, 8).join('；'),
        children: h(Pill, { className: css.badgeWarn }, `⚠ ${t('errors')} ${suite.errors.length}`),
      }),
    ),
  )
}
