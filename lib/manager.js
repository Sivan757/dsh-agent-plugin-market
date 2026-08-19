/**
 * SuiteManager: the host-authoritative orchestrator behind the market page.
 *
 * Owns the persisted state (sources + install entries), discovery over the
 * source checkouts, and every mutating action (source add/remove/refresh,
 * install/uninstall, enable/disable). Mutations serialize through a
 * single-flight queue so concurrent HTTP actions cannot interleave state
 * writes or git operations. After every mutation it calls `onChanged()`,
 * which is where the runtime consumers (skill registry invalidation, MCP
 * mount reconciliation) pick the new enabled set up.
 */
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { discoverLspEntries, discoverSourceList, discoverSuitesInSource, listMdFiles, repoName } from './discovery.js';
import { gitClone, gitHead, gitPull, gitRemove } from './git.js';
import { deriveSourceId, expandHome, isDirectory, resolveProjectRoot, sanitizeId, sourceCheckoutDir, sourcesDir, STATE_FILE_NAME } from './paths.js';
import { loadState, saveState, EMPTY_STATE } from './state.js';
export class SuiteManager {
    options;
    state = EMPTY_STATE;
    mutationQueue = Promise.resolve();
    statePath;
    /** Latest MCP mount diagnostics (suiteId -> reasons), fed by the host reconcile. */
    mcpDiagnostics = [];
    constructor(options) {
        this.options = options;
        this.statePath = join(options.userRoot, STATE_FILE_NAME);
    }
    /** Load persisted state once at plugin activation. */
    async load() {
        this.state = await loadState(this.statePath);
    }
    get sources() {
        return this.state.sources;
    }
    /** The user-dimension suite root this manager operates. */
    get userRoot() {
        return this.options.userRoot;
    }
    /**
     * One suite's full detail for the market detail modal: manifest fields,
     * skill metadata, validated mcp.json servers, and per-surface file lists.
     */
    async suiteDetail(sourceId, suiteId) {
        const suites = await this.discoverDimension('user', this.options.userRoot);
        const suite = suites.find(entry => entry.sourceId === sourceId && entry.id === suiteId);
        if (suite === undefined)
            throw new Error(`suite "${suiteId}" not found in source "${sourceId}"`);
        const installed = this.state.installed[installKey(sourceId, suiteId)];
        const remoteUrl = suite.remote?.url;
        return {
            sourceId,
            suiteId: suite.id,
            name: suite.manifest.name,
            version: suite.manifest.version ?? null,
            description: suite.manifest.description ?? null,
            author: suite.manifest.author ?? null,
            keywords: suite.manifest.keywords ?? [],
            layout: suite.manifest.layout,
            dimension: suite.dimension,
            root: remoteUrl ?? suite.root,
            remoteUrl: remoteUrl ?? null,
            installed: installed !== undefined,
            enabled: installed?.enabled === true,
            skills: suite.skills.map(skill => ({
                name: skill.name,
                description: skill.description,
                ...skill.whenToUse === undefined ? {} : { whenToUse: skill.whenToUse },
                path: skill.file,
            })),
            mcpServers: suite.mcp === undefined ? [] : Object.entries(suite.mcp.servers).map(([key, server]) => ({ key, ...server })),
            hooks: remoteUrl === undefined ? await this.hooksPreviews(suite.root) : { count: 0, entries: [] },
            commands: remoteUrl === undefined ? await this.commandPreviews(`${suite.root}/commands`) : [],
            agents: remoteUrl === undefined ? await this.agentPreviews(`${suite.root}/agents`) : [],
            lsp: remoteUrl === undefined ? await this.lspPreviews(suite.root) : [],
            errors: suite.errors,
            mcpErrors: this.mcpDiagnostics.filter(diagnostic => diagnostic.suiteId === suite.id).map(diagnostic => `${diagnostic.serverKey}: ${diagnostic.reason}`),
        };
    }
    async readPreview(path, capBytes = 64 * 1024) {
        const text = await readFile(path, 'utf8');
        return text.length > capBytes ? `${text.slice(0, capBytes)}\n… (truncated)` : text;
    }
    /** One skill's full SKILL.md text for the market detail modal. */
    async skillContent(sourceId, suiteId, skillName) {
        const suites = await this.discoverDimension('user', this.options.userRoot);
        const suite = suites.find(entry => entry.sourceId === sourceId && entry.id === suiteId);
        if (suite === undefined)
            throw new Error(`suite "${suiteId}" not found in source "${sourceId}"`);
        const skill = suite.skills.find(entry => entry.name === skillName);
        if (skill === undefined)
            throw new Error(`skill "${skillName}" not found in suite "${suiteId}"`);
        let content;
        try {
            content = await readFile(skill.file, 'utf8');
        }
        catch (error) {
            throw new Error(`skill file unreadable: ${error instanceof Error ? error.message : String(error)}`);
        }
        return { name: skill.name, description: skill.description, content, path: skill.file };
    }
    /** The full market overview: fresh discovery merged with install entries. */
    async overview() {
        const suites = await this.discoverDimension('user', this.options.userRoot);
        const sourceRows = [];
        for (const source of this.state.sources) {
            const checkout = this.sourceCheckoutPath(source);
            let cloned = false;
            let lockCommit;
            let error;
            if (source.local === true) {
                cloned = await isDirectory(checkout);
                if (!cloned)
                    error = `local source directory ${checkout} is missing`;
            }
            else {
                try {
                    lockCommit = await gitHead(checkout);
                    cloned = true;
                }
                catch {
                    // not cloned yet (or a broken checkout); the clone attempt records its own error on refresh
                }
            }
            const sourceSuites = suites.filter(suite => suite.sourceId === source.id);
            sourceRows.push({
                id: source.id,
                url: source.url,
                ...source.branch === undefined ? {} : { branch: source.branch },
                ...source.local === true ? { local: true } : {},
                cloned,
                ...lockCommit === undefined ? {} : { lockCommit },
                ...error === undefined ? {} : { error },
                suiteIds: sourceSuites.map(suite => suite.id),
            });
        }
        const installed = new Set(Object.keys(this.state.installed));
        const cards = suites.map(suite => ({
            sourceId: suite.sourceId,
            suiteId: suite.id,
            name: suite.manifest.name,
            version: suite.manifest.version,
            description: suite.manifest.description,
            keywords: suite.manifest.keywords ?? [],
            surfaces: suite.surfaces,
            enabled: suite.enabled,
            installed: installed.has(installKey(suite.sourceId, suite.id)),
            dimension: suite.dimension,
            layout: suite.manifest.layout,
            errors: suite.errors,
            mcpErrors: this.mcpDiagnostics.filter(diagnostic => diagnostic.suiteId === suite.id).map(diagnostic => `${diagnostic.serverKey}: ${diagnostic.reason}`),
        }));
        return {
            sources: sourceRows,
            suites: cards,
            totals: {
                all: cards.length,
                installed: cards.filter(card => card.installed).length,
                enabled: cards.filter(card => card.enabled).length,
            },
            roots: { user: this.options.userRoot, data: this.options.dataRoot },
        };
    }
    /** Enabled user-dimension suites (the MCP mount input). */
    async enabledUserSuites() {
        const suites = await this.discoverDimension('user', this.options.userRoot);
        return suites.filter(suite => suite.enabled);
    }
    /** Enabled user- and project-dimension suites for a workspace cwd. */
    async enabledSuitesForCwd(cwd) {
        const user = await this.enabledUserSuites();
        const project = (await this.discoverDimension('project', await resolveProjectRoot(cwd))).filter(suite => suite.enabled);
        return { user, project };
    }
    /** All suites (any enabled state) of one dimension. */
    async suitesForDimension(dimension, dimensionRoot) {
        return this.discoverDimension(dimension, dimensionRoot);
    }
    // ---- mutations ----
    /**
     * Add a source and clone it immediately. The id is derived from the suite
     * repository's own JSON (marketplace plugin entry name first, then the
     * root manifest name, then the repo basename), sanitized; collisions get a
     * numeric suffix.
     */
    async addSource(input) {
        return this.enqueue(async () => {
            const baseId = this.uniqueSourceId(deriveSourceId(input.url));
            const source = {
                id: baseId,
                url: input.url,
                ...input.branch === undefined ? {} : { branch: input.branch },
                ...input.local === true ? { local: true } : {},
            };
            const checkout = this.sourceCheckoutPath(source);
            if (input.local === true) {
                if (!await isDirectory(checkout))
                    throw new Error(`local source directory ${checkout} is missing`);
            }
            else {
                await this.ensureClone(source);
            }
            source.id = this.uniqueSourceId(sanitizeId(await repoName(checkout)));
            this.state = { ...this.state, sources: [...this.state.sources, source] };
            await saveState(this.statePath, this.state);
            this.options.onChanged();
            return source;
        });
    }
    uniqueSourceId(derived) {
        if (!this.state.sources.some(source => source.id === derived))
            return derived;
        for (let suffix = 2;; suffix++) {
            const candidate = `${derived}-${suffix}`;
            if (!this.state.sources.some(source => source.id === candidate))
                return candidate;
        }
    }
    /**
     * Update one source's url / branch / local flag. A git source whose URL
     * changes drops its stale checkout (the next refresh clones the new URL);
     * a local source's directory is never touched.
     */
    async updateSource(sourceId, patch) {
        return this.enqueue(async () => {
            const index = this.state.sources.findIndex(source => source.id === sourceId);
            if (index === -1)
                throw new Error(`unknown source "${sourceId}"`);
            const current = this.state.sources[index];
            const next = {
                id: sourceId,
                url: patch.url ?? current.url,
                ...(patch.branch !== undefined ? { branch: patch.branch } : current.branch === undefined ? {} : { branch: current.branch }),
                ...(patch.local !== undefined ? { local: patch.local } : current.local === undefined ? {} : { local: current.local }),
            };
            if (current.local !== true && patch.url !== undefined && patch.url !== current.url) {
                await gitRemove(sourceCheckoutDir(this.options.userRoot, sourceId));
            }
            this.state = { ...this.state, sources: this.state.sources.map((source, i) => i === index ? next : source) };
            await saveState(this.statePath, this.state);
            this.options.onChanged();
        });
    }
    /** Remove a source: delete its checkout, forget its suites and install entries. */
    async removeSource(sourceId) {
        return this.enqueue(async () => {
            this.state = {
                ...this.state,
                sources: this.state.sources.filter(source => source.id !== sourceId),
                installed: Object.fromEntries(Object.entries(this.state.installed).filter(([key]) => !key.startsWith(`${sourceId}/`))),
            };
            await saveState(this.statePath, this.state);
            const source = this.state.sources.find(entry => entry.id === sourceId);
            if (source === undefined || source.local !== true) {
                await gitRemove(sourceCheckoutDir(this.options.userRoot, sourceId));
            }
            this.options.onChanged();
        });
    }
    /** Refresh one source checkout (pull), or every source when `sourceId` is omitted. */
    async refreshSource(sourceId) {
        return this.enqueue(async () => {
            const targets = sourceId === undefined ? this.state.sources : this.state.sources.filter(source => source.id === sourceId);
            for (const source of targets) {
                if (source.local === true) {
                    if (!await isDirectory(expandHome(source.url))) {
                        throw new Error(`local source directory ${expandHome(source.url)} is missing`);
                    }
                    continue;
                }
                const checkout = sourceCheckoutDir(this.options.userRoot, source.id);
                try {
                    await gitHead(checkout);
                }
                catch {
                    await this.ensureClone(source);
                    continue;
                }
                await gitPull(checkout);
            }
            this.options.onChanged();
        });
    }
    /** Install a suite: the source must be cloned; the suite dir becomes an enabled install entry. */
    async install(sourceId, suiteId) {
        return this.enqueue(async () => {
            const source = this.state.sources.find(entry => entry.id === sourceId);
            if (source === undefined)
                throw new Error(`unknown source "${sourceId}"`);
            const checkout = this.sourceCheckoutPath(source);
            if (!await isDirectory(checkout))
                await this.ensureClone(source);
            const suites = await discoverSuitesInSource(checkout, sourceId, 'user');
            const suite = suites.find(entry => entry.id === suiteId);
            if (suite === undefined)
                throw new Error(`suite "${suiteId}" not found in source "${sourceId}"`);
            if (suite.remote !== undefined)
                throw new Error(`suite "${suiteId}" is a remote reference (${suite.remote.url}); add its repository as a source before installing`);
            await this.setInstalled(sourceId, suiteId, { enabled: true, installedAt: new Date().toISOString(), lockCommit: await tryHead(checkout) });
            this.options.onChanged();
        });
    }
    /** Uninstall a suite: drop the install entry (the source clone stays for browsing). */
    async uninstall(sourceId, suiteId) {
        return this.enqueue(async () => {
            const key = installKey(sourceId, suiteId);
            if (this.state.installed[key] === undefined)
                throw new Error(`suite "${suiteId}" is not installed`);
            const { [key]: _removed, ...rest } = this.state.installed;
            this.state = { ...this.state, installed: rest };
            await saveState(this.statePath, this.state);
            this.options.onChanged();
        });
    }
    /** Enable or disable an installed suite. */
    async setEnabled(sourceId, suiteId, enabled) {
        return this.enqueue(async () => {
            const key = installKey(sourceId, suiteId);
            const entry = this.state.installed[key];
            if (entry === undefined)
                throw new Error(`suite "${suiteId}" is not installed`);
            await this.setInstalled(sourceId, suiteId, { ...entry, enabled });
            this.options.onChanged();
        });
    }
    /** Append config-seeded sources missing from state and persist; clones lazily on first refresh/install. */
    async mergeSources(sources) {
        const existing = new Set(this.state.sources.map(source => source.id));
        const additions = sources.filter(source => !existing.has(source.id));
        if (additions.length === 0)
            return;
        this.state = { ...this.state, sources: [...this.state.sources, ...additions] };
        await saveState(this.statePath, this.state);
    }
    async setInstalled(sourceId, suiteId, entry) {
        this.state = { ...this.state, installed: { ...this.state.installed, [installKey(sourceId, suiteId)]: entry } };
        await saveState(this.statePath, this.state);
    }
    async ensureClone(source) {
        if (source.local === true) {
            if (!await isDirectory(expandHome(source.url))) {
                throw new Error(`local source directory ${expandHome(source.url)} is missing`);
            }
            return;
        }
        const checkout = sourceCheckoutDir(this.options.userRoot, source.id);
        await mkdir(sourcesDir(this.options.userRoot), { recursive: true });
        await gitClone(source.url, source.branch, checkout);
    }
    /** The filesystem location one source is read from. */
    sourceCheckoutPath(source) {
        return source.local === true ? expandHome(source.url) : sourceCheckoutDir(this.options.userRoot, source.id);
    }
    async discoverDimension(dimension, dimensionRoot) {
        const discovered = await discoverSourceList(this.state.sources, dimension, dimensionRoot);
        const suites = [];
        for (const suite of discovered) {
            const installed = this.state.installed[installKey(suite.sourceId, suite.id)];
            suites.push({
                ...suite,
                enabled: dimension === 'user' && installed?.enabled === true,
                ...installed?.lockCommit === undefined ? {} : { lockCommit: installed.lockCommit },
                ...installed?.installedAt === undefined ? {} : { installedAt: installed.installedAt },
            });
        }
        return suites;
    }
    async commandPreviews(dir) {
        const names = await listMdFiles(dir);
        const previews = [];
        for (const name of names) {
            const file = `${dir}/${name}`;
            try {
                const content = await this.readPreview(file);
                const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
                let description;
                if (match !== null) {
                    const yaml = (await import('yaml')).parse(match[1]);
                    if (typeof yaml === 'object' && yaml !== null) {
                        const desc = yaml['description'];
                        if (typeof desc === 'string')
                            description = desc;
                    }
                }
                previews.push({ name: name.slice(0, -3), ...description === undefined ? {} : { description }, content });
            }
            catch {
                // unreadable command files are skipped in previews
            }
        }
        return previews;
    }
    async agentPreviews(dir) {
        const names = await listMdFiles(dir);
        const previews = [];
        for (const name of names) {
            const file = `${dir}/${name}`;
            try {
                const content = await this.readPreview(file);
                const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(content);
                let description;
                if (match !== null) {
                    const yaml = (await import('yaml')).parse(match[1]);
                    if (typeof yaml === 'object' && yaml !== null) {
                        const desc = yaml['description'];
                        if (typeof desc === 'string')
                            description = desc;
                    }
                }
                previews.push({ name: name.slice(0, -3), ...description === undefined ? {} : { description }, content });
            }
            catch {
                // unreadable agent files are skipped in previews
            }
        }
        return previews;
    }
    /** Parse CC hooks.json into flat {event, matcher, command} preview entries. */
    async hooksPreviews(root) {
        for (const relative of ['hooks/hooks.json', 'hooks.json']) {
            let text;
            try {
                text = await readFile(`${root}/${relative}`, 'utf8');
            }
            catch {
                continue;
            }
            try {
                const parsed = JSON.parse(text);
                if (typeof parsed !== 'object' || parsed === null)
                    continue;
                const hooks = parsed['hooks'];
                if (typeof hooks !== 'object' || hooks === null)
                    continue;
                const entries = [];
                for (const [event, groups] of Object.entries(hooks)) {
                    if (!Array.isArray(groups))
                        continue;
                    for (const group of groups) {
                        if (typeof group !== 'object' || group === null)
                            continue;
                        const record = group;
                        const matcher = typeof record['matcher'] === 'string' ? record['matcher'] : undefined;
                        const hooksList = record['hooks'];
                        if (Array.isArray(hooksList)) {
                            for (const hook of hooksList) {
                                if (typeof hook !== 'object' || hook === null)
                                    continue;
                                const hookRecord = hook;
                                if (typeof hookRecord['command'] === 'string') {
                                    entries.push({ event, ...matcher === undefined ? {} : { matcher }, command: hookRecord['command'] });
                                }
                            }
                        }
                    }
                }
                return { count: entries.length, entries };
            }
            catch {
                // unparsable hook files yield zero entries
            }
        }
        return { count: 0, entries: [] };
    }
    async lspPreviews(root) {
        const previews = [];
        for (const entry of await discoverLspEntries(root)) {
            try {
                previews.push({ name: entry.name, content: await this.readPreview(entry.path) });
            }
            catch {
                // unreadable LSP files are skipped in previews
            }
        }
        return previews;
    }
    enqueue(operation) {
        const result = this.mutationQueue.then(operation, operation);
        this.mutationQueue = result.catch(() => { });
        return result;
    }
}
function installKey(sourceId, suiteId) {
    return `${sourceId}/${suiteId}`;
}
/** Read a checkout's HEAD when it is a git repository; other checkouts have no lock commit. */
async function tryHead(dir) {
    try {
        return await gitHead(dir);
    }
    catch {
        return undefined;
    }
}
