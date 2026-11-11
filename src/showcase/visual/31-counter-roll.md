---
layout: doc
navbar: true
sidebar: false
---

# 31. 数字滚动计数器（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<CounterRoll />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/counter-roll.vue
:::

## 三、使用讲解

### 实现原理

- **props**：只有一个 `duration`，写法是
  `withDefaults(defineProps<{ duration?: number }>(), { duration: 2 })` 默认 2，
  `roll()` 里 `total = props.duration * 1000` 作为本次滚动的总时长
  （源码注释写的是"停留多少秒开始滚动"，实现上实际是滚动时长，以代码为准）。
- **响应式数据**：`items = reactive<CounterItem[]>([...])` 存 4 条指标，每条含
  `label / target / decimals / prefix / suffix / shown / progress`，例如
  `{ label: '构建耗时', target: 62, decimals: 0, prefix: '-', suffix: '%' }`、
  首屏时间 `target: 0.86`（`decimals: 2`、后缀 `s`）、Lighthouse `98`、累计下载 `12.4`（后缀 `k`）。
- **缓动与帧循环**：`easeOutExpo(t) = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)` 前快后慢；
  `frame(now)` 用 `performance.now()` 与 `start` 的差值算 `t = Math.min(1, (now - start) / total)`，
  再把 `shown = target * e` 与 `progress = e` 同步写给全部条目，`t < 1` 时继续
  `requestAnimationFrame(frame)`；每次 `roll()` 开头先 `cancelAnimationFrame(raf)` 防止叠加。
- **生命周期**：`onMounted` 里 `document.querySelector('.counter-roll')` 拿根元素，
  用 `IntersectionObserver`（`{ threshold: 0.35 }`）观察，首次进入视口调 `roll()` 后
  `disconnect()` 并把 observer 置 `undefined`；环境不支持 IO 时直接 `roll()` 兜底。
  `onUnmounted` 中 `cancelAnimationFrame(raf)` 并断开 observer。
- **渲染与交互**：模板用 <span v-pre>`{{ item.shown.toFixed(item.decimals) }}`</span> 控制小数位，
  进度条用 `:style="{ width: (item.progress * 100).toFixed(1) + '%' }"` 驱动；
  「↻ 重新滚动」按钮 `@click="replay"` 内部再调一次 `roll()`，数据先归零再重新滚起。

### 如何调整

- 滚动时长传 `<CounterRoll :duration="3" />`；新增指标只需往 `items` 数组追加一个含
  `target / decimals / prefix / suffix` 的对象，栅格
  `repeat(auto-fit, minmax(130px, 1fr))` 会自动排版，无需改模板。
- 数字渐变改 `.value` 的 `linear-gradient(135deg, #6366f1, #22d3ee)`（`.bar i` 用了同款渐变）；
  边框、背景、文字色都写成 `var(--vp-c-*)` 并带兜底值，换站点主题只改变量即可。
- 手感改 `easeOutExpo` 里的 `-10 * t` 指数，或换成 `1 - Math.pow(1 - t, 3)` 一类的经典缓动。

### 注意事项

- `<style>` 是 `scoped`，但 `onMounted` 用 `document.querySelector` 全局查找根节点：
  页面同时放两个该组件时，两次回调都会命中第一个实例的根元素，建议改用模板 `ref` 绑定。
- `duration` 的 JSDoc 注释与实现不一致（实际是滚动总时长而非等待延迟），
  调用方按注释理解会算错节奏。
- 组件没有 `prefers-reduced-motion` 分支，动效敏感场景可在业务侧按该媒体查询
  把 `duration` 压到 0.01，让数字一次性到位。

<script setup>
import CounterRoll from '@components/visual/counter-roll.vue'
</script>
