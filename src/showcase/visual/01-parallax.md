---
layout: doc
navbar: true
sidebar: false
---

# 01. 视差滚动

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/parallax.html" title="视差滚动" :height="460" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/parallax.html
:::

## 三、使用讲解

### 实现原理

- 每个图层用 `data-speed` 声明自己的视差速率，滚动时统一写入 `transform: translate3d(0, y × speed, 0)`。
- 用 `requestAnimationFrame` + `ticking` 标志节流，保证一帧最多计算一次位移。
- 只改 `transform`，位移由合成器完成，滚动过程不触发重排（reflow）。

### 如何调整

- `data-speed` 取值：`0` = 完全不动（前景文字），`0.15` = 远景星空，`0.3 ~ 0.7` = 中景错落层。
- 图层内容可自由替换（图片、文字、形状），只要保留 `data-speed` 属性即可接入同一套滚动逻辑。

### 注意事项

- 位移量 = 滚动距离 × 速率，页面很长时图层要留够高度，否则低速层会露出底色。
- `position: fixed` 的图层脱离文档流，正文区域需要自行留白避免重叠。
- 移动端性能敏感时，可用媒体查询去掉 `data-speed` 降级为静态背景。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
