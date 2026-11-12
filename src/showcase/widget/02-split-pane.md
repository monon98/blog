---
layout: doc
navbar: true
sidebar: false
---

# 02. 可拖拽分栏（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/split-pane.html" title="可拖拽分栏" :height="540" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/split-pane.html
:::

## 三、使用讲解

### 实现原理

- 布局只改左栏一个值：`.pane.left { width: 45% }`、右栏 `flex: 1` 自动吃掉剩余宽度（容器宽 − 左栏 − 分隔条），JS 无需计算右栏尺寸。
- 核心函数 `setWidth(pct, animate)`：先 `clamp` 到 `MIN=15 ~ MAX=85`，写 `left.style.width`、工具栏百分比文本、`aria-valuenow` 三处；`animate=false` 时临时 `transition='none'`，用 `void left.offsetWidth` 强制重排后再恢复——避免复位/互换时出现滑动动画。
- 拖拽链路：`divider` 的 `mousedown/touchstart` 起手（`dragging=true` + body 加 `.resizing` 禁选中），`document` 上 `mousemove/touchmove` 用 `split.getBoundingClientRect()` 算 `pct`，`mouseup/touchend` 收尾清状态——监听在 document 上，拖出容器不丢事件。
- 附加交互：`dblclick` 复位 45%；`divider` 带 `tabindex="0"`，聚焦后 `←/→` 每次 ±2%、`Home` 复位；工具栏「左右互换」即 `setWidth(100 - current)`。

### 如何调整

- 边界与默认值是顶部 `MIN / MAX / DEFAULT` 三个常量；键盘步长在 `keydown` 的 `current - 2` / `+ 2`。
- 分隔条宽度改 CSS `.divider { width: 8px }`（拖拽比例基于容器宽，不受影响）；改成上下分栏（`flex-direction: column` + `row-resize`）需把 `pct` 的横轴计算换成纵轴。
- `role="separator"` / `aria-orientation` / `aria-valuemin/max/now` 全套无障碍属性在 divider 标签上，改默认值时 `aria-valuenow` 会由 `setWidth` 自动同步。

### 注意事项

- `transition` 的「禁用 → 强制重排 → 恢复」三步缺一不可，否则浏览器把两条 width 变更合并，复位也会平滑过渡。
- 拖拽期间 `body.resizing { user-select: none }` 防止文字被选中，`cursor: col-resize` 全程保持。
- 拖动时是 `animate=true`（带过渡），连续 mousemove 下过渡反而更顺滑；若用 `requestAnimationFrame` 节流可再降开销。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
