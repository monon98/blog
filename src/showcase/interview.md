---
layout: doc
navbar: true
sidebar: false
---

# 第三组 · 面试题联动

本组案例对应面试高频考点，可交互验证行为，源码可直接复制到其他项目。

## 1. 防抖 vs 节流演示（Vue 组件）

关联题目：[17. 防抖函数 debounce](../docs/interview/20.%20前端编程题/17.%20防抖函数%20debounce) · [18. 节流函数 throttle](../docs/interview/20.%20前端编程题/18.%20节流函数%20throttle)

在上方区域移动鼠标，对比原始事件数与实际处理次数的差异。

<DebounceThrottle />

## 2. Event Loop 执行顺序可视化（Vue 组件）

关联笔记：[06. 事件循环](../docs/interview/06.%20browser/06.%20事件循环)

把任务入队，再逐轮执行，观察「微任务清空 → 才取一个宏任务」的顺序。

<EventLoop />

## 3. 虚拟列表（Vue 组件）

1 万条数据只渲染视口内几十个节点，实时显示渲染数量与 DOM 节省比例。

<VirtualList :total="10000" :item-height="38" />

## 4. 图片懒加载 / 瀑布流（原生 HTML）

关联题目：[31. 图片懒加载](../docs/interview/20.%20前端编程题/31.%20图片懒加载)

`IntersectionObserver` 进入视口才给 `img.src` 赋值，图片用内联 SVG data URI，无外部依赖。

<HtmlFrame src="html/interview/lazyload.html" title="图片懒加载 / 瀑布流" :height="740" />

## 5. Promise 链式调用演示（原生 HTML）

关联题目：[19. 手写 Promise](../docs/interview/20.%20前端编程题/19.%20手写%20Promise)

分别点击 resolve / reject，观察值在链上的流转与 catch、finally 的执行时机。

<HtmlFrame src="html/interview/promise-chain.html" title="Promise 链式调用演示" :height="820" />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import DebounceThrottle from '@components/interview/debounce-throttle.vue'
import EventLoop from '@components/interview/event-loop.vue'
import VirtualList from '@components/interview/virtual-list.vue'
</script>
