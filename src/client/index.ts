/**
 * dsh-agent-plugin client: mounts the 套件市场 as a top-level entry.
 *
 * The web shell exposes no third-party navigation slot, so the entry follows
 * the dsh-ssh / task-board precedent: a plain-DOM sidebar row toggles a
 * center-column React panel (data-attribute visibility, cross-plugin panel
 * eviction). The market no longer lives inside the settings dialog.
 */
import { en, zh } from './locales.js'
import { mountPanel } from './mount.js'
import { PanelController } from './panel-controller.js'
import { mountSidebarEntry } from './sidebar-entry.js'

const NS = 'dsh-agent-plugin'

export type Translate = (key: string) => string

/** The subset of the locale service this plugin touches. */
interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): Translate
}

/** The client cordis context this plugin relies on (structural subset). */
interface SuiteClientContext {
  effect(callback: () => unknown, label?: string): void
  locale: LocaleService
}

export const name = 'dsh-agent-plugin'
export const inject = ['locale']

export function apply(ctx: SuiteClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-agent-plugin: dictionaries')
  const t = ctx.locale.bind(NS)

  const controller = new PanelController()
  ctx.effect(() => mountPanel(controller, t), 'dsh-agent-plugin: market panel')
  ctx.effect(() => mountSidebarEntry(controller, t), 'dsh-agent-plugin: sidebar entry')
}
