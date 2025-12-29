# Design: Add Blog

## Context
Adding a custom blog to the Unentropy documentation website. The blog must be compatible with the starlight-blog plugin's frontmatter schema to allow potential future migration.

### Stakeholders
- Site maintainers (content authors)
- Site visitors (readers)

### Constraints
- Must use SSG only (no server-side rendering)
- Must work with existing starlight-theme-nova
- Must maintain visual consistency with existing site design

## Goals / Non-Goals

### Goals
- Create a functional blog with posts, tags, and pagination
- Support cover images with dark/light variants
- Display author information
- Provide prev/next navigation on posts
- Use schema 100% compatible with starlight-blog plugin

### Non-Goals
- Sidebar integration with Starlight docs (deferred)
- RSS feed (requires site URL configuration, deferred)
- Search integration (deferred)
- Comments system

## Decisions

### 1. Content Organization
**Decision:** Store blog posts in `src/content/blog/` with images alongside posts.

**Rationale:** 
- Keeps related content together
- Easier to manage per-post assets
- Standard Astro content collection pattern

**Alternatives considered:**
- Images in `src/assets/blog/` - Rejected: Separates content from its assets

### 2. Schema Design
**Decision:** Mirror starlight-blog schema exactly.

**Schema fields:**
```typescript
{
  title: z.string(),              // Required
  date: z.date(),                 // Required
  authors: z.union([...]),        // Optional - string ID or inline object
  excerpt: z.string(),            // Optional - for collapsed cards
  tags: z.string().array(),       // Optional
  cover: z.union([...]),          // Optional - single or dark/light
  featured: z.boolean(),          // Optional - for future use
  draft: z.boolean(),             // Optional - exclude from production
  lastUpdated: z.date(),          // Optional
  metrics: z.object({...}),       // Optional - reading time/words
}
```

**Rationale:** Enables seamless migration to starlight-blog if needed later.

### 3. Author System
**Decision:** Define authors in `src/data/authors.ts` file, reference by string ID in frontmatter.

**Example:**
```typescript
// src/data/authors.ts
export const authors = {
  mat: {
    name: "Mat",
    title: "Creator of Unentropy",
    picture: "/authors/mat.jpg",
    url: "https://github.com/mat"
  }
};
```

**Rationale:** 
- Matches plugin's global author configuration
- Single source of truth
- Easy to update across all posts

### 4. Pagination Strategy
**Decision:** Use Astro's built-in `paginate()` function with 10 posts per page.

**URL structure:**
- `/blog` - Page 1
- `/blog/2` - Page 2
- etc.

**Rationale:** Standard Astro pattern, simple implementation.

### 5. Excerpt Handling
**Decision:** Support both explicit excerpt and auto-generated from first paragraph.

**Logic:**
1. If `excerpt` frontmatter exists, use it
2. Else, extract first paragraph from rendered content
3. Truncate to ~200 characters with ellipsis

**Rationale:** Flexibility for authors while providing sensible defaults.

### 6. Blog Index Layout
**Decision:** First post shown in full, subsequent posts collapsed.

**Structure:**
- Featured/latest post: Full cover image, full content preview, prominent styling
- Other posts: Thumbnail, title, excerpt, metadata in card format

**Rationale:** Highlights newest content while keeping page scannable.

### 7. Reading Time Calculation
**Decision:** Calculate from word count (200 words/minute average).

**Formula:** `Math.ceil(wordCount / 200)` minutes

**Rationale:** Simple, matches plugin behavior, no external dependencies.

### 8. Layout Reuse
**Decision:** Create `BlogLayout.astro` based on `HomepageLayout.astro` patterns.

**Shared elements:**
- Header (with Blog nav link added)
- Footer
- Theme provider
- CSS variables

**Rationale:** Visual consistency, code reuse, maintainability.

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Schema divergence from plugin | Migration difficulty | Pin to known plugin version, document schema |
| Styling conflicts with Nova theme | Visual inconsistencies | Use Starlight CSS variables, scoped styles |
| No RSS initially | Reduced discoverability | Document as future enhancement |

## Migration Plan
Not applicable - this is a new capability with no existing data.

## Open Questions
None - all decisions made during planning phase.
