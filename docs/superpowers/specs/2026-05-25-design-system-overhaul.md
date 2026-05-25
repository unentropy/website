# Unentropy Website — Design System Overhaul

**Date:** 2026-05-25
**Status:** Draft, ready for implementation planning
**Author:** Mateusz Tymek (with Claude)

## 1. Motivation

The Unentropy website (`/home/mat/Work/unentropy/website`) currently
ships as stock Astro Starlight 0.39 with the `starlight-theme-nova`
plugin and ~70 lines of incidental custom CSS. The result is
recognisable as Starlight default chrome: near-black background, system
fonts, grey accent, low-contrast surface hierarchy. For a product whose
job is to track and visualise metrics, the docs site should *look* like
something engineers built for engineers — closer to Grafana / Tailscale
admin / a developer instrument panel than to a generic SaaS docs site.

This spec defines a coherent design system — typography, colour,
surfaces, motifs, radius — and lays out how to integrate it with
Starlight without forking the chrome.

## 2. Goals & Non-goals

### Goals

- Replace the stock Starlight look with a Lattice-inspired "instrument
  panel" aesthetic that reads as technical and credible.
- Establish a token system (colours, type scale, radius, spacing) that
  every Starlight surface inherits from, so we don't override
  component-by-component.
- Support both dark and light modes, sharing the same token semantics
  (surface-card flips lightness between modes — recessed in dark,
  elevated in light).
- Keep the chrome minimal and dense — no shadows, hairline borders, 3
  real surface layers.
- Bake in a small, disciplined set of "hacker" motifs that signal the
  product's audience without tipping into cliché.

### Non-goals

- **Homepage hero layout.** Out of scope; revisited separately once the
  design system is in place.
- **New custom components or pages.** This spec changes presentation;
  it does not introduce blog post types, dashboard widgets, etc.
- **Animation beyond the blinking H1 caret.** Motion is explicitly
  restrained.
- **Search UX changes.** Pagefind stays as-is; only its rendered chrome
  gets restyled.
- **Logo redesign.** The existing logo is retained; only its colour
  treatment changes (see §7).
- **Removing `starlight-theme-nova`.** Plugin stays for Shiki and the
  Code component; we override its token defaults (see §5).

## 3. Design tokens

Tokens are scoped to `:root` for dark and `[data-theme="light"]` for
light. Names follow Lattice originals where possible, and map to
Starlight's `--sl-color-*` variables (see §5).

### 3.1 Surfaces & text — dark

| Token | Value | Role |
|---|---|---|
| `--bg`            | `#1c2230` | Page background |
| `--surface`       | `#161b27` | Nav, sidebar, table header, code-bar |
| `--surface-card`  | `#11151f` | Code block body, recessed cards (deepest) |
| `--border`        | `#2a3148` | Default 1px hairline |
| `--border-soft`   | `#262d42` | Within-card dividers, dotted grid |
| `--text`          | `#cad3e0` | Primary copy, headings |
| `--text-dim`      | `#9aa6bb` | Lede, sidebar links, descriptions |
| `--text-muted`    | `#5a6680` | Eyebrow labels, metadata, breadcrumb |

### 3.2 Surfaces & text — light

| Token | Value | Role |
|---|---|---|
| `--bg`            | `#f4f6fa` | Page background |
| `--surface`       | `#e8ecf2` | Nav, sidebar, table header, code-bar |
| `--surface-card`  | `#ffffff` | Code block body, *elevated* cards (lightest) |
| `--border`        | `#d0d6e0` | Default 1px hairline |
| `--border-soft`   | `#dde2ea` | Within-card dividers, dotted grid |
| `--text`          | `#2a3344` | Primary copy, headings |
| `--text-dim`      | `#4f5a72` | Lede, sidebar links, descriptions |
| `--text-muted`    | `#7c8699` | Eyebrow labels, metadata, breadcrumb |

**Note — the surface-card flip is intentional:** `--surface-card` is the
*most distant* surface from `--bg` in both directions (deepest in dark,
lightest in light). Cards always stand apart from the page; the
metaphor inverts between modes. CSS never branches on theme — only the
tokens change.

### 3.3 Accent & semantic

