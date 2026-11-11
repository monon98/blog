---
layout: doc
navbar: true
sidebar: false
---

# 06. 无限轮播 / 跑马灯

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/marquee.html" title="无限轮播 / 跑马灯" :height="760" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/marquee.html
:::

## 三、使用讲解

### 实现原理

- 无缝核心：`.track` 用 `width: max-content`，把 8 个 `.chip` 手写成完全相同的两份。
  `@keyframes scrollX` 从 `translateX(0)` 走到 `translateX(-50%)` —— 位移正好等于一份内容宽度，
  接缝处首尾相接；外层 `animation: scrollX 22s linear infinite`。
- 悬停暂停：`.marquee:hover .track { animation-play-state: paused }`；
  反向条目给 `.track.reverse` 单独设 `animation-direction: reverse` 与 `28s` 时长，
  共用同一个 `scrollX` 关键帧，只是方向与时长不同。
- 两端淡出：`.marquee` 上挂 `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)`，
  并同时写了 `-webkit-mask-image` 兼容老 Safari。
- 纵向版 `.vscroll` 固定 `height: 150px` + `overflow: hidden`，`.vtrack` 把 5 条 `.vitem` 复制两份，
  `scrollY 16s` 沿 Y 轴同样位移 `-50%`，遮罩改为 `180deg`、`12% / 88%`。
  条目本体 `.vitem` 左侧是文字、右侧是蓝色数值（`b { color: #38bdf8 }`）。
- 渐变文字：`.text-run` 用 `background-clip: text` + `color: transparent`，`background-size: 200% 100%`
  让 `shine 6s` 平移背景形成流光，内部 `<span>` 复用 `scrollX` 以 `14s` 滚动并 `padding-right: 60px` 拉开间距。

### 如何调整

- 速度只改 duration：横向 `22s`、反向 `28s`、纵向 `16s`、文字 `14s`；
  条目增多时按比例加长，保持观感速度一致（位移距离随内容变长，时长不变就会加速）。
- 淡出范围改 mask 渐变里的 `8%` / `92%`；条目间距改 `.track { gap: 12px }`（纵向 `.vtrack` 是 `10px`）。
- 配色：`.chip` 是 `rgba(99, 102, 241, 0.35) → rgba(56, 189, 248, 0.35)` 渐变，
  `.chip.alt` 是粉橙系（`rgba(244, 114, 182, 0.3)` 起步），改 `background` 即可。

### 注意事项

- `-50%` 方案要求内容严格两份且等宽，若用 JS 动态增删条目，必须同步复制一份，否则接缝会跳帧。
  源码里两份内容是手写重复的 8 个 `.chip`，改文案时两处都要同步改。
- `mask-image` 必须连同 `-webkit-mask-image` 一起写，只写标准版在部分旧版 WebKit 上不生效。
- `animation-play-state: paused` 依赖 hover，触摸设备没有悬停态，
  移动端需另加 `touchstart` 事件控制暂停与恢复，纵向滚动同理。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
