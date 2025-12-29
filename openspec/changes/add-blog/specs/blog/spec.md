# Blog Capability

## ADDED Requirements

### Requirement: Blog Content Collection
The system SHALL provide a `blog` content collection for storing blog posts as Markdown/MDX files in `src/content/blog/`.

#### Scenario: Valid blog post
- **WHEN** a Markdown file exists in `src/content/blog/` with valid frontmatter containing `title` and `date`
- **THEN** the post SHALL be included in the blog collection
- **AND** all frontmatter fields SHALL be type-validated

#### Scenario: Draft post in production
- **WHEN** a blog post has `draft: true` in frontmatter
- **AND** the site is built for production
- **THEN** the post SHALL NOT be included in the build output

#### Scenario: Draft post in development
- **WHEN** a blog post has `draft: true` in frontmatter
- **AND** the site is running in development mode
- **THEN** the post SHALL be visible for preview

---

### Requirement: Blog Index Page
The system SHALL provide a paginated blog index at `/blog` displaying all published posts sorted by date (newest first).

#### Scenario: First post display
- **WHEN** a user visits `/blog`
- **THEN** the most recent post SHALL be displayed with full cover image, title, metadata, and content excerpt
- **AND** a "Read more" link SHALL navigate to the full post

#### Scenario: Subsequent posts display
- **WHEN** a user visits `/blog`
- **THEN** posts after the first SHALL be displayed as collapsed cards with thumbnail, title, excerpt, and metadata

#### Scenario: Pagination navigation
- **WHEN** more than 10 posts exist
- **THEN** pagination links SHALL appear at the bottom of the page
- **AND** `/blog/2`, `/blog/3`, etc. SHALL display subsequent pages

#### Scenario: Empty blog
- **WHEN** no published posts exist
- **THEN** a message SHALL indicate no posts are available

---

### Requirement: Individual Post Page
The system SHALL provide individual post pages at `/blog/[slug]` displaying the full post content.

#### Scenario: Post page content
- **WHEN** a user visits `/blog/[slug]`
- **THEN** the page SHALL display the cover image (if present), title, publication date, author, tags, and full rendered content

#### Scenario: Previous/next navigation
- **WHEN** a user views a post that has adjacent posts
- **THEN** navigation arrows SHALL appear at the bottom linking to the previous and next posts (by date order)

#### Scenario: Post not found
- **WHEN** a user visits `/blog/[slug]` for a non-existent slug
- **THEN** a 404 page SHALL be displayed

---

### Requirement: Tag Pages
The system SHALL provide tag listing pages at `/blog/tags/[tag]` showing all posts with a specific tag.

#### Scenario: Tag page content
- **WHEN** a user visits `/blog/tags/[tag]`
- **THEN** the page SHALL display a heading indicating the tag name
- **AND** all posts with that tag SHALL be listed as collapsed cards

#### Scenario: Tag not found
- **WHEN** a user visits `/blog/tags/[tag]` for a tag with no posts
- **THEN** a 404 page SHALL be displayed

#### Scenario: Clickable tags
- **WHEN** tags are displayed on a post or card
- **THEN** each tag SHALL link to its corresponding tag page

---

### Requirement: Cover Images
The system SHALL support cover images on blog posts with optional dark/light mode variants.

#### Scenario: Single cover image
- **WHEN** a post has `cover.image` and `cover.alt` in frontmatter
- **THEN** the image SHALL be displayed at the top of the post
- **AND** the alt text SHALL be applied for accessibility

#### Scenario: Dark/light cover variants
- **WHEN** a post has `cover.dark`, `cover.light`, and `cover.alt` in frontmatter
- **THEN** the appropriate image SHALL be displayed based on the current theme

#### Scenario: No cover image
- **WHEN** a post has no cover in frontmatter
- **THEN** no cover image section SHALL be rendered

---

### Requirement: Author Display
The system SHALL display author information on blog posts.

#### Scenario: Author by ID reference
- **WHEN** a post has `authors: "mat"` (string ID) in frontmatter
- **THEN** the author name, title, and picture SHALL be resolved from the global authors configuration

#### Scenario: Inline author definition
- **WHEN** a post has an inline author object in frontmatter
- **THEN** that author information SHALL be displayed directly

#### Scenario: No author specified
- **WHEN** a post has no `authors` field in frontmatter
- **THEN** no author information SHALL be displayed

---

### Requirement: Post Metadata
The system SHALL display metadata for each post including date, reading time, and tags.

#### Scenario: Publication date
- **WHEN** a post is displayed
- **THEN** the publication date SHALL be shown in a human-readable format

#### Scenario: Reading time
- **WHEN** a post is displayed
- **THEN** an estimated reading time SHALL be calculated and displayed (based on ~200 words/minute)

#### Scenario: Last updated date
- **WHEN** a post has `lastUpdated` in frontmatter
- **AND** it differs from the publication date
- **THEN** the last updated date SHALL also be displayed

---

### Requirement: Excerpt Generation
The system SHALL support both explicit and auto-generated excerpts for collapsed post cards.

#### Scenario: Explicit excerpt
- **WHEN** a post has `excerpt` in frontmatter
- **THEN** that text SHALL be used for the collapsed card preview

#### Scenario: Auto-generated excerpt
- **WHEN** a post has no `excerpt` in frontmatter
- **THEN** the first ~200 characters of content SHALL be extracted and used

---

### Requirement: Blog Navigation Link
The system SHALL include a "Blog" link in the homepage header navigation.

#### Scenario: Navigation visibility
- **WHEN** a user visits the homepage
- **THEN** a "Blog" link SHALL appear in the header next to "Documentation"
- **AND** clicking it SHALL navigate to `/blog`
