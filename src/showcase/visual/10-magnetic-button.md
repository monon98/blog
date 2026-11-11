---
layout: doc
navbar: true
sidebar: false
---

# 10. 磁吸按钮（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<MagneticButton label="Magnetic" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/magnetic-button.vue
:::

## 三、使用讲解

### 实现原理

- props 有两个：`label?`（默认 `Magnetic`）与 `strength?`（默认 `0.4`，注释为「吸附强度 0~1，越大跟手越紧」）。
  注意源码 `onMove` 里位移写死为 `tx.value = dx * 0.4`，`strength` 目前仅声明未接入计算，
  要改强度需直接改 `onMove` 中的 `0.4`。
- `onMove(e)` 以 `el.parentElement`（即 `.stage`）作感应区，取按钮中心 `cx / cy`，
  算 `dx / dy` 与 `dist = Math.hypot(dx, dy)`，感应半径 `radius = Math.max(rect.width, rect.height) * 1.1`；
  `dist < radius` 时置 `active = true` 并 `tx = dx * 0.4`、`ty = dy * 0.4`，否则调 `reset()` 归零。
- 跟手快、回弹慢的双过渡：`.magnetic` 默认 `transition: transform 0.12s ease-out`；
  `active` 为 false 时按钮带 `settling` 类，切到 `0.55s cubic-bezier(0.22, 1.6, 0.36, 1)`，
  第二个参数 1.6 的过冲系数产生弹性回弹。
- 位移通过内联 `:style` 把 `translate3d(tx px, ty px, 0)` 应用到按钮，
  配合 `will-change: transform` 走合成层，避免每帧触发布局重排。
- `onClick()` 置 `clicked = true`，`window.setTimeout(..., 1400)` 后复位，
  提示文案在「🎉 捕获成功」与「把鼠标移近按钮，它会被"吸"过来」之间切换，
  `onUnmounted` 负责清这个定时器。
  `active` 为 false 时挂 `settling` 类触发弹性回弹，`clicked` 单独驱动提示文案，两者职责分离。

### 如何调整

- 吸附强度改 `onMove` 里的 `0.4`（0~1 越大越跟手），感应半径改 `radius` 公式里的 `* 1.1`。
- 回弹手感改 `.magnetic.settling` 的 `0.55s cubic-bezier(0.22, 1.6, 0.36, 1)`，1.6 越大弹得越高。
- 按钮外观在 `.magnetic`：`padding: 17px 46px`、胶囊圆角 `999px`、渐变 `#0ea5e9 → #6366f1`，
  外层感应区 `.stage` 是 `min-height: 260px` 的卡片。

### 注意事项

- `strength` prop 与实际计算不一致是已知坑，接入时把 `dx * 0.4` 改为 `dx * props.strength`，
  否则调用方传了值也不生效。
- 每次 `mousemove` 都调 `getBoundingClientRect()`，高频移动会频繁触发布局读取，
  建议用 `requestAnimationFrame` 节流或缓存 rect。
- 触摸设备不触发 `@mousemove`，磁吸效果仅鼠标可用，移动端应降级为普通按钮（源码未做 touch 分支）。

<script setup>
import MagneticButton from '@components/visual/magnetic-button.vue'
</script>
