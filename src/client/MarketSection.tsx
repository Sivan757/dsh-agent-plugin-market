/**
 * The Agent Plugins Market settings section.
 *
 * Layout: repository sources run along the TOP as chips (全部 first), with
 * edit-current / add / refresh-all controls on the right; below sit search,
 * status tabs, and the card grid. Colors ride the dsh --dsw-alias-* tokens
 * with light-mode fallbacks so the page follows the active theme.
 */
import { createElement as h, useCallback, useEffect, useMemo, useState, type ReactElement, type ReactNode } from 'react'
import {
  Button,
  Input,
  Modal,
  Toast,
  Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { fetchOverview, fetchSourceProgress, postAction, type OverviewData, type SourceOverview, type SourceProgress, type SuiteCardData } from './api.js'
import type { Translate } from './index.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { SuiteDetailModal } from './SuiteDetail.js'
import { SearchFilterToolbar } from './SearchFilterToolbar.js'
import css from './market.module.css'

/** Host step keys -> translation keys, resolved against the active t(). */
const PROGRESS_STEP_LABELS: Record<string, string> = {
  cloning: 'progressCloning',
  reading: 'progressReading',
}

export interface MarketSectionProps {
  t: Translate
  /** The host surface controls only outer spacing; data and actions stay shared. */
  mode?: 'settings' | 'page'
}

type Tab = 'all' | 'installed' | 'uninstalled'
type Category = 'all' | string
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

type EditorState =
  | { mode: 'edit'; source: SourceOverview }
  | { mode: 'add' }
  | undefined

interface ProgressState {
  step: string | undefined
  error: string | undefined
}

/**
 * Poll the host's source-mutation progress while an add-source request runs.
 * Failures of the poll itself never surface: the add request is the authority.
 */
function startProgressPolling(report: (state: ProgressState) => void): { stop: () => void } {
  let stopped = false
  const tick = async () => {
    if (stopped) return
    try {
      const progress: SourceProgress = await fetchSourceProgress()
      if (!stopped && progress.active) report({ step: progressStepLabel(progress.step), error: undefined })
    } catch {
      // transient poll failures are ignored; the add request reports real errors
    }
    if (!stopped) timer = setTimeout(tick, 800) as unknown as number
  }
  let timer = setTimeout(tick, 400) as unknown as number
  return {
    stop: () => {
      stopped = true
      clearTimeout(timer)
    },
  }
}

function progressStepLabel(step: string): string {
  return PROGRESS_STEP_LABELS[step] ?? step
}

/** Keep parameterized copy compatible with hosts whose bound translator ignores params. */
function interpolate(text: string, params: Record<string, unknown>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => key in params ? String(params[key]) : match)
}

const EMPTY_OVERVIEW: OverviewData = { sources: [], suites: [], totals: { all: 0, installed: 0, enabled: 0 }, roots: { user: '', data: '' } }

/**
 * Session-level overview cache: the first mount paints the last snapshot
 * instantly (no empty-state flash on reopen), then revalidates in the
 * background. Every refresh overwrites the cached copy.
 */
let cachedOverview: OverviewData | undefined
let inflightOverview: Promise<OverviewData> | undefined

function loadOverview(): { initial: OverviewData; revalidating: boolean; promise: Promise<OverviewData> } {
  const initial = cachedOverview ?? EMPTY_OVERVIEW
  if (inflightOverview === undefined) {
    inflightOverview = fetchOverview()
      .then(data => {
        cachedOverview = data
        return data
      })
      .finally(() => { inflightOverview = undefined })
  }
  return { initial, revalidating: cachedOverview === undefined, promise: inflightOverview }
}

/** Invalidate the cached overview after any mutating action. */
function dropCachedOverview(): void {
  cachedOverview = undefined
}

