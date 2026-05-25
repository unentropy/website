# Design System Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stock Astro Starlight + `starlight-theme-nova` chrome on the Unentropy website with a Lattice-inspired "instrument panel" design system (Commit Mono + IBM Plex Sans, Lattice surfaces, accent `#65c2e7`, 2/3/4px tiered radius, restrained hacker motifs).

**Architecture:** Token-bridge approach — never fork Starlight. A new `src/styles/tokens.css` defines Lattice tokens and re-maps Starlight's `--sl-color-*` variables to them, so every Starlight surface inherits the new palette without per-component override fights. Self-hosted fonts via `@fontsource`. Layout templates (`HomepageLayout.astro`, `BlogLayout.astro`) get header/footer chrome updates; blog components get a typography pass. Plugin `starlight-theme-nova` stays — only its tokens get overridden.

**Tech Stack:** Astro 6.3, Starlight 0.39.2, `starlight-theme-nova` 0.11.9, Bun, `@fontsource/ibm-plex-sans`, `@fontsource/commit-mono`. Plain CSS only — no preprocessor.

**Spec:** `docs/superpowers/specs/2026-05-25-design-system-overhaul.md`

---

## Pre-flight

This plan assumes you're on the detached-HEAD commit `176f148` (the spec commit). Attach a branch before starting:

```bash
git switch -c design-system-overhaul 176f148
```

Confirm baseline state:

```bash
git status         # working tree changes to favicon.svg, logo.svg, logo-icon.svg are pre-existing — leave alone
bun install        # install current deps
bun run build      # baseline build must pass before we change anything
```

If `bun run build` fails on the baseline, stop and report — the plan assumes a green baseline.

Start the dev server in a separate terminal (or via a background process) so you can verify each task visually:

```bash
bun run dev        # serves at http://localhost:4321
```

Open `http://localhost:4321/` and `http://localhost:4321/getting-started/` in a browser. Keep DevTools open with the Elements/Computed panel — that's how we verify token resolution.

---

## Task 1: Install fonts via @fontsource

**Files:**
- Modify: `package.json`
- Modify: `bun.lock` (regenerated)

- [ ] **Step 1: Add @fontsource packages**

Run:
```bash
bun add @fontsource/ibm-plex-sans @fontsource/commit-mono
```

Expected: `package.json` now contains both packages under `dependencies`. Versions will be `^5.x` (current at time of writing).

- [ ] **Step 2: Verify package contents exist**

Run:
```bash
ls node_modules/@fontsource/ibm-plex-sans/files/ | head -5
ls node_modules/@fontsource/commit-mono/files/ | head -5
```

Expected: Each lists multiple `.woff2` files with weight numbers in the filename. If `commit-mono` is missing or empty, fall back to `@fontsource/jetbrains-mono` and update the plan accordingly (see spec §9 risks).

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "Add IBM Plex Sans and Commit Mono via @fontsource"
```

---

## Task 2: Create fonts.css

**Files:**
- Create: `src/styles/fonts.css`

- [ ] **Step 1: Create the file**

Write `src/styles/fonts.css` with:

```css
/* IBM Plex Sans — body */
@import "@fontsource/ibm-plex-sans/400.css";
@import "@fontsource/ibm-plex-sans/500.css";
@import "@fontsource/ibm-plex-sans/600.css";

/* Commit Mono — display, UI chrome, code */
@import "@fontsource/commit-mono/400.css";
@import "@fontsource/commit-mono/500.css";
@import "@fontsource/commit-mono/600.css";
```

- [ ] **Step 2: Commit (we wire it up in the next task)**

```bash
git add src/styles/fonts.css
git commit -m "Add @fontsource imports for IBM Plex Sans and Commit Mono"
```

---

## Task 3: Create tokens.css with Lattice tokens + Starlight bridge

**Files:**
- Create: `src/styles/tokens.css`

This is the keystone of the whole change. It defines every token, maps Lattice → Starlight, and applies global typography/background. Subsequent tasks reference these tokens.

- [ ] **Step 1: Write the full tokens.css**

Create `src/styles/tokens.css` with:

```css
/* ============================================================
   UNENTROPY · LATTICE DESIGN SYSTEM
   Spec: docs/superpowers/specs/2026-05-25-design-system-overhaul.md
   ============================================================ */

/* -----------------------------------------------------------
   1. Lattice tokens — dark (default)
   ----------------------------------------------------------- */
:root {
  --bg:            #1c2230;
  --surface:       #161b27;
  --surface-card:  #11151f;
  --border:        #2a3148;
  --border-soft:   #262d42;
  --text:          #cad3e0;
  --text-dim:      #9aa6bb;
  --text-muted:    #5a6680;

  --accent:        #65c2e7;
  --accent-rgb:    101, 194, 231;
  --accent-soft:   rgba(101, 194, 231, 0.14);

  --up:            #8ec07c;
  --down:          #e08490;
  --warn:          #d4a663;

  /* Type */
  --font-sans: "IBM Plex Sans", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "Commit Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Scale */
  --t-eyebrow: 0.6875rem;
  --t-xs:      0.75rem;
  --t-sm:      0.8125rem;
  --t-base:    0.9375rem;
  --t-md:      1.0625rem;
  --t-lg:      1.375rem;
  --t-xl:      1.75rem;
  --t-2xl:     2.25rem;

  /* Radius */
  --r-sm: 2px;
  --r-md: 3px;
  --r-lg: 4px;
}

/* -----------------------------------------------------------
   2. Lattice tokens — light
   ----------------------------------------------------------- */
:root[data-theme="light"] {
  --bg:            #f4f6fa;
  --surface:       #e8ecf2;
  --surface-card:  #ffffff;
  --border:        #d0d6e0;
  --border-soft:   #dde2ea;
  --text:          #2a3344;
  --text-dim:      #4f5a72;
  --text-muted:    #7c8699;

  --accent:        #2c7ea2;
  --accent-rgb:    44, 126, 162;
  --accent-soft:   rgba(44, 126, 162, 0.10);

  --up:            #4a8d3a;
  --down:          #b94656;
  --warn:          #a67224;
}

