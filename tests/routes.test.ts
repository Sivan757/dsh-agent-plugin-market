import { describe, expect, it } from 'vitest'
import { MARKET_ROUTES } from '../src/contracts/market.js'
import { mountSuiteRoutes, type WebServerService } from '../src/routes.js'
import type { MarketService } from '../src/application/queries.js'

function service(): MarketService {
  return {
    sources: [],
    overview: async () => ({ sources: [], suites: [], totals: { all: 0, installed: 0, enabled: 0 }, roots: { user: '/user', data: '/data' } }),
    mcpStatus: async () => ({ entries: [], observedAt: '', totals: { all: 0, connected: 0, degraded: 0, failed: 0, disabled: 0 }, directObservationOnly: true }),
    sourceProgress: () => ({ active: false, sourceId: '', step: '' }),
    suiteDetail: async () => {
      throw new Error('not found')
    },
    skillContent: async () => {
      throw new Error('not found')
    },
    addSource: async input => ({ id: 'source', ...input }),
    updateSource: async () => {},
    removeSource: async () => {},
    refreshSource: async () => {},
    install: async () => {},
    uninstall: async () => {},
    setEnabled: async () => {}
  }
}

function response(): { value: () => unknown; writeHead: (status: number, headers: Record<string, string>) => void; end: (body: string) => void } {
  let body = ''
  return {
    value: () => JSON.parse(body),
    writeHead: () => {},
    end: value => {
      body = value
    }
  }
}

describe('market HTTP routes', () => {
  it('registers the shared route constants and disposes them together', async () => {
    const routes = new Map<string, (request: unknown, response: unknown) => void | Promise<void>>()
    const webServer: WebServerService = {
      register: route => {
        routes.set(route.path, route.handler as (request: unknown, response: unknown) => void | Promise<void>)
        return () => routes.delete(route.path)
      }
    }
    const dispose = mountSuiteRoutes({ webServer }, service())

    expect([...routes.keys()]).toEqual(Object.values(MARKET_ROUTES))
    const overviewResponse = response()
    await routes.get(MARKET_ROUTES.overview)?.({ url: '/api/agent-plugins/overview', headers: {} }, overviewResponse)
    expect(overviewResponse.value()).toMatchObject({ totals: { all: 0 } })

    dispose()
    expect(routes.size).toBe(0)
  })
})
