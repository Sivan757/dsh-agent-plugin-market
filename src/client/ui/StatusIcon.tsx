/** Shared status icon used by market and MCP status filter tabs. */
import { createElement as h, type ReactNode } from 'react'

export type StatusIconKind = 'all' | 'installed' | 'uninstalled'

export interface StatusIconProps {
  kind: StatusIconKind
}

/** An SVG status icon for the all/installed/uninstalled filter tabs. */
export function StatusIcon({ kind }: StatusIconProps): ReactNode {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', 'aria-hidden': true } as const
  if (kind === 'installed') {
    return h('svg', common, h('circle', { cx: 8, cy: 8, r: 5.5 }), h('path', { d: 'm5.5 8 1.7 1.7 3.4-3.4' }))
  }
  if (kind === 'uninstalled') {
    return h('svg', common, h('path', { d: 'M8 2v8m-3-3 3 3 3-3M3 13h10' }))
  }
  return h('svg', common, h('path', { d: 'M2.5 5 8 2.5 13.5 5 8 7.5 2.5 5Zm0 3L8 10.5 13.5 8M2.5 11 8 13.5 13.5 11' }))
}