/* -----------------------------------------------------------
   3. Starlight variable bridge
   Re-map Starlight's --sl-color-* tokens to Lattice tokens.
   Done at :root so it picks up the active theme automatically.
   ----------------------------------------------------------- */
:root {
  /* Backgrounds */
  --sl-color-bg:             var(--bg);
  --sl-color-bg-nav:         var(--surface);
  --sl-color-bg-sidebar:     var(--surface);
  --sl-color-bg-inline-code: var(--surface);
  --sl-color-bg-accent:      var(--accent);

  /* Text */
  --sl-color-text:        var(--text);
  --sl-color-text-accent: var(--accent);
  --sl-color-text-invert: var(--bg);
  --sl-color-white:       var(--text);

  /* Accent (Starlight uses low/mid/high — map to a usable triplet) */
  --sl-color-accent-low:  color-mix(in srgb, var(--accent) 14%, transparent);
  --sl-color-accent:      var(--accent);
  --sl-color-accent-high: var(--text);

  /* Gray ramp — Starlight uses these in many places; remap to our text/border ramp */
  --sl-color-gray-1: var(--text);
  --sl-color-gray-2: var(--text-dim);
  --sl-color-gray-3: var(--text-muted);
  --sl-color-gray-4: var(--text-muted);
  --sl-color-gray-5: var(--border);
  --sl-color-gray-6: var(--border-soft);
  --sl-color-black:  var(--bg);

  /* Hairlines */
  --sl-color-hairline-light: var(--border);
  --sl-color-hairline:       var(--border-soft);
  --sl-color-hairline-shade: var(--surface-card);

  /* Fonts */
  --sl-font:      var(--font-sans);
  --sl-font-mono: var(--font-mono);
}

/* -----------------------------------------------------------
   4. Body + global resets
   ----------------------------------------------------------- */
html {
  background: var(--bg);
}

body {
  font-family: var(--font-sans);
  color: var(--text);
  background-color: var(--bg);
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(202, 211, 224, 0.035) 1px,
    transparent 0
  );
  background-size: 24px 24px;
  background-position: 12px 12px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

:root[data-theme="light"] body {
  background-image: radial-gradient(
    circle at 1px 1px,
    rgba(42, 51, 68, 0.055) 1px,
    transparent 0
  );
}

::selection {
  background: var(--accent);
  color: var(--bg);
}

:root[data-theme="light"] ::selection {
  color: #ffffff;
}

