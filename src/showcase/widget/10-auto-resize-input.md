---
layout: doc
navbar: true
sidebar: false
---

# 10. Vue3 自适应高度 Input（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/auto-resize-input.html" title="Vue3 自适应高度 Input" :height="460" />

## 二、代码实现

单文件自包含，引入 CDN 版 Vue 3 后整文件复制即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/auto-resize-input.html
:::

## 三、使用讲解

### 实现原理

- 单行 input 溢出不可滚动，方案是**用字号适配内容**：容器固定 `300×40`、`font-size` 可变（`fontSize` ref，初值/上限 27px、下限 12px），`:style="{ fontSize: fontSize + 'px' }"` 绑到 input 上。
- 判定依据是 `input.scrollWidth > input.clientWidth`：`scrollWidth` 是内容实际需要的宽度，超出可视宽就说明字号偏大。
- 双向收敛靠 `requestAnimationFrame` 递归：变长（`isAdd=true`）时 `fontSize--` 直到放下或到 12px，每步一帧保证样式已应用后再测量；变短时先 `fontSize++` 尝试放大，一旦 `scrollWidth <= clientWidth` 改调 `adjustFontSize(true)` 进入收缩分支，避免来回震荡。
- 驱动源是 `watch(inputValue)`，用 `newValue.length > oldValue.length` 判断变长还是变短，把方向传给 `adjustFontSize`。

### 如何调整

- 三个关键数：`maxFontSize = 27`、`minFontSize = 12`、CSS 里 `.input-box` 的初始 `font-size: 27px`（要与 maxFontSize 一致）；容器宽改 `.input-box { width: 300px }`。
- 输入响应式改 `v-model` 换成 `@input` 手动取值即可；`adjustFontSize` 里残留的 `console.log` 可删。
- 想要平滑动画，CSS 已有 `transition: font-size 0.1s ease`——但 rAF 递归每帧改 1px，动画会与递归叠加，追求精确可去掉 transition。

### 注意事项

- `inputElement` 需 `ref="inputElement"`（选项式字符串 ref），`adjustFontSize` 内访问前要判空，否则首帧可能 `value` 为 null。
- 递归终止依赖 `minFontSize` 兜底，删掉下限会造成无限 `--`；`requestAnimationFrame` 在标签页后台会暂停，属预期降级。
- 方向判断用 `length` 简化（删一个字符再打一个不算「变长」时会误判），更精确应比较 `scrollWidth` 趋势——本例以最终 `scrollWidth` 校验为准，误判只多走一轮 rAF，无死循环。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
