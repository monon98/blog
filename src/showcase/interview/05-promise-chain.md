---
layout: doc
navbar: true
sidebar: false
---

# 05. Promise 链式调用演示（原生 HTML）

← [返回面试题联动列表](../interview)

关联题目：[19. 手写 Promise](../../docs/interview/20.%20前端编程题/19.%20手写%20Promise)

## 一、展示用例

<HtmlFrame src="html/interview/promise-chain.html" title="Promise 链式调用演示" :height="820" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/interview/promise-chain.html
:::

## 三、使用讲解

### 实现原理

- 五个 `.step` 节点（`data-step 0-4`）就是链条本身：Promise 构造 → `.then` ×2 → `.catch` → `.finally`，每个带固定修饰类（3 是 `catch-step`、4 是 `finally-step`）和 `.state` 状态徽标。
- 动画全部靠**延迟定时器编排**：`later(fn, ms)` 把回调 push 进 `timers`，成功路径在 120/760/1400/2040/2560ms 依次激活各步；`activate(i)` 加 `.active` 并在 480ms 后转 `.done`，把 480ms 的执行过程可视化。
- 失败路径 `runReject()`：第 0 步锁定 rejected → 760ms 同时 `skip(1)` / `skip(2)`（虚线 + 删除线，徽标「跳过」）→ 1500ms `.catch` 捕获并高亮红色 → 2100ms `.finally` 依然执行——准确表达「then 被跳过、catch 恢复链路、finally 必达」。
- `reset()` 先 `clearTimers()` 清空全部定时器（防两次点击动画叠加），再按 `dataset.step` 重建固定修饰类并把徽标复位 `pending`；`log()` 输出滚动到底部的执行日志。

### 如何调整

- 节奏改 `runResolve / runReject` 里各 `later` 的毫秒值与 `activate` 的 `480`；步骤增删只需加 `.step` 节点 + `data-step`，注意 `reset` 里 step 3/4 的特殊类判断。
- 「重置 / resolve / reject」三个按钮 id 直接被 `getElementById` 绑定，改 id 要同步改脚本末尾的事件注册。
- 状态配色在 CSS 的 `.active / .done / .skipped / .catch-step / .finally-step` 五组规则里，语义固定：黄=执行中、绿=完成、虚线=跳过、红=catch、灰=finally。

### 注意事项

- 本例是**时序动画模拟**，不是真 Promise 运行；教学时建议同步打开控制台写真代码对照。
- 每次点击都先 `reset()`，但若在动画进行中快速切换 resolve/reject，旧定时器已清、状态已重置，不会串戏——这是 `timers` 数组集中管理的意义。
- 真实 Promise 中 `then` 返回 Promise 会自动展平（`[[Resolve]]` 机制），本例的「值流转」文案简化了这一步，深挖见关联的「手写 Promise」题目。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
