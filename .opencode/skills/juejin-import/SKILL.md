---
name: juejin-import
description: Use when importing articles from juejin.cn (掘金) into this blog's repost collection. Covers fetching juejin articles by URL, converting HTML to Markdown, writing numbered files into src/docs/collection/reposts/<分类>/, deduplication, and updating the landing page. Front-load keywords: 掘金, juejin, 转载, reposts, 收藏, 导入, import, 文章抓取, collection.
---

# 掘金文章导入（转载收藏）

把一篇掘金文章通过链接抓下来，转成 Markdown，按本仓库规范写入
`src/docs/collection/reposts/<分类>/`，并同步更新落地页。

## 1. 工具脚本（已就绪，直接用，不要另写）

| 脚本 | 作用 |
|------|------|
| `scripts/lib/juejin-convert.mjs` | HTML → Markdown 转换器（无第三方依赖） |
| `scripts/fetch-juejin.mjs` | 抓取器（重试 + 退避 + 反爬检测），输出 JSON |
| `scripts/import-juejin.mjs` | 落库器（去重 + 编号 + 写文件 + 更新落地页） |

### 一条命令完成导入（推荐）

```bash
node scripts/import-juejin.mjs "https://juejin.cn/post/<文章ID>" <分类>
```

例：

```bash
node scripts/import-juejin.mjs "https://juejin.cn/post/7564681385294921737" 前端
```

### 只抓取、不落库（先看内容再决定）

```bash
node scripts/fetch-juejin.mjs "https://juejin.cn/post/<文章ID>" --out .tmp-juejin.json
```

输出 JSON 字段：`title` / `author` / `created` / `tags` / `body` / `source` / `blocked` / `bodyLength`。

### 从本地 HTML 转换（不联网）

转换器改过之后，需要把已抓过的文章重新转换一遍时用这个模式 ——
**不会请求掘金，因此不会触发反爬冷却**：

```bash
node scripts/import-juejin.mjs "https://juejin.cn/post/<文章ID>" <分类> <序号> \
  --from-file .tmp-juejin-raw/<文章ID>.html
```

批量导入建议先把原始 HTML 缓存到 `.tmp-juejin-raw/<id>.html`，
再用 `--from-file` 逐条落库；这样转换器出问题可以零成本重转。

## 2. 标准工作流

1. **确认分类目录**：`src/docs/collection/reposts/` 下现有分类为
   `前端`、`开发`、`android`、`window`、`面试`。没有合适分类时可新建（用中文名，与现有风格一致）。
2. **执行导入**（见上）。
3. **读回文件核对**（重点检查这 5 项，见 §4）。
4. **确认落地页已更新**：`src/docs/collection/index.md` 对应分类小节下应新增一条链接。
5. **构建验证**：`pnpm build`（退出码 0 且输出无 `TypeError`）。
6. **清理临时文件**（若有 `.tmp-*.json`）。

## 3. 落库产物的格式规范

`import-juejin.mjs` 自动生成以下格式，**不要手工改动结构**：

```markdown
---
created: 2025-10-24 22:51:59 (UTC +08:00)
tags: [前端,JavaScript,面试]
source: https://juejin.cn/post/7564681385294921737
author: 拉不动的猪
---

# 文章标题

::: tip
转载自掘金 · 作者：拉不动的猪 · [原文链接](https://juejin.cn/post/7564681385294921737)
:::

## 一、二级章节
```

规则要点：

- **文件命名**：`<序号>. <标题>.md`，序号由脚本自动取该分类目录内现有最大编号 + 1，固定 3 位（`001`、`002`…）。
- **同一分类内编号位数必须一致**（现有 `前端`/`开发` 用 3 位，别混用 2 位）。
- **标题层级**：文章标题是页面唯一 H1；正文从 `##` 开始。转换器已按「出现顺序」动态映射层级，掘金作者混用 h2~h5 也能正确处理。
- **链接**：落地页条目里的路径要 `%20` 编码空格、去掉 `.md` 后缀（脚本已处理）。
- **侧边栏**：`.vitepress/sidebar.ts` 按文件系统自动生成，**不需要**手动改配置。
- **文件名不能含裸 `%`**：脚本已自动把 `%` 换成全角 `％`。
  原因见 §7.1 —— 裸 `%` 会让整站 `pnpm build` 失败。

## 4. 导入后必查的 5 项

转换器已针对这些做过修复，但抓到的文章结构千差万别，仍需人工过一眼：