/* Tabular numerals on anything that displays numbers in chrome */
code, kbd, samp, pre,
.sl-markdown-content table,
.sidebar, .right-sidebar,
.starlight-aside,
[class*="status"], [class*="badge"] {
  font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 2: Verify file syntax**

Run:
```bash
node -e "require('fs').readFileSync('src/styles/tokens.css', 'utf-8')"
```

Expected: no error.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Add Lattice tokens and Starlight variable bridge"
```

---

## Task 4: Wire fonts.css + tokens.css into astro.config.mjs

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Read the current config**

Open `astro.config.mjs`. The current `customCss` line reads:

```js
customCss: ["./src/styles/custom.css"],
```

- [ ] **Step 2: Replace with**

```js
customCss: [
  "./src/styles/fonts.css",
  "./src/styles/tokens.css",
  "./src/styles/custom.css",
],
```

**Order matters.** Fonts first (so `@font-face` is registered before anything uses them), tokens next (so component styles can reference `--accent` etc), custom.css last (so component-level overrides win against tokens.css).

- [ ] **Step 3: Restart dev server**

The dev server may not pick up `astro.config.mjs` changes via HMR. Stop and restart:
```bash
# In the dev terminal: Ctrl-C, then:
bun run dev
```

- [ ] **Step 4: Visual verification**

Open `http://localhost:4321/getting-started/`. Expected changes vs baseline:
- Background is now slate (`#1c2230`) instead of near-black
- Body text is IBM Plex Sans (open DevTools → Computed → `font-family` on `body`; should list "IBM Plex Sans" first)
- Sidebar background is `#161b27`
- Inline code background is `#161b27` with text in `--accent` colour `#65c2e7`
- Subtle 24px dot grid visible on background (squint or zoom in)
- Toggle theme: light mode swaps to `#f4f6fa` background

If any of these aren't right, inspect the failing surface in DevTools and read which `--sl-color-*` variable resolves to what. Fix in `tokens.css` before continuing.

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs
git commit -m "Wire fonts and tokens into Starlight customCss chain"
```

---

## Task 5: Restyle headings

**Files:**
- Modify: `src/styles/tokens.css` (append a new section)

- [ ] **Step 1: Append heading styles to tokens.css**

Add to the bottom of `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   5. Headings — Commit Mono, weight 600, blinking caret on H1
   ----------------------------------------------------------- */
.sl-markdown-content h1,
.sl-markdown-content h2,
.sl-markdown-content h3,
.sl-markdown-content h4,
h1, h2, h3 {
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: -0.015em;
  color: var(--text);
}

.sl-markdown-content h1, h1 {
  font-size: var(--t-2xl);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.sl-markdown-content h2, h2 {
  font-size: var(--t-xl);
  line-height: 1.2;
  margin-top: 3rem;
}

.sl-markdown-content h3, h3 {
  font-size: var(--t-md);
  margin-top: 2.25rem;
}

/* Blinking caret on H1 — only inside markdown content (avoid sidebar/nav h1s) */
.sl-markdown-content h1::after,
main h1:not(.no-caret)::after {
  content: "▍";
  color: var(--accent);
  margin-left: 0.3rem;
  display: inline-block;
  transform: translateY(-0.05em);
  animation: caret-blink 1.2s steps(2, start) infinite;
}

@keyframes caret-blink {
  to { visibility: hidden; }
}

/* Respect reduced-motion preference */
@media (prefers-reduced-motion: reduce) {
  main h1::after,
  .sl-markdown-content h1::after {
    animation: none;
  }
}
```

- [ ] **Step 2: Visual verification**

Reload `http://localhost:4321/getting-started/`. Expected:
- The H1 "Getting Started" renders in Commit Mono, weight 600
- A blinking `▍` caret appears after the H1, in `--accent` colour
- H2s in the page (e.g. "What You'll Learn", "1. Generate Configuration") render in Commit Mono 600
- No caret on H2 or H3
- Open `http://localhost:4321/` (homepage) — caret should also appear on the homepage hero H1

If the caret appears on the wrong H1 (e.g. inside a card or sidebar), narrow the selector by removing `main h1:not(.no-caret)` and keeping only `.sl-markdown-content h1`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle headings — Commit Mono 600, blinking caret on H1"
```

---

## Task 6: Restyle inline code and code blocks

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Append code styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   6. Code — inline + block
   ----------------------------------------------------------- */
.sl-markdown-content :not(pre) > code {
  font-family: var(--font-mono);
  font-size: 0.85em;
  color: var(--accent);
  background: var(--surface);
  border: 1px solid var(--border-soft);
  padding: 1px 5px;
  border-radius: var(--r-sm);
}

.sl-markdown-content pre {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--r-md);
}

.sl-markdown-content pre code {
  font-family: var(--font-mono);
  font-size: var(--t-sm);
  line-height: 1.65;
  background: transparent;
  border: 0;
  padding: 0.9rem 1rem;
}

/* starlight-theme-nova Code component frame — match the radius */
.expressive-code, .ec-frame, .ec-wrap, figure.expressive-code {
  border-radius: var(--r-md) !important;
}
```

Note: the `!important` on `.expressive-code` is the one exception to our no-`!important` rule. `starlight-theme-nova`'s Code component sets its own radius inline-ish; we override it once at this seam. Document it inline so future readers know it's intentional.

- [ ] **Step 2: Visual verification**

Reload `http://localhost:4321/getting-started/`. Expected:
- Inline `code` in body paragraphs renders in Commit Mono, `--accent` colour, on `--surface` background, with a 1px `--border-soft` outline and 2px radius
- Fenced code blocks (the `npx unentropy init` snippet, the npm/bun commands) render with `--surface-card` background, 1px border, 3px radius
- Body of code blocks uses Commit Mono 400

Visit homepage `http://localhost:4321/`. The Shiki-rendered install block should pick up the new background and radius. If it doesn't, inspect the `.expressive-code` element in DevTools and adjust the selector.

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle inline code and fenced code blocks"
```

---

## Task 7: Restyle asides (:::tip / :::caution / :::danger / :::note)

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Inspect a real aside in DevTools to confirm class names**

Open `http://localhost:4321/getting-started/`. The page has a `:::tip[Using an AI coding agent?]` block. Inspect it. Confirm the wrapping element uses class `starlight-aside` and a variant class like `starlight-aside--tip`. Note the inner `.starlight-aside__title` and `.starlight-aside__content` selectors.

If the class names differ in your Starlight 0.39 version, use the actual class names below.

- [ ] **Step 2: Append aside styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   7. Asides — :::tip / :::caution / :::danger / :::note
   ----------------------------------------------------------- */
.starlight-aside {
  padding: 0.9rem 1rem;
  border: 1px solid var(--border);
  border-left-width: 2px;
  background: var(--surface);
  border-radius: var(--r-md);
  font-size: var(--t-sm);
  line-height: 1.55;
}

.starlight-aside__title {
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.starlight-aside--tip     { border-left-color: var(--accent); }
.starlight-aside--tip .starlight-aside__title { color: var(--accent); }

.starlight-aside--caution { border-left-color: var(--warn); }
.starlight-aside--caution .starlight-aside__title { color: var(--warn); }

.starlight-aside--danger  { border-left-color: var(--down); }
.starlight-aside--danger .starlight-aside__title { color: var(--down); }

.starlight-aside--note    { border-left-color: var(--text-dim); }
.starlight-aside--note .starlight-aside__title { color: var(--text-dim); }
```

- [ ] **Step 3: Visual verification**

Reload `http://localhost:4321/getting-started/`. The tip aside should now have:
- `--surface` background
- 1px hairline border with `--accent`-coloured 2px left edge
- Mono uppercase title in `--accent`, tracked +0.14em

Visit other doc pages to spot asides of other variants. If you can't find caution/danger/note examples, create temporary ones in `src/content/docs/troubleshooting.md` to verify, then revert.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle asides — mono uppercase titles, semantic left borders"
```

---

## Task 8: Restyle Starlight badges

**Files:**
- Modify: `src/styles/tokens.css`

The homepage uses `<Badge text="Beta" variant="caution" />`. `starlight-theme-nova` provides default badge CSS; we want to replace it with our Lattice badge treatment.

- [ ] **Step 1: Inspect badge in DevTools**

Open `http://localhost:4321/`. Inspect the "Beta" badge near the top of the content. Note the element classes (likely `sl-badge` plus a variant class).

- [ ] **Step 2: Append badge styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   8. Badges
   ----------------------------------------------------------- */
.sl-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 1px 6px;
  border: 1px solid var(--border);
  color: var(--text-dim);
  background: var(--surface);
  line-height: 1.5;
  border-radius: var(--r-sm);
  font-weight: 400;
}

.sl-badge::before {
  content: "";
  width: 5px;
  height: 5px;
  background: var(--text-muted);
  display: inline-block;
  border-radius: var(--r-sm);
}

.sl-badge.note,
.sl-badge.default {
  /* default treatment — already covered above */
}

.sl-badge.tip,
.sl-badge.success {
  color: var(--up);
  border-color: color-mix(in srgb, var(--up) 40%, transparent);
  background: color-mix(in srgb, var(--up) 8%, transparent);
}
.sl-badge.tip::before,
.sl-badge.success::before { background: var(--up); }

.sl-badge.caution {
  color: var(--warn);
  border-color: color-mix(in srgb, var(--warn) 40%, transparent);
  background: color-mix(in srgb, var(--warn) 8%, transparent);
}
.sl-badge.caution::before { background: var(--warn); }

.sl-badge.danger {
  color: var(--down);
  border-color: color-mix(in srgb, var(--down) 40%, transparent);
  background: color-mix(in srgb, var(--down) 8%, transparent);
}
.sl-badge.danger::before { background: var(--down); }
```

- [ ] **Step 3: Verify class names match real DOM**

If Starlight's badge uses a different class structure (e.g. `--variant-caution` instead of `.caution`), update the selectors to match. Use DevTools as source of truth.

- [ ] **Step 4: Visual verification**

Homepage: the "Beta" badge should now read `● BETA` in mono uppercase with `--warn` colour. Check the SDD blog post tags too if visible.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle Starlight badges with mono semantic variants"
```

---

## Task 9: Add button classes (.btn, .btn--ghost)

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Append button styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   9. Buttons
   ----------------------------------------------------------- */
.btn {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0.5rem 0.95rem;
  background: var(--accent);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  border-radius: var(--r-md);
  border: 1px solid var(--accent);
  cursor: pointer;
  transition: filter 160ms ease;
}
.btn:hover { filter: brightness(1.1); text-decoration: none; }

.btn--ghost {
  background: transparent;
  color: var(--accent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
}
.btn--ghost:hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}

/* Light mode — button text needs explicit white for accent bg */
:root[data-theme="light"] .btn {
  color: #ffffff;
}
```

These are used by `src/pages/index.astro` later. We define them now so they're available.

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Add .btn and .btn--ghost utility classes"
```

---

## Task 10: Restyle tables

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Append table styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   10. Tables
   ----------------------------------------------------------- */
.sl-markdown-content table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--t-sm);
  font-variant-numeric: tabular-nums;
}

