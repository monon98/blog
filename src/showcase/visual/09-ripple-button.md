---
layout: doc
navbar: true
sidebar: false
---

# 09. 涟漪按钮（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<RippleButton label="点我试试" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/ripple-button.vue
:::

## 三、使用讲解

### 实现原理

- props 仅 `label?`（默认「点击产生涟漪」）；`ripples = ref<Ripple[]>` 存 `{ id, x, y, size }`，
  `uid` 自增作 `:key`，模板用 `v-for` 渲染多个 `.ripple` span。
  按钮本体用 `ref="btnRef"` 挂在 `HTMLButtonElement` 上，供坐标计算使用。
- `onClick(e)` 通过 `btnRef.value.getBoundingClientRect()` 把 `e.clientX / e.clientY`
  换算成按钮内坐标 `x / y`，再用 `Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2`
  计算 `size` —— 点击点到最远角距离的两倍，保证圆一定扩到按钮边缘。
- 每个涟漪 `transform: translate(-50%, -50%) scale(0)` 起步，
  `animation: ripple 0.6s ease-out forwards` 扩到 `scale(1)` 同时 `opacity: 0`；
  `window.setTimeout(..., 650)` 后从数组 `filter` 移除（比动画时长多 50ms）。
  先 `++uid` 再 `push`，保证每个涟漪的 `:key` 全局唯一，动画不会互相复用。
- 样式要点：按钮 `overflow: hidden` + `isolation: isolate` 裁住涟漪，
  `.label` 设 `z-index: 1` 保证文字压在涟漪之上；背景是 `linear-gradient(135deg, #6366f1, #8b5cf6)`。
- 交互反馈：`:hover` 上浮 `translateY(-2px)` 并加深阴影 `0 12px 26px rgba(99, 102, 241, 0.45)`，
  `:active` 回到 `translateY(0) scale(0.98)`。

### 如何调整

- 涟漪浓度改 `.ripple` 的 `rgba(255, 255, 255, 0.55)`，扩散速度改 `ripple 0.6s`，
  `onClick` 里 650ms 的移除延时要同步改（必须大于动画时长）。
- 按钮尺寸在 `.ripple-button` 的 `padding: 13px 34px` 与 `border-radius: 10px`，
  渐变换 `background` 即可，涟漪色与按钮底色反差越大越明显。
- 想限制同时存在的涟漪数量，在 `ripples.value.push(...)` 之前对数组做长度截断。

### 注意事项

- 每次点击都 `getBoundingClientRect()` 读一次布局，按钮带 CSS `transform`（hover 位移）时坐标仍正确，
  但若外层容器有 `scale` 缩放，坐标会按视觉尺寸计算而偏移，涟漪圆心会偏离真实点击点。
- `.ripple` 必须保留 `pointer-events: none`，否则涟漪会成为点击目标，连点时事件坐标会算偏。
- 移动端已加 `-webkit-tap-highlight-color: transparent`，
  去掉会在点按瞬间叠加系统高亮底色，与涟漪动画叠在一起很脏。

<script setup>
import RippleButton from '@components/visual/ripple-button.vue'
</script>