export function MarketSection({ t, mode = 'settings' }: MarketSectionProps): ReactNode {
  const [overview, setOverview] = useState<OverviewData>(() => loadOverview().initial)
  const [loading, setLoading] = useState(() => cachedOverview === undefined)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [category, setCategory] = useState<Category>('all')
  const [view, setView] = useState<ViewMode>('grid')
  const [busy, setBusy] = useState<string | undefined>(undefined)
  const [toast, setToast] = useState<ToastState | undefined>(undefined)
  const [confirm, setConfirm] = useState<ConfirmState | undefined>(undefined)
  const [editor, setEditor] = useState<EditorState>(undefined)
  const [detail, setDetail] = useState<{ sourceId: string; suiteId: string } | undefined>(undefined)
  const [progress, setProgress] = useState<ProgressState>({ step: undefined, error: undefined })

  const refresh = useCallback(async () => {
    dropCachedOverview()
    try {
      const data = await loadOverview().promise
      setOverview(data)
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
      dropCachedOverview()
      await refresh()
      return true
    } catch (error) {
      setToast({ key: Date.now(), message: `${t('actionFail')}: ${error instanceof Error ? error.message : String(error)}` })
      return false
    } finally {
      setBusy(undefined)
    }
  }, [refresh, t])

  // Scope totals follow the selected source pill; without a selection they
  // mirror the overview-wide totals (全部 / 已安装 / 未安装 stay consistent
  // with the visible set).
  const scopeTotals = useMemo(() => {
    if (category === 'all') return overview.totals
    const scoped = overview.suites.filter(suite => suite.sourceId === category)
    return {
      all: scoped.length,
      installed: scoped.filter(suite => suite.installed).length,
      enabled: scoped.filter(suite => suite.enabled).length,
    }
  }, [overview, category])

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return overview.suites.filter((suite) => {
      if (category !== 'all' && suite.sourceId !== category) return false
      if (tab === 'installed' && !suite.installed) return false
      if (tab === 'uninstalled' && suite.installed) return false
      if (needle === '') return true
      const haystack = `${suite.name} ${suite.description ?? ''} ${suite.keywords.join(' ')}`.toLowerCase()
      return haystack.includes(needle)
    })
  }, [overview, search, tab, category])

  const openUninstall = useCallback((suite: SuiteCardData) => {
    setConfirm({ kind: 'uninstall', sourceId: suite.sourceId, suiteId: suite.suiteId })
  }, [])

  const confirmAction = useCallback(async () => {
    if (confirm === undefined) return
    if (confirm.kind === 'uninstall' && confirm.suiteId !== undefined) {
      await action(`u:${confirm.suiteId}`, 'uninstall', { sourceId: confirm.sourceId, suiteId: confirm.suiteId })
    } else if (confirm.kind === 'removeSource') {
      await action(`s:${confirm.sourceId}`, 'sources/remove', { id: confirm.sourceId })
      if (category === confirm.sourceId) setCategory('all')
    }
    setConfirm(undefined)
  }, [confirm, action, category])

  const selectedSource = category === 'all' ? undefined : overview.sources.find(source => source.id === category)

  return h(ErrorBoundary, {
    fallback: error => h('div', { className: css.empty }, `${t('actionFail')}: ${error.message}`),
    children: h('div', { className: mode === 'page' ? `${css.market} ${css.pageMode}` : css.market },
    h('header', { className: css.header },
      h('div', { className: css.titleRow },
        h('h2', { className: css.title }, t('nav')),
        h('div', { className: css.spacer }),
        h('div', { className: css.searchGroup },
          h(Button, { variant: 'ghost', size: 'sm', title: t('addSource'), onClick: () => setEditor({ mode: 'add' }) }, '＋'),
          h(Button, { variant: 'ghost', size: 'sm', title: t('refreshAll'), onClick: () => { void action('s:refresh:all', 'sources/refresh', {}) } }, '↻'),
        ),
      ),
      h('div', { className: css.marketControls },
        h('div', { className: css.sourceTabsRow },
          h('div', { className: css.sourceTabsScroll },
            h(SourceTab, {
              key: '__all__',
              t,
              active: category === 'all',
              label: `${t('tabAll')} ${overview.totals.all}`,
              onSelect: () => setCategory('all'),
            }),
            ...[...overview.sources].sort((a, b) => a.id.localeCompare(b.id)).map(source => h(SourceTab, {
              key: source.id,
              t,
              active: category === source.id,
              label: `${source.id}${source.local === true ? ` · ${t('sourceLocal')}` : ''} ${source.suiteIds.length}${source.cloned === false ? ' ⚠' : ''}`,
              onSelect: () => setCategory(source.id),
              onDelete: () => setConfirm({ kind: 'removeSource', sourceId: source.id }),
              onEdit: selectedSource?.id === source.id ? () => setEditor({ mode: 'edit', source: source }) : undefined,
            })),
          ),
        ),
        h(SearchFilterToolbar, {
          search,
          searchLabel: t('searchPh'),
          searchPlaceholder: t('searchPh'),
          onSearchChange: setSearch,
          filters: [
            { id: 'all', label: t('tabAll'), count: scopeTotals.all, icon: h(StatusIcon, { kind: 'all' }), active: tab === 'all', onSelect: () => setTab('all') },
            { id: 'installed', label: t('tabInstalled'), count: scopeTotals.installed, icon: h(StatusIcon, { kind: 'installed' }), active: tab === 'installed', onSelect: () => setTab('installed') },
            { id: 'uninstalled', label: t('tabUninstalled'), count: scopeTotals.all - scopeTotals.installed, icon: h(StatusIcon, { kind: 'uninstalled' }), active: tab === 'uninstalled', onSelect: () => setTab('uninstalled') },
          ],
          view,
          gridLabel: t('grid'),
          listLabel: t('list'),
          onViewChange: nextView => setView(nextView),
        }),
      ),
    ),
    h('main', { className: view === 'grid' ? css.grid : css.list },
          loading
            ? h('div', { className: css.empty }, t('loading'))
            : filtered.length === 0
              ? h('div', { className: css.empty }, tab === 'installed' ? t('installedEmpty') : t('empty'))
              : filtered.map(suite => h(SuiteCard, {
                key: `${suite.sourceId}/${suite.suiteId}`,
                t, suite,
                busy: busy !== undefined,
                onOpen: () => setDetail({ sourceId: suite.sourceId, suiteId: suite.suiteId }),
                onInstall: () => { void action(`i:${suite.suiteId}`, 'install', { sourceId: suite.sourceId, suiteId: suite.suiteId }) },
                onAddSource: () => { if (suite.remoteUrl !== undefined) void action(`a:${suite.suiteId}`, 'sources/add', { url: suite.remoteUrl }) },
                onToggle: () => { void action(`e:${suite.suiteId}`, 'set-enabled', { sourceId: suite.sourceId, suiteId: suite.suiteId, enabled: !suite.enabled }) },
                onRefresh: () => { void action(`r:${suite.suiteId}`, 'sources/refresh', { id: suite.sourceId }) },
                onUninstall: () => openUninstall(suite),
              })),
    ),
    toast === undefined ? null : h(Toast, { key: toast.key, text: toast.message, onDone: () => setToast(undefined) }),
    confirm === undefined ? null : h(Modal, {
      open: true,
      onClose: () => setConfirm(undefined),
      title: confirm.kind === 'uninstall' ? t('uninstallConfirmTitle') : interpolate(t('removeSourceConfirmTitle', { sourceId: confirm.sourceId }), { sourceId: confirm.sourceId }),
      closeLabel: t('cancel'),
      description: confirm.kind === 'uninstall' ? t('uninstallConfirmDesc') : t('removeSourceConfirmDesc'),
      footer: h('div', { className: css.modalFooter },
        h(Button, { variant: 'ghost', onClick: () => setConfirm(undefined) }, t('cancel')),
        h(Button, { variant: 'primary', onClick: () => { void confirmAction() } }, t('confirmDelete')),
      ),
    }),
    detail === undefined ? null : h(SuiteDetailModal, {
      t,
      sourceId: detail.sourceId,
      suiteId: detail.suiteId,
      onClose: () => setDetail(undefined),
    }),

    editor === undefined ? null : h(SourceEditorModal, {
      t,
      editor,
      busy: busy !== undefined,
      progress,
      onClose: () => setEditor(undefined),
      onSave: async (url, branch, local) => {
        const key = editor.mode === 'edit' ? `s:edit:${editor.source.id}` : `s:add:${url}`
        const body = { url, ...branch === '' ? {} : { branch }, local }
        if (editor.mode === 'add') {
          setBusy(key)
          setProgress({ step: t('progressStarting'), error: undefined })
          const poll = startProgressPolling(setProgress)
          try {
            const payload = await postAction('sources/add', body)
            const derived = (payload['source'] as { id?: string } | undefined)?.id
            dropCachedOverview()
            await refresh()
            setEditor(undefined)
            if (derived !== undefined) setCategory(derived)
            return true
          } catch (error) {
            setToast({ key: Date.now(), message: `${t('actionFail')}: ${error instanceof Error ? error.message : String(error)}` })
            setProgress({ step: undefined, error: error instanceof Error ? error.message : String(error) })
            return false
          } finally {
            poll.stop()
            setBusy(undefined)
          }
        }
        const ok = await action(key, 'sources/update', { id: editor.source.id, ...body })
        if (ok) setEditor(undefined)
        return ok
      },
      onRemove: async (id) => {
        setConfirm({ kind: 'removeSource', sourceId: id })
        setEditor(undefined)
      },
    }),
  )
  })
}