| 检查项 | 期望 | 失败时的现象 |
|--------|------|--------------|
| 代码围栏配对 | `````{3,} `` 成对出现，长度按内容动态加长 | 奇数个 → 后续内容全被当成代码渲染 |
| 页面唯一 H1 | 正文无 `# ` 开头行（**围栏内的不算**） | 多 H1 会污染 VitePress 目录与锚点 |
| 标题层级不跳跃 | 不出现 h2 直接跳 h4 | 目录层级错乱 |
| 无 `{{ }}` 插值 | 围栏外不出现未保护的 `{{ }}` | md 页面被当 Vue 模板编译，SSR 报错 |
| 无 HTML 残留 | 正文不残留 `<div>`/`<span>`（**围栏内的不算**） | 渲染出裸标签 |

> 写校验脚本时容易踩的假阳性见 §7.6。

## 5. 反爬与失败处理（重要）

### 5.1 必须带 Referer

掘金对**不带 `Referer`** 的请求会返回约 2.5KB 的 SPA 骨架（无正文）。
`fetch-juejin.mjs` 已内置 `Referer: https://juejin.cn/`，**不要绕过脚本直接写 fetch**。

### 5.2 冷却期是 IP 级的

连续抓取会触发 IP 级临时冷却，期间所有请求都返回 SPA 骨架。实测：

- 改 UA、换 Referer、加 query 参数、间隔 6s 重试 **都无效**
- 只有等冷却过去才恢复

脚本已实现 5 轮递增退避（1.5s → 5s → 12s → 25s → 30s）。若仍失败会抛出明确中文错误。

**遇到报错时的正确做法**：

1. **不要**反复重试刷请求（会延长冷却）。
2. 等几分钟再试；或换网络环境。
3. 若文章本身重要且一直抓不到，改用 `agent-browser` 技能手动打开页面复制正文，再用 `fetch-juejin.mjs` 的转换逻辑处理本地 HTML。

### 5.3 失败时绝不能静默产出空文件

`import-juejin.mjs` 已内置三道闸门，任一触发即中止且不写文件：

- `blocked = true`（登录墙/付费墙截断）
- `title` 为空
- `bodyLength < 200`

## 6. 版权合规

- frontmatter 的 `source`（原文链接）与 `author`（原作者）**必须保留**，脚本已写入。
- 正文顶部的 `::: tip` 转载提示块同理。
- 标注「禁止转载」或需付费的文章：只保留链接与摘要，不全文入库。
- 导入后人工确认原文允许转载。

## 7. 常见问题

### 7.1 文件名里的 `%` 会让整站构建失败（踩过两次）

掘金标题里带百分号很常见（「90% 的人分不清…」「⚡90%前端没摸过的…」）。
**文件名里出现裸 `%` 会让 `pnpm build` 在渲染页面阶段崩溃**：

```
URIError: URI malformed
    at decodeURI (<anonymous>)          ← VitePress normalize() 处理 sidebar link
    at decodeURIComponent (<anonymous>)  ← VitePress pathToFile() 加载页面
```

两处都会对路径做 `decodeURI` / `decodeURIComponent`，裸 `%` 不是合法转义序列 → 抛错。

**处理办法**（`import-juejin.mjs` 的 `safeName()` 已内置）：文件名里的 `%` 换成
**全角 `％`**（视觉等价，中文排版也更规范）。正文标题保持原文的半角 `%` 不变。

如果手工加过文件，发现构建报 `URI malformed`：

```bash
# 重命名 + 同步落地页链接
# 文件名 019. xxx 90% yyy.md → 019. xxx 90％ yyy.md
```

> 不要试图在 `.vitepress/sidebar.ts` 里做 `encodeURIComponent` 绕过 ——
> 页面加载那一步（`pathToFile`）照样会炸，且改 sidebar 会影响全站链接格式。

### 7.2 表格与嵌套围栏（转换器已处理）

