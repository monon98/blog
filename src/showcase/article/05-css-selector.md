---
layout: doc
navbar: true
sidebar: false
---

# 05. CSS 选择器实战演示

← [返回与已有文章联动列表](../article)

关联文章：[009. 《CSS 核心机制与选择器实战精要》](../../docs/collection/reposts/前端/009.%20《CSS%20核心机制与选择器实战精要》)

## 一、展示用例

<HtmlFrame src="html/article/css-selector.html" title="CSS 选择器实战演示" :height="580" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/article/css-selector.html
:::

## 三、使用讲解

### 实现原理

- 左侧 9 个按钮即选择器文本（`li`、`.item`、`#list .item`、`li:nth-child(2)`、`[data-type="js"]`、`.item:not(.active)` 等），点击时取 `btn.textContent` 作为字符串直接交给 `document.querySelectorAll(selector)` 求值——原生 API 就是匹配引擎。
- 命中元素逐个加 `.matched` 类：渐变背景 + 蓝边框 + `translateX(6px)` 位移 + 阴影，与未命中项形成对比；数量显示在下方黑色 info 面板。
- 事件委托实现：监听器绑在 `#selList` 容器上，用 `e.target.closest('.sel')` 找到真正点中的按钮，按钮增删不用逐个绑定。
- `try/catch` 包住 `querySelectorAll`：手写选择器语法错误时（如 `.item:`）捕获异常并把错误文案写进 info 面板，页面不崩。

### 如何调整

- 加新选择器只需在 `.sel-list` 里加一个 `<button class="sel">选择器文本</button>`，逻辑零改动（委托 + 文本取值）。
- 目标 DOM 在右侧 `ul#list`，元素结构改了左侧匹配结果自动跟随；`.matched` 的高亮样式在 CSS 顶部统一定义。
- 「清除高亮」复位三处：移除所有 `matched`、取消按钮 `on` 态、info 恢复默认文案。

### 注意事项

- `querySelectorAll` 的选择器会作用于**整个文档**（不只右侧列表），若页面上还有其它同名元素也会被计入命中数——本例独占 iframe 所以无干扰。
- 选择器文本取自 `textContent`，按钮内不能加额外标签或空白字符（`trim()` 已兜底首尾空格）。
- `li:nth-child(2)` 等结构型选择器依赖列表顺序，增删 DOM 后命中位置会变，属预期行为。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
