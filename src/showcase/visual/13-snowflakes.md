---
layout: doc
navbar: true
sidebar: false
---

# 13. 雪花飘落（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<Snowflakes :width="640" :height="180" :count="60" x="center" color="skyblue" :maxSpeed="1" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/snowflakes.vue
:::

## 三、使用讲解

### 实现原理

- 普通 `<script>` 块导出了 `Snowflake` 类与 `random(min, max)` 工具函数：构造时调用 `init()`，
  用 `random(minRadius, maxRadius)` 抽半径、`random(minSpeed, maxSpeed)` 抽速度，x / y 在画布内随机。
- 每帧 `update()` 执行 `y += speed * random(1, 1.05) * parms.y`、`x += speed * random(1, 1.05) * parms.x`，
  并让 `radius += 0.001` 缓慢变大；方向来自 `direction = { start: -1, center: 0, end: 1 }` 对 props `x` / `y` 字符串的映射。
- 示例里 `x="center"` 映射为 0（无横向漂移），默认 `y="end"` 映射为 1（y 持续增大，即向下飘落）。
- 出界回收写在 `update()` 内：`y > canvas.height` 时 `init(undefined, 0)` 从顶部重生，`y < 0` 时落回底部，
  `x < 0` / `x > width` 时横向回卷到画布另一侧，保证雪花永不消失。
- `onMounted` 里先 `canvas.width = props.width || window.innerWidth`（示例 640×180），再按 `props.count` 循环
  `new Snowflake(canvas, params)` 装满 `snowflakes` 数组，最后 `animate()` 用 `clearRect` 清屏、逐个 `draw()`
  （`ctx.arc` + `fillStyle = parms.color`）、`requestAnimationFrame(animate)` 递归驱动。
- 样式侧通过 `v-bind(props.backgroundColor)` 把 `backgroundColor`（默认 `rgba(0, 0, 0, 0.9)`）写进 canvas 背景。
- 两个 script 块分工明确：普通 `<script>` 只导出 `Snowflake` 类与 `random()`（可被外部 import 复用），
  `<script setup>` 负责 `defineProps` 的 11 个字段、`useTemplateRef<HTMLCanvasElement>('snow-canvas')` 取 DOM、挂载与循环。
- `defineProps` 声明了 `count / width / height / isAutoResize / minRadius / maxRadius / minSpeed / maxSpeed /
  backgroundColor / x / y / color`，默认画布 600×400、100 片雪花、白色、`y="end"`。

### 如何调整

- `count`（默认 100，示例 60）控制密度，`minRadius/maxRadius`（默认 1/2）、`minSpeed/maxSpeed`（默认 1/2）
  控制大小与快慢；示例 `:maxSpeed="1"` 配合 `minSpeed` 默认 1，让速度恒为 1。
- `color`（默认 `white`，示例 `skyblue`）换雪花颜色，`backgroundColor` 换画布底色。
- `x` / `y` 只认 `start` / `center` / `end` 三档，传别的值会回退到 `direction.center`（0，不动）。

### 注意事项

- `params`（含 count / color / 半径速度区间）在 `onMounted` 里一次性快照，挂载后再改这些 props 不会重建雪花，
  需要动态变更请加 `watch` 或给组件换 `:key` 重建。
- `isAutoResize`（默认 false）才会挂 `window.resize` 监听去改画布尺寸，`onUnmounted` 会 `removeEventListener`，
  但 `animate()` 的 `requestAnimationFrame` 没有被取消，组件卸载后动画回调仍会执行。
- 模板上的元素是 `id="snow-canvas"`，scoped 样式的选择器却是 `.snow-canvas` 类，两者并不匹配，
  想把雪花铺满父容器当背景时，需要自己保证父级脱离文档流并处理定位。
- `backgroundColor` 默认是接近不透明的黑底 `rgba(0, 0, 0, 0.9)`，要叠在页面内容上做氛围背景，
  需显式传更透明的值（如 `rgba(0, 0, 0, 0)`），否则会盖住下层内容。

<script setup>
import Snowflakes from '@components/visual/snowflakes.vue'
</script>
