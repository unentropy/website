# AGENTS.md

## What This Is

A documentation website built with Astro and Starlight. Static site generation (SSG) only.

## Tech Stack

- **Runtime:** Bun (not npm/node)
- **Framework:** Astro 5.6+ with Starlight theme
- **Language:** TypeScript (strict mode)

## Quick Commands

```bash
bun dev        # Dev server at localhost:4321
bun build      # Build to ./dist/
bun preview    # Preview production build
bun astro check # Type check
```

## Project Map

```
src/
  content/docs/  # Markdown docs (auto-routed by Starlight)
  pages/         # Root pages (index.astro = homepage)
  layouts/       # Reusable Astro layouts
  assets/        # Images, SVGs (import to embed)
  styles/        # Global CSS
```

## Key Conventions

- Components: `PascalCase.astro`
- Pages/routes: `kebab-case.md`
- Use `---` frontmatter fence in Astro files
- Prefer scoped `<style>` tags in components
- Type Starlight props explicitly: `type Props = StarlightPageProps`

## Verification

Always run `bun build` before considering work complete. Build errors are the primary feedback mechanism - no test framework is configured.

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

