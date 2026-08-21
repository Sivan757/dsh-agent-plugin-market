import { defineConfig } from 'tsdown'

/**
 * Client bundle: the Web app loads `./client/client.js` through its
 * `__ModuleLoader__` and injects the `dsh.client.inject` module table as
 * `require(...)` calls. React, ReactDOM, and first-party client packages stay
 * external; CSS modules are inlined into the bundle so the section renders
 * with no companion asset.
 */
export default defineConfig({
  entry: { client: 'src/client/index.ts' },
  format: ['cjs'],
  outDir: 'client',
  platform: 'browser',
  hash: false,
  external: [/^react(\/|$)/, /^react-dom(\/|$)/, /^@deepseek-ai\/dsh-client-/, /^@deepseek-ai\/dsh-llm(\/|$)/],
  css: { inject: true },
  outExtensions: ({ format }) => (format === 'cjs' ? { js: '.js' } : {}),
  dts: false,
  sourcemap: true
})
