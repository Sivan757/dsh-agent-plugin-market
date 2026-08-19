import type { IncomingMessage, ServerResponse } from 'node:http';
import type { SuiteManager } from './manager.js';
export interface WebServerService {
    register(route: {
        kind: 'exact' | 'prefix';
        path: string;
        handler: (request: IncomingMessage, response: ServerResponse) => void | Promise<void>;
    }): () => void;
}
/** Mount every route; returns the disposer releasing them all. */
export declare function mountSuiteRoutes(hostCtx: unknown, manager: SuiteManager): () => void;
