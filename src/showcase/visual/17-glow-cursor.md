---
layout: doc
navbar: true
sidebar: false
---

# 17. 光晕跟随光标

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/glow-cursor.html" title="光晕跟随光标" :height="440" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/glow-cursor.html
:::

## 三、使用讲解

### 实现原理

- 三个 `position: fixed` 的圆层叠加：`.glow` 是 340×340 的
  `radial-gradient(circle, rgba(99, 102, 241, 0.35), transparent 65%)` + `filter: blur(18px)`；
  `.ring` 是 56px、2px 的 `rgba(103, 232, 249, 0.75)` 圆环；`.dot` 是 8px 的 `#f0abfc` 实心点带 `box-shadow: 0 0 12px`。
- 初始状态 `mouse = { x: innerWidth / 2, y: innerHeight / 2 }`，各层位置对象 `g`、`r` 也从视口中心出发，
  所以首帧三层圆完全重合，之后才逐渐拉开拖尾。
- 中间标题 `.content h1` 是流光字：`linear-gradient(90deg, #a5b4fc, #67e8f9, #f0abfc)` 配
  `background-clip: text` + `color: transparent`，`@keyframes shine 5s linear infinite` 把
  `background-position` 从 `0% 0` 推到 `200% 0`。
- 三层都用 `transform: translate(-50%, -50%)` 以自身中心对准坐标，并设 `pointer-events: none`、
  `z-index` 依次为 1 / 2 / 3（内容层是 4）。
- 快慢差异来自 `lerp(a, b, n) = a + (b - a) * n`：`loop()` 每帧把光晕按 `0.07`、圆环按 `0.18` 的系数
  插值到 `mouse.x/y`，而实心点在 `mousemove` 里直接写 `left/top` —— 形成"慢光晕 + 中速环 + 精确点"三层拖尾。
- 悬停反馈靠事件委托：`mouseover / mouseout` 里 `e.target.closest('button, a')` 切换 `.ring.hot`
  （放大到 84px、边框换 `rgba(244, 114, 182, 0.9)`）。
- 点击 `#btn` 用 Web Animations API `ring.animate([...], { duration: 500, easing: 'ease-out' })`
  播放 `scale(1) → scale(2.2) → scale(1)` 的脉冲；`.content` 整体 `pointer-events: none`，只有 `.btn` 恢复可点。

### 如何调整

- `loop()` 里的 `0.07` / `0.18` 是跟随系数，越接近 1 跟得越紧，差距越小拖尾越不明显。
- 三层尺寸与配色都在 CSS 里：`340px` / `blur(18px)` / `rgba(99,102,241,0.35)`、`56px → 84px`、`8px #f0abfc`。
- 脉冲幅度改 `ring.animate` 中的 `scale(2.2)`，时长改 `duration: 500`。
- 内容区 `.content` 的 `pointer-events: none` 与按钮 `.btn` 的 `pointer-events: auto` 是配套写法，
  决定了"光标层不挡点击、按钮仍可点"，调整层级或加新交互元素时别漏。

### 注意事项

- `loop()` 的 `requestAnimationFrame` 没有保存句柄也不终止，页面常驻或组件化复用时需要自己在卸载时取消。
- 触屏 / 无鼠标环境里 `mouse` 初始值是视口中心，光晕会一直停在正中，`dot` 也只在 `mousemove` 后才动。
- `filter: blur(18px)` 在低端设备上开销明显，可缩半径或直接用预置的径向渐变代替模糊。
- 三层 `z-index`（1/2/3）与内容层（4）是写死的，挪到有复杂层级的页面时要重新对齐。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