.sl-markdown-content th,
.sl-markdown-content td {
  text-align: left;
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--border-soft);
}

.sl-markdown-content th {
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  font-weight: 600;
  background: var(--surface);
  border-bottom-color: var(--border);
}
```

- [ ] **Step 2: Visual verification**

Visit `http://localhost:4321/reference/cli/` (or another reference page that has tables). Expected:
- Headers in mono uppercase, `--text-muted`, on `--surface` background
- Rows separated by `--border-soft` hairlines
- Body text in IBM Plex Sans

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle markdown tables with mono headers and hairline rows"
```

---

## Task 11: Restyle sidebar

**Files:**
- Modify: `src/styles/tokens.css`

The Starlight sidebar uses several selectors. We restyle the section labels (eyebrow), the link list, and the active state.

- [ ] **Step 1: Inspect sidebar DOM in DevTools**

Open any doc page. Inspect the sidebar. Note: Starlight typically uses `<details>` for group headers and `<a>` for links. The active link gets `[aria-current="page"]`.

- [ ] **Step 2: Append sidebar styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   11. Sidebar
   ----------------------------------------------------------- */
starlight-menu-button,
.sidebar-content {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
}

.sidebar-content nav > ul > li > details > summary,
.sidebar-content nav > ul > li > span {
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  font-weight: 600;
}

.sidebar-content nav a {
  color: var(--text-dim);
  border-left: 1px solid transparent;
  padding-left: 0.5rem;
}

.sidebar-content nav a:hover {
  color: var(--text);
}

.sidebar-content nav a[aria-current="page"] {
  color: var(--text);
  border-left-color: var(--accent);
  background: var(--surface);
}
```

- [ ] **Step 3: Verify in browser**

Open `http://localhost:4321/getting-started/`. Sidebar should now show:
- Section labels in mono uppercase
- Links in mono, dim by default
- Active page link has `--accent` left border + `--surface` background

If the exact selectors don't match Starlight 0.39, adjust to whatever DevTools shows. Don't paper over with `!important`.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle sidebar with mono uppercase sections and accent active state"
```

---

## Task 12: Restyle TOC (right sidebar)

**Files:**
- Modify: `src/styles/tokens.css`

- [ ] **Step 1: Inspect TOC**

Open a long doc page (`http://localhost:4321/guides/storage/` or similar) and inspect the right-side TOC. Common Starlight selectors: `starlight-toc`, `.right-sidebar`, or `nav#starlight-toc`.

- [ ] **Step 2: Append TOC styles**

Add to `src/styles/tokens.css`:

```css
/* -----------------------------------------------------------
   12. Table of contents (right sidebar)
   ----------------------------------------------------------- */
.right-sidebar,
starlight-toc {
  font-family: var(--font-mono);
  font-size: var(--t-xs);
}

.right-sidebar nav a,
starlight-toc a {
  color: var(--text-dim);
  border-left: 1px solid var(--border);
  padding: 0.25rem 0 0.25rem 0.75rem;
  display: block;
}

.right-sidebar nav a:hover,
starlight-toc a:hover {
  color: var(--text);
}

.right-sidebar nav a[aria-current="true"],
starlight-toc a[aria-current="true"] {
  color: var(--text);
  border-left-color: var(--accent);
}
```

- [ ] **Step 3: Verify in browser**

TOC entries should read in mono, with vertical hairlines on the left and an `--accent` indicator on the active section.

- [ ] **Step 4: Commit**

```bash
git add src/styles/tokens.css
git commit -m "Restyle right-sidebar TOC with mono and accent active indicator"
```

---

## Task 13: HomepageLayout — chrome restyle

**Files:**
- Modify: `src/layouts/HomepageLayout.astro`

