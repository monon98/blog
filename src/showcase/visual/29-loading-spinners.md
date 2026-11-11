---
layout: doc
navbar: true
sidebar: false
---

# 29. 纯 CSS Loader 合集

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/loading-spinners.html" title="纯 CSS Loader 合集" :height="760" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/loading-spinners.html
:::

## 三、使用讲解

### 实现原理

- **零 JS 布局**：`.grid` 用 `repeat(auto-fill, minmax(150px, 1fr))` 与 `gap: 14px`
  自适应排出 10 个 `.cell`，每格是 56px 高、居中对齐的 `.stage` 加等宽字体的 `.name`，
  名称依次为 spinner、dual-ring、bouncing-dots、pulse、clock、equalizer、orbit、
  progress、flip-square、ripple。
- **分色旋转**：`.l-spinner` 是 44px 圆，`border: 4px solid rgba(148,163,184,0.25)` 打底、
  `border-top-color: #38bdf8` 做亮点，`spin 0.8s linear infinite`；`.l-dual` 是 46px 圆，
  `border-top/bottom-color: #f472b6`，其 `::after`（`inset: 5px`）用
  `border-left/right-color: #fbbf24` 以 `0.7s ... reverse` 反向旋转，形成双环对转。
- **延时序列**：bouncing-dots 三个 12px 圆点按 `0.15s / 0.3s` 错拍
  （颜色 `#34d399 / #22d3ee / #818cf8`），`bounce` 峰值为 `translateY(-14px) scale(1.15)`；
  equalizer 5 根 7px 竖条以 `0.12s` 递增、`scaleY(0.35 ↔ 1)`；orbit 三个球尺寸
  12 / 9 / 7px 错落挂在同一旋转容器上。
- **伪元素补层**：`.l-clock` 的 `::before`（3×15px、`transform-origin: top center`、1.6s）
  当秒针，`::after`（3×10px、起始 `rotate(90deg)`、8s）当分针；`.l-progress` 的 `::before`
  是 40% 宽的渐变条，`@keyframes slide` 从 `translateX(-110%)` 走到 `280%`。
- **变形与扩散**：`.l-flip` 36px 方块在 `cubic-bezier(0.6, 0, 0.4, 1)` 下
  `rotate(0 → 360deg)` 同时把 `border-radius` 从 8px 变到 50%、`scale(1 → 0.7)`；
  `.l-pulse` 用 `box-shadow: 0 0 0 16px` 由实到透明做扩散波；
  `.l-ripple` 三层环按 `0 / 0.5s / 1s` 延时 `scale(0.2 → 1)` 并淡出
  （颜色 `#38bdf8 / #818cf8 / #f472b6`）。

### 如何调整

- 速度改各 loader 自己的 `animation` 时长（源码范围 0.7s–1.6s）；错拍节奏改
  `animation-delay` 的步长：dots 0.15s、bars 0.12s、ripple 0.5s。
- 尺寸与配色都集中在对应 `.l-*` 选择器内部：`width / height` 加 `#38bdf8`、`#f472b6`、
  `#34d399`、`#a78bfa`、`#fbbf24` 等色值，改一处即可换掉该 loader 的主题。
- 栅格密度调 `.grid` 的 `minmax(150px, 1fr)` 与 `gap: 14px`，
  卡片外观改 `.cell` 的 `padding: 22px 12px 14px`、圆角 12px 与半透明背景。

### 注意事项

- 10 个动画基本只动 `transform` / `opacity`，可以常驻合成层；例外是 pulse 的
  `box-shadow` 扩散，每帧都会重绘，多实例同屏时优先换成 ripple 或 dots。
- 双环、时钟、进度条的图形有一半在 `::before / ::after` 里，
  复制单个 loader 到别的项目时要把伪元素规则一起带走，否则只剩空壳。
- 源码没有 `prefers-reduced-motion` 处理，长期展示建议补一个媒体查询关闭动画
  （`src/components/visual/day-night.vue` 末尾有现成写法可直接参考）。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
