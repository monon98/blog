---
layout: doc
navbar: true
sidebar: false
---

# 03. 虚拟列表（Vue 组件）

← [返回面试题联动列表](../interview)

## 一、展示用例

<VirtualList :total="10000" :item-height="38" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/interview/virtual-list.vue
:::

## 三、使用讲解

### 实现原理

- 数据与渲染解耦：`items` 一次性生成 1 万条（真实项目来自接口），DOM 只渲染 `visibleItems = items.slice(start, end)` 这一段窗口切片。
- `start = floor(scrollTop / itemHeight) - buffer`、`end = ceil((scrollTop + viewportHeight) / itemHeight) + buffer`，`buffer = 5` 即视口上下各多渲染 5 行，滚动时不会露白。
- 窗口外的空间用上下两个占位 div 撑出：`paddingTop = start * itemHeight`、`paddingBottom = (total - end) * itemHeight`，总高度恒等于 `total * itemHeight`，滚动条行为与全量渲染完全一致。
- `onScroll` 只更新 `scrollTop` 一个 ref，所有派生值都是 computed，Vue 自动完成重算与最小量 DOM 更新；`ResizeObserver` 监听容器高度变化实时刷新 `viewportHeight`（SSR 降级用 `typeof` 判断）。

### 如何调整

- 三个 props 全有默认值：`total = 10000`、`itemHeight = 38`、`buffer = 5`；传入的 `:item-height` 必须与 `.row` 的 CSS `height: 38px` 一致，否则占位计算会漂移。
- 行高不等的场景（动态高度）本方案不适用，需引入高度缓存与累加前缀和，或用 `content-visibility: auto` 的轻量替代。
- 滚动容器高度在 CSS `.list { height: 420px }`，`viewportHeight` 默认值 420 与之一致，改高度时两处同步改。

### 注意事项

- `:key="item.id"` 必须唯一稳定，否则滚动切片时 Vue 会整段重建 DOM，失去增量更新优势。
- `.list` 加了 `contain: strict` 提升渲染性能，它要求容器尺寸不依赖内容——占位撑高的实现方式正好满足。
- 头部统计 `saved` 是 `1 - rendered / total`，极端滚动位置渲染几十条，节省率约 99.6%。

<script setup>
import VirtualList from '@components/interview/virtual-list.vue'
</script>
