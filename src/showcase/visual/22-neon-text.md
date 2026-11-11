---
layout: doc
navbar: true
sidebar: false
---

# 22. 霓虹灯文字

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/neon-text.html" title="霓虹灯文字" :height="520" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/neon-text.html
:::

## 三、使用讲解

### 实现原理

- 主标题 `.neon` 用四层 `text-shadow` 由内到外叠出发光：`0 0 7px #fff`、`0 0 16px #ff4fa3`、
  `0 0 34px #ff4fa3`、`0 0 70px #ff2d95`，字号 `clamp(34px, 7vw, 64px)`、`letter-spacing: 6px`。
- 闪烁由 `@keyframes flicker 4.5s linear infinite` 完成：0%~18%、20%、22%、25%、54%、56%、100% 保持满亮，
  19% / 21% / 24% 突然掉到 `opacity: 0.35` 并只剩 `0 0 4px rgba(255,255,255,0.6)`，55% 掉到 `opacity: 0.55`
  ——模拟霓虹管偶发熄灭。
- 副标题 `.sub-neon` 换青色系 `#a5f3fc` + `0 0 14px #22d3ee / 0 0 30px #06b6d4`，
  用 `flicker 6s linear infinite 0.8s` 让节奏与主标题错开。
- 三个按钮各司其职：`toggle` 用 `style.animationPlayState = running / paused` 冻结闪烁（关闭时手动把 `opacity` 归 1）；
  `swap` 在 `texts`（4 组文案）里轮换并写 `textContent`；`color` 在 `palettes`（4 组配色）里轮换，
  重写 `main.style.textShadow / sub.style.textShadow`，并给 `.sign` 换 `borderColor = p[0] + '59'`、
  `boxShadow = 'inset 0 0 40px ' + p[0] + '14'`（两位十六进制透明度）。
- 背景是两条 `repeating-linear-gradient` 组成的 34px 细网格压在 `#0a0a12` 上，招牌框 `.sign` 有
  `3px` 的 `rgba(244, 114, 182, 0.35)` 描边与 `inset 0 0 40px` 内阴影。
- 按钮区 `.ctrl` 三个按钮各有状态反馈：`.on` 态是 `background: #ff2d95` + `0 0 18px rgba(255,45,149,0.55)` 光晕，
  hover 态把边框换成 `#ff4fa3`、文字换成 `#ff9ecb`，当前"开/关"一目了然。
- 说明区 `.tip` 直接把原理写在页面上：多层 `text-shadow` 由内到外叠加 + `@keyframes flicker` 模拟偶发熄灭。

### 如何调整

- 四层阴影的模糊半径 `7 / 16 / 34 / 70px` 与色值 `#ff4fa3` / `#ff2d95` 决定光晕范围，逐层放大才有"由实到虚"。
- `flicker` 关键帧的百分比与 `opacity`（0.35 / 0.55）控制熄灭频率和程度，`4.5s` / `6s` 是周期。
- `palettes`、`texts` 两个数组直接加行即可扩展；招牌留白改 `.sign { padding: 40px 56px; }`。

### 注意事项

- 换色是把 `textShadow` 写进行内样式，而 `flicker` 关键帧里也声明了 `text-shadow` —— 动画运行期间关键帧优先，
  新配色要等点"闪烁动画：关"（`animationPlayState: paused`）才完全显现。
- `p[0] + '59'` 这种拼法只支持 6 位 hex 颜色，palette 若换成 `rgb(...)` 字符串会拼出非法属性值。
- 多层 `text-shadow` 动画每帧都在重绘大面积文字，移动端建议减少层数或缩短动画周期。
- `animationPlayState: paused` 只是暂停、不会重置进度，再次开启会从当前百分比继续闪，而不是从头开始。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
