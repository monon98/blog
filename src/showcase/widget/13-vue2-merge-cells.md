---
layout: doc
navbar: true
sidebar: false
---

# 13. Vue2 合并相同单元格（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/vue2-merge-cells.html" title="Vue2 合并相同单元格" :height="560" />

## 二、代码实现

单文件自包含，引入 CDN 版 Vue 2 后整文件复制即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/vue2-merge-cells.html
:::

## 三、使用讲解

### 实现原理

- 表格合并不改 DOM 结构，而是算两个字段挂到行数据上：`rowspan`（跨行数）与 `isVisible`（是否渲染该 `<td>`），模板里 `<td v-if="item.isVisible" :rowspan="item.rowspan">`——组首行跨 N 行，组内其余行不渲染这列，即得到合并效果。
- `mergeCells()` 单趟线性扫描：`currentName` 记当前组的姓名、`currentStartIndex` 记组首下标；同名就把**组首**的 `rowspan++` 并给当前行 `isVisible = false`，不同名则开新组重置两个游标。
- 原数据不被污染：每次先 `JSON.parse(JSON.stringify(this.items))` 深拷贝成 `processedItems` 再处理，原始 `items` 保持干净，可反复点击重算。
- 数据特意排成「张三、张三、李四、王五、张三」——最后一组的张三**不与第一组合并**（只合并连续相同行），这是本算法的边界语义。
- `mounted` 里拷贝后立即调 `mergeCells()`，首屏即合并态；按钮可随时重算。

### 如何调整

- 换合并列只改两处：比较条件 `currentName === item.name` 换成目标字段，以及模板上 `v-if/rowspan` 移到对应 `<td>`。
- 多列合并：复制多组 `currentName/currentStartIndex` 游标分别处理每列，或抽成 `mergeBy(key)` 工具函数。
- 想合并「非连续同名」需先按列排序（如 `items.sort((a,b) => a.name.localeCompare(b.name))`），否则当前实现语义不变。

### 注意事项

- `rowspan` 合并要求**整列连续**：中间插入别的姓名即断组，这是表格合并的天然约束。
- 深拷贝用 JSON 方案，含 `undefined`/`Date`/函数字段会失真，复杂数据建议 `structuredClone` 或 `lodash.clonedeep`。
- 只有首列参与演示，其余列逐行渲染；给 age/city 也做合并时同样套 `v-if + rowspan` 模式。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
