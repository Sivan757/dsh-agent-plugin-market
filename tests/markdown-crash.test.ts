// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { createElement as h } from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react'
import { MarkdownText } from '@deepseek-ai/dsh-client-ui-primitives'

const ROOT = join(process.cwd(), 'tests/fixtures')

function skillFiles(directory = ROOT): string[] {
  const files: string[] = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      files.push(...skillFiles(path))
      continue
    }
    if (entry.name === 'SKILL.md') {
      readFileSync(path, 'utf8')
      files.push(path)
    }
  }
  return files
}

describe('MarkdownText renders committed skill fixtures', () => {
  it('does not throw on any SKILL.md', () => {
    const files = skillFiles()
    expect(files.length).toBeGreaterThan(0)
    const crashed: string[] = []
    for (const file of files) {
      const text = readFileSync(file, 'utf8')
      const container = document.createElement('div')
      document.body.appendChild(container)
      const root = createRoot(container)
      try {
        act(() => { root.render(h(MarkdownText, { text })) })
        act(() => { root.unmount() })
      } catch {
        crashed.push(file)
      } finally {
        container.remove()
      }
    }
    expect(crashed, `crashed files: ${crashed.join(', ')}`).toEqual([])
  })
})