type StatusIconKind = 'all' | 'installed' | 'uninstalled'

function StatusIcon({ kind }: { kind: StatusIconKind }): ReactNode {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true } as const
  if (kind === 'installed') {
    return h('svg', common, h('circle', { cx: 8, cy: 8, r: 5.5 }), h('path', { d: 'm5.5 8 1.7 1.7 3.4-3.4' }))
  }
  if (kind === 'uninstalled') {
    return h('svg', common, h('path', { d: 'M8 2v8m-3-3 3 3 3-3M3 13h10' }))
  }
  return h('svg', common, h('path', { d: 'M2.5 5 8 2.5 13.5 5 8 7.5 2.5 5Zm0 3L8 10.5 13.5 8M2.5 11 8 13.5 13.5 11' }))
}

/** A source tab with a trailing delete control (deletion confirms at the section level). */
function SourceTab(props: {
  t: Translate
  active?: boolean
  label: string
  onSelect: () => void
  onDelete?: () => void
  onEdit?: () => void
}): ReactNode {
  const { t, active = false, label, onSelect, onDelete, onEdit } = props
  return h('div', { className: active ? css.srcTabOn : css.srcTab },
    h('button', { type: 'button', className: css.srcTabMain, onClick: onSelect }, label),
    onEdit === undefined ? null : h('button', {
      type: 'button',
      className: css.srcTabEdit,
      title: t('editSource'),
      onClick: (event: { stopPropagation(): void }) => { event.stopPropagation(); onEdit() },
    }, '✎'),
    onDelete === undefined ? null : h('button', {
      type: 'button',
      className: css.srcTabDel,
      title: t('remove'),
      onClick: (event: { stopPropagation(): void }) => { event.stopPropagation(); onDelete() },
    }, '×'),
  )
}

