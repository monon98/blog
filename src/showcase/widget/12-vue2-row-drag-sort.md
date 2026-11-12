---
layout: doc
navbar: true
sidebar: false
---

# 12. Vue2 行级拖拽排序（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/vue2-row-drag-sort.html" title="Vue2 行级拖拽排序" :height="560" />

## 二、代码实现

单文件自包含，引入 CDN 版 Vue 2 后整文件复制即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/vue2-row-drag-sort.html
:::

## 三、使用讲解

### 实现原理

- 用 HTML5 原生 Drag and Drop，而不是鼠标坐标计算：行内「拖拽」按钮 `draggable="true"`，`@mousedown` 记 `draggingIndex = index` 并给所在 `tr` 加 `.dragging`（半透明），`@dragend` 清类并刷新底部顺序 JSON。
- `<tbody @dragover.prevent @drop="onDrop">` 是落点接收器——`dragover` 必须 `preventDefault()` 浏览器才允许 drop，这是原生拖拽最常见的遗忘点。
- `onDrop` 用 DOM 反查索引：`event.target.closest('tr')` 拿目标行，`Array.from(parentNode.children).indexOf(targetRow)` 算出 `targetIndex`，与 `draggingIndex` 比较后操作数组。
- 重排是 `splice` 二连：`items.splice(draggingIndex, 1)[0]` 取出被拖行，`items.splice(targetIndex, 0, item)` 插到目标位——Vue 2 对数组的这几种变异方法有劫持，视图自动更新；`targetIndex === -1`（落点不在任何行）时 `push` 到末尾兜底。
- 实时反馈：`currentOrder = JSON.stringify(items, null, 2)` 渲染到 `<pre>`，每次 `dragend` 刷新。

### 如何调整

- 行结构改模板 `v-for` 里的 `<td>` 即可，拖拽逻辑只依赖 `tr` 与索引，与列无关；数据字段（name/age/city）在 `data.items` 初始数组里。
- 换成 Vue 3：`new Vue` 改 `createApp().mount()`，`draggingIndex` 改 `ref`，`splice` 重排逻辑可原样保留（Vue 3 仍劫持数组变异方法）。
- 视觉反馈在 CSS：`tr.dragging { opacity: 0.5 }`、`.drag-button { cursor: move }`；想加「插入位置指示线」可在 `dragover` 时给目标行加类。

### 注意事项

- 按钮 `mousedown` 会与 `draggable` 合作起拖，但拖拽手柄是整个按钮——行内其它区域不可拖；`closest` 兼容性 IE10+。
- `draggingIndex` 未在 `onDrop` 里清空，靠下一次 `onDragStart` 覆盖；若一次 drop 后不再拖，残留值被 `targetIndex !== this.draggingIndex` 防误伤，稳妥起见可在 `onDrop` 末尾置 `null`。
- 落到表头（thead）不会触发 tbody 的 drop，天然避免了非数据行；移动端 Safari 对原生拖拽支持差，生产环境需配 touch 事件或 sortable 类库。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
