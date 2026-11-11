---
layout: doc
navbar: true
sidebar: false
---

# 04. 波浪 / 液体进度条

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/wave-progress.html" title="波浪 / 液体进度条" :height="660" />

## 二、代码实现

单文件自包含，SVG 环形进度 + CSS 液面双实现。

::: details 展开完整源码
<<< ../../public/html/visual/wave-progress.html
:::

## 三、使用讲解

### 实现原理

- **环形进度**：`stroke-dasharray = 2πr`（周长），`stroke-dashoffset = 周长 × (1 - 进度)` 控制可见弧长；渐变描边通过 `<linearGradient>` 引用。
- **液面波动**：液面高度 = 进度百分比，波浪用两层伪元素的圆形径向渐变重复平铺，`translateX` 循环位移形成正弦式起伏，两层反向不同速度产生层次。
- JS 侧一个 `render(p)` 同时驱动两处，滑块 `input` 事件实时联动。

### 如何调整

- 圆环半径 `r` 变化时，`CIRC = 2πr` 要同步（代码里用公式自动算，改 `r` 即可）。
- 波浪速度改 `animation-duration`，幅度改伪元素 `height` 与 `top` 负值。

### 注意事项

- `svg` 标签加了 `transform: rotate(-90deg)`，让弧线从 12 点方向开始。
- 液体容器用 `overflow: hidden` 裁掉溢出的波浪，圆角处自然被切割。
- 进度动画 `transition: stroke-dashoffset 0.4s`，批量更新时不会闪跳。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
