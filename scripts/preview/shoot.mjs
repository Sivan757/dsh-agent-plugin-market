import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const root = '/Users/sivan/workspace/dsh-agent-plugins-market/scripts/preview'
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.map': 'application/json' }
const server = createServer(async (req, res) => {
  const path = req.url === '/' ? '/preview.html' : req.url
  try {
    const file = join(root, decodeURIComponent(path ?? '/'))
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': mime[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404); res.end()
  }
})
await new Promise(resolve => server.listen(4173, resolve))
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1240, height: 1500 } })
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({ path: join(root, 'screenshot.png') })
await browser.close()
server.close()
console.log('screenshot written')
