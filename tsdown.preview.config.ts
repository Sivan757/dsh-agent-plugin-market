import { defineConfig } from 'tsdown'

/** Self-contained preview bundle for the README screenshot. */
export default defineConfig({
  entry: { demo: 'scripts/preview/demo.tsx' },
  format: ['cjs'],
  outDir: 'scripts/preview/dist',
  platform: 'browser',
  hash: false,
  external: [/^react(\/|$)/, /^react-dom(\/|$)/],
  css: { inject: true },
  dts: false,
})
