---
name: demo-showcase
description: Use when generating AI demo/case showcase items (案例展示) in this VitePress blog — both Vue components and native HTML files embedded via iframe. Covers src/components, src/public/html, src/showcase, the HtmlFrame component, and the /blog/ base path. Front-load keywords: demo, showcase, 案例, 展示, iframe, html, component, 组件, 生成.
---

# 案例展示生成规范（AI 生成模板）

用于在本项目中**生成「案例展示」**：把一个可运行的 demo（Vue 组件 或 原生 HTML）沉淀为可在站点浏览的展示页。
本文档既是技术规范，也是可直接照抄的模板。生成新案例时，先选形态，再套对应模板。

## 1. 两种案例形态

| 形态 | 源码位置 | 展示页 | 渲染方式 | 适用场景 |
|------|----------|--------|----------|----------|
| **A. Vue 组件** | `src/components/<name>.vue` | `src/showcase/<name>.md` | markdown 中 `import` 后直接以标签渲染 | 需要响应式、props、和站点主题交互的 demo |
| **B. 原生 HTML** | `src/public/html/<name>.html` | `src/showcase/<name>.md` | 用 `<HtmlFrame>` 以 iframe 内嵌 | 单文件自包含 demo、第三方片段、纯 HTML/CSS/JS 效果 |

> 站点 base 为 `/blog/`。**所有相对路径都不要手写 `/blog/` 前缀**，由 `withBase()` / `@components` 别名自动处理。

## 2. 关键约束（必读）

1. **可被 iframe 加载的 HTML 必须放在 `src/public/html/`**
   - `src/public/` 下的文件会被拷贝到 `dist/` 根目录，dev 与生产构建都以 `/blog/<file>` 提供。
   - `src/html/` 下的文件**不会**被拷贝进 `dist/`，只能在本地直接打开，**无法用于线上 iframe 内嵌**。
   - 因此：要内嵌展示 → 放 `src/public/html/`；仅作参考源码、不内嵌 → 才放 `src/html/`。
2. **HTML 文件名用 ASCII kebab-case**（如 `hover-card.html`），避免中文/空格带来的 URL 编码问题。
3. **HTML 必须自包含**：样式与脚本内联在单文件内，不依赖外部 CDN（确需依赖时在展示页注明）。
4. **iframe 需要显式高度**：`HtmlFrame` 默认 `480`，按内容调整 `:height`。
5. **内容语言为中文**（用户可见文案、标题、说明）。
6. **Vite 别名**（`.vitepress/config.mts`）：`@` → `src/`，`@components` → `src/components/`。
7. 组件用 Vue 3 `<script setup>`，不引入外部 UI 库，保持自包含。

## 3. 模板 A：Vue 组件案例

### A-1. 组件 `src/components/<name>.vue`

```vue
<template>
  <div class="<name>">
    <!-- DOM 结构 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// props（可选）
// defineProps<{ msg?: string }>()

const count = ref(0)
</script>

<style scoped>
.<name> {
  /* 自包含样式 */
}
</style>
```

### A-2. 展示页 `src/showcase/<name>.md`

```md
---
layout: doc
navbar: true
sidebar: false
---

# 案例标题

一句话说明。

<Name :some-prop="value" />

<script setup>
import Name from '@components/<name>.vue'

const value = 100
</script>
```

### A-3. 注册到 `src/showcase/index.md`

在列表末尾追加一条（沿用「编号. [名称](链接) — 一句话说明」格式）：

```md
6. [name 案例标题](./name) 一句话说明
```

> 若需在首页直接内联预览，可把组件标签一并写进 `index.md`，并把 `import` 加入其 `<script setup>`。

## 4. 模板 B：原生 HTML 案例（iframe 内嵌）

### B-1. HTML 文件 `src/public/html/<name>.html`

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>案例标题</title>
  <style>
    /* 自包含样式，不引用外部资源 */
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    }
  </style>
</head>
<body>
  <!-- DOM 结构 -->

  <script>
    // 自包含脚本
  </script>
</body>
</html>
```

### B-2. 展示页 `src/showcase/<name>.md`

```md
---
layout: doc
navbar: true
sidebar: false
---

# 案例标题

一句话说明。

<HtmlFrame src="html/<name>.html" title="案例标题" :height="480" />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
```

`src` 为**相对 `src/public/` 的路径**，不要以 `/` 开头，也不要带 base 前缀。

### B-3. 注册到 `src/showcase/index.md`

```md
7. [name 案例标题](./name) iframe 内嵌 `src/public/html/<name>.html`
```

## 5. `HtmlFrame` 组件（`src/components/html-frame.vue`）

内嵌原生 HTML 的统一封装，内部用 `withBase()` 自动补全 base。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | 必填 | 相对 `src/public/` 的路径，如 `html/hover-card.html` |
| `title` | `string` | `demo` | iframe 无障碍标题 |
| `height` | `number \| string` | `480` | 数字按 px，字符串原样 |
| `loading` | `'lazy' \| 'eager'` | `lazy` | 加载时机 |

用法：

```md
<HtmlFrame src="html/hover-card.html" title="悬浮卡片" :height="420" />
```

## 6. 可直接粘贴给 AI 的生成提示词模板

```
请在本项目生成一个「案例展示」，要求：
- 案例名称：<name>，中文标题：<标题>
- 形态：Vue 组件 / 原生 HTML（二选一）
- 功能描述：<一段描述>
- 按 .opencode/skills/demo-showcase/SKILL.md 的对应模板产出文件：
  · Vue：src/components/<name>.vue + src/showcase/<name>.md
  · HTML：src/public/html/<name>.html + src/showcase/<name>.md（用 <HtmlFrame> 内嵌）
- 同时在 src/showcase/index.md 末尾追加注册条目
- 中文文案、自包含、不引外部 UI 库/CDN，最后跑 pnpm build 验证
```

## 7. 质量清单

- [ ] 形态选对：需要交互/响应式 → Vue；单文件效果 → HTML
- [ ] HTML 放在 `src/public/html/`（要内嵌）且文件名为 ASCII kebab-case
- [ ] HTML 自包含（样式脚本内联，无外部 CDN）
- [ ] 展示页 frontmatter 为 `layout: doc` + `navbar: true` + `sidebar: false`
- [ ] `HtmlFrame` 的 `src` 不含 `/blog/` 前缀、不以 `/` 开头
- [ ] `:height` 按内容设置，iframe 不出现大片空白或被截断
- [ ] 已在 `src/showcase/index.md` 注册
- [ ] `pnpm build` 通过（构建期会校验死链）
