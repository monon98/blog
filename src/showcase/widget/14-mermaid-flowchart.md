---
layout: doc
navbar: true
sidebar: false
---

# 14. Mermaid 流程图（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/mermaid-flowchart.html" title="Mermaid 流程图" :height="560" />

## 二、代码实现

单文件自包含（仅依赖 Mermaid CDN），整文件复制即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/mermaid-flowchart.html
:::

## 三、使用讲解

### 实现原理

- Mermaid 用**文本描述图形**：`<pre class="mermaid">` 里写 DSL（`graph TD` 从上到下，`A[Client] --> B` 矩形节点与箭头，`B(Load Balancer)` 圆角节点，`-->|tcp_123|` 给边加标签）。
- 初始化只有一行：`mermaid.initialize({ startOnLoad: true })`——以 ESM 方式 `import mermaid from 'cdn'`，页面加载完成后自动扫描所有 `.mermaid` 元素，把文本渲染成 SVG 并**替换原节点**。
- 两个 `<pre class="mermaid">` 各成一张图：第一张演示基础拓扑（Client → LB → Server1/2），第二张演示边标签与圆角节点语法。
- 全页零手写 SVG/布局代码，`type="module"` 的脚本保证 import 语法与 DOM 就绪顺序。

### 如何调整

- 图类型改首行声明：`graph LR`（从左到右）、`sequenceDiagram`（时序图）、`classDiagram`、`gantt` 等；节点形状 `[方框]`、`(圆角)`、`{菱形}`、`((圆形))`。
- 动态渲染（SPA 路由变化后新插入的图）：把 `startOnLoad` 关掉，插入 DOM 后调 `mermaid.run({ querySelector: '.mermaid' })`。
- 主题在 `initialize({ theme: 'dark' / 'forest' / 'neutral', themeVariables: {...} })` 里配。

### 注意事项

- 本例从 jsdelivr 引入 `mermaid@11` 的 ESM 产物，**需要网络**；DSL 语法错误时 Mermaid 会渲染报错占位图，注意看控制台。
- `startOnLoad` 只在首屏执行一次，动态内容不会自动渲染（需手动 `mermaid.run`）。
- 渲染产物是内联 SVG，拷贝 `pre` 文本即可带走源码，但改文字后需重新初始化才会重绘。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