| Token | Dark | Light | Used on |
|---|---|---|---|
| `--accent`    | `#65c2e7` | `#2c7ea2` | Links, H1 caret, brand mark, active borders, code keywords, badge/button accent |
| `--up`        | `#8ec07c` | `#4a8d3a` | Positive deltas, "PASS" badges, syntax strings, status `● operational` |
| `--down`      | `#e08490` | `#b94656` | Negative deltas, danger asides, syntax numbers |
| `--warn`      | `#d4a663` | `#a67224` | "WARN" badges, caution asides, syntax functions |

Dark `--accent` is 60% between Lattice's published gentle
(`#6fb3d2`) and a punchier `#5fc8f3` — `hsl(197°, 73%, 65%)`.

### 3.4 Type scale

```
--t-eyebrow:  0.6875rem   /* 11px — UPPERCASE, tracked +0.14em */
--t-xs:       0.75rem     /* 12px */
--t-sm:       0.8125rem   /* 13px */
--t-base:     0.9375rem   /* 15px — body */
--t-md:       1.0625rem   /* 17px — lede, post-card title */
--t-lg:       1.375rem    /* 22px */
--t-xl:       1.75rem     /* 28px — H2 */
--t-2xl:      2.25rem     /* 36px — H1 */
```

### 3.5 Radius

```
--r-sm: 2px   /* badges, inline code, kbd, dot inside badges */
--r-md: 3px   /* code-frame, asides, buttons, search box */
--r-lg: 4px   /* large cards, hero panels, system-row callouts */
```

This matches Lattice's own SVG previews (`rx=3` on inner cards). Sharper
than Linear/Vercel; softer than pure 0px brutalism.

### 3.6 Fonts

```
--font-sans: "IBM Plex Sans", system-ui, sans-serif;
--font-mono: "Commit Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

Hosting: **self-hosted via `@fontsource` npm packages**, not the Google
Fonts / jsdelivr CDN. No third-party network dependency in production;
fonts ship from our domain.

Packages:

- `@fontsource/ibm-plex-sans` — weights 400, 500, 600
- `@fontsource-variable/commit-mono` *or* `@fontsource/commit-mono` —
  weights 400, 500, 600. (Variable preferred if available; otherwise
  pin to three static weights.)

Headings use Commit Mono **weight 600**. Body uses IBM Plex Sans **400**
with **600** for emphasis. Code uses Commit Mono **400**.

## 4. Motifs (hacker/dashboard, restrained)

Each motif is justified by a specific surface — no decorative
sprinkling. Total list is intentionally short.

| Motif | v1 | Where it lives |
|---|---|---|
| **Blinking `▍` caret** | ✓ | After H1 only. Keyframes-based, no JS. |
| **`$` prompt prefix** | ✓ | Inside `bash` code blocks, before each command line. Coloured `--accent`, `user-select: none`. Applied to the homepage install snippet now; extends to any Shiki `bash` block via a CSS `::before` rule on a Shiki line span (verify selector during implementation). |
| **Status bar (footer)** | ✓ | Bottom strip with `█▍ v0.3.11 │ build e1b8162 │ ● operational │ © 2026 unentropy`. Mono, uppercase, tracked. Version and SHA can be hard-coded for v1; wiring to package.json / build env deferred. |
| **Brand mark** | ✓ | 10px solid `--accent` square before the wordmark, e.g. `■ unentropy/docs`. Either added to the header in-template or replaces the existing img-based logo treatment. |
| **24px dot grid** | ✓ | Body background, very low opacity (~3.5% dark, ~5.5% light). `radial-gradient` at 24×24px, offset 12×12 to centre between content. |
| **Eyebrow indices** | ✗ deferred | Before doc section labels (`02 · 04 · GUIDES`). Coloured `--text-muted` with the digits in `--accent`. Requires per-page frontmatter — see §5.5. Style is locked in tokens.css so it lands instantly when used. |
| **ASCII separator** | ✗ deferred | Between major content blocks: `──── # ────`, centred, `--border` colour with the glyph in `--text-muted`. Requires a remark plugin or aside variant — see §5.5. |
| **Breadcrumb mono** | ✗ deferred | `~/docs/guides/storage` rendered in mono with `/` separators in `--border`, leaf in `--text`. Requires opting out of Starlight's title layout — see §5.5. |