The home layout has its own `<header>` and `<footer>` styled inline. Update them to use the new tokens. Keep the existing logo `<img>` (don't introduce a brand mark — see spec §4 note on logo).

- [ ] **Step 1: Read current HomepageLayout.astro**

Open `src/layouts/HomepageLayout.astro`. Identify the `<style>` block at the bottom (lines ~123-210). The relevant rules are: `.home-header`, `.home-header-inner`, `.site-title img`, `.home-nav`, `.nav-link`, `.site-footer`, `.footer-content`, `.footer-copyright`.

- [ ] **Step 2: Replace the `<style>` block**

Replace lines 123-210 (the entire `<style>` block) with:

```astro
<style>
  .home-header {
    display: flex;
    justify-content: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-soft);
    background: rgba(28, 34, 48, 0.85);
    backdrop-filter: saturate(140%) blur(8px);
    -webkit-backdrop-filter: saturate(140%) blur(8px);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  :global([data-theme="light"]) .home-header {
    background: rgba(244, 246, 250, 0.85);
  }

  .home-header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1280px;
  }

  .site-title img {
    height: 1.75rem;
    width: auto;
  }

  .logo-full { display: block; }
  .logo-icon { display: none; }

  :global([data-theme="light"]) .site-title img {
    filter: brightness(0);
  }
  :global([data-theme="dark"]) .site-title img {
    filter: brightness(0) invert(1);
  }

  .home-nav {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    font-family: var(--font-mono);
    font-size: var(--t-xs);
  }

  .nav-link {
    color: var(--text-dim);
    text-decoration: none;
    padding: 0.4rem 0;
    border-bottom: 1px solid transparent;
    white-space: nowrap;
  }

  .nav-link:hover {
    color: var(--text);
    border-bottom-color: var(--accent);
  }

  /* Mobile */
  @media (max-width: 600px) {
    .logo-full { display: none; }
    .logo-icon { display: block; }
    .home-nav { gap: 0.75rem; }
  }

  /* Footer */
  .site-footer {
    border-top: 1px solid var(--border-soft);
    margin-top: 5rem;
    background: var(--surface);
  }

  .footer-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1.5rem 1.25rem;
    color: var(--text-dim);
    font-size: var(--t-sm);
  }

  .footer-copyright {
    color: var(--text-muted);
    font-size: var(--t-xs);
    font-family: var(--font-mono);
  }

  /* Status bar — added in next task */
</style>
```

- [ ] **Step 3: Verify in browser**

Reload `http://localhost:4321/`. Expected:
- Sticky header with `--surface` background and blurred backdrop
- Logo still works (unchanged filter rules)
- Nav links "Blog" / "Documentation" in mono, dim by default; underline `--accent` on hover
- Footer has `--surface` background and 1px hairline above

- [ ] **Step 4: Commit**

```bash
git add src/layouts/HomepageLayout.astro
git commit -m "Restyle HomepageLayout chrome with Lattice tokens and mono nav"
```

---

## Task 14: HomepageLayout — add status bar to footer

**Files:**
- Modify: `src/layouts/HomepageLayout.astro`

- [ ] **Step 1: Read package.json for version**

```bash
grep '"version"' package.json
```

Note the version string (e.g. `"0.0.1"`). We hardcode it for v1; wiring to a build-time variable is deferred.

- [ ] **Step 2: Update the footer markup**

In `src/layouts/HomepageLayout.astro`, find the `<footer>` element near the bottom (around line 115). Replace it with:

```astro
<footer class="site-footer">
  <div class="footer-content">
    <div class="footer-copyright">&copy;{currentYear} Unentropy</div>
  </div>
  <div class="status-bar">
    <div class="status-bar-inner">
      <span class="block">█▍</span>
      <span>v 0.0.1</span>
      <span class="sep">│</span>
      <span>github.com/unentropy/unentropy</span>
      <span class="sep">│</span>
      <span>status <span class="status-up">● operational</span></span>
      <span class="right">© {currentYear} unentropy</span>
    </div>
  </div>
</footer>
```

Update the literal `0.0.1` to whatever `package.json` shows.

- [ ] **Step 3: Add status bar styles to the same `<style>` block**

In the same `<style>` block, append:

```css
.status-bar {
  border-top: 1px solid var(--border-soft);
  background: var(--surface-card);
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}
.status-bar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0.6rem 1.5rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.status-bar .block { color: var(--up); letter-spacing: 0; }
.status-bar .sep   { color: var(--border); }
.status-bar .status-up { color: var(--up); }
.status-bar .right { margin-left: auto; }

@media (max-width: 600px) {
  .status-bar .right { margin-left: 0; }
}
```

- [ ] **Step 4: Verify**

Scroll to the bottom of `http://localhost:4321/`. Status bar with `█▍ v 0.0.1 │ github.com/... │ ● operational │ © 2026 unentropy` should appear, in mono uppercase.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/HomepageLayout.astro
git commit -m "Add status bar to homepage footer"
```

---

## Task 15: BlogLayout — chrome restyle + status bar

**Files:**
- Modify: `src/layouts/BlogLayout.astro`

The blog layout is structurally identical to the homepage layout, with one difference: it doesn't share the Starlight ContentPanel. Apply the same restyle.

- [ ] **Step 1: Read current BlogLayout.astro**

Note the existing `<style>` block (lines ~74-179). Selectors: `.blog-header`, `.blog-header-inner`, `.site-title img`, `.blog-nav`, `.nav-link`, `.blog-main`, `.blog-content`, `.blog-footer`, `.footer-content`, `.footer-copyright`.

- [ ] **Step 2: Replace the `<style>` block**

Use the same patterns as the homepage layout. Replace lines 74-179 with:

```astro
<style>
  .blog-header {
    display: flex;
    justify-content: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--border-soft);
    background: rgba(28, 34, 48, 0.85);
    backdrop-filter: saturate(140%) blur(8px);
    -webkit-backdrop-filter: saturate(140%) blur(8px);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  :global([data-theme="light"]) .blog-header {
    background: rgba(244, 246, 250, 0.85);
  }

  .blog-header-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1280px;
  }

  .site-title img { height: 1.75rem; width: auto; }
  .logo-full { display: block; }
  .logo-icon { display: none; }

  :global([data-theme="light"]) .site-title img { filter: brightness(0); }
  :global([data-theme="dark"]) .site-title img  { filter: brightness(0) invert(1); }

  .blog-nav {
    display: flex;
    gap: 1.25rem;
    align-items: center;
    font-family: var(--font-mono);
    font-size: var(--t-xs);
  }

  .nav-link {
    color: var(--text-dim);
    text-decoration: none;
    padding: 0.4rem 0;
    border-bottom: 1px solid transparent;
    white-space: nowrap;
  }
  .nav-link:hover {
    color: var(--text);
    border-bottom-color: var(--accent);
  }

  @media (max-width: 600px) {
    .logo-full { display: none; }
    .logo-icon { display: block; }
    .blog-nav { gap: 0.75rem; }
  }

  .blog-main { min-height: calc(100vh - 200px); }

  .blog-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .blog-footer {
    border-top: 1px solid var(--border-soft);
    margin-top: 5rem;
    background: var(--surface);
  }

  .footer-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem 1.5rem 1.25rem;
    color: var(--text-dim);
    font-size: var(--t-sm);
  }

  .footer-copyright {
    color: var(--text-muted);
    font-size: var(--t-xs);
    font-family: var(--font-mono);
  }

  .status-bar {
    border-top: 1px solid var(--border-soft);
    background: var(--surface-card);
    font-family: var(--font-mono);
    font-size: var(--t-eyebrow);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--text-muted);
  }
  .status-bar-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0.6rem 1.5rem;
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
  }
  .status-bar .block { color: var(--up); letter-spacing: 0; }
  .status-bar .sep   { color: var(--border); }
  .status-bar .status-up { color: var(--up); }
  .status-bar .right { margin-left: auto; }
  @media (max-width: 600px) {
    .status-bar .right { margin-left: 0; }
  }
