# Change: Add Blog to Documentation Website

## Why
The website needs a blog to share updates, tutorials, and announcements about Unentropy. The blog should be built custom (not using starlight-blog plugin) for more control, while maintaining frontmatter compatibility with the plugin for potential future migration.

## What Changes
- Add new `blog` content collection with plugin-compatible schema
- Create blog index page at `/blog` with pagination
- Create individual post pages at `/blog/[slug]`
- Create tag listing pages at `/blog/tags/[tag]`
- Add blog components (PostCard, PostMeta, CoverImage, PrevNext)
- Add "Blog" link to homepage header navigation
- Add blog-specific styles

## Impact
- Affected specs: blog (new capability)
- Affected code:
  - `src/content.config.ts` - Add blog collection
  - `src/pages/blog/` - New route directory
  - `src/components/blog/` - New component directory
  - `src/layouts/BlogLayout.astro` - New layout
  - `src/layouts/HomepageLayout.astro` - Add Blog nav link
  - `src/styles/blog.css` - New stylesheet
