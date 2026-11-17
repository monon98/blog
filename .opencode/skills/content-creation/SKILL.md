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
  - `src/docs/code/` — 面试代码题（LeetCode / 前端手写题）
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

## 大批量力扣题页生产（几十~几百题级）

先例：`03. 数据库编程题` 323 题、`04. 力扣 JS 专项` 67 题。一次收录几十道 LeetCode 题时按下面流程走，不要手工逐页攒。

### 1. 题面获取：leetcode.cn GraphQL

端点 `POST https://leetcode.cn/graphql/`，**必须带 `Referer` 头**（单题用 `https://leetcode.cn/problems/<slug>/`，列表用 `https://leetcode.cn/problemset/javascript/`），否则偶发 400。

题目列表（字段名与国际站不同，实测可用）：

```graphql
{ problemsetQuestionList(categorySlug: "javascript", limit: 100, skip: 0, filters: {}) {
    total
    questions { frontendQuestionId title titleCn titleSlug difficulty paidOnly topicTags { name slug } }
} }
```

单题题面：

```graphql
{ question(titleSlug: "<slug>") { questionFrontendId translatedTitle translatedContent content } }
```

字段坑（都实测过）：

- 单题 `QuestionNode` **没有** `frontendQuestionId`/`titleCn`/`paidOnly`（VIP 判定用列表的 `paidOnly`）；可用字段是 `questionFrontendId translatedTitle translatedContent content`
- introspection（`__type`/`__schema`）被禁用，字段名只能靠 GraphQL 错误信息试探
- 列表 `topicTags.name` 返回 null → 官方标签拿不到，标签自行提炼
- **VIP（付费）题 `translatedContent`/`content` 双语皆 NULL** —— 官方题面拿不到
- 免费题 `translatedContent` 是 HTML（`<p>/<pre>/<code>/<strong>/<ul>`），入库前必须转 Markdown 并反转义全部实体（`&nbsp; &lt; &gt; &amp; &quot; &#39;`），不得残留标签

### 2. VIP（付费）题面处理

官方双语皆 NULL，用公开镜像站核对题意后**自行整理中文题面**（不要凭记忆编造）：

- `https://leetcode.doocs.org/en/lc/{id}`（doocs/LeetCode 镜像，含锁定题）
- `https://walkccc.me/LeetCode/problems/{slug}/`
- `https://leetcode.ca/` 按 id 检索

页首在「题目描述」下加引用块标注（与 03. 数据库编程题 SQL VIP 做法一致）：

```markdown
> 本题为 LeetCode VIP 专属题，官方题面需登录后查看，以下为按原题题意整理的版本。
```

头部行也标 `（VIP 专属题）`，索引条目尾部标 `· VIP`。

### 3. 分批生产流程

1. **拉元数据 + 免费题题面**存到会话临时目录（JSON），按分类切成 `catNN.json` 素材（含 seq/id/title/slug/diff/paid/zh 题面）
2. **写一份生产规范 spec**（页面模板、HTML→MD 转换规则、VitePress 红线、自检清单、旧题页合并映射），所有批次子代理共用同一份
3. **每个分类一个子代理并行生产题页**——只写题页，禁止创建 index.md、禁止跑 build（避免互相冲突）
4. **索引（分类 index + 总 index）由脚本从素材统一生成**：链接 `%20` 编码、难度/VIP 后缀、题号都从素材取，保证一致且无死链
5. **只读核对脚本先行**：文件名与素材逐一对得上 / H1 / 头部行（难度、LeetCode 题号、slug URL）/ 必备章节（题目描述、题解、思路、代码实现、复杂度分析）/ `::: details` 与 ``` 围栏配对 / 围栏外无 `{{ }}` 与 HTML 残留 / 索引链接可解析 → `ALL-PASS` 才进下一步
6. `pnpm build` 退出码 0 且 grep 输出无 `TypeError` → **核对通过才 commit，每批一次 commit，只 commit 不 push**（push 即触发 GitHub Pages 部署）

### 4. 题页模板

免费题：

```markdown
# {中文题名}

> 难度：{简单|中等|困难} | 标签：{标签} | LeetCode {题号} · [原题链接](https://leetcode.cn/problems/{slug}/)

## 题目描述

{官方题面 HTML 转成的 Markdown}

## 题解

::: details 点击查看题解

### 思路
### 代码实现
```javascript
{可直接提交通过的实现}
```
### 复杂度分析

- 时间复杂度：O(...)。
- 空间复杂度：O(...)。

:::
```

VIP 题：头部行加 `（VIP 专属题）`，题目描述用 §2 的标注块 + 整理题面，其余同。

### 5. 替换既有相似题

收录力扣题时常要删除已有的非力扣手写题：

1. 先做 51×67 之类**相似度比对**得到替换映射（写脚本/子代理比对，不靠印象）
2. **先建新页、核对、commit，再删旧页** —— 顺序反了会出死链
3. 旧页**独有讲解并入新页题解**（如防抖的 immediate、pipe 方向），旧页的自拟「题目描述」不照抄
4. 删旧页的同一批里同步：grep 全库引用改指新页（showcase 关联题目链接、上级 index.md 条目）
5. 删除导致子目录编号断档时，**统一推迟到最后一批一次性重编号**（避免同一文件两次 git mv）
6. 剩余非力扣题做**逐题必要性报告**交用户决定去留，保留者标记非力扣来源