</style>
```

- [ ] **Step 3: Update the footer markup**

Find the `<footer>` element near the bottom of `BlogLayout.astro`. Replace with:

```astro
<footer class="blog-footer">
  <div class="footer-content">
    <div class="footer-copyright">&copy;{currentYear} Unentropy</div>
  </div>
  <div class="status-bar">
    <div class="status-bar-inner">
      <span class="block">█▍</span>
      <span>v 0.0.1</span>
      <span class="sep">│</span>
      <span>github.com/unentropy/unentropy</span>
      <span class="sep">│</span>
      <span>status <span class="status-up">● operational</span></span>
      <span class="right">© {currentYear} unentropy</span>
    </div>
  </div>
</footer>
```

Update the version literal to match `package.json`.

- [ ] **Step 4: Verify**

Visit `http://localhost:4321/blog/`. Expected: matching header/footer/status bar with the homepage. Click into a blog post (`hello-world` or `why-you-should-pay-attention-to-sdd`); verify the same chrome appears.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BlogLayout.astro
git commit -m "Restyle BlogLayout chrome and add status bar"
```

---

## Task 16: Logo SVG audit

**Files:**
- Verify (no code change unless audit fails): `src/assets/logo.svg`, `src/assets/logo-icon.svg`, `public/logo.svg`, `public/favicon.svg`

The user has already modified these SVGs (visible as `M` in the initial `git status`). They've not been committed. The current `brightness(0) invert(1)` filter assumes mono-fill SVGs.

- [ ] **Step 1: Inspect each SVG**

```bash
head -20 src/assets/logo.svg
head -20 src/assets/logo-icon.svg
head -20 public/logo.svg
head -20 public/favicon.svg
```

Look for `<path fill="..."`, `<g fill="..."`, or inline `style` attributes with colours. If the SVGs use only `currentColor` or one explicit colour, the filter approach still works.

- [ ] **Step 2: Visual check on dark and light themes**

Open `http://localhost:4321/`. Logo should read clearly on `#1c2230` (dark) and `#f4f6fa` (light). If the logo looks too dim or muddy on the new background, two options:
   - **Option A** (preferred — preserve filter): adjust filter to `brightness(0) invert(0.95)` for dark mode, which gives `#cad3e0` (`--text`) instead of pure white.
   - **Option B**: edit the SVG `fill` attributes to use `currentColor` and set the parent `color: var(--text)`. Drops the filter entirely.

If Option A is chosen, update `src/styles/custom.css` (covered in Task 19).

- [ ] **Step 3: Decide and document**

If no change needed, skip the next step. Otherwise, implement the chosen option.

- [ ] **Step 4: Commit (if changes)**

```bash
git add src/assets/ public/
git commit -m "Adjust logo for new background palette"
```

If no changes are needed, do NOT make an empty commit.

---

## Task 17: Restyle blog components

**Files:**
- Modify: `src/components/blog/PostCard.astro`
- Modify: `src/components/blog/PostMeta.astro`
- Modify: `src/components/blog/PrevNext.astro`
- Modify: `src/components/blog/TagList.astro`

Each of these has its styles in `src/styles/blog.css`. Update that single file rather than the individual `.astro` files.

- [ ] **Step 1: Read current blog.css**

Open `src/styles/blog.css`. Note the existing rules (lines 1-302) that use `--sl-color-*` variables.

- [ ] **Step 2: Replace blog.css contents**

Replace the entire file with:

