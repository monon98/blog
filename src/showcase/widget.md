---
layout: doc
navbar: true
sidebar: false
---

# 第四组 · 实用交互组件

本组为可复用的交互组件，源码自包含，可直接复制到其他项目二次开发。

## 1. 滑块拼图验证码（原生 HTML）

拖动滑块把拼图块对准缺口，误差 6px 内通过；背景用内联 SVG 生成，无外部图片依赖。

<HtmlFrame src="html/widget/slider-captcha.html" title="滑块拼图验证码" :height="500" />

[完整页面：用例 · 代码 · 讲解 →](./widget/01-slider-captcha)

## 2. 可拖拽分栏（原生 HTML）

拖动分隔条调整宽度，支持双击复位、方向键微调与触摸事件，`aria-valuenow` 同步无障碍树。

<HtmlFrame src="html/widget/split-pane.html" title="可拖拽分栏" :height="540" />

[完整页面：用例 · 代码 · 讲解 →](./widget/02-split-pane)

## 3. 下拉刷新（原生 HTML）

列表顶部下拉带阻尼效果，超过阈值释放触发刷新，支持鼠标与触摸。

<HtmlFrame src="html/widget/pull-refresh.html" title="下拉刷新" :height="620" />

[完整页面：用例 · 代码 · 讲解 →](./widget/03-pull-refresh)

## 4. Toast 消息（Vue 组件）

四种类型提示，自动消失并带倒计时进度条，通过 `defineExpose` 暴露 `show()` 供外部调用。

<Toast />

[完整页面：用例 · 代码 · 讲解 →](./widget/04-toast)

## 5. 右键菜单（Vue 组件）

在虚线区域内右键唤出自定义菜单，自动避让视口边界，支持 Esc 关闭与危险项样式。

<ContextMenu />

[完整页面：用例 · 代码 · 讲解 →](./widget/05-context-menu)

## 6. 无限滚动（Vue 组件）

滚动到底部自动追加数据，含加载态与「已经到底」终止态，可配置总数与每页条数。

<InfiniteScroll :total="120" :page-size="15" />

[完整页面：用例 · 代码 · 讲解 →](./widget/06-infinite-scroll)

## 7. 画布绘图（Vue 组件）

<DrawCanvas :width="560" :height="300" backgroundColor="#ffffff" color="#000000" borderColor="red" />

[完整页面：用例 · 代码 · 讲解 →](./widget/07-draw-canvas)

## 8. 浏览器信息展示（Vue 组件）

<Info />

[完整页面：用例 · 代码 · 讲解 →](./widget/08-info)

## 9. 输入框标签效果（原生 HTML）

<HtmlFrame src="html/widget/floating-label.html" title="输入框标签效果" :height="460" />

[完整页面：用例 · 代码 · 讲解 →](./widget/09-floating-label)

## 10. Vue3 自适应高度 Input（原生 HTML）

<HtmlFrame src="html/widget/auto-resize-input.html" title="Vue3 自适应高度 Input" :height="460" />

[完整页面：用例 · 代码 · 讲解 →](./widget/10-auto-resize-input)

## 11. Vue3 自适应高度 Textarea（原生 HTML）

<HtmlFrame src="html/widget/auto-resize-textarea.html" title="Vue3 自适应高度 Textarea" :height="520" />

[完整页面：用例 · 代码 · 讲解 →](./widget/11-auto-resize-textarea)

## 12. Vue2 行级拖拽排序（原生 HTML）

<HtmlFrame src="html/widget/vue2-row-drag-sort.html" title="Vue2 行级拖拽排序" :height="560" />

[完整页面：用例 · 代码 · 讲解 →](./widget/12-vue2-row-drag-sort)

## 13. Vue2 合并相同单元格（原生 HTML）

<HtmlFrame src="html/widget/vue2-merge-cells.html" title="Vue2 合并相同单元格" :height="560" />

[完整页面：用例 · 代码 · 讲解 →](./widget/13-vue2-merge-cells)

## 14. Mermaid 流程图（原生 HTML）

<HtmlFrame src="html/widget/mermaid-flowchart.html" title="Mermaid 流程图" :height="560" />

[完整页面：用例 · 代码 · 讲解 →](./widget/14-mermaid-flowchart)

## 15. 图片加载失败兜底指令（原生 HTML）

<HtmlFrame src="html/widget/img-fallback.html" title="图片加载失败兜底指令" :height="640" />

[完整页面：用例 · 代码 · 讲解 →](./widget/15-img-fallback)

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import Toast from '@components/widget/toast.vue'
import ContextMenu from '@components/widget/context-menu.vue'
import InfiniteScroll from '@components/widget/infinite-scroll.vue'
import DrawCanvas from '@components/widget/draw-canvas.vue'
import Info from '@components/widget/info.vue'
</script>
