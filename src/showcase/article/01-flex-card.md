---
layout: doc
navbar: true
sidebar: false
---

# 01. 扩展卡片 Flexbox 过渡

← [返回与已有文章联动列表](../article)

关联文章：[002. 扩展卡片效果：用 Flexbox 和 CSS 过渡打造惊艳交互体验](../../docs/collection/reposts/前端/002.%20扩展卡片效果：用%20Flexbox%20和%20CSS%20过渡打造惊艳交互体验)

## 一、展示用例

<HtmlFrame src="html/article/flex-card.html" title="扩展卡片 Flexbox 过渡" :height="460" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/article/flex-card.html
:::

## 三、使用讲解

### 实现原理

- 每张卡片默认 `flex: 1`，激活态 `.card.active { flex: 3.5 }`，JS 只负责切换 `active` 类，宽度变化全由浏览器在两档 flex 值之间插值。
- `transition: flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)` 作用于 flex 属性，主轴尺寸变化平滑过渡，无需任何 JS 宽度计算。
- 描述段落默认 `max-height: 0; opacity: 0`，激活时 `max-height: 140px; opacity: 1`，且两者都带 `0.15s` 延迟，让文字在卡片撑开后再浮现。
- 渐变背景用伪元素 `::before` + `inset: 0` 铺满，颜色由行内 `--c1 / --c2` 自定义属性注入，`.card > * { position: relative }` 让内容压在渐变之上。

### 如何调整

- 展开幅度改 `.card.active` 的 `flex: 3.5`（数值越大展开占比越大）；动画节奏改 `transition` 的 `0.6s` 与缓动曲线。
- 换配色只改每张卡片行内的 `--c1 / --c2`；卡片数量直接增删 `.card` 节点即可，flex 自动均分。

### 注意事项

- `flex` 过渡在 Chrome / Firefox 可用，但属于较新的过渡属性，老内核浏览器（如旧版 Safari）可能直接跳变——降级方案是改过渡 `width` 或用 `flex-grow` 过渡。
- 描述文字用 `max-height` 撑开，值要大于实际内容最高行数，否则会被 `overflow: hidden` 裁掉。
- 媒体查询 `max-width: 600px` 时切 `flex-direction: column` 并把激活值降为 `2.5`，窄屏复用同一套结构。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