| 原文形态 | 现象 | 转换器行为 |
|---------|------|-----------|
| `<table>` | 没有转换器支持时，整张表会被压成一行连排文字 | 转成 GitHub 风格 Markdown 表格 |
| 代码块内容里再套 ```（如 `language-diff` 里放 Markdown 文档） | 内层 ``` 提前闭合围栏，里面的 `# 标题` 泄漏成页面 H1 | 围栏长度按内容里最长反引号串 +1 动态加长（会变成 ``````） |
| 作者把一段代码拆成 `<pre>`（只有首行）+ `<p>`（剩余代码） | 代码块被截断，后面残留一个孤立 ``` → 围栏奇偶错乱，整篇渲染全乱 | 合并回同一个代码块，并去掉 `<p>` 末尾那个孤立围栏 |

### 7.3 Vue 插值防护（转换器已处理）

md 页面整页编译成 Vue 模板，正文出现 `{{ ... }}` 会被当插值执行 → SSR TypeError。
转换器会把围栏外的 `{{ }}` 包进 `<span v-pre>`（本仓库既有约定）：

- 行内代码 → `<span v-pre>`{{ x }}`</span>`
- 裸文本 → `<span v-pre>{{ x }}</span>`

SSR 输出里 `v-pre` 属性会被 Vue 移除，但 `{{ }}` 保持字面量 —— 这是正常的。

### 7.4 抓取 / 构建类问题

| 现象 | 原因 | 处理 |
|------|------|------|
| 报错「掘金返回了 SPA 骨架」 | 反爬冷却中 | 等几分钟再试，别连续重试 |
| 报错「正文疑似被登录墙/付费墙截断」 | 文章需登录/付费 | 改用浏览器手动获取 |
| 报错「抓取内容异常」 | title 为空或正文 < 200 字符 | 检查链接是否正确、文章是否已删除 |
| 输出「已存在，跳过」 | 同 source 链接已收录 | 正常，说明去重生效；换分类需手动处理 |
| 侧边栏没出现新页 | dev server 文件变动有短暂 502 | 刷新页面重试 |
| `pnpm build` 报 `spawnSync git EPERM` | 沙箱禁止子进程 spawn | 需要 `danger-full-access` 才能构建，非代码问题 |
| 预览新页 404 | `pnpm preview` 缓存了启动时的文件列表 | 重新 build 后重启 preview |

### 7.5 批量导入的编号空洞

`import-juejin.mjs` 按「目录内最大编号 + 1」分配序号。批量导入时如果中途有文章
因**去重跳过**（同 source 已收录），后面就会留下编号空洞（如 015、016 缺失）。

**导入后必须检查编号连续性**，有空洞就整体重排 + 同步落地页链接里的序号：

```bash
# 核对：列出目录序号 vs 连续序列
ls src/docs/collection/reposts/<分类>/ | sed 's/\..*//' | sort
```

### 7.6 检查脚本的假阳性

自己写校验脚本时注意三个坑（都踩过）：

1. **围栏长度**：不能只匹配 `^````，要匹配 ``^`{3,}``，并按 CommonMark 规则
   （长度 N 的围栏只能被长度 ≥ N 的围栏关闭）判断状态。
2. **H1 检测**：必须同样忽略围栏内的 `# `，否则嵌套围栏里的 Markdown 标题会被误报。
3. **`<table>` 计数**：VitePress 渲染成 `<table tabindex="0">`，只匹配 `<table>` 会漏。
   用 `<table[\s>]`。
4. **SSR 报错误判**：正文代码示例里出现「TypeError」这个词（如「严格模式下会抛出
   TypeError」）不等于构建报错，要匹配 `TypeError:` / `URIError:` 这种带冒号的形式。

## 8. 批量导入

### 8.1 推荐流程：先缓存 HTML，再离线落库

```bash
# 1) 逐条抓取原始 HTML 并缓存（间隔 8s，避免触发 IP 级反爬冷却）
node scripts/fetch-juejin.mjs "https://juejin.cn/post/ID1" --out .tmp-juejin-raw/ID1.json
#    或直接保存原始 HTML（推荐，便于用 --from-file 重转）

# 2) 离线落库（不联网）
node scripts/import-juejin.mjs "https://juejin.cn/post/ID1" 前端 012 --from-file .tmp-juejin-raw/ID1.html

# 3) 统一构建验证
pnpm build

# 4) 清理临时目录
rm -rf .tmp-juejin-raw
```

好处：转换器出问题时可以零成本重转，不会再碰反爬冷却。

### 8.2 注意事项

- **逐条串行**，每条之间留间隔（脚本内已有退避）。
- **检查是否有文章被去重跳过**——跳过会在编号序列里留下空洞（见 §7.5）。
- 批量导入后**统一跑一次 `pnpm build`**，并逐篇抽查 §4 的 5 项。
- 落地页链接里分类名建议用原始中文（`前端`）而不是全量百分号编码
  （`%E5%89%8D%E7%AB%AF`），与既有条目风格一致。
