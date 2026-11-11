---
layout: doc
navbar: true
sidebar: false
---

# 第二组 · 纯视觉特效

本组全部为独立自包含案例，源码可整文件复制到任意项目直接使用。

## 1. 视差滚动（原生 HTML）

多层背景按 `data-speed` 差速位移，只改 `transform` 保证滚动流畅。

<HtmlFrame src="html/visual/parallax.html" title="视差滚动" :height="460" />

## 2. 鼠标跟随粒子 / 烟花（原生 HTML）

Canvas 粒子系统：移动产生拖尾，点击绽放烟花，带重力与阻尼。

<HtmlFrame src="html/visual/particles.html" title="鼠标跟随粒子 / 烟花" :height="440" />

## 3. 3D 翻转卡片（原生 HTML）

`preserve-3d` + `backface-visibility` 实现正反面翻转，点击卡片试玩。

<HtmlFrame src="html/visual/flip-card.html" title="3D 翻转卡片" :height="480" />

## 4. 波浪 / 液体进度条（原生 HTML）

SVG `stroke-dashoffset` 环形进度 + CSS 液面波动，拖动滑块联动。

<HtmlFrame src="html/visual/wave-progress.html" title="波浪 / 液体进度条" :height="660" />

## 5. 倒计时翻页时钟（原生 HTML）

数字变化时触发 `rotateX` 翻页动画，支持开始 / 暂停 / 重置 / 加时。

<HtmlFrame src="html/visual/flip-clock.html" title="倒计时翻页时钟" :height="400" />

## 6. 无限轮播 / 跑马灯（原生 HTML）

内容复制两份 + `translateX(-50%)` 无缝循环，横向、反向、纵向、渐变文字四种。

<HtmlFrame src="html/visual/marquee.html" title="无限轮播 / 跑马灯" :height="760" />

## 7. 音频频谱可视化（原生 HTML）

Web Audio API 合成音序（无外部音频文件）+ `AnalyserNode` 实时频谱，点击播放。

<HtmlFrame src="html/visual/audio-spectrum.html" title="音频频谱可视化" :height="440" />

## 8. 打字机效果（Vue 组件）

逐字输出文案，支持暂停与重播，可自定义文案与速度。

<Typewriter :speed="14" />

## 9. 涟漪按钮（Vue 组件）

点击位置向四周扩散的 Material 风格涟漪，自适应按钮对角线尺寸。

<RippleButton label="点我试试" />

## 10. 磁吸按钮（Vue 组件）

鼠标靠近时按钮被"吸附"跟手移动，离开后弹性回位。

<MagneticButton label="Magnetic" />

## 11. 骨架屏（Vue 组件）

微光扫过的占位骨架，数据就位后切换为真实内容，降低 CLS。

<Skeleton />

---

## 原有案例（归档至本组）

### 12. CSS 镂空遮罩（原生 HTML）

<HtmlFrame src="html/visual/css-mask.html" title="CSS 镂空遮罩" :height="460" />

### 13. 雪花飘落（Vue 组件）

<Snowflakes :width="640" :height="180" :count="60" x="center" color="skyblue" :maxSpeed="1" />

### 14. 滚动字符（Vue 组件）

<div style="min-height: 130px;">
  <RandomScroll :immediate="true" />
</div>

### 15. 悬浮按钮（Vue 组件）

<HoverButton text="hover me" />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import Typewriter from '@components/visual/typewriter.vue'
import RippleButton from '@components/visual/ripple-button.vue'
import MagneticButton from '@components/visual/magnetic-button.vue'
import Skeleton from '@components/visual/skeleton.vue'
import Snowflakes from '@components/visual/snowflakes.vue'
import RandomScroll from '@components/visual/random-scroll.vue'
import HoverButton from '@components/visual/hover-button.vue'
</script>
