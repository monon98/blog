---
layout: doc
navbar: true
sidebar: false
---

# 原生 HTML 案例内嵌示例

通过 `HtmlFrame` 组件，将 `src/public/html/` 下的原生 HTML 文件以 iframe 形式内嵌展示。
组件内部使用 VitePress 的 `withBase()`，自动补全 base（本项目为 `/blog/`），dev 与生产构建均可用。

<HtmlFrame src="html/hover-card.html" title="悬浮卡片" :height="420" />

## 用法

```md
<HtmlFrame src="html/hover-card.html" title="悬浮卡片" :height="420" />
```

`src` 为相对 `src/public/` 的路径（不要以 `/` 开头，也不要带 base 前缀）。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