```css
/* Blog-specific styles — uses Lattice tokens from tokens.css */

/* Post metadata */
.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  margin-bottom: 1.5rem;
}

.post-meta-separator { color: var(--border); }

/* Author */
.post-author {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
}

.post-author-picture {
  width: 20px;
  height: 20px;
  border-radius: var(--r-sm);
  object-fit: cover;
}

.post-author-name {
  color: var(--text-muted);
  text-decoration: none;
}

.post-author-name:hover { color: var(--accent); }

/* Tags */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.tag {
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 1px 6px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-dim);
  text-decoration: none;
  border-radius: var(--r-sm);
}

.tag:hover {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 40%, transparent);
}

/* Cover image */
.cover-image { margin-bottom: 1.5rem; }
.cover-image img {
  width: 100%;
  height: auto;
  border-radius: var(--r-md);
}

.cover-image-dark { display: block; }
.cover-image-light { display: none; }

[data-theme="light"] .cover-image-dark { display: none; }
[data-theme="light"] .cover-image-light { display: block; }

/* Post card */
.post-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid var(--border-soft);
}

.post-card:last-child { border-bottom: none; }

.post-card-thumbnail {
  flex-shrink: 0;
  width: 100px;
  height: 66px;
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--surface);
}

.post-card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-card-content { flex: 1; min-width: 0; }

.post-card-title {
  font-family: var(--font-mono);
  font-size: var(--t-md);
  font-weight: 600;
  margin: 0 0 0.4rem;
  letter-spacing: -0.01em;
}

.post-card-title a {
  color: var(--text);
  text-decoration: none;
}

.post-card-title a:hover { color: var(--accent); }

.post-card-excerpt {
  color: var(--text-dim);
  font-size: var(--t-sm);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-card-meta { margin-top: 0.5rem; }
.post-card-meta .post-meta {
  font-size: var(--t-eyebrow);
  margin-bottom: 0;
}

/* Featured post */
.featured-post {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border);
}

.featured-post-title {
  font-family: var(--font-mono);
  font-size: var(--t-xl);
  font-weight: 600;
  margin: 0 0 0.75rem;
  letter-spacing: -0.015em;
}

.featured-post-title a {
  color: var(--text);
  text-decoration: none;
}

.featured-post-title a:hover { color: var(--accent); }

.featured-post-excerpt {
  color: var(--text-dim);
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.read-more {
  color: var(--accent);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: var(--t-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.read-more:hover { text-decoration: underline; }

/* Prev/Next navigation */
.prev-next-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.prev-next-link {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.85rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: var(--r-md);
  text-decoration: none;
}

.prev-next-link:hover {
  background: var(--surface-card);
  border-color: var(--border);
}

.prev-next-link.next { text-align: right; }

.prev-next-label {
  font-family: var(--font-mono);
  font-size: var(--t-eyebrow);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--text-muted);
}

.prev-next-title {
  font-family: var(--font-mono);
  color: var(--text);
  font-size: var(--t-sm);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.pagination-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  background: var(--surface);
  color: var(--text-dim);
  text-decoration: none;
  border: 1px solid var(--border-soft);
  border-radius: var(--r-sm);
  font-family: var(--font-mono);
  font-size: var(--t-xs);
}

.pagination-link:hover {
  background: var(--surface-card);
  color: var(--text);
  border-color: var(--border);
}

.pagination-link.active {
  background: var(--accent);
  color: var(--bg);
  border-color: var(--accent);
}

.pagination-link.disabled {
  opacity: 0.4;
  pointer-events: none;
}

/* Page header */
.blog-page-title { margin-bottom: 1.5rem; }

/* Empty state */
.blog-empty {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* Responsive */
@media (max-width: 480px) {
  .post-card { flex-direction: column; }
  .post-card-thumbnail { width: 100%; height: 140px; }
  .prev-next-nav { grid-template-columns: 1fr; }
  .prev-next-link.next { text-align: left; }
}
```

- [ ] **Step 3: Visual verification**

Visit `http://localhost:4321/blog/`. Expected:
- Post cards have mono titles, dim excerpts, hairline dividers
- Tags render as bordered uppercase mono pills
- Featured post (if visible) has a mono H1-style title

Click into a blog post. Prev/next at the bottom should be card-like with mono labels.

- [ ] **Step 4: Commit**

```bash
git add src/styles/blog.css
git commit -m "Restyle blog components with Lattice tokens and mono chrome"
```

---

## Task 18: Update homepage hero styles (token-only)

**Files:**
- Modify: `src/pages/index.astro`

The spec defers homepage hero **layout** changes. Apply tokens only — colours, fonts, button styles.

- [ ] **Step 1: Read the existing `<style>` block in index.astro**

Lines ~83-161 contain the hero styling. Selectors used: `.hero`, `.hero-content`, `.hero-title`, `.hero-tagline`, `.hero-code`, `.demo-video`, `.demo-video video`, `.homepage-content`, `.homepage-content h2`, `.homepage-content ul`, `.docs-cta`, `.docs-cta a`.

- [ ] **Step 2: Replace the `<style>` block**

Replace lines 83-161 with:

```astro
<style>
  .hero {
    padding: 4rem 1rem 2rem;
    text-align: center;
  }

  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }

  .hero-title {
    font-family: var(--font-mono);
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 600;
    line-height: 1.15;
    margin: 0 0 1rem;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .hero-tagline {
    font-size: clamp(1.1rem, 2.5vw, 1.35rem);
    color: var(--text-dim);
    margin: 0 0 2rem;
  }

  .hero-code {
    max-width: 680px;
    margin: 0 auto;
    text-align: left;
  }

  .demo-video {
    display: flex;
    justify-content: center;
    padding: 0 1rem 3rem;
  }

  .demo-video video {
    width: 70%;
    max-width: 840px;
    height: auto;
    border-radius: var(--r-md);
    border: 1px solid var(--border);
  }

  @media (max-width: 768px) {
    .demo-video video { width: 100%; }
  }

  .homepage-content {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .homepage-content h2 {
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  .homepage-content ul {
    margin-bottom: 2rem;
  }

  .docs-cta {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .docs-cta a {
    font-family: var(--font-mono);
    font-size: var(--t-xs);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.55rem 1rem;
    background: var(--accent);
    color: var(--bg);
    text-decoration: none;
    font-weight: 600;
    border-radius: var(--r-md);
    display: inline-block;
  }

  .docs-cta a:hover {
    filter: brightness(1.1);
  }

  :global([data-theme="light"]) .docs-cta a {
    color: #ffffff;
  }
</style>
```

The hero H1 will pick up the blinking caret from Task 5's global heading rule — verify that fires.

- [ ] **Step 3: Verify**

Reload `http://localhost:4321/`. Expected:
- "Your code under your control" headline in Commit Mono 600 with blinking `▍` caret
- Tagline in `--text-dim`
- "Get started →" CTA renders as a mono uppercase filled button
- Demo video has a 1px hairline border and 3px radius

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Apply Lattice tokens to homepage hero and CTA"
```

---

## Task 19: Clean up custom.css

**Files:**
- Modify: `src/styles/custom.css`

The original `custom.css` contains theme-gallery rules used by `src/content/docs/guides/reports.mdx`. These reference `--sl-color-*` tokens that now resolve to Lattice tokens — they probably look OK, but verify and update where needed.

- [ ] **Step 1: Read current custom.css**

Open the file. The body of it is the `.theme-gallery` rules from lines 12-73, plus the logo-filter rules from lines 4-10.

- [ ] **Step 2: Update — replace the entire file contents with**

```css
/* Custom styles for Unentropy docs */

/* Note: tokens.css and fonts.css are loaded before this file via astro.config.mjs */

