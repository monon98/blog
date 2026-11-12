---
layout: doc
navbar: true
sidebar: false
---

# 06. 无限滚动（Vue 组件）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<InfiniteScroll :total="120" :page-size="15" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/widget/infinite-scroll.vue
:::

## 三、使用讲解

### 实现原理

- 三态互斥：`loading`（加载中）、`finished`（computed：`list.length >= total`）、空闲态；状态条按这三态显示转圈 / 「已经到底啦」 / 「滚动到底部自动加载」。
- 触发判定是经典公式：`scrollTop + clientHeight >= scrollHeight - 60`——距底部 60px 内即算到底，提前量避免用户滚到底才开始请求。
- `loadMore()` 头部双重守卫 `if (loading || finished) return`，再 `setTimeout(600ms)` 模拟网络延迟，成功后不可变更新 `list = [...list, ...makeRows(...)]` 并解除 loading；接真实接口时把 setTimeout 换成 `await api.get(...)` 即可。
- `makeRows(from, count)` 按 `list.length + 1` 生成下一页 id，保证分页不重不漏；`onMounted` 先填满首页 15 条，滚动容器 `height: 340px; overflow-y: auto` 独立滚动。
- `reset()`：清空数组 + 归零 scrollTop + 立即 `loadMore()` 补首页。

### 如何调整

- 两个 props：`:total="120"`（数据总量）、`:page-size="15"`（每页条数），无默认值依赖的 `withDefaults` 均已给默认值 `120 / 15`。
- 预加载距离改 `onScroll` 的 `- 60`；也可改用 `IntersectionObserver` 观察底部哨兵节点，滚动监听换 IO 无需改其它逻辑。
- 模拟延迟 `600`、滚动容器高度 `.scroll { height: 340px }`、底部状态条文案都在模板里，直接改。

### 注意事项

- `loading` 是防重入的唯一闸门：真实项目里请求失败时务必在 `finally` 解除 `loading`，否则列表会永久卡在「正在加载」。
- `finished` 用 computed 派生而非手动赋值，避免两处状态不同步。
- 数据量大时 `list` 单向增长会越来越重，可配合虚拟列表（见本组 interview 示例）只渲染视口内行。

<script setup>
import InfiniteScroll from '@components/widget/infinite-scroll.vue'
</script>
