/**
 * dsh-agent-plugins-market client: registers the Agent Plugins Market section inside the Web
 * GUI's settings dialog (the same settings.section seat dshmarket uses).
 * Mirrors the market's integration contract: the bundle's only externals are
 * react and the injected `dsh.client.inject` module table, so it cannot reach
 * packages the host does not serve.
 */
import { createElement as h } from 'react'
import * as primitives from '@deepseek-ai/dsh-client-ui-primitives'
import { en, zh } from './locales.js'
import { MarketSection } from './MarketSection.js'

const NS = 'dsh-agent-plugins-market'

export type Translate = (key: string) => string

/** The subset of the locale service this plugin touches. */
interface LocaleService {
  register(namespace: string, dicts: { zh: Record<string, string>; en: Record<string, string> }): unknown
  bind(namespace: string): Translate
}

/** The subset of the slots service this plugin touches. */
interface SlotsService {
  inject(slot: string, register: () => unknown): void
  register(meta: Record<string, unknown>, component: () => unknown): unknown
}

/** The client cordis context this plugin relies on (structural subset). */
interface SuiteClientContext {
  effect(callback: () => unknown, label?: string): void
  locale: LocaleService
  slots: SlotsService
}

export const name = 'dsh-agent-plugins-market'
export const inject = ['slots', 'locale']

/** Primitives this section renders with; absent exports degrade the whole section. */
export const REQUIRED_PRIMITIVES = ['Button', 'Input', 'Modal', 'Toast', 'Tooltip'] as const

/** Detect host primitives that predate the exports this UI relies on. */
export function missingPrimitives(module: Record<string, unknown>, required: readonly string[] = REQUIRED_PRIMITIVES): string[] {
  return required.filter(name => module[name] === undefined)
}

export function apply(ctx: SuiteClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-agent-plugins: dictionaries')
  const t = ctx.locale.bind(NS)

  const gaps = missingPrimitives(primitives as unknown as Record<string, unknown>)
  if (gaps.length > 0) {
    console.warn(`[dsh-agent-plugins-market] host ui-primitives missing ${gaps.join(', ')} — Agent Plugins Market section disabled (dsh web >= 0.1.0-rc.6 required)`)
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
