---
name: demo-showcase
description: Use when generating AI demo/case showcase items (案例展示) in this VitePress blog — both Vue components and native HTML files embedded via iframe. Covers grouped subdirectories under src/public/html/ and src/components/, per-group showcase pages, the HtmlFrame component, portability rules, and the /blog/ base path. Front-load keywords: demo, showcase, 案例, 展示, iframe, html, component, 组件, 生成, 分组.
---

# 案例展示生成规范（AI 生成模板）

用于在本项目中**生成「案例展示」**：把一个可运行的 demo（Vue 组件 或 原生 HTML）沉淀为可在站点浏览的展示页。
本文档既是技术规范，也是可直接照抄的模板。生成新案例时：先定分组 → 套对应模板 → 注册到该组展示页 → `pnpm build` 验证。

## 1. 两种案例形态

| 形态 | 源码位置 | 渲染方式 | 适用场景 |
|------|----------|----------|----------|
| **A. Vue 组件** | `src/components/<group>/<name>.vue` | 展示页 `import` 后以标签渲染 | 需要响应式、props、交互的 demo |
| **B. 原生 HTML** | `src/public/html/<group>/<name>.html` | 用 `<HtmlFrame>` 以 iframe 内嵌 | 单文件自包含 demo、纯 HTML/CSS/JS 效果 |

> 站点 base 为 `/blog/`。**不要手写 `/blog/` 前缀**，由 `withBase()` / `@components` 别名自动处理。

## 2. 分组与目录结构

四个分组，源码按 `<group>` 分子目录，**每组一个展示页**：

| 组 | `<group>` | 说明 |
|----|-----------|------|
| 一 | `article` | 与已有文章联动 |
| 二 | `visual` | 纯视觉特效 |
| 三 | `interview` | 面试题联动 |
| 四 | `widget` | 实用交互组件 |

```
src/
  public/html/<group>/<name>.html   # 原生 HTML（会被拷贝进 dist，可被 iframe 加载）
  components/<group>/<name>.vue     # Vue 组件
  showcase/<group>.md               # 每组一个展示页，内嵌该组全部 demo
  showcase/index.md                 # 首页，列出各组入口
```

## 3. 可移植性规则（独立不关联）

生成的案例必须**可整文件复制到任意其他项目直接使用**：

- **HTML**：单文件自包含——样式、脚本全部内联，**不引用本项目任何路径**，不依赖外部 CDN（确需第三方库时在展示页注明并给出 `<script>` 来源）。
- **Vue**：`<script setup>` 单文件组件，**只允许 `import ... from 'vue'`**；禁止 `@components`、`vitepress`、本项目工具函数等依赖。样式用 `<style scoped>` 内联。
- 每个案例彼此独立，不互相 import。
- 展示页（`src/showcase/*.md`）与 `HtmlFrame` 属于站点基础设施，不参与移植。

## 4. 关键约束（必读）

1. **可被 iframe 加载的 HTML 必须在 `src/public/html/<group>/`**——`src/public/` 下文件会拷贝到 `dist/` 根，dev 与生产都以 `/blog/<file>` 提供；`src/html/` 下文件**不会**进 `dist/`，无法线上内嵌。
2. **文件名用 ASCII kebab-case**（如 `flex-card.html`），避免中文/空格的 URL 编码问题。
3. **iframe 需要显式高度**：`HtmlFrame` 默认 `480`，按内容调 `:height`。
4. **内容语言为中文**（用户可见文案、标题、说明）。
5. **Vite 别名**（`.vitepress/config.mts`）：`@` → `src/`，`@components` → `src/components/`；子目录用 `@components/<group>/<name>.vue`。
6. 不引入外部 UI 库，保持自包含。

## 5. 模板 A：Vue 组件

### A-1. 组件 `src/components/<group>/<name>.vue`

```vue
<template>
  <div class="<name>">
    <!-- DOM 结构 -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue' // 只允许从 vue 引入

const count = ref(0)
</script>

<style scoped>
.<name> {
  /* 自包含样式 */
}
</style>
```

### A-2. 展示页引用

```md
<GroupDemo :prop="value" />

<script setup>
import GroupDemo from '@components/<group>/<name>.vue'

const value = 100
</script>
```

## 6. 模板 B：原生 HTML

### B-1. 文件 `src/public/html/<group>/<name>.html`

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

### B-2. 展示页引用

```md
<HtmlFrame src="html/<group>/<name>.html" title="案例标题" :height="480" />
```

`src` 为**相对 `src/public/` 的路径**，不要以 `/` 开头，也不要带 base 前缀。

## 7. 组展示页模板 `src/showcase/<group>.md`

一组的所有 demo 放在**同一个展示页**：

