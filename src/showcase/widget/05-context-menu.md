---
layout: doc
navbar: true
sidebar: false
---

# 05. 右键菜单（Vue 组件）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<ContextMenu />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/widget/context-menu.vue
:::

## 三、使用讲解

### 实现原理

- 触发区 `@contextmenu.prevent="onOpen"`：阻止浏览器默认菜单，把 `e.clientX/clientY` 写进 `pos` 并 `visible = true`，菜单位置由 `:style="{ left: pos.x, top: pos.y }"` 定位。
- 边界避让在 `nextTick` 里做——必须等 `v-if` 渲染完拿到 `getBoundingClientRect()`：`rect.right > innerWidth` 则左移、`rect.bottom > innerHeight` 则上移（各留 8px 边距）。
- 菜单用 `<teleport to="body">` 挂到 body，配合**非 scoped** 的第二个 `<style>` 块渲染（scoped 选择器匹配不到 teleport 出去的节点）；`position: fixed` + `z-index: 9999` 保证浮在最上层。
- 关闭是多信号的：`document click`（菜单自身 `@click.stop` + 按钮 `onPick` 内 `close()`）、`Escape` 键、`window` 的 `blur / resize / scroll`（scroll 用 `capture: true` 连捕获期的内部滚动也抓到）；`onMounted/onUnmounted` 成对注册/移除全部监听。
- 数据驱动菜单项：`items: MenuItem[]` 支持 `icon / shortcut / divided（分隔线）/ danger（红色危险项）`，`onPick` 把选择写进 `lastAction` 展示。

### 如何调整

- 改菜单项只需增删 `items` 数组元素；`divided: true` 加分隔线、`danger: true` 变红。
- 关闭时机改 `onKey` / 监听列表；想「点击菜单外才关」可去掉 `scroll/blur` 监听。
- 动画在 `.menu-enter-from { scale(0.94) }`，改缩放/淡入时长调整两个 transition。

### 注意事项

- `teleport` 的菜单样式必须放非 scoped `<style>`，否则选择器带不上属性标记、样式全失效。
- `scroll` 监听第三参 `true` 是 capture 模式——菜单是 fixed 定位，任何祖先/文档滚动都会让位置错位，必须监听。
- `pos` 用 `reactive` 对象整体改属性没问题；若换 `ref` 对象需 `.value.x = ...` 或整体替换。

<script setup>
import ContextMenu from '@components/widget/context-menu.vue'
</script>
