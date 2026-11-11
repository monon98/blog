---
layout: doc
navbar: true
sidebar: false
---

# 18. 网格聚光灯

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/spotlight-grid.html" title="网格聚光灯" :height="560" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/spotlight-grid.html
:::

## 三、使用讲解

### 实现原理

- JS 用 `COLS = 18`、`ROWS = 9` 循环创建 162 个 `.cell` 塞进 `.grid`，grid 布局是
  `grid-template-columns: repeat(18, 1fr)` + `grid-template-rows: repeat(9, 1fr)`、`gap: 6px`、`padding: 10px`。
- `mousemove` 时先拿到 `.spot`（260px 径向光斑，`mix-blend-mode: screen`）的坐标，再对每个格子
  `getBoundingClientRect()` 求中心，用 `Math.hypot(cx - mx, cy - my)` 算距离。
- 只有 `dist < RADIUS`（`RADIUS = 170`）的格子才点亮：把 `--d = dist / RADIUS`（0 最近 ~ 1 边缘，保留 3 位）
  写进元素并加 `.lit`，超出半径则 `classList.remove('lit')`。
- 点亮效果由 CSS 变量 + `calc()` 驱动：背景 `rgba(129, 140, 248, calc(0.9 - var(--d) * 0.75))`、
  阴影 `box-shadow: 0 0 calc(18px - var(--d) * 14px) rgba(129, 140, 248, 0.75)`、
  `transform: scale(calc(1.18 - var(--d) * 0.2))` —— 距离越小越亮、光晕越大、缩放越明显。
- 同一次循环里累计 `litCount` 与最近距离 `nearest`，写进 `.readout` 的
  `照亮格子 <b>N</b> / 162 · 最近距离 <b>xxpx</b>`；`mouseleave` 批量移除 `.lit` 并复位文案。
- 计数逻辑写在同一次遍历里：`litCount` 每次进循环先归零，`nearest` 初始为 `Infinity`，
  只在 `dist < RADIUS` 的分支里更新，最后由 `readout.innerHTML` 拼接 `<b>` 高亮统计。
- 格子的默认态也定义在 CSS 中：`.cell { border-radius: 6px; background: rgba(148, 163, 184, 0.07); }`，
  容器 `.board` 是 `max-width: 720px; height: 360px; cursor: crosshair` 的圆角面板。

### 如何调整

- `RADIUS = 170` 是照亮半径，调大光圈更大；`COLS / ROWS` 要和 CSS 的 `repeat(18, 1fr) / repeat(9, 1fr)` 一起改。
- `.cell.lit` 三处 `calc` 的系数（`0.9 / 0.75`、`18px / 14px`、`1.18 / 0.2`）分别控制亮度、发光半径与放大幅度。
- `.spot` 的 `260px` 与 `rgba(165, 180, 252, 0.16)` 控制顶层光斑；格子底色是 `rgba(148, 163, 184, 0.07)`。

### 注意事项

- 每次 `mousemove` 对 162 个格子调 `getBoundingClientRect()`（强制读布局），高频移动容易掉帧；
  源码里 `centers` 数组实际没被使用（注释写着"懒加载，首次移动时测量"），可缓存中心点并用 rAF 节流。
- `transition: background 0.18s, box-shadow 0.18s, transform 0.18s` 让开关灯有过渡，但快速划过会留下"拖尾"感，想更跟手可缩短。
- 格子数超过约 300 个时 DOM 距离计算开销明显上升，大规模网格更适合改用 canvas 实现。
- 每次 `mousemove` 都是"先批量 `getBoundingClientRect()` 读、再写 style / classList / innerHTML"，
  读写交替会加剧布局抖动，可把统计文案的更新降频到每几帧一次。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
