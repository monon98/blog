---
layout: doc
navbar: true
sidebar: false
---

# 08. 打字机效果（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<Typewriter :speed="14" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/typewriter.vue
:::

## 三、使用讲解

### 实现原理

- props 只有两个：`text?`（默认「把一段文字逐字打出来——这就是打字机效果……」）
  与 `speed?`（每秒打出的字符数，默认 `12`），由 `withDefaults` 提供默认值。
  两个 prop 都是可选的，最简用法直接写 `<Typewriter />`。
- 响应式数据 `index = ref(0)` 记录已打出的字数，
  `display = computed(() => props.text.slice(0, index.value))` 截取显示文本，
  `done = computed(() => index.value >= props.text.length)` 控制光标状态。
- `play()` 先 `clear()` 再 `window.setInterval(..., 1000 / props.speed)`，每拍 `index.value += 1`；
  打满后在回调里 `clear()` 并把 `running` 置回 `false`，同时按钮从「暂停」切回「重播」。
  模板里还有一行速度提示，用 `speed` 拼出「速度 N 字/秒」的文案，与 prop 实时联动。
- `toggle()` 负责暂停与重播：运行中调 `clear()` 停表；重播时若 `done.value` 为真先把 `index` 归 0 再 `play()`，
  按钮文字由 `running` 状态驱动（运行中显示「暂停」，否则显示「重播」）。
- 生命周期：`watch(() => props.text, ...)` 监听文案变化自动 `index = 0` 重播，
  `onMounted(play)` 开始打字，`onUnmounted(clear)` 清理定时器。

### 如何调整

- 速度改传入的 `:speed`（本页为 `:speed="14"`，即每秒 14 字），实际间隔是 `1000 / props.speed` 毫秒。
- 文案用 `:text="'……'"` 传入，组件监听 `props.text` 变化会自动从头重播，无需手动重置。
- 光标是 `.caret`：`width: 2px; height: 1.1em`、颜色 `var(--vp-c-brand, #3451b2)`，
  `blink 0.9s steps(1)` 动画只在 `!done` 时通过 `:class="{ blink: !done }"` 挂上，打完自动停止闪烁。

### 注意事项

- 定时器句柄 `timer` 是普通 `let` 变量，`onUnmounted(clear)` 必须保留，
  否则路由切走后 interval 继续跑，造成定时器泄漏。
  `clear()` 会把 `timer` 置回 `undefined`，重复清理是安全的。
- 组件只在 `onMounted` 后才调用 `window.setInterval`，SSR 渲染阶段不会执行，服务端安全。
  SSR 阶段 `index` 仍是 0，输出空文本，水合后才由 `play()` 逐字打出。
- 光标元素是行内块，`vertical-align: -0.15em` 用于对齐中文基线，
  更换字体后可能需要微调该值；打完字后 `.caret` 不再带 `blink` 类，光标静止。

<script setup>
import Typewriter from '@components/visual/typewriter.vue'
</script>
