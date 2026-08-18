/**
 * Sidebar entry injection (套件市场 top-level entry).
 *
 * dsh's sidebar shell exposes no slot an external plugin can register into,
 * so — following the dsh-ssh / task-board precedent of DOM-level extension —
 * the entry row is injected between the shell's New Session button and the
 * workspace browser. The injection self-heals: a MutationObserver watches the
 * sidebar root and re-inserts the row whenever a React re-render displaces it
 * (re-insertion happens in the same frame, before paint, so no flicker).
 *
 * The row is plain DOM (no React tree) so it can never disturb the shell's
 * reconciliation; the panel it toggles is a separate React root mounted in
 * the center column (see mount.tsx).
 */
import type { PanelController } from './panel-controller.js'
import type { Translate } from './index.js'
import css from './market.module.css'

/** Stable data attribute identifying the injected entry row. */
export const ENTRY_SELECTOR = '[data-dsh-agent-plugin-entry]'

/** Inline icon (matches the shell's 16px nav-icon look): a grid of four tiles. */
const ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>'

/** Find the sidebar shell root element, or undefined while not yet mounted. */
function sidebarRoot(): HTMLElement | undefined {
  const column = document.querySelector<HTMLElement>('[data-pane="sidebar"], [class*="sidebarCol"]')
  if (column === null) return undefined
  const logoOwner = column.querySelector<HTMLElement>('[class*="logoRow"]')?.parentElement
  return logoOwner ?? (column.firstElementChild as HTMLElement | undefined)
}

/** The New Session button: nested in the logo row on current shells, a direct child on legacy shells. */
function newSessionButton(root: HTMLElement): HTMLButtonElement | undefined {
  const nested = root.querySelector<HTMLButtonElement>('button[class*="newSession"]')
  if (nested !== null) return nested
  for (const child of root.children) {
    if (child.tagName === 'BUTTON') return child as HTMLButtonElement
  }
  return undefined
}

/** Build the entry row (a detached button; insert once the shell is up). */
function createEntry(controller: PanelController, t: Translate): HTMLButtonElement {
  const entry = document.createElement('button')
  entry.type = 'button'
  entry.dataset.dshAgentPluginEntry = ''
  entry.className = css.entry
  entry.innerHTML = `${ICON}<span class="${css.entryLabel}">${t('nav')}</span>`
  entry.title = t('nav')
  entry.addEventListener('click', () => controller.toggle())
  return entry
}

/**
 * Keep the entry row present in the sidebar: insert it after the New Session
 * button on first sight, and re-insert whenever a shell re-render displaces
 * it. The observer is disconnected once the row exists and the root is
 * stable; a re-render that removes the row re-arms insertion.
 * @returns disposer removing the row and the observer.
 */
export function mountSidebarEntry(controller: PanelController, t: Translate): () => void {
  let entry: HTMLButtonElement | undefined
  let anchor: HTMLElement | undefined
  let observer: MutationObserver | undefined

  const insert = (): void => {
    const root = sidebarRoot()
    if (root === undefined) return
    const button = newSessionButton(root)
    if (button === undefined) return
    if (entry === undefined) entry = createEntry(controller, t)
    const parent = button.parentElement
    if (parent === null) return
    if (entry.isConnected && entry.parentElement === parent && entry.nextSibling === button.nextSibling) return
    button.insertAdjacentElement('afterend', entry)
    anchor = button
    if (observer !== undefined) {
      observer.disconnect()
      observer = undefined
    }
  }

  const rearm = (): void => {
    if (entry !== undefined && entry.isConnected) return
    if (observer === undefined) {
      observer = new MutationObserver(() => insert())
      observer.observe(document.body, { childList: true, subtree: true })
    }
    insert()
  }

  insert()
  rearm()
  return () => {
    observer?.disconnect()
    entry?.remove()
  }
}
