# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Engineering refactor — catalog-centered modularization (ADR-0001)

This release completes the internal engineering refactor documented in ADR-0001 and `docs/design/engineering-refactor-plan.md`. No public API (`exports`, route paths, `state.json` structure) changed, but the internal module layout changed substantially.

#### Refactor

- Introduced `contracts/`, `catalog/`, `application/`, `runtime/`, `model/`, and `client/features/` + `client/ui/` layered modules
- Deleted `SuiteManager` and `discovery` compatibility facades; all callers now use `application/Catalog` directly
- Relocated runtime mounts, model, and catalog modules into their target layers
- Split `MarketSection.tsx` (620 lines) into feature components and shared UI controls
- Replaced lint/format hardcoded file whitelists with directory globs
- Untracked `lib/` and `client/` build artifacts; added `prepare` script for GitHub installs (GitHub installs now require Node + pnpm toolchain)

#### Tests

- Added characterization, contract, and view-model tests (Stage 0/4)
- Added `MarketSection` render smoke tests
- Fixed React `act(...)` warnings and parallel-test interference
- Established coverage baseline (`test:coverage` script)

## [0.4.6] - 2025-08-21

### Features

- Add MCP status surface and shared catalog toolbar
- Add-source action for remote references, MCP mount status in UI

### Performance

- Cache overview snapshot to stop settings-panel flash; add clone progress feedback

## [0.4.5] - 2025-08-21

### Documentation

- Restructure READMEs — Quick start first, merge duplicate FAQs, align section order
- GEO optimization — README definition sentence + FAQ, npm keywords, docs site
- Link docs website in READMEs

## [0.4.4] - 2025-08-20

### Features

- Rename to `dsh-agent-plugins-market` (Agent Plugin Market)
- Dual-channel install (npm registry / GitHub)
