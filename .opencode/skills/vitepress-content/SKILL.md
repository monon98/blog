---
name: vitepress-content
description: Use when adding, editing, or managing markdown content files in this VitePress blog. Covers docs in src/docs/, showcase pages, and the home page. Front-load keywords: markdown, content, docs, collection, interview, guide, develop.
---

# VitePress Content Management

## Content location

All content lives under `src/` (VitePress `srcDir`), NOT the repo root.

| Path | Purpose |
|------|---------|
| `src/docs/collection/personal/` | 个人收藏 (personal bookmarks) |
| `src/docs/collection/reposts/` | 转载收藏 (reposted articles) |
| `src/docs/develop/` | 开发笔记 (dev notes) |
| `src/docs/guide/` | 技术导航 (tech guides) |
| `src/docs/interview/` | 面试题 (interview questions) |
| `src/showcase/` | Demo showcase pages |
| `src/index.md` | Home page (frontmatter layout) |

## Adding new content

1. Create a `.md` file in the appropriate `src/docs/` subdirectory
2. Use numeric prefix in filename for ordering (e.g. `3. My New Article.md`)
3. The prefix is stripped from display text by `cleanName()` in `.vitepress/sidebar.ts`
4. Sidebar updates automatically on next `pnpm dev` — no config edits needed

## File naming convention

- Pattern: `<number>. <Title>.md` (e.g. `0. Introduction.md`)
- The number controls sort order in the sidebar
- `cleanName()` removes `^\d+\.?\s*` for display
- Directories also use numeric prefixes

## Frontmatter

Standard VitePress frontmatter. Use `layout: home` only for `src/index.md`.

```yaml
---
title: Article Title
description: Brief description
lastUpdated: true
---
```

## Language

Content is written in Chinese (中文). Maintain this convention for all new content.

## Gotchas

- `src/html/` contains standalone HTML files, NOT VitePress markdown — don't add routable content there
- Base path is `/blog/` — internal links should account for this
- Do not edit `.vitepress/sidebar.ts` manually to add content — just add files to the filesystem
