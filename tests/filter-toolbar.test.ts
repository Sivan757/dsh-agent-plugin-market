// @vitest-environment jsdom

import { act, createElement as h, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { SearchFilterToolbar, type SearchFilterToolbarView } from '../src/client/SearchFilterToolbar.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let root: Root | undefined
let host: HTMLDivElement | undefined

afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
  root = undefined
  host = undefined
})

describe('SearchFilterToolbar', () => {
  it('uses one accessible control row and switches presentation modes', () => {
    function Harness() {
      const [view, setView] = useState<SearchFilterToolbarView>('grid')
      return h('div', {},
        h(SearchFilterToolbar, {
          search: '',
          searchLabel: 'Search services',
          searchPlaceholder: 'Search services',
          onSearchChange: () => {},
          filters: [
            { id: 'all', label: 'All', count: 3, icon: h('svg'), active: true, onSelect: () => {} },
            { id: 'plugin', label: 'Plugin', count: 2, icon: h('svg'), active: false, onSelect: () => {} },
          ],
          view,
          gridLabel: 'Grid',
          listLabel: 'List',
          onViewChange: setView,
        }),
        h('output', { 'data-view': view }, view),
      )
    }

    host = document.createElement('div')
    document.body.append(host)
    root = createRoot(host)
    act(() => root!.render(h(Harness)))

    expect(host.querySelector('input')?.getAttribute('aria-label')).toBe('Search services')
    expect(host.querySelectorAll('button[aria-label]').length).toBe(3)
    expect(host.querySelector('button[aria-label="List"]')).not.toBeNull()

    act(() => host!.querySelector<HTMLButtonElement>('button[aria-label="List"]')!.click())

    expect(host.querySelector('output')?.getAttribute('data-view')).toBe('list')
    expect(host.querySelector('button[aria-label="Grid"]')).not.toBeNull()
  })
})
