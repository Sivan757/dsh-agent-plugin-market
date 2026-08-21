// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/client/MarketSection.js', () => ({
  MarketSection: () => null
}))

import { LEGACY_PAGE_MODE_SURFACE_EVENT, mountLegacyPageMode } from '../src/client/page-mode.js'

describe('legacy market page mode', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('data-dsh-agent-plugins-market-page')
  })

  it('mounts a localized page entry when the settings surface is absent', async () => {
    document.body.innerHTML = [
      '<div data-pane="sidebar"><div><button class="newSession">New session</button></div></div>',
      '<div data-pane="conversation"><div data-conversation-body="true">Conversation</div></div>'
    ].join('')
    let settingsAvailable = false
    let nav = 'Agent Plugins 市场'
    let onLocale: (() => void) | undefined
    const dispose = mountLegacyPageMode({
      t: () => nav,
      isSettingsSurfaceAvailable: () => settingsAvailable,
      subscribeLocale: listener => {
        onLocale = listener
        return () => {
          onLocale = undefined
        }
      }
    })
    await new Promise(resolve => setTimeout(resolve, 0))

    const entry = document.querySelector<HTMLButtonElement>('[data-dsh-agent-plugins-market-entry]')
    expect(entry?.textContent).toBe('Agent Plugins 市场')
    expect(document.querySelector('[data-dsh-agent-plugins-market-page-view]')).not.toBeNull()

    nav = 'Agent Plugins Market'
    onLocale?.()
    expect(entry?.textContent).toBe('Agent Plugins Market')

    entry?.click()
    expect(document.documentElement.hasAttribute('data-dsh-agent-plugins-market-page')).toBe(true)

    settingsAvailable = true
    document.dispatchEvent(new Event(LEGACY_PAGE_MODE_SURFACE_EVENT))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(document.documentElement.hasAttribute('data-dsh-agent-plugins-market-page')).toBe(false)
    expect(document.querySelector('[data-dsh-agent-plugins-market-entry]')).toBeNull()

    dispose()
  })
})
