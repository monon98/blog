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

## Interview question management

### Directory structure

- Use numeric prefix directories for each topic (e.g. `01. javascript/`, `02. css/`)
- Each topic directory contains an `index.md` and numbered QA files
- Files use pattern: `<number>. <Topic>.md` (e.g. `01. 基础概念.md`)

### Content format

- Use `::: details` for collapsible Q&A blocks
- Each question should have a clear, concise answer
- Include code examples where applicable
- Use consistent heading hierarchy

### Link management

- Use relative paths without `.md` extension
- Escape spaces as `%20` in links
- Cross-file links: `./06.%20路由与状态管理#2-vuex-的原理和使用`
- Same-page links: `#section-name`

### Deduplication

- Check for duplicate content across files before adding
- Use cross-references instead of duplicating content
- Keep related content in its designated topic directory

### Quality checklist

- Content is accurate and up-to-date
- Code examples follow Vue 3 / latest framework conventions
- Links are valid and use correct format
- No duplicate content across files
- Build passes without errors

## Content review and deduplication

### Review workflow

After adding or modifying content, always run a full audit:

1. **Correctness check**
   - Verify API names, parameters, and return values are accurate
   - Ensure code examples are syntactically correct and runnable
   - Check that lifecycle hooks and configuration options match the latest version
   - Validate that platform-specific APIs are attributed to the correct platform

2. **Freshness check**
   - Confirm framework versions referenced are current (e.g. Vue 3.4+, Three.js r170+)
   - Update deprecated API mentions with warnings or replacements
   - Remove or mark obsolete patterns (e.g. Vue 2 syntax in Vue 3 contexts)

3. **Deduplication check**
   - Search for duplicate code blocks across all files in the same directory
   - Search for duplicate code blocks across related directories (e.g. `miniprogram/` and `uniapp/`)
   - Check for duplicate concepts that can be consolidated
   - Look for similar table/comparison content that appears in multiple places

### Deduplication rules

| Scenario | Action |
|----------|--------|
| Same code in same directory | Keep the more complete version, replace the other with a cross-reference |
| Same code in different directories | Keep in the canonical location, add `::: tip` cross-reference in others |
| Similar concept explained twice | Consolidate into one location, reference from others |
| Generic concept (e.g. Vue props) | Keep detailed explanation in the primary topic (e.g. `vue/03`), reference from derived topics (e.g. `uniapp/03`) |
| Platform-specific variants | Keep separate but note the relationship (e.g. CommonJS vs ES Module) |

### Cross-reference format

Use VitePress custom containers for cross-references:

```markdown
::: tip
Detailed explanation见 [02. 生命周期.md](./02.%20生命周期)。
:::
```

```markdown
::: warning
`FirstPersonControls` 自 Three.js r128 起已被弃用，推荐使用 `PointerLockControls` 替代。
:::
```

### Common duplication patterns to check

- `setData` usage patterns across `miniprogram/` and `uniapp/`
- Component communication (props/$emit) across `vue/`, `miniprogram/`, `uniapp/`
- Lifecycle hooks across `vue/`, `miniprogram/`, `uniapp/`
- Performance optimization patterns (lazy loading, caching) across all content directories
- Event bus / state management implementations across directories
- Route management across `vue/`, `miniprogram/`, `uniapp/`

### Platform-specific code conventions

| Directory | Module system | API prefix |
|-----------|---------------|------------|
| `miniprogram/` | CommonJS (`require`/`module.exports`) | `wx.` |
| `uniapp/` | ES Module (`import`/`export`) or CommonJS | `uni.` |
| `vue/` | ES Module | N/A |
| `electron/` | CommonJS (main) / ES Module (renderer) | N/A |

## Gotchas

- `src/html/` contains standalone HTML files, NOT VitePress markdown — don't add routable content there
- Base path is `/blog/` — internal links should account for this
- Do not edit `.vitepress/sidebar.ts` manually to add content — just add files to the filesystem
