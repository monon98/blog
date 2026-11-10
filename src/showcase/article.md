---
layout: doc
navbar: true
sidebar: false
---

# 第一组 · 与已有文章联动

本组案例与站内已有文章一一对应，可直接复制源码到其他项目使用。

## 1. 扩展卡片 Flexbox 过渡（原生 HTML）

关联文章：[002. 扩展卡片效果：用 Flexbox 和 CSS 过渡打造惊艳交互体验](../docs/collection/reposts/前端/002.%20扩展卡片效果：用%20Flexbox%20和%20CSS%20过渡打造惊艳交互体验)

点击卡片展开、其余收起，纯 `flex` + `transition` 实现。

<HtmlFrame src="html/article/flex-card.html" title="扩展卡片 Flexbox 过渡" :height="460" />

## 2. visibilitychange 后台检测（Vue 组件）

关联文章：[001. h5后台切换检测利用visibilitychange的缺点分析](../docs/collection/reposts/前端/001.%20h5后台切换检测利用visibilitychange的缺点分析)

切换标签页或最小化窗口，实时统计隐藏次数与累计时长。

<VisibilityDetect />

## 3. BFC 三大特性演示（原生 HTML）

关联笔记：[块级格式化上下文 BFC](../docs/develop/css/块级格式化上下文%20BFC)

点击「开启 BFC」对比包含浮动、避免重叠、阻止 margin 重叠三个特性。

<HtmlFrame src="html/article/bfc.html" title="BFC 演示" :height="780" />

## 4. CSS 盒模型可视化（原生 HTML）

关联文章：[007. 彻底搞懂 CSS 盒子模型](../docs/collection/reposts/前端/007.%20彻底搞懂%20CSS%20盒子模型：从%20content-box%20到%20border-box%20的实战指南)

拖动滑块调整尺寸，切换 `box-sizing` 观察占位变化，悬停色块高亮对应层级。

<HtmlFrame src="html/article/box-model.html" title="CSS 盒模型可视化" :height="580" />

## 5. CSS 选择器实战演示（原生 HTML）

关联文章：[009. 《CSS 核心机制与选择器实战精要》](../docs/collection/reposts/前端/009.%20《CSS%20核心机制与选择器实战精要》)

点击选择器查看命中元素与匹配数量。

<HtmlFrame src="html/article/css-selector.html" title="CSS 选择器实战演示" :height="580" />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import VisibilityDetect from '@components/article/visibility-detect.vue'
</script>
