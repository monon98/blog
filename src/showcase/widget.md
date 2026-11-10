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

## 2. 可拖拽分栏（原生 HTML）

拖动分隔条调整宽度，支持双击复位、方向键微调与触摸事件，`aria-valuenow` 同步无障碍树。

<HtmlFrame src="html/widget/split-pane.html" title="可拖拽分栏" :height="540" />

## 3. 下拉刷新（原生 HTML）

列表顶部下拉带阻尼效果，超过阈值释放触发刷新，支持鼠标与触摸。

<HtmlFrame src="html/widget/pull-refresh.html" title="下拉刷新" :height="620" />

## 4. Toast 消息（Vue 组件）

四种类型提示，自动消失并带倒计时进度条，通过 `defineExpose` 暴露 `show()` 供外部调用。

<Toast />

## 5. 右键菜单（Vue 组件）

在虚线区域内右键唤出自定义菜单，自动避让视口边界，支持 Esc 关闭与危险项样式。

<ContextMenu />

## 6. 无限滚动（Vue 组件）

滚动到底部自动追加数据，含加载态与「已经到底」终止态，可配置总数与每页条数。

<InfiniteScroll :total="120" :page-size="15" />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import Toast from '@components/widget/toast.vue'
import ContextMenu from '@components/widget/context-menu.vue'
import InfiniteScroll from '@components/widget/infinite-scroll.vue'
</script>
