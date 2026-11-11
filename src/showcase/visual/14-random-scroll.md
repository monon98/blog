---
layout: doc
navbar: true
sidebar: false
---

# 14. 滚动字符（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<div style="min-height: 130px;">
  <RandomScroll :immediate="true" />
</div>

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/random-scroll.vue
:::

## 三、使用讲解

### 实现原理

- 核心是两个游标 `tailPoint`（尾巴）与 `headPoint`（头部）：`randomize()` 先让 `tailPoint` 一路涨到
  `targetStringLength`（`computed` 出的目标长度），之后改涨 `headPoint`。
- 当 `tailPoint - headPoint > props.delay`（默认 10）时 `headPoint++` 跟进，于是屏幕上始终只有一段
  约 `delay` 个字符宽的"乱码窗口"在滚动。
- 可见串拼装分两步：先 `props.immediate && headPoint !== tailPoint ? "" : props.targetString.slice(0, headPoint)`
  取定型前缀，再用 `while (randomString.value.length < tailPoint) randomString.value += getRandomCode()` 补乱码；
  `getRandomCode()` 即 `String.fromCharCode(Math.floor(Math.random() * 127))`。
- `randomizeString()` 用 `interval++` 做节流：只有 `interval === props.speed`（默认 1）才真正调一次 `randomize()`，
  所以 speed 越大推进越慢；每帧末尾若 `headPoint !== targetStringLength` 就继续 `requestAnimationFrame`。
- 响应式数据只有 `const randomString = ref("")`，模板也只有一行 <span v-pre>`<span>{{ randomString }}</span>`</span>；
  目标长度走 `computed(() => props.targetString.length)`，运行中改 `targetString` 会立刻生效于比较逻辑。
- 打完一遍后，条件 `props.isLoop || props.isLoop > -1` 成立时用 `setTimeout(..., props.isLoop)`（默认 3000ms）
  把两个游标清零再启动，形成循环；`onMounted` 是唯一入口。

### 如何调整

- `targetString` 换目标文案（默认 `Hello World! My name is Monon98. ...`），`speed` 是帧节流系数，
  `delay` 决定乱码尾巴长度（默认 10，越大滚动区越长）。
- `:immediate="true"` 走"全程乱码、最后一刻才显示原文"的模式；不传则逐字显现真实文本。
- `isLoop`（默认 3000，单位毫秒）是两轮之间的停顿时间。

### 注意事项

- 判断写成 `props.isLoop || props.isLoop > -1`，`false` 会被强转成 0 参与 `0 > -1` 比较，条件恒为真，
  实际上无法靠 `isLoop=false` 停止循环，只能等组件卸载。
- 组件没有 `onUnmounted`：`requestAnimationFrame` 链与 `setTimeout` 在卸载后依旧运行，页面反复挂载同一组件会积累回调。
- 随机码范围是 0~126 的 ASCII，包含 0~31 控制字符，渲染出来会表现为"缺字"或不可见空隙，属正常现象。
- 每次推进都对整串做 `slice` + `+=` 重新拼接，目标文案很长时建议改为按索引增量更新。
- `speed` 与 `delay` 作用相互独立：`speed` 只决定每几帧推进一次，`delay`（默认 10）决定推进后保留的乱码窗口宽度，
  想要"又快又短"的滚动效果要同时调这两个值。
- 组件没有局部样式，文字外观完全由外层容器决定（演示里用 `min-height: 130px` 的 div 防止高度跳动）。

<script setup>
import RandomScroll from '@components/visual/random-scroll.vue'
</script>
