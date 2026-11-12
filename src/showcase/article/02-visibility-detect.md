---
layout: doc
navbar: true
sidebar: false
---

# 02. visibilitychange 后台检测（Vue 组件）

← [返回与已有文章联动列表](../article)

关联文章：[001. h5后台切换检测利用visibilitychange的缺点分析](../../docs/collection/reposts/前端/001.%20h5后台切换检测利用visibilitychange的缺点分析)

## 一、展示用例

<VisibilityDetect />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/article/visibility-detect.vue
:::

## 三、使用讲解

### 实现原理

- 四个响应式状态：`visible`（当前可见）、`hideCount`（隐藏次数）、`totalHidden`（累计隐藏秒数）、`currentHidden`（本次隐藏秒数），另有非响应式的 `hiddenAt` 记录隐藏时刻。
- `onVisibilityChange()` 里判断 `document.hidden`：进入后台时 `hideCount + 1`、记 `hiddenAt = Date.now()`，并启动 `setInterval(250ms)` 实时刷新 `currentHidden`；回到前台时把 `(Date.now() - hiddenAt) / 1000` 取整累加进 `totalHidden`，清零 `currentHidden` 并 `clearInterval`。
- 事件在 `onMounted` 注册 `document.addEventListener('visibilitychange', ...)`，`onUnmounted` 移除监听并清理定时器，避免组件卸载后监听器泄漏。
- 「重置统计」按钮调 `reset()` 把三个计数归零；状态点的脉冲动画靠 `box-shadow` 扩散的 `@keyframes pulse`。

### 如何调整

- 刷新精度改 `setInterval` 的 `250`（毫秒），调小数字更实时、更耗电。
- 累计口径改 `totalHidden.value += ...` 那一行，例如改为毫秒级或按次计费式统计。
- 面板配色与三列栅格在 `scoped` 样式里，`.stats` 的 `grid-template-columns: repeat(3, 1fr)` 控制列数。

### 注意事项

- `visibilitychange` 在移动端切后台可靠，但锁屏、跳转前不一定触发 `hidden`，需要配合 `pagehide` 事件兜底（对应关联文章分析的缺点）。
- 隐藏期间的 `setInterval` 必须在回到前台时清理，否则后台标签页会一直空跑定时器。
- `Math.floor` 按秒取整，隐藏不足 1 秒显示 0s，属预期行为。

<script setup>
import VisibilityDetect from '@components/article/visibility-detect.vue'
</script>
