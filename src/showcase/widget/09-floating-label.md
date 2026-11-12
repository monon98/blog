---
layout: doc
navbar: true
sidebar: false
---

# 09. 输入框标签效果（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/floating-label.html" title="输入框标签效果" :height="460" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/floating-label.html
:::

## 三、使用讲解

### 实现原理

- 零 JS 方案，两个纯 CSS 伪类驱动：`.input:focus + .label`（聚焦时上移）和 `.input:not(:placeholder-shown) + .label`（有内容时保持上移）——`:placeholder-shown` 判断「placeholder 还在显示」即输入框为空。
- 空值技巧：`<input placeholder=" ">` 的 placeholder 是**一个空格**（不能省略，省略则伪类永远不匹配），label 平时盖在框中央。
- 结构是相邻兄弟：`input` 在前、`label` 在后，才能被 `+` 选择器命中；`label` 绝对定位 `top: 50% + translateY(-50%)` 垂直居中，上移态改 `top: 20%` 并缩字号 `12px`、加深颜色。
- 两个关键辅助：`label { pointer-events: none }` 防止点标签挡住输入框；`input { padding: 20px 10px 10px }` 顶部留出内边距，文字不与浮起的标签重叠。

### 如何调整

- 上移位置改 `.input:focus + .label` 的 `top: 20%`；过渡时长在 `.label { transition: 0.2s ease all }`。
- 宽高在 `.input-container`（300×60），输入框 `height: 100%` 随容器；换 `<textarea>` 时 `:placeholder-shown` 同样可用，但焦点态需改用 `:focus-within`（若 label 是对容器）。
- 想加必填校验色，可叠加 `.input:user-invalid + .label { color: #dc2626 }`。

### 注意事项

- `+` 是**相邻兄弟**选择器，input/label 顺序颠倒或中间插节点都会失效。
- `:placeholder-shown` 要求 placeholder 非空，写成 `placeholder=""` 效果直接消失（最常见的坑）。
- Safari 对 `input:not(:placeholder-shown)` 支持良好，但旧版 Edge 需注意兼容；标签移动用 `top` 而非 `transform`，已有 `translateY(-50%)` 被覆盖的风险——当前用 `top` 百分比 + 原 transform 组合，改动画时两者要一起算。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
