/**
 * dsh-agent-plugin client: registers the 套件市场 section inside the Web
 * GUI's settings dialog. Mirrors the market's integration contract: the
 * bundle's only externals are react and the injected `dsh.client.inject`
 * module table, so it cannot reach packages the host does not serve.
 */
import { createElement as h } from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { en, zh } from './locales.js'
import { MarketSection } from './MarketSection.js'

const NS = 'dsh-agent-plugin'

export type Translate = (key: string) => string

/** The subset of the locale service this plugin touches. */
interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): Translate
  subscribe(callback: () => void): () => void
  getSnapshot(): { active: string }
}

/** The subset of the theme service this plugin touches. */
interface ThemeService {
  getTheme(): { id: string } | null
}

/** The subset of the slots service this plugin touches. */
interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** The client cordis context this plugin relies on (structural subset). */
interface SuiteClientContext {
  effect(callback: () => unknown, label?: string): void
  on(event: string, callback: () => void): () => void
  locale: LocaleService
  slots: SlotsService
  theme: ThemeService
}

export const name = 'dsh-agent-plugin'
export const inject = ['slots', 'locale', 'theme']

/** Primitives this section renders with; absent exports degrade to text controls. */
export const REQUIRED_PRIMITIVES = ['Button', 'Input', 'Modal', 'Pill', 'Toast', 'Tooltip'] as const

/** Detect host primitives that predate the exports this UI relies on. */
export function missingPrimitives(module: Record<string, unknown>, required: readonly string[] = REQUIRED_PRIMITIVES): string[] {
  return required.filter(name => module[name] === undefined)
}

export function apply(ctx: SuiteClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-agent-plugin: dictionaries')
  const t = ctx.locale.bind(NS)

  const gaps = missingPrimitives(primitives as unknown as Record<string, unknown>)
  if (gaps.length > 0) {
    console.warn(`[dsh-agent-plugin] host ui-primitives missing ${gaps.join(', ')} — 套件市场 section disabled (dsh web >= 0.1.0-rc.6 required)`)
    return
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'agent-plugin',
    order: 45,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t }),
  }, () => h(MarketSection, {
    t,
  })))
}
