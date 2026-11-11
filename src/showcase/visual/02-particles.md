---
layout: doc
navbar: true
sidebar: false
---

# 02. 鼠标跟随粒子 / 烟花

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/particles.html" title="鼠标跟随粒子 / 烟花" :height="440" />

## 二、代码实现

单文件自包含，Canvas 粒子系统无任何外部依赖。

::: details 展开完整源码
<<< ../../public/html/visual/particles.html
:::

## 三、使用讲解

### 实现原理

- 每个粒子是一个普通对象 `{ x, y, vx, vy, life, size, color }`，帧循环里统一 `update()`（积分速度 + 重力 + 阻尼）与 `draw()`（按剩余寿命计算透明度）。
- 背景用半透明填充 `rgba(5,6,15,0.22)` 擦除，自然形成拖尾残影，无需逐像素清空。
- 鼠标移动按位移差生成拖尾粒子，点击以 70+ 粒子按圆周角均匀发射形成烟花。

### 如何调整

- `trail()` 里的 `40 + Math.random() * 25` 控制拖尾寿命，`burst()` 的 `n` 控制烟花规模。
- `COLORS` 数组决定配色；`Particle` 中 `vy += 0.045` 是重力，调大下落更快。

### 注意事项

- 粒子上限 1200 做了兜底清理（`splice` 最旧的），避免长时间运行内存无限增长。
- `mousemove` 依赖 `mouse.px/py` 上一帧位置算速度，首次进入（px = -999）不会生成粒子。
- 高 DPI 屏如需更清晰，可按 `devicePixelRatio` 放大 `canvas.width` 并 `ctx.scale()`。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
