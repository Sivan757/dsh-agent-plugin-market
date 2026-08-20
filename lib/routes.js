/**
 * HTTP routes bridging the market page to the SuiteManager.
 *
 * This layer only parses requests, delegates to the manager, and serializes
 * responses. Mutating routes accept same-origin POSTs exclusively: a
 * cross-site form or fetch cannot trigger a clone, an uninstall, or an
 * enable/disable against a local profile.
 */
import { isAbsolute } from 'node:path';
import { expandHome } from './paths.js';
const API_PREFIX = '/api/agent-plugins/';
const MAX_BODY_BYTES = 64 * 1024;
/** Mount every route; returns the disposer releasing them all. */
export function mountSuiteRoutes(hostCtx, manager) {
    const host = hostCtx;
    const disposers = [];
    const get = (path, handler) => {
        disposers.push(host.webServer.register({ kind: 'exact', path, handler }));
    };
    const post = (path, handler) => {
        disposers.push(host.webServer.register({
            kind: 'exact',
            path,
            handler: (request, response) => {
                if (!sameOrigin(request)) {
                    sendJson(response, 403, { ok: false, error: 'cross-origin request rejected' });
                    return;
                }
                void (async () => {
                    const body = await readJsonBody(request);
                    if (body === undefined) {
                        sendJson(response, 400, { ok: false, error: 'invalid JSON body' });
                        return;
                    }
                    try {
                        const value = await handler(body);
                        sendJson(response, 200, { ok: true, ...value });
                    }
                    catch (error) {
                        sendJson(response, 400, { ok: false, error: error instanceof Error ? error.message : String(error) });
                    }
                })();
            },
        }));
    };
    get(`${API_PREFIX}overview`, async (_request, response) => {
        sendJson(response, 200, await manager.overview());
    });
    get(`${API_PREFIX}progress`, async (_request, response) => {
        sendJson(response, 200, manager.sourceProgress());
    });
    get(`${API_PREFIX}config`, async (_request, response) => {
        sendJson(response, 200, { sources: manager.sources });
    });
    get(`${API_PREFIX}suite`, async (request, response) => {
        const query = queryOf(request);
        const sourceId = query.get('sourceId');
        const suiteId = query.get('suiteId');
        if (sourceId === null || suiteId === null) {
            sendJson(response, 400, { ok: false, error: 'missing sourceId or suiteId' });
            return;
        }
        try {
            sendJson(response, 200, await manager.suiteDetail(sourceId, suiteId));
        }
        catch (error) {
            sendJson(response, 404, { ok: false, error: error instanceof Error ? error.message : String(error) });
        }
    });
    get(`${API_PREFIX}skill`, async (request, response) => {
        const query = queryOf(request);
        const sourceId = query.get('sourceId');
        const suiteId = query.get('suiteId');
        const skill = query.get('skill');
        if (sourceId === null || suiteId === null || skill === null) {
            sendJson(response, 400, { ok: false, error: 'missing sourceId, suiteId, or skill' });
            return;
        }
        try {
            sendJson(response, 200, await manager.skillContent(sourceId, suiteId, skill));
        }
        catch (error) {
            sendJson(response, 404, { ok: false, error: error instanceof Error ? error.message : String(error) });
        }
    });
    post(`${API_PREFIX}sources/add`, async (body) => {
        const url = String(body['url'] ?? '').trim();
        if (url === '')
            throw new Error('missing source url');
        const local = body['local'] === true;
        if (local) {
            const expanded = expandHome(url);
            if (!url.startsWith('~/') && url !== '~' && !isAbsolute(expanded))
                throw new Error('local source url must be an absolute path or start with ~/');
        }
        const branch = body['branch'];
        const source = await manager.addSource({
            url: local ? expandHome(url) : url,
            ...typeof branch === 'string' && branch.trim() !== '' ? { branch: branch.trim() } : {},
            ...local ? { local: true } : {},
        });
        return { source };
    });
    post(`${API_PREFIX}sources/update`, async (body) => {
        const id = body['id'];
        if (typeof id !== 'string' || id === '')
            throw new Error('missing source id');
        const patch = {};
        if (body['url'] !== undefined) {
            const url = String(body['url']).trim();
            if (url === '')
                throw new Error('missing source url');
            patch.url = url;
        }
        if (body['branch'] !== undefined)
            patch.branch = String(body['branch']).trim();
        if (body['local'] !== undefined)
            patch.local = body['local'] === true;
        await manager.updateSource(id, patch);
        return {};
    });
    post(`${API_PREFIX}sources/remove`, async (body) => {
        const id = body['id'];
        if (typeof id !== 'string' || id === '')
            throw new Error('missing source id');
        await manager.removeSource(id);
        return {};
    });
    post(`${API_PREFIX}sources/refresh`, async (body) => {
        const id = body['id'];
        await manager.refreshSource(typeof id === 'string' && id !== '' ? id : undefined);
        return {};
    });
    post(`${API_PREFIX}install`, async (body) => {
        const { sourceId, suiteId } = parseTarget(body);
        await manager.install(sourceId, suiteId);
        return {};
    });
    post(`${API_PREFIX}uninstall`, async (body) => {
        const { sourceId, suiteId } = parseTarget(body);
        await manager.uninstall(sourceId, suiteId);
        return {};
    });
    post(`${API_PREFIX}set-enabled`, async (body) => {
        const { sourceId, suiteId } = parseTarget(body);
        const enabled = body['enabled'];
        if (typeof enabled !== 'boolean')
            throw new Error('missing boolean enabled');
        await manager.setEnabled(sourceId, suiteId, enabled);
        return {};
    });
    return () => {
        for (const dispose of disposers)
            dispose();
    };
}
function parseTarget(body) {
    const sourceId = body['sourceId'];
    const suiteId = body['suiteId'];
    if (typeof sourceId !== 'string' || sourceId === '')
        throw new Error('missing sourceId');
    if (typeof suiteId !== 'string' || suiteId === '')
        throw new Error('missing suiteId');
    return { sourceId, suiteId };
}
function sameOrigin(request) {
    const origin = request.headers['origin'];
    if (origin === undefined)
        return true;
    try {
        return new URL(origin).host === request.headers['host'];
    }
    catch {
        return false;
    }
}
function readJsonBody(request) {
    return new Promise((resolve) => {
        let size = 0;
        const chunks = [];
        request.on('data', (chunk) => {
            size += chunk.length;
            if (size > MAX_BODY_BYTES) {
                resolve(undefined);
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on('end', () => {
            if (size > MAX_BODY_BYTES)
                return;
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
            }
            catch {
                resolve(undefined);
            }
        });
        request.on('error', () => resolve(undefined));
    });
}
/** Parse the query string of one request into a URLSearchParams. */
function queryOf(request) {
    return new URL(request.url ?? '/', 'http://dsh.local').searchParams;
}
function sendJson(response, status, payload) {
    const body = JSON.stringify(payload);
    response.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': Buffer.byteLength(body) });
    response.end(body);
}
