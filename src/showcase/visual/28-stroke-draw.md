---
layout: doc
navbar: true
sidebar: false
---

# 28. SVG 路径描边绘画

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/stroke-draw.html" title="SVG 路径描边绘画" :height="520" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/stroke-draw.html
:::

## 三、使用讲解

### 实现原理

- **描边核心**：`.draw` 统一设置 `fill: none`、`stroke-linecap: round`、
  `stroke-dasharray: var(--len)`、`stroke-dashoffset: var(--len)`，
  `@keyframes draw` 把 offset 过渡到 0，虚线段便沿着路径长度被逐段"画"出来；
  每条元素用 `style="--len: ...; --dur: ...; --delay: ..."` 单独编排。
- **长度校准**：`calibrate()` 遍历 `.draw`，具备 `getTotalLength()` 的元素（path / circle）
  直接取真实长度，`<g>` 没有该方法时累加子 `<path>` 的长度，`Math.ceil` 后写回 `--len` ——
  手写的 `460 / 520 / 220` 只是首帧兜底，每次播放前都会被真实值覆盖。
- **分层上色**：DOM 顺序即绘制层级，先放天空 `<rect class="fill-in" style="--delay: 2.6s">`
  与两座山的填充（2.7s / 2.8s，颜色 `#a7f3d0`、`#6ee7b7`），再叠描边路径
  （第一座山 `--len: 460 --dur: 1.1s --delay: 0s`，第二座山 `--len: 520 --dur: 1.2s --delay: 0.5s`），
  房子的墙体与屋顶填充排在最后（3s / 3.1s）。
- **时间轴编排**：地平线 `--delay: 1.4s`，太阳 `--len: 220 --dur: 0.9s --delay: 1.2s`，
  八道光芒 `<g>` `--len: 160 --dur: 0.7s --delay: 1.7s`，房子 `<g>` `--len: 330 --dur: 1.2s --delay: 2s`，
  云 `<g>` `--len: 300 --dur: 1s --delay: 2.3s`，错开后形成"先山后日再屋云"的顺序。
- **淡入填充**：`.fill-in` 初始 `opacity: 0`，`.playing .fill-in` 变为 1 并带
  `transition: opacity 0.8s ease` 与 `transition-delay: var(--delay, 1s)`，
  因此描边画完之后颜色才逐渐浮现，不会一开始就压住线条。
- **播放控制**：`play()` 三步 —— 移除 `.playing`、执行 `calibrate()`、
  `void art.getBoundingClientRect().width` 强制回流，然后加回 `.playing`；
  `window.addEventListener('load', play)` 负责首播，「↻ 重新绘制」按钮负责重播。

### 如何调整

- 每条路径的 `--len` / `--dur` / `--delay` 三个变量各自独立，`--delay` 越大越晚起笔，
  `--dur` 决定这条线画多快（CSS 里的兜底值是 `1.4s` 与 `0s`）。
- 线条外观改 `.draw` 的 `stroke-linecap` / `stroke-linejoin`（都是 `round`），
  以及各元素的 `stroke-width`：山 4、地平线 3、云 3.5、房体 4。
- 整体节奏把所有 `--dur` 同比例缩放；上色时间整体前移或后移，改天空 `rect` 与两座山
  `fill-in` 的 `2.6s / 2.7s / 2.8s` 这一组值即可。

### 注意事项

- 重播必须强制回流，删掉 `void art.getBoundingClientRect().width` 后，
  类名一去一回会被浏览器合并，动画不会重启。
- 手写的 `--len` 与真实路径长度可能不符，`calibrate()` 每次播放前都会覆盖它，
  所以自行改 `viewBox` 或路径 `d` 之后无需手工重新计算长度。
- SVG 的 `<g>` 上没有 `getTotalLength()`，源码用
  `typeof el.getTotalLength === 'function'` 分支处理，新增 `<g>` 包多条 path 时自动生效，
  但仍建议给 `<g>` 留一个初始 `--len` 兜底样式，避免首帧完全不可见。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
