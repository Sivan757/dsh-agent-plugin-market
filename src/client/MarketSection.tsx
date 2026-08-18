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
import { fetchOverview, postAction, type OverviewData, type SourceOverview, type SuiteCardData } from './api.js'
import type { Translate } from './index.js'
import { ErrorBoundary } from './ErrorBoundary.js'
import { SuiteDetailModal } from './SuiteDetail.js'
import css from './market.module.css'

export interface MarketSectionProps {
  t: Translate
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

const EMPTY_OVERVIEW: OverviewData = { sources: [], suites: [], totals: { all: 0, installed: 0, enabled: 0 }, roots: { user: '', data: '' } }

export function MarketSection({ t }: MarketSectionProps): ReactNode {
  const [overview, setOverview] = useState<OverviewData>(EMPTY_OVERVIEW)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<Tab>('all')
  const [category, setCategory] = useState<Category>('all')
  const [view, setView] = useState<ViewMode>('grid')
  const [busy, setBusy] = useState<string | undefined>(undefined)
  const [toast, setToast] = useState<ToastState | undefined>(undefined)
  const [confirm, setConfirm] = useState<ConfirmState | undefined>(undefined)
  const [editor, setEditor] = useState<EditorState>(undefined)
  const [detail, setDetail] = useState<{ sourceId: string; suiteId: string } | undefined>(undefined)

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
    children: h('div', { className: css.market },
    h('header', { className: css.header },
      h('div', { className: css.titleRow },
        h('h2', { className: css.title }, t('nav')),
        h('p', { className: css.sub }, t('subtitle')),
        h('div', { className: css.spacer }),
        h('div', { className: css.searchGroup },
          h(Button, { variant: 'ghost', size: 'sm', title: t('addSource'), onClick: () => setEditor({ mode: 'add' }) }, '＋'),
          h(Button, { variant: 'ghost', size: 'sm', title: t('refreshAll'), onClick: () => { void action('s:refresh:all', 'sources/refresh', {}) } }, '↻'),
          h('div', { className: css.searchWrap },
            h(Input, { className: css.searchInput, placeholder: t('searchPh'), value: search, onChange: event => setSearch((event.target as HTMLInputElement).value) })),
        ),
      ),
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
      h('div', { className: css.tabRow },
        h(TabButton, { t, active: tab === 'all', label: `${t('tabAll')} ${overview.totals.all}`, onClick: () => setTab('all') }),
        h(TabButton, { t, active: tab === 'installed', label: `${t('tabInstalled')} ${overview.totals.installed}`, onClick: () => setTab('installed') }),
        h(TabButton, { t, active: tab === 'uninstalled', label: `${t('tabUninstalled')} ${overview.totals.all - overview.totals.installed}`, onClick: () => setTab('uninstalled') }),
        h('div', { className: css.tabGap }),
        h('button', {
          type: 'button',
          className: css.viewSwitch,
          onClick: () => setView(view === 'grid' ? 'list' : 'grid'),
        }, view === 'grid' ? t('list') : t('grid')),
      ),
    ),
    h('main', { className: view === 'grid' ? css.grid : css.list },
      loading
        ? h('div', { className: css.empty }, '…')
        : filtered.length === 0
          ? h('div', { className: css.empty }, tab === 'installed' ? t('installedEmpty') : t('empty'))
          : filtered.map(suite => h(SuiteCard, {
            key: `${suite.sourceId}/${suite.suiteId}`,
            t, suite,
            busy: busy !== undefined,
            onOpen: () => setDetail({ sourceId: suite.sourceId, suiteId: suite.suiteId }),
            onInstall: () => { void action(`i:${suite.suiteId}`, 'install', { sourceId: suite.sourceId, suiteId: suite.suiteId }) },
            onToggle: () => { void action(`e:${suite.suiteId}`, 'set-enabled', { sourceId: suite.sourceId, suiteId: suite.suiteId, enabled: !suite.enabled }) },
            onRefresh: () => { void action(`r:${suite.suiteId}`, 'sources/refresh', { id: suite.sourceId }) },
            onUninstall: () => openUninstall(suite),
          })),
    ),
    toast === undefined ? null : h(Toast, { key: toast.key, text: toast.message, onDone: () => setToast(undefined) }),
    confirm === undefined ? null : h(Modal, {
      open: true,
      onClose: () => setConfirm(undefined),
      title: confirm.kind === 'uninstall' ? t('uninstallConfirmTitle') : `${t('removeSourceConfirmTitle')}「${confirm.sourceId}」`,
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
      onClose: () => setEditor(undefined),
      onSave: async (url, branch, local) => {
        const key = editor.mode === 'edit' ? `s:edit:${editor.source.id}` : `s:add:${url}`
        const body = { url, ...branch === '' ? {} : { branch }, local }
        if (editor.mode === 'add') {
          setBusy(key)
          try {
            const payload = await postAction('sources/add', body)
            const derived = (payload['source'] as { id?: string } | undefined)?.id
            await refresh()
            setEditor(undefined)
            if (derived !== undefined) setCategory(derived)
            return true
          } catch (error) {
            setToast({ key: Date.now(), message: `${t('actionFail')}: ${error instanceof Error ? error.message : String(error)}` })
            return false
          } finally {
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

function TabButton({ t: _t, active, label, onClick }: { t: Translate; active: boolean; label: string; onClick: () => void }): ReactNode {
  return h('button', { type: 'button', className: active ? css.tabOn : css.tab, onClick }, label)
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
  const layoutLabel = suite.layout === 'agent-plugin-v1' ? t('layoutV1') : suite.layout === 'claude-code' ? t('layoutCC') : suite.layout === 'codex' ? t('layoutCodex') : suite.layout === 'universal' ? t('layoutUniversal') : suite.layout === 'cursor' ? t('layoutCursor') : suite.layout === 'kimi' ? t('layoutKimi') : t('layoutSkills')
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
      h('span', { className: css.src }, `${suite.sourceId} · ${suite.dimension === 'user' ? t('dimensionUser') : t('dimensionProject')}`),
      h('span', { className: css.tag }, layoutLabel),
      suite.installed ? h('span', { className: suite.enabled ? css.okState : css.tag }, suite.enabled ? `✓ ${t('installedBadge')}` : t('installedBadge')) : null,
      ...tags.map(([label, count]) => h('span', { key: label, className: css.tag }, `${label} ${count}`)),
      suite.errors.length === 0 ? null : h(Tooltip, {
        label: suite.errors.slice(0, 8).join('；'),
        children: h('span', { className: css.warnLine }, `⚠ ${t('errors')} ${suite.errors.length}`) as unknown as ReactElement,
      }),
    ),
  )
}
