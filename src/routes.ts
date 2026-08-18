/**
 * HTTP routes bridging the market page to the SuiteManager.
 *
 * This layer only parses requests, delegates to the manager, and serializes
 * responses. Mutating routes accept same-origin POSTs exclusively: a
 * cross-site form or fetch cannot trigger a clone, an uninstall, or an
 * enable/disable against a local profile.
 */
import { isAbsolute } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { expandHome } from './paths.js'
import type { SuiteManager } from './manager.js'
import type { SourceRef } from './types.js'

const API_PREFIX = '/api/agent-plugin/'
const MAX_BODY_BYTES = 64 * 1024

export interface WebServerService {
  register(route: {
    kind: 'exact' | 'prefix'
    path: string
    handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>
  }): () => void
}

interface RouteHost {
  webServer: WebServerService
}

/** Mount every route; returns the disposer releasing them all. */
export function mountSuiteRoutes(hostCtx: unknown, manager: SuiteManager): () => void {
  const host = hostCtx as RouteHost
  const disposers: Array<() => void> = []
  const get = (path: string, handler: RouteHandler) => {
    disposers.push(host.webServer.register({ kind: 'exact', path, handler }))
  }
  const post = (path: string, handler: JsonAction) => {
    disposers.push(host.webServer.register({
      kind: 'exact',
      path,
      handler: (request, response) => {
        if (!sameOrigin(request)) {
          sendJson(response, 403, { ok: false, error: 'cross-origin request rejected' })
          return
        }
        void (async () => {
          const body = await readJsonBody(request)
          if (body === undefined) {
            sendJson(response, 400, { ok: false, error: 'invalid JSON body' })
            return
          }
          try {
            const value = await handler(body as Record<string, unknown>)
            sendJson(response, 200, { ok: true, ...value })
          } catch (error) {
            sendJson(response, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
        })()
      },
    }))
  }

  get(`${API_PREFIX}overview`, async (_request, response) => {
    sendJson(response, 200, await manager.overview())
  })

  get(`${API_PREFIX}config`, async (_request, response) => {
    sendJson(response, 200, { sources: manager.sources })
  })

  post(`${API_PREFIX}sources/add`, async (body) => {
    const source = parseSource(body)
    await manager.addSource(source)
    return { source }
  })

  post(`${API_PREFIX}sources/remove`, async (body) => {
    const id = body['id']
    if (typeof id !== 'string' || id === '') throw new Error('missing source id')
    await manager.removeSource(id)
    return {}
  })

  post(`${API_PREFIX}sources/refresh`, async (body) => {
    const id = body['id']
    await manager.refreshSource(typeof id === 'string' && id !== '' ? id : undefined)
    return {}
  })

  post(`${API_PREFIX}install`, async (body) => {
    const { sourceId, suiteId } = parseTarget(body)
    await manager.install(sourceId, suiteId)
    return {}
  })

  post(`${API_PREFIX}uninstall`, async (body) => {
    const { sourceId, suiteId } = parseTarget(body)
    await manager.uninstall(sourceId, suiteId)
    return {}
  })

  post(`${API_PREFIX}set-enabled`, async (body) => {
    const { sourceId, suiteId } = parseTarget(body)
    const enabled = body['enabled']
    if (typeof enabled !== 'boolean') throw new Error('missing boolean enabled')
    await manager.setEnabled(sourceId, suiteId, enabled)
    return {}
  })

  return () => {
    for (const dispose of disposers) dispose()
  }
}

type RouteHandler = (request: IncomingMessage, response: ServerResponse) => void | Promise<void>
type JsonAction = (body: Record<string, unknown>) => Promise<Record<string, unknown>>

function parseSource(body: Record<string, unknown>): SourceRef {
  const id = body['id']
  const url = body['url']
  if (typeof id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/.test(id)) throw new Error('source id must match [a-z0-9][a-z0-9-]*')
  if (typeof url !== 'string' || url.trim() === '') throw new Error('missing source url')
  const branch = body['branch']
  const local = body['local'] === true
  if (local) {
    const path = url.trim()
    const expanded = expandHome(path)
    if (!path.startsWith('~/') && path !== '~' && !isAbsolute(expanded)) throw new Error('local source url must be an absolute path or start with ~/')
    return { id, url: expanded, local: true }
  }
  return { id, url: url.trim(), ...typeof branch === 'string' && branch !== '' ? { branch } : {} }
}

function parseTarget(body: Record<string, unknown>): { sourceId: string; suiteId: string } {
  const sourceId = body['sourceId']
  const suiteId = body['suiteId']
  if (typeof sourceId !== 'string' || sourceId === '') throw new Error('missing sourceId')
  if (typeof suiteId !== 'string' || suiteId === '') throw new Error('missing suiteId')
  return { sourceId, suiteId }
}

function sameOrigin(request: IncomingMessage): boolean {
  const origin = request.headers['origin']
  if (origin === undefined) return true
  try {
    return new URL(origin).host === request.headers['host']
  } catch {
    return false
  }
}

function readJsonBody(request: IncomingMessage): Promise<unknown | undefined> {
  return new Promise((resolve) => {
    let size = 0
    const chunks: Buffer[] = []
    request.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        resolve(undefined)
        request.destroy()
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => {
      if (size > MAX_BODY_BYTES) return
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        resolve(undefined)
      }
    })
    request.on('error', () => resolve(undefined))
  })
}

function sendJson(response: ServerResponse, status: number, payload: unknown): void {
  const body = JSON.stringify(payload)
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) })
  response.end(body)
}
