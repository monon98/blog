---
layout: doc
navbar: true
sidebar: false
---

# 04. 图片懒加载 / 瀑布流（原生 HTML）

← [返回面试题联动列表](../interview)

关联题目：[31. 图片懒加载](../../docs/interview/20.%20前端编程题/31.%20图片懒加载)

## 一、展示用例

<HtmlFrame src="html/interview/lazyload.html" title="图片懒加载 / 瀑布流" :height="740" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/interview/lazyload.html
:::

## 三、使用讲解

### 实现原理

- 图片地址不写进 `src` 而存 `img.dataset.src`，`<img>` 初始无 src 配合 CSS `opacity: 0` 显示 `.card::before` 的骨架屏 shimmer 动画，首屏零图片请求。
- `IntersectionObserver` 观察每个 `.card`（`rootMargin: '160px 0px'` 提前 160px 预加载），回调里命中 `isIntersecting` 才 `img.src = img.dataset.src`，随后 `delete dataset.src` 并 `io.unobserve(card)`——每张图只加载一次、只回调一次。
- `img.onload` 里加 `.loaded`（淡入）和 `.done`（隐藏骨架、显示「已加载 #n」角标）并 `loadedCount + 1` 刷新顶部统计。
- 瀑布流用 CSS `column-count: 3` + `break-inside: avoid` 实现（媒体查询降到 2 / 1 列），图片高度由 `HEIGHTS` 数组产生差异错落。
- 图片是运行时拼的内联 SVG data URI（渐变 + 序号文字），整个文件无任何外部依赖，可整文件复制。

### 如何调整

- 预加载距离改 `rootMargin: '160px 0px'`（负值则进入视口后才加载）；阈值可加 `threshold` 控制可见比例。
- 数量、列数、配色分别在 `COUNT`、`.masonry` 的 `column-count`、`COLORS / HEIGHTS` 数组里。
- 真实项目替换 `makeSrc(i)` 为接口返回的图片 URL 即可，懒加载逻辑不变；也可只用 `loading="lazy"` 一行，但其预加载时机不可控，本例为了可演示采用 IO 方案。

### 注意事项

- `img.width / img.height` 必须写死（400 × HEIGHTS[i]），否则图片加载前无占位高度，瀑布流布局会跳动。
- IO 回调里 `if (img.dataset.src && !img.src)` 双重判断，防重复赋值；`unobserve` 后若想「回到顶部重新触发淡入」，需重置类名——本例按钮只回顶滚动，已加载的不会重新变骨架，属预期。
- `content-visibility` 或虚拟滚动与本方案可叠加，超长列表建议组合使用。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
