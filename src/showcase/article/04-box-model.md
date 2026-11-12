---
layout: doc
navbar: true
sidebar: false
---

# 04. CSS 盒模型可视化

← [返回与已有文章联动列表](../article)

关联文章：[007. 彻底搞懂 CSS 盒子模型](../../docs/collection/reposts/前端/007.%20彻底搞懂%20CSS%20盒子模型：从%20content-box%20到%20border-box%20的实战指南)

## 一、展示用例

<HtmlFrame src="html/article/box-model.html" title="CSS 盒模型可视化" :height="580" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/article/box-model.html
:::

## 三、使用讲解

### 实现原理

- 四层盒子嵌套渲染：`.margin-box`（红）→ `.border-box`（橙）→ `.padding-box`（蓝）→ `.content-box`（绿），每层用 `padding: var(--m/b/p)` 撑出厚度，content 尺寸用 `width/height: var(--w/h)`，全部由 CSS 自定义属性驱动。
- 单一 `state` 对象（`{ w: 160, h: 90, p: 18, b: 6, m: 20, sizing: 'content-box' }`）是唯一数据源，`render()` 读它写入五个 CSS 变量并计算右侧汇总表。
- `box-sizing` 差异在 `render()` 里显式体现：`content-box` 下 content 直接取滑块值；`border-box` 下 `contentW = Math.max(20, w - 2*p - 2*b)`——width 含 padding/border，content 被反推且保底 20px 防止负值。
- 高亮联动用事件委托给所有 `[data-layer]` 元素绑 `mouseenter/mouseleave`，切换 `viz.className = 'viz hl-' + layer`，四条 `.hl-*` 规则给对应层加红色 `outline`。

### 如何调整

- 新增一层（如 outline）只需：加嵌套节点 + 一个 `data-layer` + 一条 `.hl-` 规则 + 一个滑块，`render()` 里补一行尺寸累加。
- 配色是四层盒的 background 红/橙/蓝/绿与 `--m/--b/--p` 的 padding，滑块范围（如 `min/max`）在 HTML input 上。
- 汇总表文案在 `result.innerHTML` 的字符串拼接里，改格式直接改那段模板。

### 注意事项

- `border-box` 反推公式带 `Math.max(20, ...)` 兜底：滑块调到极端值时 content 不会塌成 0 或负数导致渲染异常。
- 高亮切换直接整体替换 `className`（而非增删类），因此 `viz` 上不能挂其它持久类。
- 自定义属性不带单位传递（`var(--w)` 处由 CSS 侧补 `px`），JS 写入时必须带 `px` 字符串。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
