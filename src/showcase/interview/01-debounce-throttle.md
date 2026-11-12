---
layout: doc
navbar: true
sidebar: false
---

# 01. 防抖 vs 节流演示（Vue 组件）

← [返回面试题联动列表](../interview)

关联题目：[17. 防抖函数 debounce](../../docs/code/02.%20前端编程题/17.%20防抖函数%20debounce) · [18. 节流函数 throttle](../../docs/code/02.%20前端编程题/18.%20节流函数%20throttle)

## 一、展示用例

<DebounceThrottle />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/interview/debounce-throttle.vue
:::

## 三、使用讲解

### 实现原理

- 同一个 `mousemove` 事件同时喂给两条链路，`raw` 计数不变，对比的是 `debounced` 与 `throttled` 两个实际执行计数，差异一目了然。
- 防抖：每次触发先 `clearTimeout(debounceTimer)` 再 `setTimeout(300ms)`——只有鼠标停下 300ms 后，回调才把 `debounced + 1`，`lastDebounce` 记录执行时刻。
- 节流：用 `t - lastThrottleTime >= 300` 做时间窗判断，放行后立刻更新 `lastThrottleTime`，保证 300ms 内最多执行一次（立即执行版节流）。
- `mouseleave` 时清掉未触发的防抖计时器，避免鼠标移出后突然补一次执行；`onUnmounted` 同样兜底清理。

### 如何调整

- 两个间隔是顶部常量 `DEBOUNCE_MS` / `THROTTLE_MS`，改成不同值可对比「防抖 500ms、节流 200ms」这类组合。
- 节流想改成「尾执行」版：不用时间窗，而是「窗口开始时立即执行 + 窗口末尾补一次」，结构上再加一个 timer 即可。
- `format()` 输出 `HH:mm:ss.SSS` 时间戳，可直接观察两次执行的真实间隔。

### 注意事项

- 这里节流用立即执行版（窗口边界先执行），面试手写题里常见的是尾执行版，注意区分「先执行还是后执行」。
- 防抖计时器用的是 `window.setTimeout`（浏览器类型返回 number），SSR 环境下这段逻辑不会执行但需注意类型标注。
- 案例用 `mousemove` 高频触发便于观察，真实业务里常见场景是 `scroll` / `resize` / 输入框 `input`。

<script setup>
import DebounceThrottle from '@components/interview/debounce-throttle.vue'
</script>