**Explicitly not used:** ASCII art logos, terminal "windows" with
fake red/yellow/green chrome dots, full monospace body copy, scanline
overlays, CRT glow, neon glow effects, Matrix-style backgrounds.

## 5. Integration with Starlight

### 5.1 Architecture — token bridge, not fork

The website continues to use `@astrojs/starlight ^0.39.2` and
`starlight-theme-nova ^0.11.9` unchanged. We do **not** swap the
plugin or fork Starlight's chrome. Instead:

1. A new `src/styles/tokens.css` defines the Lattice tokens at `:root`
   and `[data-theme="light"]`.
2. The same file **re-maps Starlight's `--sl-color-*` variables** to
   our Lattice tokens. Examples:

   ```css
   :root {
     --sl-color-bg:           var(--bg);
     --sl-color-bg-nav:       var(--surface);
     --sl-color-bg-sidebar:   var(--surface);
     --sl-color-bg-inline-code: var(--surface);
     --sl-color-text:         var(--text);
     --sl-color-text-accent:  var(--accent);
     --sl-color-accent:       var(--accent);
     --sl-color-accent-high:  var(--text);
     --sl-color-accent-low:   color-mix(in srgb, var(--accent) 14%, transparent);
     --sl-color-hairline:     var(--border-soft);
     --sl-color-hairline-light: var(--border);
     --sl-color-gray-1:       var(--text);
     --sl-color-gray-2:       var(--text-dim);
     --sl-color-gray-3:       var(--text-muted);
     --sl-color-gray-5:       var(--border);
     --sl-color-gray-6:       var(--border-soft);
     --sl-font:               "IBM Plex Sans", ...;
     --sl-font-mono:          "Commit Mono", ...;
   }
   ```

3. `starlight-theme-nova` declares its own `--sl-color-*` defaults
   (gray accent etc). Our overrides must win the cascade. The
   `customCss` array is loaded **after** plugin styles, so a plain
   import in `astro.config.mjs` is sufficient — no `!important`, no
   specificity tricks. Verify during implementation.

### 5.2 Surface map

Every visual surface in the design system maps to a Starlight surface
(or to a small additional override). No new layout components are
introduced.

