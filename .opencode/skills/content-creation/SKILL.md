---
name: content-creation
description: Use when creating new content directories or expanding existing ones in this VitePress blog. Covers interview questions, guides, dev notes, collection, and any other content type. Standard workflow from planning to build verification.
---

# Content Creation Workflow

## Standard process for adding new content

### 1. Planning

- Identify the content type and scope
- Check existing content for overlap or related material
- Plan the directory structure and file count
- Decide where it belongs:
  - `src/docs/interview/` — 面试题
  - `src/docs/guide/` — 技术导航
  - `src/docs/develop/` — 开发笔记
  - `src/docs/collection/personal/` — 个人收藏
  - `src/docs/collection/reposts/` — 转载收藏

### 2. Directory structure

```
src/docs/<category>/
  XX. topic-name/
    index.md          # Directory navigation
    01. subtopic.md   # Numbered files
    02. subtopic.md
    ...
```

- Use numeric prefix for directory and files
- Directory name: `<number>. <topic-name>` (lowercase, hyphenated)
- File name: `<number>. <subtopic-name>.md` (Chinese titles allowed)

### 3. Content format

Each file follows this pattern:

```markdown
# Topic Title

## 1. Section Title

::: details
Content with code examples.

### Sub-sections if needed

\`\`\`javascript
// Code examples
\`\`\`

### 总结

Brief summary.

:::

## 2. Next Section...
```

### 4. Quality checklist

Before finalizing:

- [ ] All code examples use latest framework syntax
- [ ] No deprecated APIs (check version history)
- [ ] Links between files use correct format
- [ ] No duplicate content across files
- [ ] Each `::: details` block has matching `:::` closing
- [ ] Build passes: `pnpm build`

### 5. Link format rules

- Same-page: `[text](#section-name)`
- Cross-file: `[text](./06.%20filename#section-name)`
- Escape spaces as `%20`
- No `.md` extension in links

### 6. Index file

Create `index.md` in the new directory:

```markdown
# Topic Name

Topic 汇总，涵盖 xxx、xxx、xxx 等各个方面。

## 目录

- [Subtopic 1](./01.%20Subtopic%201)
- [Subtopic 2](./02.%20Subtopic%202)
```

### 7. Update main index

Add link to the parent `index.md`:

```markdown
- [Topic](./XX.%20topic-name/)
```

### 8. Build verification

```bash
pnpm build
```

Check for:
- No broken links
- No SSR errors
- All pages render correctly

### 9. Deduplication

After creating content:

1. Search for repeated code examples across files
2. Search for repeated explanations
3. Replace duplicates with cross-references
4. Keep related content in its designated directory

### 10. Version currency check

Before marking content as complete:

1. Check framework/library latest version
2. Update version tables if applicable
3. Verify all API references are current
4. Remove deprecated features or mark as legacy