/* -----------------------------------------------------------
   Logo filter — for any place using <img> with mono SVG content.
   The two layout files duplicate this rule because Astro's scoped
   styles don't reach <img> in slots. Keep this as a backup/global.
   ----------------------------------------------------------- */
[data-theme="light"] .site-title img {
  filter: brightness(0);
}
[data-theme="dark"] .site-title img {
  filter: brightness(0) invert(1);
}

/* -----------------------------------------------------------
   Theme gallery (used by src/content/docs/guides/reports.mdx)
   ----------------------------------------------------------- */
.theme-gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin: 1.5rem 0 1.75rem;
}

.theme-gallery__card {
  display: grid;
  grid-template-rows: auto auto;
  gap: 0.625rem;
  padding: 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--r-md);
  background: var(--surface);
  transition:
    border-color 160ms ease,
    transform 160ms ease;
}

.theme-gallery__card:hover {
  border-color: var(--text-muted);
}

.theme-gallery__preview {
  position: relative;
  display: block;
  line-height: 0;
  border-radius: var(--r-sm);
  overflow: hidden;
  aspect-ratio: 280 / 180;
  background: var(--surface-card);
}

.theme-gallery__preview img {
  display: block;
  width: 100%;
  height: 100%;
}

.theme-gallery__name {
  font-family: var(--font-mono);
  font-size: var(--t-sm);
  font-weight: 600;
  color: var(--text);
  margin: 0;
  padding: 0 0.125rem;
  line-height: 1.4;
  letter-spacing: 0;
}

.theme-gallery__hint {
  font-weight: 400;
  color: var(--text-muted);
}

@media (max-width: 36rem) {
  .theme-gallery {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Verify theme gallery still works**

Visit `http://localhost:4321/guides/reports/`. The theme-gallery cards should render with the new tokens.

- [ ] **Step 4: Commit**

```bash
git add src/styles/custom.css
git commit -m "Update custom.css to use Lattice tokens"
```

---

## Task 20: Full-site QA pass

**Files:** None — verification only

Run a structured walk through every page type in both themes.

- [ ] **Step 1: Build check**

```bash
bun run build
```

Expected: completes without errors. Note any warnings — they may be selectors that don't resolve.

- [ ] **Step 2: Dark theme walk**

With the dev server running, visit each of the following and confirm visually:

| URL | Check |
|---|---|
| `/` | Hero, blinking caret, code block, badge, CTA button, status bar in footer |
| `/getting-started/` | Sidebar mono section labels, H1 caret, asides (tip), code blocks, tables |
| `/troubleshooting/` | Asides, body type, heading rhythm |
| `/guides/metrics/` | Code blocks, inline code, lists |
| `/guides/quality-gates/` | Tables, code blocks |
| `/guides/reports/` | Theme gallery cards |
| `/guides/storage/` | Long-page TOC on the right (mono, active indicator) |
| `/reference/cli/` | Tables with mono headers |
| `/reference/actions/` | YAML code block rendering |
| `/reference/config/` | Reference table layout |
| `/blog/` | Post cards, hairline dividers, tag pills |
| `/blog/hello-world/` | Blog post chrome (header, footer, status bar), body type, prev/next |
| `/blog/why-you-should-pay-attention-to-sdd/` | Cover image, post body |

- [ ] **Step 3: Light theme walk**

Toggle to light theme using the theme switcher. Walk the same pages. Spot-check:
- Backgrounds are `--bg` (`#f4f6fa`)
- Code blocks are white (`--surface-card`), elevated
- Accent is `--accent` (`#2c7ea2`), readable on white
- Filled buttons have white text (look at the homepage CTA)
- Tables: headers on `--surface`, rows separated by `--border-soft`

- [ ] **Step 4: Mobile pass**

In DevTools, switch to mobile viewport (375px or iPhone preset).
- Sidebar collapses to the menu drawer (Starlight default)
- Header navigation reduces gap
- Logo switches to icon-only at <600px
- Status bar wraps gracefully (no horizontal scroll)
- TOC hides on narrow viewports (Starlight default)

- [ ] **Step 5: Reduced-motion check**

In Chrome DevTools → Rendering → Emulate CSS media → `prefers-reduced-motion: reduce`. Reload homepage. Expected: H1 caret no longer blinks.

- [ ] **Step 6: Console errors**

Open DevTools Console on every page above. Expected: no errors, no FOUC warnings, no font-load failures.

- [ ] **Step 7: Document any deltas**

If anything in the walk above didn't match, take a short note. Two outcomes:
- **Trivial fix** — adjust the appropriate `tokens.css` rule, verify, commit.
- **Non-trivial issue** — log it in a follow-up `docs/superpowers/specs/2026-05-25-design-system-followups.md` (or open a GitHub issue) and move on. Don't expand scope mid-plan.

- [ ] **Step 8: Final commit if anything changed**

If steps 7's "trivial fix" happened, commit the resulting tokens.css change as:

```bash
git add src/styles/tokens.css
git commit -m "QA fixes from design system walkthrough"
```

Otherwise, no commit needed.

---

## Done

The site now ships the Lattice design system. If you cloned a branch in pre-flight, the work lives on `design-system-overhaul` and is ready for PR.

```bash
git log --oneline main..HEAD
```

Should show ~17–20 commits, each scoped to one task.

### Out of scope (next plan)

These were explicitly deferred (spec §5.5) or removed during planning:

- Eyebrow indices on docs pages (`02 · 04 · GUIDES`) — requires per-page frontmatter
- ASCII separator (`─── # ───`) at section breaks — requires remark plugin or aside variant
- Mono breadcrumb (`~/docs/guides/storage`) — requires opting out of Starlight's title layout
- `$`-prompt prefix in `bash` code blocks — requires Shiki transformer; out of scope for v1
- Brand-mark `■` square in header — would be redundant with the existing wordmark logo; keep logo as-is for v1
- Shiki syntax theme matched to Lattice palette
- Homepage hero layout redesign
- Wiring status-bar version/SHA to `package.json` and build env

Each of these is its own brainstorm → spec → plan cycle.
