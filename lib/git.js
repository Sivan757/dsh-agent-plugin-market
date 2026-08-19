/**
 * Git operations for repository sources: clone, pull, head, remove.
 *
 * Every operation runs `git` through `execFile` without a shell, so a source
 * URL or branch can never interpolate into a command string. Failures carry
 * the stderr tail as the message; the manager surfaces them as source errors.
 */
import { execFile } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { promisify } from 'node:util';
const run = promisify(execFile);
const DEFAULT_TIMEOUT_MS = 120_000;
/** Clone a source (depth 1, optional branch) into a not-yet-existing directory. */
export async function gitClone(url, branch, dest, timeoutMs = DEFAULT_TIMEOUT_MS) {
    const args = ['clone', '--depth', '1', ...(branch === undefined ? [] : ['--branch', branch]), '--', url, dest];
    try {
        await run('git', args, { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 });
    }
    catch (error) {
        throw gitError('clone', error);
    }
}
/** Fast-forward a checked-out source to its configured branch. */
export async function gitPull(dir, timeoutMs = DEFAULT_TIMEOUT_MS) {
    try {
        await run('git', ['-C', dir, 'pull', '--ff-only'], { timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 });
    }
    catch (error) {
        throw gitError('pull', error);
    }
}
/** Read the checked-out HEAD commit. */
export async function gitHead(dir, timeoutMs = 30_000) {
    try {
        const { stdout } = await run('git', ['-C', dir, 'rev-parse', 'HEAD'], { timeout: timeoutMs });
        return stdout.trim();
    }
    catch (error) {
        throw gitError('rev-parse', error);
    }
}
/** Remove a source checkout tree entirely. */
export async function gitRemove(dir) {
    await rm(dir, { recursive: true, force: true });
}
function gitError(operation, error) {
    if (error instanceof Error && 'stderr' in error && typeof error.stderr === 'string') {
        const stderr = error.stderr.trim();
        return new Error(`git ${operation} failed: ${stderr.split('\n').at(-1) ?? stderr}`);
    }
    return new Error(`git ${operation} failed: ${error instanceof Error ? error.message : String(error)}`);
}
