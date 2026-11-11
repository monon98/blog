---
layout: doc
navbar: true
sidebar: false
---

# 26. 液态融球背景

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/liquid-blob.html" title="液态融球背景" :height="460" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/liquid-blob.html
:::

## 三、使用讲解

### 实现原理

- **gooey 滤镜**：外层 `.goo` 用 `inset: -10%` 铺满整块区域，样式为
  `filter: blur(46px) contrast(28); background: #0a0a14` —— 先把相邻色块的边缘糊在一起，
  再用 28 倍对比度把中间的半透明过渡推回实边，两球靠近的位置就"粘连"成液态融合。
- **四个色块**尺寸全部用 vmin，跟随视口等比缩放：`.b1` 34vmin 走 `#6366f1 → #8b5cf6` 渐变，
  配 `morph1 9s` + `float1 13s`；`.b2` 28vmin 走 `#06b6d4 → #22d3ee`，配 `morph2 11s` + `float2 15s`；
  `.b3` 24vmin 走 `#ec4899 → #f472b6`，配 `morph1 8s alternate-reverse` + `float3 12s`；
  `.b4` 18vmin 走 `#f59e0b → #fbbf24`，配 `morph2 7s` + `float1 14s reverse`。
- **形变动画**：`morph1` / `morph2` 的关键帧在 4 组 8 数值 `border-radius` 之间循环，
  例如 `0%` 处是 `42% 58% 62% 38% / 45% 42% 58% 55%`，`100%` 处换成另一组，
  球面轮廓持续改变；元素上标了 `will-change: border-radius, transform` 提示合成。
- **漂浮动画**：`float1` 走 `translate(6vmin, -5vmin) rotate(24deg)`，`float2` 走
  `translate(-7vmin, 6vmin)`，`float3` 走 `translate(4vmin, -7vmin) scale(1.14)`，
  每个 blob 同时挂两条 animation（形变 + 漂浮），互不干扰地叠加。
- **JS 只有两个按钮**：暂停按钮把全部 `.blob` 的 `animationPlayState` 置 `paused` / `running`；
  变小按钮先设 `transform: scale(0.62)` 再设 `zoom: 0.62`，
  源码注释明确说明 transform 与 keyframes 冲突，靠 `zoom` 兜底生效。

### 如何调整

- 融合强度调 `.goo` 的 `blur(46px)` 与 `contrast(28)`：模糊越大、对比越高越"黏"；
  同时 `.goo` 的 `background` 必须与页面底色 `#0a0a14` 一致，否则对比滤镜会把底色也推向两极。
- 形变幅度改 `morph1` / `morph2` 关键帧里的 8 组百分比，速度改各自 `animation`
  的 9s / 11s / 8s / 7s；时长越短球面抖动越快。
- 漂浮距离改 `float1/2/3` 关键帧中的 `vmin` 位移与 `rotate`、`scale` 峰值；
  加球只需复制 `.b1` 规则并给它一套独立的 morph / float 组合，注意配不同底色避免完全重合。

### 注意事项

- `contrast(28)` 会把容器内的一切拉向两极，所以文字与按钮必须放在 `.goo` 之外
  （源码里 `h1`、`p`、`.ctrl` 都是 `.goo` 的同级节点），否则文案会糊成色块。
- `transform` 与 `@keyframes` 同时作用于同一元素时后者优先，这就是"让色块变小"
  改用 `zoom` 的原因；`zoom` 属非标准属性，老 Safari 与部分嵌入式浏览器表现不一致。
- `blur + contrast` 全屏滤镜开销较大，移动端建议把球减到 2–3 个，
  或调低 `.goo` 的模糊半径，避免长时间运行发热掉帧。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