function SourceEditorModal(props: {
  t: Translate
  editor: Exclude<EditorState, undefined>
  busy: boolean
  progress: ProgressState
  onClose: () => void
  onSave: (url: string, branch: string, local: boolean) => Promise<boolean>
  onRemove: (id: string) => void
}): ReactNode {
  const { t, editor } = props
  const [local, setLocal] = useState(editor.mode === 'edit' && editor.source.local === true)
  const [url, setUrl] = useState(editor.mode === 'edit' ? editor.source.url : '')
  const [branch, setBranch] = useState(editor.mode === 'edit' ? (editor.source.branch ?? '') : '')
  const id = editor.mode === 'edit' ? editor.source.id : ''
  const title = editor.mode === 'edit' ? t('editSourceTitle') : t('addSourceTitle')
  return h(Modal, {
    open: true,
    onClose: props.onClose,
    title,
    description: t('editorHint'),
    closeLabel: t('cancel'),
    className: css.editorDialog,
    footer: h('div', { className: css.modalFooter },
      h('div', { className: css.modalFooterLeft },
        editor.mode === 'edit'
          ? h(Button, { variant: 'ghost', onClick: () => props.onRemove(id) }, `🗑 ${t('remove')}`)
          : null,
      ),
      h(Button, { variant: 'ghost', onClick: props.onClose }, t('cancel')),
      h(Button, {
        variant: 'primary',
        disabled: props.busy,
        onClick: () => { void props.onSave(url.trim(), branch.trim(), local) },
      }, t('save')),
    ),
    children: h('div', { className: css.editorForm },
      h('div', { className: css.modeRow },
        h('button', {
          type: 'button',
          className: local ? css.seg : css.segOn,
          onClick: () => setLocal(false),
        }, t('sourceModeGit')),
        h('button', {
          type: 'button',
          className: local ? css.segOn : css.seg,
          onClick: () => setLocal(true),
        }, t('sourceModeLocal')),
      ),
      editor.mode === 'edit'
        ? h('div', { className: css.fieldGroup },
            h('label', { className: css.fieldLabel }, t('sourceIdPh')),
            h('div', { className: css.staticId },
              h('span', { className: css.staticIdValue }, id),
              h('span', { className: css.fieldHint }, t('idFixed')),
            ),
          )
        : null,
      h('div', { className: css.fieldGroup },
        h('label', { className: css.fieldLabel }, local ? t('sourceUrlLocalPh') : t('sourceUrlPh')),
        h(Input, { placeholder: local ? t('sourceUrlLocalPh') : t('sourceUrlPh'), value: url, onChange: event => setUrl((event.target as HTMLInputElement).value) }),
        h('span', { className: css.fieldHint }, local ? t('urlLocalHint') : t('urlGitHint')),
      ),
      local ? null : h('div', { className: css.fieldGroup },
        h('label', { className: css.fieldLabel }, t('branchPh')),
        h(Input, { placeholder: t('branchPh'), value: branch, onChange: event => setBranch((event.target as HTMLInputElement).value) }),
        h('span', { className: css.fieldHint }, t('branchHint')),
      ),
      props.progress.error === undefined && props.progress.step === undefined ? null : h('div', {
        className: props.progress.error === undefined ? css.progress : css.progressError,
      },
        props.progress.error === undefined
          ? h('span', { className: css.progressSpin })
          : h('span', { className: css.progressFail }, '✕'),
        h('span', { className: css.progressText },
          props.progress.error === undefined
            ? props.progress.step
            : `${t('actionFail')}: ${props.progress.error}`),
      ),
    ),
  })
}

