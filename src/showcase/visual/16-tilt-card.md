---
layout: doc
navbar: true
sidebar: false
---

# 16. 3D 倾斜卡片

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/tilt-card.html" title="3D 倾斜卡片" :height="540" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/tilt-card.html
:::

## 三、使用讲解

### 实现原理

- 外层 `.card-wrap` 用 `perspective: 1000px` 建立 3D 视距，内层 `.card` 用 `transform-style: preserve-3d`
  保留子元素的 Z 轴，并设 `transition: transform 0.12s ease-out` 让倾斜跟手但不生硬。
- JS 在 `wrap` 上监听 `mousemove`，用 `card.getBoundingClientRect()` 把指针换算成 0~1 的 `px / py`，
  再按 `MAX = 14` 计算 `rotateY = (px - 0.5) * 2 * MAX`、`rotateX = (0.5 - py) * 2 * MAX`，
  鼠标在右侧时 `rotateY` 为负（卡片向左转），最后 `card.style.transform = 'rotateX(..) rotateY(..)'`。
- 高光层 `.glare` 是一层 `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%),
  rgba(255, 255, 255, 0.22), transparent 45%)`，JS 用 `setProperty('--mx', px*100 + '%')` 同步光斑中心，
  默认 `opacity: 0`，仅在 `.card:hover .glare` 时淡入到 1。
- 立体分层靠 `translateZ`：badge 40px、icon 60px、`h3` 34px、`p` 22px、`meta` 16px，数值越大倾斜时越"浮"在前面。
- `mouseleave` 把 transform 复位为 `rotateX(0deg) rotateY(0deg)`，高光随 `opacity 0.3s` 淡出。
- 卡片底色是两层渐变叠加：`radial-gradient(120% 90% at 20% 0%, #312e81, transparent 55%)` 压在
  `linear-gradient(155deg, #1e1b4b, #312e81 60%, #0f172a)` 之上，再加 `0 30px 60px rgba(0,0,0,0.5)` 投影。
- 卡片内容（badge "Tilt Card"、图标 🃏、`h3`、`p`、`meta`）全是静态节点，倾斜完全交给 CSS 的
  `translateZ` 参与 3D 变换，JS 只写最外层的 `transform`，不必逐层计算。
- 角度写入时用 `rotateX(..deg)` 字符串拼 `toFixed(2)` 的数值，避免超长浮点；整个脚本是经典 `var` 声明（非 module），
  放在 iframe 里不会污染外层页面。

### 如何调整

- `var MAX = 14` 是最大倾斜角度，调小更含蓄；`perspective: 1000px` 越小透视变形越夸张。
- `.glare` 里的 `420px`（光斑半径）与 `rgba(255, 255, 255, 0.22)`（高光强度）控制反光观感。
- 卡片尺寸写在 `.card-wrap { width: 300px; height: 380px; }`，各元素 `translateZ` 值可分层加深。

### 注意事项

- `.glare` 必须保持 `pointer-events: none`，否则会盖住文字、干扰 `.card:hover` 的判定。
- 监听挂在 `.card-wrap` 上却用 `card.getBoundingClientRect()` 计算，两者尺寸必须一致（当前都是 300×380），
  若给卡片加 margin 或偏移，倾角计算就会错位。
- 每次 `mousemove` 都同步写 style 与 CSS 变量，卡片结构很重时建议用 `requestAnimationFrame` 节流。
- 交互依赖 `mousemove`，触屏设备没有悬停，只能看到静态卡片，可自行补 `touchmove` 处理。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
