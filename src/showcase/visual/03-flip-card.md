---
layout: doc
navbar: true
sidebar: false
---

# 03. 3D 翻转卡片

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/flip-card.html" title="3D 翻转卡片" :height="480" />

## 二、代码实现

单文件自包含，点击卡片即可翻转。

::: details 展开完整源码
<<< ../../public/html/visual/flip-card.html
:::

## 三、使用讲解

### 实现原理

- 父容器 `perspective: 1200px` 建立 3D 视距，`transform-style: preserve-3d` 让子元素保留立体空间。
- 正反两个面绝对定位铺满卡片，背面预置 `transform: rotateY(180deg)`。
- 两面都设 `backface-visibility: hidden`，翻转时背向视图的一面被隐藏，避免内容透叠。
- 点击切换 `.flipped`（`rotateY(180deg)`），`transition` 作用于 `transform` 完成整卡翻转。

### 如何调整

- `perspective` 越小 3D 透视越夸张；`transition` 的 `0.8s` 与缓动曲线控制翻转节奏。
- 卡片宽高、正反面内容、配色均为独立 CSS，按需替换。

### 注意事项

- 少了 `preserve-3d` 子元素会被压平成 2D，少了 `backface-visibility` 会看到背面文字的镜像。
- 移动端可监听 `touchstart` 替代 `click`（本例 click 在移动端同样可用，只是有约 300ms 差异，现代浏览器已优化）。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