/** A green/gray switch control for suite enable state. */
function ToggleSwitch(props: {
  on: boolean
  disabled?: boolean
  title?: string
  onChange: () => void
}): ReactNode {
  return h('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': props.on,
    title: props.title,
    disabled: props.disabled,
    className: props.on ? css.switchOn : css.switchOff,
    onClick: (event: { stopPropagation(): void }) => { event.stopPropagation(); props.onChange() },
  }, h('span', { className: css.switchThumb }))
}

function SuiteCard(props: {
  t: Translate
  suite: SuiteCardData
  busy: boolean
  onOpen: () => void
  onInstall: () => void
  onAddSource: () => void
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
  const layoutLabel = suite.layout === 'agent-plugin-v1' ? t('layoutV1') : suite.layout === 'claude-code' ? t('layoutCC') : suite.layout === 'codex' ? t('layoutCodex') : suite.layout === 'universal' ? t('layoutUniversal') : suite.layout === 'cursor' ? t('layoutCursor') : suite.layout === 'kimi' ? t('layoutKimi') : suite.layout === 'remote' ? t('layoutRemote') : t('layoutSkills')
  const isRemote = suite.remoteUrl !== undefined
  const stop = (callback: () => void) => (event: { stopPropagation(): void }) => { event.stopPropagation(); callback() }
  return h('article', { className: css.card, onClick: props.onOpen },
    h('div', { className: css.cardTop },
      h('div', { className: css.cardTitle },
        h('span', { className: css.cardName }, suite.name),
        suite.version === undefined ? null : h('span', { className: css.version }, `v${suite.version}`),
      ),
      h('div', { className: css.cardActions },
        suite.installed
          ? h(ToggleSwitch, {
            on: suite.enabled,
            disabled: busy,
            title: suite.enabled ? t('disable') : t('enable'),
            onChange: props.onToggle,
          })
          : isRemote
            ? h(Button, {
              variant: 'primary', size: 'sm', disabled: busy,
              title: suite.remoteUrl,
              onClick: stop(props.onAddSource),
            }, t('addSource'))
            : h(Button, {
              variant: 'primary', size: 'sm', disabled: busy,
              onClick: stop(props.onInstall),
            }, t('install')),
        suite.installed ? h(Button, { variant: 'ghost', size: 'sm', title: t('refresh'), disabled: busy, onClick: stop(props.onRefresh) }, '↻') : null,
        suite.installed ? h(Button, { variant: 'ghost', size: 'sm', title: t('uninstall'), disabled: busy, onClick: stop(props.onUninstall) }, '🗑') : null,
      ),
    ),
    h('p', { className: css.desc }, suite.description ?? ''),
    h('div', { className: css.meta },
      h('span', { className: css.src }, `${suite.sourceId} · ${isRemote ? t('remoteRef') : (suite.dimension === 'user' ? t('dimensionUser') : t('dimensionProject'))}`),
      h('span', { className: css.tag }, layoutLabel),
      suite.installed ? h('span', { className: suite.enabled ? css.okState : css.tag }, suite.enabled ? `✓ ${t('installedBadge')}` : t('installedBadge')) : null,
      ...tags.map(([label, count]) => h('span', { key: label, className: css.tag }, `${label} ${count}`)),
      suite.errors.length === 0 ? null : h(Tooltip, {
        label: suite.errors.slice(0, 8).join(t('sourceErrorSeparator')),
        children: h('span', { className: css.warnLine }, `⚠ ${t('errors')} ${suite.errors.length}`) as unknown as ReactElement,
      }),
      (suite.mcpErrors?.length ?? 0) === 0 ? null : h(Tooltip, {
        label: suite.mcpErrors!.slice(0, 8).join(t('sourceErrorSeparator')),
        children: h('span', { className: css.warnLine }, `⚠ ${t('mcpSection')} ${suite.mcpErrors!.length}`) as unknown as ReactElement,
      }),
    ),
  )
}
