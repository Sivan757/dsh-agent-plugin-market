# Keep one npm plugin and center the internal refactor on Catalog

The plugin will remain one published npm package with stable host/client entry points, while internal responsibilities move behind a deep `Catalog` application module that produces coherent discovered-and-install-enriched snapshots. We choose this targeted modular refactor over vertical feature slices because discovery, install state, enabled-suite derivation, runtime reconciliation, and client projections share one data source; keeping that seam centralized limits change amplification without introducing multiple-package release coordination.

## Considered options

- **Catalog-centered modular refactor — accepted.** Preserve `SuiteManager` as a temporary compatibility facade, centralize catalog snapshots, and migrate callers incrementally.
- **Vertical feature slices with a new runtime coordinator — rejected for now.** This would move ownership to user-facing features while still requiring a shared catalog/read model, increasing migration risk and distributing cache invalidation.

## Consequences

New layout dialects belong in discovery/scanner code and fixtures; runtime mounts and client modules do not parse source formats. MCP, command, and hook mounts remain separate because their host APIs and failure semantics differ. Compatibility code requires tests and an explicit deletion condition; it is not a permanent second implementation.
