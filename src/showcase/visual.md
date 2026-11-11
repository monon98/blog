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

## 12. CSS 镂空遮罩（原生 HTML）

<HtmlFrame src="html/visual/css-mask.html" title="CSS 镂空遮罩" :height="460" />

## 13. 雪花飘落（Vue 组件）

<Snowflakes :width="640" :height="180" :count="60" x="center" color="skyblue" :maxSpeed="1" />

## 14. 滚动字符（Vue 组件）

<div style="min-height: 130px;">
  <RandomScroll :immediate="true" />
</div>

## 15. 悬浮按钮（Vue 组件）

<HoverButton text="hover me" />

## 16. 3D 倾斜卡片（原生 HTML）

鼠标位置计算 rotateX / rotateY，高光层跟随，卡片元素分层 translateZ 纵深。

<HtmlFrame src="html/visual/tilt-card.html" title="3D 倾斜卡片" :height="540" />

## 17. 光晕跟随光标（原生 HTML）

三层光标以不同插值系数跟随：光晕慢速氛围、圆环悬停放大、实心点精确同步。

<HtmlFrame src="html/visual/glow-cursor.html" title="光晕跟随光标" :height="440" />

## 18. 网格聚光灯（原生 HTML）

JS 计算每个格子与鼠标的距离，写入 CSS 变量驱动亮度、发光与缩放。

<HtmlFrame src="html/visual/spotlight-grid.html" title="网格聚光灯" :height="560" />

## 19. 星座连线网络（原生 HTML）

粒子间距离小于阈值即连线，鼠标靠近产生斥力并额外连线（Canvas）。

<HtmlFrame src="html/visual/particles-network.html" title="星座连线网络" :height="480" />

## 20. 点击放彩带（原生 HTML）

点击页面发射 DOM 彩带簇，带重力、阻尼、翻转压扁与淡出。

<HtmlFrame src="html/visual/confetti.html" title="点击放彩带" :height="440" />

## 21. 流星雨（原生 HTML）

Canvas 星空 + 斜向划过的渐变拖尾流星，可调密度，含闪烁星星与月亮。

<HtmlFrame src="html/visual/meteor.html" title="流星雨" :height="480" />

## 22. 霓虹灯文字（原生 HTML）

多层 text-shadow 叠出发光，keyframes 模拟霓虹管偶发熄灭，可换文案与发光色。

<HtmlFrame src="html/visual/neon-text.html" title="霓虹灯文字" :height="520" />

## 23. 故障风文字（原生 HTML）

两层伪元素染红 / 青，clip-path 分段切片反向位移做 RGB 通道错位，hover 加剧。

<HtmlFrame src="html/visual/glitch-text.html" title="故障风文字" :height="440" />

## 24. 文字逐词入场（原生 HTML）

按词包 overflow 遮罩，translateY 依次浮现，IntersectionObserver 触发、可重播。

<HtmlFrame src="html/visual/split-text-reveal.html" title="文字逐词入场" :height="640" />

## 25. 极光背景（原生 HTML）

四层椭圆渐变 blur + screen 混合，不同周期漂移旋转，可调速与暂停。

<HtmlFrame src="html/visual/aurora.html" title="极光背景" :height="440" />

## 26. 液态融球背景（原生 HTML）

色块 border-radius 形变漂浮，外层 blur + contrast 让相邻色块融化融合（gooey）。

<HtmlFrame src="html/visual/liquid-blob.html" title="液态融球背景" :height="460" />

## 27. 波点矩阵涟漪（原生 HTML）

鼠标靠近的波点按距离放大点亮，点击产生扩散环。

<HtmlFrame src="html/visual/hover-grid.html" title="波点矩阵涟漪" :height="580" />

## 28. SVG 路径描边绘画（原生 HTML）

用 getTotalLength 校准路径长度，dashoffset 依次画出山水与小屋，最后淡入填充。

<HtmlFrame src="html/visual/stroke-draw.html" title="SVG 路径描边绘画" :height="520" />

## 29. 纯 CSS Loader 合集（原生 HTML）

10 种常用加载动画，全部只用 CSS：旋转环 / 跳动点 / 均衡器 / 轨道 / 波纹等。

<HtmlFrame src="html/visual/loading-spinners.html" title="纯 CSS Loader 合集" :height="760" />

## 30. SVG 模拟指针时钟（原生 HTML）

60 格刻度 + 三针，秒针按 rAF 平滑扫动（非跳秒），可隐藏秒针与切时区。

<HtmlFrame src="html/visual/analog-clock.html" title="SVG 模拟指针时钟" :height="540" />

## 31. 数字滚动计数器（Vue 组件）

进入视口从 0 滚到目标值，easeOutExpo 缓动收尾，支持前缀 / 后缀与小数位。

<CounterRoll />

## 32. 昼夜切换（Vue 组件）

太阳月亮交替升降、星星淡入、云朵飘散，天空 / 地面 / 面板全场景平滑过渡。

<DayNight />

<script setup>
import HtmlFrame from '@components/html-frame.vue'
import Typewriter from '@components/visual/typewriter.vue'
import RippleButton from '@components/visual/ripple-button.vue'
import MagneticButton from '@components/visual/magnetic-button.vue'
import Skeleton from '@components/visual/skeleton.vue'
import Snowflakes from '@components/visual/snowflakes.vue'
import RandomScroll from '@components/visual/random-scroll.vue'
import HoverButton from '@components/visual/hover-button.vue'
import CounterRoll from '@components/visual/counter-roll.vue'
import DayNight from '@components/visual/day-night.vue'
</script>
