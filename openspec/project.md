# Project Context

## Purpose
Documentation website for Unentropy, an open-source CI/CD tool for tracking code metrics. The tagline is "Track your code metrics in CI/CD - serverless, self-hosted, completely yours."

This repository contains only the documentation site, not the Unentropy tool itself.

## Tech Stack
- **Runtime:** Bun
- **Framework:** Astro 5.6+ with Starlight theme
- **Theme:** starlight-theme-nova
- **Language:** TypeScript (strict mode)
- **Build:** Static Site Generation (SSG) only

## Project Conventions

### Code Style
- TypeScript strict mode (extends `astro/tsconfigs/strict`)
- Components: `PascalCase.astro`
- Pages/routes: `kebab-case.md`
- Prefer scoped `<style>` tags in components
- Type Starlight props explicitly: `type Props = StarlightPageProps`

No automated linting or formatting tools are configured.

### Architecture Patterns
- **Content-first:** Uses Astro content collections with Starlight's docsLoader
- **File-based routing:** Markdown in `src/content/docs/` auto-maps to routes
- **Directory structure:**
  - `src/content/docs/guides/` - Task-oriented documentation
  - `src/content/docs/reference/` - Technical reference
  - `src/pages/` - Root pages (homepage)
  - `src/layouts/` - Reusable Astro layouts
  - `src/assets/` - Images, SVGs
  - `src/styles/` - Global CSS

### Testing Strategy
No test framework is configured. Build validation is the primary feedback mechanism:
- Run `bun build` to verify changes
- Run `bun astro check` for TypeScript type checking


## Domain Context
Unentropy is a CI/CD metrics tool (currently in beta, 0.x). The documentation covers:
- Getting started guides
- Configuration reference
- CLI documentation
- Guides for metrics, quality gates, storage, and reports

## Important Constraints
- SSG only: No server-side rendering

## External Dependencies
None. This is a fully self-contained static site with no external runtime dependencies.