```md
---
layout: doc
navbar: true
sidebar: false
---

# 组名（如：纯视觉特效）

## 1. 案例标题 A（原生 HTML）

<HtmlFrame src="html/<group>/a.html" title="案例标题 A" :height="480" />

## 2. 案例标题 B（Vue 组件）

<CaseB :prop="value" />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import CaseB from '@components/<group>/b.vue'

const value = 100
</script>
```

最后在 `src/showcase/index.md` 追加该组入口（沿用「编号. [名称](链接) — 一句话说明」）：

```md
6. [组名](./<group>) 一句话说明
```

每个案例演示行之后追加详情页入口（编号与详情页一致）：

```md
[完整页面：用例 · 代码 · 讲解 →](./<group>/01-<name>)
```

## 8. `HtmlFrame` 组件（`src/components/html-frame.vue`）

内嵌原生 HTML 的统一封装，内部规范化路径后用 `withBase()` 补全 base（注意：`withBase` 只对以 `/` 开头的路径补 base）。

| Prop | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | 必填 | 相对 `src/public/` 的路径，如 `html/visual/ripple.html` |
| `title` | `string` | `demo` | iframe 无障碍标题 |
| `height` | `number \| string` | `480` | 数字按 px，字符串原样 |
| `loading` | `'lazy' \| 'eager'` | `lazy` | 加载时机 |

## 9. 可直接粘贴给 AI 的生成提示词模板

```
请在本项目生成「案例展示」，要求：
- 分组：<article|visual|interview|widget>，案例名 <name>，中文标题 <标题>
- 形态：Vue 组件 / 原生 HTML（二选一）
- 功能描述：<一段描述>
- 按 .opencode/skills/demo-showcase/SKILL.md 模板产出：
  · Vue：src/components/<group>/<name>.vue（只 import vue，可移植）
  · HTML：src/public/html/<group>/<name>.html（单文件自包含）
  · 展示：追加到 src/showcase/<group>.md（HTML 用 <HtmlFrame>）
- 中文文案、独立不关联、可整文件复制到其他项目，最后 pnpm build 验证
```

## 10. 质量清单

- [ ] 分组 `<group>` 选对，文件落在对应子目录
- [ ] HTML 在 `src/public/html/<group>/`，ASCII kebab-case，单文件自包含
- [ ] Vue 只 `import ... from 'vue'`，无项目内依赖，可直接复制到其他项目
- [ ] 案例之间互不依赖
- [ ] 展示页 frontmatter 为 `layout: doc` + `navbar: true` + `sidebar: false`
- [ ] `HtmlFrame` 的 `src` 不含 `/blog/` 前缀、不以 `/` 开头
- [ ] `:height` 按内容设置，iframe 无大片空白或截断
- [ ] 已追加到 `src/showcase/<group>.md` 并在 `index.md` 注册
- [ ] 案例有对应详情页 `src/showcase/<group>/NN-<name>.md`，分组页有「完整页面 →」链接
- [ ] `pnpm build` 通过（构建期校验死链）

## 11. 详情页模板 `src/showcase/<group>/NN-<name>.md`

每个案例配一个**独立详情页**（展示用例 + 代码实现 + 使用讲解），与分组页共存、由分组页链接进入：

```md
---
layout: doc
navbar: true
sidebar: false
---

# NN. 中文标题（形态）

← [返回<组名>列表](../<group>)

（article / interview 组此处加：关联文章/题目：[标题](../../docs/...)）

## 一、展示用例

<!-- HTML 页： -->
<HtmlFrame src="html/<group>/<name>.html" title="中文标题" :height="480" />
<!-- Vue 页：直接放组件，如 <CaseB :prop="value" /> -->

## 二、代码实现

<!-- HTML 页：单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。 -->
<!-- Vue 页：`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。 -->

::: details 展开完整源码
<<< ../../public/html/<group>/<name>.html   （或 ../../components/<group>/<name>.vue）
:::

## 三、使用讲解

### 实现原理

- 3-5 条要点，基于真实源码写（真实函数名/参数名/数值），不编造。

### 如何调整

- 2-3 条：改哪些常量/结构可调行为。

### 注意事项

- 2-3 条：坑、兼容性、安全边界。

<script setup>
<!-- HTML 页：import HtmlFrame from '@components/html-frame.vue' -->
<!-- Vue 页：import 目标组件，不 import HtmlFrame -->
</script>
```

要点：

- 路径基准是 `src/showcase/<group>/`：返回链接 `../<group>`，snippet 与关联文章用 `../../` 开头。
- HTML 页与 Vue 页的二、三节首句固定文案不同（见模板内注释），底部 `<script setup>` 只 import 本页用到的组件。
- 讲解每页约 60-90 行、中文；行内反引号代码含 `{{ }}` 必须用 `<span v-pre>` 包裹（围栏块与 `<<<` snippet 天然安全，无需处理）。
- 编号 `NN-` 与分组页 `## N.` 案例顺序一一对应，分组页每个案例都要有对应详情页链接。
