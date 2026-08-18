/**
 * Panel open/close state for the 套件市场 center-column takeover.
 * A tiny subscribe/getSnapshot store (no React involvement in the toggle
 * path), mirroring the ssh/task-board panel precedent.
 */

export interface PanelSnapshot {
  panelOpen: boolean
}

export class PanelController {
  private open = false
  private readonly listeners = new Set<() => void>()

  getSnapshot(): PanelSnapshot {
    return { panelOpen: this.open }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  openPanel(): void {
    if (this.open) return
    this.open = true
    for (const listener of this.listeners) listener()
  }

  close(): void {
    if (!this.open) return
    this.open = false
    for (const listener of this.listeners) listener()
  }

  toggle(): void {
    if (this.open) this.close()
    else this.openPanel()
  }
}
