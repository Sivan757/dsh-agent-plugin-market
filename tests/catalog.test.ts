import { cp, mkdtemp, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { Catalog } from '../src/application/catalog.js'

const fixture = join(process.cwd(), 'tests', 'fixtures', 'v1-suite')

describe('Catalog application module', () => {
  it('reuses a coherent user snapshot until a mutation invalidates it', async () => {
    const userRoot = await mkdtemp(join(tmpdir(), 'dsh-agent-plugins-catalog-'))
    await mkdir(join(userRoot, '.sources', 'demo'), { recursive: true })
    await cp(fixture, join(userRoot, '.sources', 'demo'), { recursive: true })
    const catalog = new Catalog({ userRoot, dataRoot: join(userRoot, 'data'), onChanged: () => {} })
    await catalog.load()
    await catalog.mergeSources([{ id: 'demo', url: 'https://example.test/demo.git' }])

    const first = await catalog.readUserCatalog()
    const second = await catalog.readUserCatalog()
    expect(second).toBe(first)
    expect(first.revision).toBe(1)
    expect(first.suites.map(suite => suite.id)).toEqual(['v1-suite'])

    await catalog.install('demo', 'v1-suite')
    const afterInstall = await catalog.readUserCatalog()
    expect(afterInstall).not.toBe(first)
    expect(afterInstall.revision).toBe(2)
    expect(afterInstall.enabledSuites.map(suite => suite.id)).toEqual(['v1-suite'])
  })
})