| Design surface | Starlight surface | Notes |
|---|---|---|
| Top nav, brand, links | Starlight `Header` | Brand mark and mono font come from `--sl-font-mono`. Active-link border-bottom is an override. |
| Sidebar | Starlight sidebar | Eyebrow labels with `01 · START` indices are an override on `.sidebar-content nav h2` (or whatever class Starlight emits — verify). |
| Breadcrumb | (no Starlight equivalent for docs pages — Starlight uses page title only) | Either add a small Astro component or skip breadcrumb in v1. **Decision: skip in v1**, revisit if needed. |
| H1 with caret | Starlight `<h1>` | `::after` keyframes injected via `tokens.css`. Caret applies only to top-level H1 inside `.sl-markdown-content`. |
| H2 / H3 | Starlight `.sl-markdown-content h2 / h3` | Mono, weight 600, standard `#` anchor (Starlight's auto-anchor stays as default). |
| Eyebrow indices | (no equivalent) | Out of scope for v1 — would require frontmatter or MDX. Tracked as future enhancement. |
| Code block | `starlight-theme-nova/Code` component | Currently used on the homepage install snippet. Keep. Override its CSS for radius, bg, and bar styling via `tokens.css`. |
| Inline code | `.sl-markdown-content code` | Override colour to `--accent`, background to `--surface`, border to `--border-soft`. |
| `:::tip/:::caution/:::danger/:::note` | Starlight asides (`.starlight-aside`) | Restyled — left border 2px in semantic colour, `--surface` background, mono title. |
| Badge | Starlight `<Badge>` | Restyled via the `starlight-theme-nova/lib/badge.css` overrides. Five semantic variants. |
| Buttons (filled, ghost) | (no Starlight equivalent for inline links-as-buttons) | New `.btn` class in `tokens.css`. Used in `index.astro` and any landing-style pages. |
| Table | `.sl-markdown-content table` | Override: mono uppercase headers, tabular-nums on `td.num`, semantic delta colours. |
| TOC | Starlight TOC | Restyled — left-border indicator on active, mono font. |
| Footer | Custom in `HomepageLayout.astro` / `BlogLayout.astro` | Add status bar strip below existing copyright. |
| Post cards (blog) | Custom `PostCard.astro` etc | Restyled — mono title, mono date, accent on hover. |

### 5.3 starlight-theme-nova interaction

`starlight-theme-nova` provides:

- A `Code` component with Shiki integration (we use it on the homepage).
- Custom CSS for badges, asides, cards, markdown (5 files in
  `lib/styles.css`).
- Component overrides for `Hero`, `Header`, `PageFrame`, etc.

Our approach: **override its tokens, leave its structure alone**.

Specifically:

- The plugin sets `--sl-color-accent` to grey (`var(--color-gray-600)`).
  We override this with `var(--accent)` in our `tokens.css`.
- Plugin badge / aside CSS uses `var(--sl-color-accent)` variants —
  these will automatically pick up our new accent.
- The plugin uses Tailwind v4 + an Inter-ish system font. We override
  `--sl-font` to IBM Plex Sans, which the plugin's CSS respects.
- Shiki: the plugin ships its own Shiki theme. We **keep the existing
  Shiki theme** in v1. Custom syntax-token colours from the prototype
  (kw → accent, str → up, num → down, fn → warn, comment →
  text-muted) are deferred to v2; see §8.

### 5.4 File-by-file changes

```
astro.config.mjs                       — no change (plugin stays)

src/styles/
  tokens.css                           — NEW. All token defs + Starlight var re-mapping + global resets.
  custom.css                           — MODIFIED. Drop theme-gallery rules → into tokens.css.
                                                    Keep logo filter rules but verify against new tokens.
  blog.css                             — MODIFIED. Update post-card, prev-next, pagination,
                                                    tag styles to use new tokens.
  fonts.css                            — NEW. @fontsource imports for IBM Plex Sans + Commit Mono.

src/layouts/
  HomepageLayout.astro                 — MODIFIED. Update inline styles to use new tokens.
                                                    Add status bar to footer.
  BlogLayout.astro                     — MODIFIED. Same as above. Update logo filter.

src/components/blog/
  PostCard.astro                       — MODIFIED. Mono title, accent on hover.
  PostMeta.astro                       — MODIFIED. Mono date, muted colour.
  PrevNext.astro                       — MODIFIED. Mono labels, new radius.
  TagList.astro                        — MODIFIED. Badge-style tags using --accent.
  CoverImage.astro                     — No change (just an img wrapper).

src/pages/index.astro                  — MODIFIED. Update hero block styles only enough to use new
                                                   tokens; layout reserved for separate work.

public/favicon.svg                     — VERIFY. Already in working tree (modified status).
                                                  Ensure it reads on the new bg.

src/assets/logo.svg
src/assets/logo-icon.svg               — VERIFY. Already modified in working tree.
                                                  The `brightness(0) invert(1)` filter may need
                                                  adjustment if the new logos have explicit colours.

astro.config.mjs                       — MODIFIED. Add `src/styles/fonts.css` and
                                                  `src/styles/tokens.css` to the customCss array.
```

### 5.5 Out-of-tree (deferred)

These come up naturally during implementation but are explicitly
deferred to a separate plan:

- Eyebrow indices on docs pages (requires frontmatter or MDX changes
  per page).
- Breadcrumb component (requires opting out of Starlight's default
  title layout).
- ASCII `─── # ───` separator on docs pages (could be a remark plugin
  or a `:::sep:::` aside variant).
- Shiki syntax theme matched to our token palette.
- Homepage hero redesign.

## 6. Cascade & specificity

The risk in this approach is `starlight-theme-nova`'s CSS winning
specificity wars. Mitigations:

1. **`customCss` runs last.** Starlight loads plugin CSS, then user CSS.
   Our `tokens.css` will land after plugin tokens.
2. **Use `:root` (not a class).** Plugin uses `:root` too — we win by
   load order.
3. **No `!important`.** If a plugin selector outranks us, we either
   match its specificity (`html[data-theme="dark"]`) or write a more
   specific rule in `custom.css`. Surface this during implementation;
   do not paper over.
4. **Verify with the rendered DOM, not with assumed selectors.** During
   implementation, the dev server (`bun dev`) plus DevTools is the
   source of truth for what's actually applied.

## 7. Logo

The site has two logo assets (`src/assets/logo.svg`,
`src/assets/logo-icon.svg`) plus a favicon. All four are in the working
tree as modified; their new content has not been audited.

Today's CSS coerces them via filter:

```css
[data-theme="light"] .site-title img { filter: brightness(0); }
[data-theme="dark"]  .site-title img { filter: brightness(0) invert(1); }
```

That treatment assumes the SVGs are mono and works in stark contrast.
With Lattice's `--bg #1c2230` (cool slate, not near-black), `invert(1)`
still produces a near-white logo which should read well. Action items:

- Open the new SVGs to confirm they're single-fill (no embedded
  colours). If they have colours, decide whether to:
  - keep the filter (loses brand colour, gains theme parity), or
  - drop the filter and accept that the logo is a fixed colour.
