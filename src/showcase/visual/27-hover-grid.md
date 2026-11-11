---
layout: doc
navbar: true
sidebar: false
---

# 27. 波点矩阵涟漪

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/hover-grid.html" title="波点矩阵涟漪" :height="580" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/hover-grid.html
:::

## 三、使用讲解

### 实现原理

- **建阵列**：JS 按 `COLS = 24`、`ROWS = 13` 循环创建 312 个 `.dot` 并 push 进 `dots[]`，
  容器 `.dots` 用 `grid-template-columns: repeat(24, 1fr)` 与
  `grid-template-rows: repeat(13, 1fr)` 一一对应，`place-items: center` 让点居中于各自格子。
- **缓存坐标**：`measure()` 拿 `.board` 与每个 dot 的 `getBoundingClientRect()`，
  算出相对 board 的中心存入 `centers[]`；mousemove 期间只读缓存做
  `Math.hypot(c.x - mx, c.y - my)`，事件里不再读布局，避免每帧强制同步排版。
- **距离归一**：影响半径 `RADIUS = 130`，`dist < 130` 时 `k = 1 - dist / RADIUS`
  （1 最近、0 最远），写入该点的行内 `--k`；已在范围外且
  `getPropertyValue('--k') !== '0'` 才复位，避免对静止点重复写样式。
- **CSS 变量一次驱动三件事**：`transform: scale(calc(1 + var(--k, 0) * 2.6))` 放大，
  `rgb(calc(51 + k*96), calc(65 + k*140), calc(85 + k*165))` 把基础色 `#334155`
  渐变成亮蓝，`box-shadow: 0 0 calc(k*14px) rgba(56, 189, 248, k*0.9)` 生成辉光，
  三项过渡统一 `0.12s ease-out`，所以手感是"跟手但略带缓冲"。
- **点击涟漪**：click 时新建 `.ripple` div（20px、2px `rgba(56,189,248,0.8)` 边框）
  用点击坐标定位，`@keyframes ripple` 放大到 `scale(16)` 并淡出（0.9s ease-out forwards），
  `setTimeout(..., 950)` 后 `remove()` 回收节点。
- **收尾逻辑**：`mouseleave` 把全部 `--k` 归 0 并复位提示文字，`readout` 实时显示
  "点亮 x / 312 个波点"；`window.resize` 时执行 `centers = []` 作废缓存，
  下一次 mousemove 发现缓存为空会重新 `measure()`。

### 如何调整

- 手感四个旋钮：`RADIUS`（影响半径，越大波及范围越广）、`.dot` 里的 `2.6`（放大倍数）、
  `14px`（辉光半径）、`0.12s ease-out`（跟随与回落速度）。
- 密度要同步改三处：`COLS` / `ROWS` 两个常量与 `.dots` 的两个 `repeat()`，
  只改 JS 不改 CSS 会导致行列数对不上。
- 配色改三处：`.dot` 基础色 `#334155`、rgb 里的增量 `96 / 140 / 165`（决定点亮终点色）、
  box-shadow 与涟漪边框的 `rgba(56, 189, 248, ...)` 主题蓝。

### 注意事项

- 每次 mousemove 全量遍历 312 个点，靠"坐标缓存 + 仅在值变化时写 `--k`"控制开销；
  密度提到 40×40 以上时，建议改用 canvas 一次性重绘而不是操作 1600+ 个元素的 style。
- `centers` 只在 `window.resize` 时作废，如果容器被父级布局或 CSS 动画改变尺寸
  （不触发 window resize），坐标会过期，可换成 `ResizeObserver` 监听 `.board`。
- 涟漪节点依赖 `pointer-events: none` 不挡后续点击，且必须定时 `remove()`，
  否则长时间连续点击会让 DOM 节点持续堆积。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
