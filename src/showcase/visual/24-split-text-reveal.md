---
layout: doc
navbar: true
sidebar: false
---

# 24. 文字逐词入场

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/split-text-reveal.html" title="文字逐词入场" :height="640" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/split-text-reveal.html
:::

## 三、使用讲解

### 实现原理

- **拆词**：`splitWords(el)` 逐字符扫描标题文本，用正则 `/[一-龥]/` 判断 CJK 字符 ——
  中文每凑满 2 个字推入一个 token（余字最后补），英文按空格切词并保留空格文本节点，
  词与词之间仍输出原始空格，因此断行保持自然，中文标题也能按"两字一词"的节奏入场。
- **遮罩结构**：每个词包两层 `<span>`，外层 `.word-mask` 用 `overflow: hidden` 做裁剪容器，
  内层 `.word` 初始为 `transform: translateY(110%) rotate(4deg)` 且 `opacity: 0`，
  拿到 `.show` 后回到 `translateY(0) rotate(0)` 并变实，形成"从遮罩下方翻出"的入场动作。
- **双重延时**：拆词阶段就给每个 `.word` 写入 `--d = (i * 0.07).toFixed(2) + 's'`，
  由 CSS `transition-delay: var(--d, 0s)` 消化；`play()` 又对每个 mask 用
  `setTimeout(150 + i * 70)` 追加 `.show` 类，JS 延时与 CSS 延时叠加，序列感更强。
- **重播机制**：`play()` 先移除全部 `.show`，执行 `void title.offsetWidth` 强制回流，
  让浏览器先渲染回初始态再加回类名；少了这一步，第二次点击「↻ 重播动画」不会有任何动画。
- **滚动触发**：`IntersectionObserver` 以 `{ threshold: 0.3 }` 观察 `.hero`，
  首屏进入视口即自动 `play()`，`played` 标志保证只播一次；第二段 `.filler` 文案同样是
  进入视口后靠 `.show` 类显形，无需在 scroll 回调里反复测量位置。
- **辅助元素错峰出场**：`.desc` 是 `all 0.8s ease 0.9s`，`.replay` 按钮是
  `opacity 0.6s ease 1.3s`，页脚提示用 `@keyframes bob` 做 1.6s 上下浮动，
  与词入场的 0.07s × 序号形成整体节奏。

### 如何调整

- 节奏三处：`buf.length >= 2` 决定中文每几个字一词，`i * 0.07` 是词与词的延时间隔，
  `150 + i * 70` 决定起播延迟与整段总时长，三者一起改可快可慢。
- 动作幅度调 `.word` 的 `translateY(110%)`（超出遮罩的行程，值越大"钻出"越久）
  与 `rotate(4deg)`，缓动曲线为 `cubic-bezier(0.22, 1, 0.36, 1)`，
  位移过渡 0.7s、透明度过渡 0.5s，可分别微调。
- 配色集中在三处：`body` 背景 `#0b1120`、`.kicker` 文字 `#67e8f9`、
  `.replay` 背景 `rgba(99, 102, 241, 0.16)`（hover 时 `0.34`），标题区顶部另有
  `radial-gradient(80% 60% at 50% 0%, #1e1b4b ...)` 的氛围光。

### 注意事项

- `.word-mask` 上的 `padding-bottom: 0.12em; margin-bottom: -0.12em` 不能删，
  否则 `overflow: hidden` 会把 g、y 这类下伸字母裁掉一截。
- `play()` 里的 `setTimeout` 没有保存句柄，快速连点「重播」会叠加多组定时器，
  需要严格控制时应把 id 存数组并逐个 `clearTimeout`。
- 源码没有 IntersectionObserver 的降级分支，老浏览器首屏会停在词全隐藏的状态，
  建议先做特性检测，不支持时直接调用 `play()`。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
