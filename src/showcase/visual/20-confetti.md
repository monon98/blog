---
layout: doc
navbar: true
sidebar: false
---

# 20. 点击放彩带

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/confetti.html" title="点击放彩带" :height="440" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/confetti.html
:::

## 三、使用讲解

### 实现原理

- `burst(x, y)` 每次先 `burstCount++` 更新"已发射"计数，再取 `var n = 46 + Math.floor(Math.random() * 26)`
  决定本簇 46~71 片碎片，逐片创建 `.piece`（约 30% 概率加 `circle` 类变圆形）并 `document.body.appendChild`。
- 初速朝上半圆放射：`angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1`，
  `speed = 6 + Math.random() * 9`，`vx = cos(angle) * speed`、`vy = sin(angle) * speed`；
  另有初始旋转 `rot = rand*360`、角速度 `vr = (rand - 0.5) * 26`、寿命 `life = 1`、`decay = 0.010 + rand * 0.010`。
- 每片各自跑一个闭包 `step()`：重力 `state.vy += 0.34`、阻尼 `vx/vy *= 0.985`、
  `life -= decay`，`squash = Math.sin(state.rot * Math.PI / 180)` 换算成
  `scaleY(max(0.15, |squash|))` 模拟纸片翻飞压扁，透明度写 `Math.min(1, state.life * 2)`。
- 生命周期：`life <= 0` 或 `y > window.innerHeight + 40` 时 `el.remove()` 并把 `alive` 计数减回去。
- 触发点有三处：`.stage` 点击任意处按 `e.clientX/Y` 爆开；`#fire` 按钮 `stopPropagation()` 后在
  `(innerWidth / 2, innerHeight * 0.62)` 放；页面加载 400ms 后自动在 `innerHeight * 0.55` 来一簇。
- 碎片是 `position: fixed; left: 0; top: 0` 的 10×16 小块（圆形版 12×12），靠 `translate` 移动，并声明了
  `will-change: transform, opacity`。
- 计数有两处：`burstCount`（已发射簇数）只增不减，`alive`（存活碎片数）在创建时 `++`、在 `el.remove()` 时 `--`，
  且统一用 `Math.max(0, alive)` 兜底后写回 `.counter`。
- 取色用 `COLORS[(Math.random() * COLORS.length) | 0]`，按位或截断等价于 `Math.floor`，从 8 色里随机取一个。

### 如何调整

- `COLORS` 数组（8 色）决定配色；`n = 46 + Math.floor(Math.random() * 26)` 控制每簇规模。
- 手感参数都在 `state` 里：重力 `0.34`、阻尼 `0.985`、角速度 `26`、`decay`（越大消失越快）、初速 `6 + rand * 9`。
- 碎片形状改 `.piece` 的 `width: 10px; height: 16px` 与 `.piece.circle` 的 `12px`；自动首爆的 `setTimeout(..., 400)` 可删。

### 注意事项

- 每簇要新建 46~71 个 DOM 节点，且每片各自起一个 `requestAnimationFrame` 循环，连续点击会让 rAF 数量暴涨；
  正式项目建议改成单个 rAF 统一驱动 + 元素池复用。
- 碎片是逐帧写 `transform / opacity` 的合成属性（配合 `will-change`），但仍会频繁触发样式计算与节点插入/删除。
- 彩带被 `append` 到 `document.body`，在 iframe 里没问题，搬到整页应用时注意父容器的 `overflow` 与 `z-index`。
- 碎片只在 `life <= 0` 或 `y > innerHeight + 40` 时才 `el.remove()`，连续狂点会让同屏 DOM 冲到数百个，
  建议按点击节流或限制同屏 `alive` 上限。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
