---
layout: doc
navbar: true
sidebar: false
---

# 32. 昼夜切换（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<DayNight />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/day-night.vue
:::

## 三、使用讲解

### 实现原理

- **状态与 props**：组件不接收任何 props，也没有生命周期钩子，全部状态就是
  `const isNight = ref(false)` 一个布尔 ref；根节点 `:class="{ night: isNight }"` 挂上 `.night` 类，
  之后完全交给 CSS 类选择器与 `transition` 完成过渡，切换入口是
  按钮 `@click="isNight = !isNight"`，文案用三元（`🌙 切换到夜晚` / `☀️ 切换到白天`）。
- **星星（SSR 安全）**：setup 期用固定公式生成 34 颗星，不使用 `Math.random` ——
  `x = (i * 37) % 96 + 2`、`y = (i * 53) % 55 + 4`、`d = (i % 7) * 0.4` 转成 `animationDelay`
  （0.0s–2.4s），服务端与客户端渲染结果一致，模板用 `v-for="s in stars"` 绑定
  `left / top / animationDelay` 三个行内样式。
- **天空与地面**：`.sky` 高 240px，白天是 `#38bdf8 → #7dd3fc → #bae6fd` 的三层渐变，
  `.day-night.night .sky` 换成 `#020617 → #0f172a → #1e293b`，配 `transition: background 1.2s ease`；
  地面（`#4ade80 → #16a34a` 变 `#14532d → #052e16`）、山丘 `.h1`（`#22c55e` → `#14532d`）、
  `.h2`（`#16a34a` → `#0f3d24`）与控制面板同步做 1.2s 过渡。
- **天体互换**：太阳 58px，内部 `v-for="n in 8"` 生成 8 根 `.ray` 并 `rotate(n * 45deg)`，
  夜晚加 `.hidden` 变成 `translateY(70px) scale(0.6)` 沉下；月亮 54px 起始同样下沉，
  拿到 `.shown` 才升起，其 `::after` 用 `box-shadow: inset 13px -6px 0 0 #0f172a` 挖出月牙缺口，
  而 `.day-night:not(.night) .moon::after` 把阴影切成 `transparent`，白天缺口消失。
- **云与闪烁**：`.c1`（96px、`26s`）和 `.c2`（74px、`38s`、`animation-delay: -14s`）用
  `@keyframes drift` 从 `translateX(0)` 走到 `680px`，夜晚加 `.hidden` 淡出；
  星星反过来 `opacity: 0 → 0.9`，再叠加 `twinkle`（`scale(0.7 ↔ 1.25)`、2.6s 交替）。

### 如何调整

- 昼夜配色集中在两组选择器：`.sky` / `.day-night.night .sky`，以及 `.ground`、`.h1`、
  `.h2`、`.panel` 的 `.night` 覆盖值，改这几处即可换整套主题。
- 过渡时长主体是 `1.2s ease`（天空、地面、山丘、面板），天体略快 `1s`（月亮还额外
  延迟 `0.3s`），星星 `1.4s`，想调节奏逐条改对应 `transition` 即可。
- 星星数量与分布改 `Array.from({ length: 34 }, ...)` 的 34 和两个取模系数 96 / 55，
  闪烁速度改 `.star` 上的 `animation: twinkle 2.6s ease-in-out infinite alternate`。

### 注意事项

- 源码末尾已有 `@media (prefers-reduced-motion: reduce)`：把 `transition-duration` 压到
  `0.01ms` 并 `animation: none`，新增带动画的元素时记得一并加进该查询的选择器列表。
- 月牙缺口的 `#0f172a` 必须与夜空渐变中段色一致才有"挖空"效果，
  把 `.night` 天空改色时要同步改 `.moon::after` 的 `inset` 阴影颜色。
- 云的 `drift` 终点 `680px` 是按 `max-width: 560px` 容器估算的，容器加宽后云会提前飞出画面，
  需同步放大位移值；星星定位只覆盖天空上半部，调整 `.sky` 高度后分布会变化。

<script setup>
import DayNight from '@components/visual/day-night.vue'
</script>
