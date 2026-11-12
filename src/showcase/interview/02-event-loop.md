---
layout: doc
navbar: true
sidebar: false
---

# 02. Event Loop 执行顺序可视化（Vue 组件）

← [返回面试题联动列表](../interview)

关联笔记：[06. 事件循环](../../docs/interview/06.%20browser/06.%20事件循环)

## 一、展示用例

<EventLoop />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/interview/event-loop.vue
:::

## 三、使用讲解

### 实现原理

- 三个响应式数组即三个「运行时模型」：`macro`（宏任务队列）、`micro`（微任务队列）、`logs`（输出控制台）；`syncId / macroId / microId` 三个计数器生成任务名。
- `pushSync()` 不入任何队列，直接 `logs.push`——对应同步代码即刻进入调用栈执行；`pushMacro()` / `pushMicro()` 分别向对应队列 `push` 一条任务。
- 核心是 `runTick()`：先判断 `micro.length`，非空则 `drainMicro()` 用 `while + shift` 把微任务**全部清空**并 return；否则取一个宏任务 `shift()` 执行，执行完再 `drainMicro()`——完整还原「微任务清空 → 取一个宏任务 → 再清空微任务」的一轮循环。
- `idle` computed 在两个队列都空时禁用「执行一轮」按钮；`clearAll()` 连同三个计数器一起归零。

### 如何调整

- 想演示 `queueMicrotask` / `MutationObserver` 等更多微任务源，只需在 `pushMicro()` 里加变体或新增按钮，队列模型不变。
- 想演示「宏任务一次取多个」，把 `runTick` 里 `shift()` 一个改成 `splice(0, n)` 即可。
- 入队、执行的文案与标签（`tag: '同步' / '入队' / '微任务'`）都在 `push*` 函数的字符串里，改文案零结构改动。

### 注意事项

- 这是**教学模型**而非真实调度器：真实引擎里 `then` 回调入队时机是微任务队列尾部追加，且每轮宏任务后微任务会全部清空，本组件按此语义实现。
- `drainMicro` 用 `while` 而非 `for`——`shift()` 改数组长度，遍历下标会错位。
- 每点一次「执行一轮」只走一步（return 单条路径），需连续点击观察完整顺序，这是刻意拆步便于教学。

<script setup>
import EventLoop from '@components/interview/event-loop.vue'
</script>
