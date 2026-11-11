---
layout: doc
navbar: true
sidebar: false
---

# 25. 极光背景

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/aurora.html" title="极光背景" :height="440" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/aurora.html
:::

## 三、使用讲解

### 实现原理

- 四层极光带 `.a1`–`.a4` 都是绝对定位的大椭圆，公共样式为 `border-radius: 50%`、
  `filter: blur(70px)`、`opacity: 0.55`、`mix-blend-mode: screen`、`will-change: transform` ——
  强模糊把渐变边界完全糊开，滤色混合让重叠处自然增亮，看起来像持续流动的光带。
- 各层规格互不相同：`.a1` `#22c55e` 70vw×42vh 配 `drift1 16s`，`.a2` `#06b6d4` 62vw×46vh 配 `drift2 21s`，
  `.a3` `#8b5cf6` 58vw×38vh 配 `drift3 18s`，`.a4` `#f472b6` 36vw×26vh 且单独压到 `opacity: 0.35`
  配 `drift2 24s alternate-reverse`，四个周期互质般错开，叠加后不会同步重复。
- `drift1/2/3` 三组 `@keyframes` 同时改变 `translate(%)`、`rotate(deg)`、`scale`，
  例如 drift1 从 `translate(-4%, -6%) rotate(-8deg) scale(1)` 走到
  `translate(10%, 8%) rotate(6deg) scale(1.18)`，位移、自转、缩放三者并行才有"漂移"感。
- 层级靠 `.scene { isolation: isolate }` 建立独立混合上下文，四层极光与 `.stars` 统一
  `z-index: -1`，`h1 / p / .ctrl` 保持默认层级自然压在其上，内容不会被滤色影响。
- 星星是一整张 `background-image`：8 个 1.1px–1.6px 的 `radial-gradient` 点，
  配 300px–420px 各不相同的 `background-size` 交错平铺，`@keyframes twinkle` 让整体
  `opacity` 在 0.45 ↔ 0.85 之间 6s 交替，模拟星光明暗。
- JS 只负责两个按钮：慢速按钮把 `['16s', '21s', '18s', '24s']` 每个值乘 2.4 写回
  `animationDuration`；暂停按钮把四层与 `.stars` 的 `animationPlayState` 统一切成
  `paused` / `running`，并同步改按钮文案与 `.off` 类。

### 如何调整

- 慢速倍数在 speed 按钮回调里的 `Number(n) * 2.4`；数组要与 CSS 四条 `animation` 的
  16s / 21s / 18s / 24s 一一对应，改动必须两边同步。
- 光带浓度调 `.aurora` 的 `blur(70px)` 与 `opacity: 0.55`（`.a4` 另有 0.35）：
  模糊越大越"化"，透明度越高越亮，`.a4` 还可单独改 `width/height` 决定粉色高光范围。
- 换配色只改 `.a1`–`.a4` 里 `radial-gradient(ellipse at center, 颜色 0%, transparent 68%/70%)`
  的中间色（绿 / 青 / 紫 / 粉四色即为默认方案）。

### 注意事项

- `mix-blend-mode: screen` 必须依赖 `.scene` 的 `isolation: isolate`，
  去掉后四层会与更外层背景混合出意外颜色，文字也可能被一起混色。
- `blur(70px)` 属于全屏级大半径模糊，四层同时动画在低端设备上会明显掉帧，
  `will-change: transform` 只能提示提升合成层，模糊本身仍可能触发重绘。
- `html, body` 设了 `overflow: hidden`，而四层故意用 `left: -12vw`、`bottom: -6vh` 溢出画布，
  删除该声明会立刻冒出滚动条。
- speed 回调里 `animationDuration` 被赋值了两次（源码保留了两段），
  实际生效的是基于 `['16s','21s','18s','24s']` 的那次赋值。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
