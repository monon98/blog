---
layout: doc
navbar: true
sidebar: false
---

# 03. BFC 三大特性演示

← [返回与已有文章联动列表](../article)

关联笔记：[块级格式化上下文 BFC](../../docs/develop/css/块级格式化上下文%20BFC)

## 一、展示用例

<HtmlFrame src="html/article/bfc.html" title="BFC 演示" :height="780" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/article/bfc.html
:::

## 三、使用讲解

### 实现原理

- 三个案例分别对应 BFC 三大特性：① 包含浮动（父容器加 `overflow: hidden` 后高度不再塌陷为 0）；② 不与浮动元素重叠（主内容区成 BFC 后自动收缩到浮动侧栏右侧）；③ 阻止 margin 重叠（两段各自成为独立 BFC，`30px + 30px` 不再合并成 30px）。
- 每个「开启 BFC」按钮带 `data-case` 标识，点击时 `classList.toggle('bfc', on)` 给对应容器加/去 `.bfc` 类，该类只有一条规则 `overflow: hidden`。
- `measure()` 用 `getBoundingClientRect()` 实测三处状态：案例 1 读父容器高度是否 > 0；案例 2 比较 `main.left < side.right - 1` 判断是否重叠；案例 3 用 `b.top - a.bottom` 算真实间距、与 59px 比较判断 margin 是否重叠。
- 切换后不立即测量，而是 `requestAnimationFrame(measure)`——等一帧让样式生效，拿到过渡前的稳定布局值。

### 如何调整

- 换触发方式：`overflow: hidden` 可替换为 `display: inline-block`、`flow-root` 等其它 BFC 触发条件，只改 `.bfc` 一条声明。
- 案例数值（浮动块 `84×84`、侧栏宽 `130px`、margin `30px`）都在顶部 CSS 里，改后测量文案会自动跟随。
- 判定阈值在 JS 中：案例 3 的 `gap < 59` 是「重叠」判定线，调整 margin 后需同步改。

### 注意事项

- `overflow: hidden` 会裁掉溢出内容（如绝对定位子元素、下拉菜单），生产环境更推荐 `display: flow-root` 触发 BFC。
- 测量依赖 `getBoundingClientRect`，在 iframe 内嵌时坐标系相对 iframe 自身视口，不受外层页面滚动影响。
- `resize` 事件也重新测量，保证窗口变化后文案与实际布局一致。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