- Verify favicon reads on browser tab in both modes.

## 8. Testing & verification

No automated visual regression in v1. Verification is manual against
the live preview:

1. **Token sanity.** Inspect `:root` and `[data-theme="light"]` in
   DevTools to confirm every Lattice token resolves and every
   Starlight `--sl-color-*` we mapped picks up our value.
2. **Dark + light parity.** Toggle the theme switch on every Starlight
   page type: docs index, getting-started, a reference page, a guide,
   a blog post, the blog index, the homepage.
3. **Code blocks.** Inline code, Shiki blocks (homepage), Markdown
   fenced blocks (every doc) read correctly in both modes. Comment
   colour, string colour, keyword colour are legible — flag if Shiki
   needs custom token override (see §5.5).
4. **Asides.** All four flavours (`:::tip / :::caution / :::danger /
   :::note`) render with the right semantic colour.
5. **Tables.** `src/content/docs/reference/config.md` and similar
   reference tables get readability check — tabular-nums on numeric
   columns, header weight, hairline colour.
6. **Mobile.** At `<800px`, sidebar collapses (Starlight default
   behaviour). Verify the new chrome doesn't break the mobile menu.
   Verify search overlay still works.
7. **No console errors.** No FOUC from font load. `@fontsource`
   imports preload via Vite.

## 9. Risks & open questions

| Risk | Mitigation |
|---|---|
| `starlight-theme-nova` token defaults beat our overrides on specificity | Use `customCss` order; resort to matching selector if needed; never `!important`. |
| Shiki theme colours don't match our palette | Out of scope for v1 — keep nova's Shiki theme; user can request v2. |
| Commit Mono via @fontsource — confirm it exists and is OFL-licensed | Verified during implementation. Fallback: `@fontsource/jetbrains-mono` keeps the same character. |
| `brightness/invert` filter on the logo produces a colour that fights the new accent | Audit logo SVGs once; either accept the result or strip the filter and embed colours directly. |
| Light-mode H1 caret blink is distracting on white background | Tolerance check during light-mode pass. If too loud, drop opacity to 0.7 or reduce blink rate to 1.6s. |
| `.starlight-aside` selector path may have changed in Starlight 0.39 | Verify selector before overriding. |

## 10. Acceptance criteria

The implementation is done when, with the dev server running:

1. The dark theme shows: Commit Mono headings (weight 600) with the
   blinking caret on H1; IBM Plex Sans body; the new accent colour on
   links/active states/code keywords; the 24px dot grid background; 1px
   hairlines with no shadows; `2/3/4`px radii on `sm/md/lg` surfaces;
   filled and ghost button styles using the new accent.
2. The light theme shows the same with Lattice light tokens; the
   surface-card flip works (code blocks are white-elevated, not dark-
   recessed).
3. Both themes pass a full docs / blog / homepage / reference walk
   (§8.2) without visual regressions.
4. No `!important` declarations are added to user CSS.
5. No new Astro components beyond what's strictly needed are introduced.
6. The status bar appears at the bottom of every layout.
7. Fonts load without FOUC; no Google Fonts CDN dependency in
   production output.
