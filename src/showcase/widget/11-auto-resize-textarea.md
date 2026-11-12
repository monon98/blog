---
layout: doc
navbar: true
sidebar: false
---

# 11. Vue3 自适应高度 Textarea（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/auto-resize-textarea.html" title="Vue3 自适应高度 Textarea" :height="520" />

## 二、代码实现

单文件自包含，引入 CDN 版 Vue 3 后整文件复制即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/auto-resize-textarea.html
:::

## 三、使用讲解

### 实现原理

- textarea 溢出时可滚动，经典两行公式：`textarea.style.height = 'auto'` 先把高度压回 auto（否则 `scrollHeight` 是**已被撑高后的值**，永远收不小），再 `style.height = scrollHeight + 'px'` 贴合内容。
- `handleInput` 同时做两件事：`text.value = event.target.value` 同步数据、`adjustHeight()` 调高度；模板里 `v-model="text"` 与 `@input` 并用（`v-model` 已隐式监听 input，这里的显式 handler 是为了顺带调高度——Vue 3 单元素上 `v-model` 与自写 `@input` 可共存）。
- CSS 是自适应的前提三件套：`min-height: 50px`（空值时有基础高度）、`resize: none`（禁用手动拖拽）、`overflow: hidden`（藏滚动条，内容永远贴合）。
- `onMounted(adjustHeight)` 初始化：若初始 `text` 有值（或为保持一致的空态），挂载后先校准一次，避免首次渲染高度失准。

### 如何调整

- 最小高度改 `textarea { min-height: 50px }`；内容与高度贴合的松紧改 `padding: 10px`（`scrollHeight` 已包含 padding，无需补偿）。
- 接入项目改成 Vue SFC：把 `template` 字符串换成 `<template>` 块、`ref` 改 `useTemplateRef`（或同名字符串 ref），逻辑一行不变。
- 想带最大高度（超过才滚动），CSS 加 `max-height` 并把 `overflow: hidden` 改回 `auto` 即可，`adjustHeight` 不用动。

### 注意事项

- `resize: none` + `overflow: hidden` 必须同时存在：前者禁手动调、后者去滚动条，缺一个体验就破。
- `adjustHeight` 直接访问 `textareaRef.value`，若在未挂载时调用会报空；当前只在 `onMounted` 与 input 回调里调用是安全的。
- 本文件与 10 号 Input 示例都依赖 CDN 脚本（jsdelivr），离线环境需改成本地引入或 npm 版本；两者都用 options 对象 + 字符串 template 写法，可平移到 `<script setup>`。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
