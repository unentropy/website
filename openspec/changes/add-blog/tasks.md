# Tasks: Add Blog

## 1. Schema & Configuration
- [x] 1.1 Update `src/content.config.ts` to add blog collection with plugin-compatible schema
- [x] 1.2 Create `src/content/blog/` directory
- [x] 1.3 Add sample blog post for testing

## 2. Layouts
- [x] 2.1 Create `src/layouts/BlogLayout.astro` (based on HomepageLayout patterns)
- [x] 2.2 Update `src/layouts/HomepageLayout.astro` to add "Blog" nav link

## 3. Blog Components
- [x] 3.1 Create `src/components/blog/PostMeta.astro` (date, author, tags, reading time)
- [x] 3.2 Create `src/components/blog/CoverImage.astro` (with dark/light mode support)
- [x] 3.3 Create `src/components/blog/PostCard.astro` (collapsed post preview)
- [x] 3.4 Create `src/components/blog/PrevNext.astro` (navigation arrows)
- [x] 3.5 Create `src/components/blog/TagList.astro` (clickable tag badges)

## 4. Blog Pages
- [x] 4.1 Create `src/pages/blog/[...page].astro` (paginated index)
- [x] 4.2 Create `src/pages/blog/[...slug].astro` (individual post)
- [x] 4.3 Create `src/pages/blog/tags/[tag].astro` (posts by tag)

## 5. Styles
- [x] 5.1 Create `src/styles/blog.css` with blog-specific styles

## 6. Author Configuration
- [x] 6.1 Create `src/data/authors.ts` with default author configuration

## 7. Verification
- [x] 7.1 Run `bun build` to verify no errors
- [x] 7.2 Run `bun astro check` for type checking (virtual module errors are expected)
- [x] 7.3 Test all routes manually: /blog, /blog/[slug], /blog/tags/[tag]
- [x] 7.4 Test pagination with multiple posts
- [x] 7.5 Test dark/light mode for cover images
