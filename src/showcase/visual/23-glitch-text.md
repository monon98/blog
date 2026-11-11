---
layout: doc
navbar: true
sidebar: false
---

# 23. 故障风文字

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/glitch-text.html" title="故障风文字" :height="440" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/glitch-text.html
:::

## 三、使用讲解

### 实现原理

- `.glitch::before` / `::after` 用 `content: attr(data-text)` 复刻文字，分别染成 `#ff3d67`（红通道，`z-index: -1`）
  与 `#00e5ff`（青通道，`z-index: -2`），各跑一套动画：`glitch-a 2.6s` 与 `glitch-b 3.1s`，
  都是 `infinite linear alternate-reverse`（来回反向播放，避免末尾跳变）。
- 每套关键帧用 `clip-path: inset(...)` 切一条横带（如 `inset(20% 0 62% 0)`），同时给
  `translate(-5px, 2px)` 级别的位移；红层每 10%、青层每 12% 换一次切片位置，两通道错开就形成 RGB 通道错位。
- `.hot` 状态加剧故障：`::before` 动画压到 `0.4s`、`::after` 压到 `0.5s`，本体叠加
  `shake 0.18s infinite`（±2px 抖动）；`mouseenter / mouseleave` 负责切换 class。
- "触发一次强故障"按钮 `add('hot')` 后用 `setTimeout(..., 900)` 移除，形成 900ms 的爆发。
- "换文案"在 `['GLITCH', '故障 404', 'SYSTEM ERR', '失真信号']` 里轮换，同时改 `textContent` 与
  `setAttribute('data-text', ...)` —— 两处必须同步，否则伪元素还显示旧文案。
- 氛围层：`body::after` 铺 `repeating-linear-gradient` 扫描线（`rgba(255,255,255,0.035)` 1px 实线 / 4px 间隔），
  `position: fixed`、`pointer-events: none`、`z-index: 5` 压在最上层。
- 文字本体同时存在两份：节点文本（`GLITCH`）与 `data-text` 属性，两套伪元素各复制一次；
  `glitch-a` 有 11 个关键帧、每 10% 换一次切片，`glitch-b` 每 12% 换一次，节拍天然错开。
- 控制区 `.ctrl` 两个按钮（"触发一次强故障"/"换文案"）hover 时边框变 `#ff3d67`、文字变 `#ff8fa3`，与红通道配色呼应。

### 如何调整

- 关键帧里的 `inset(...)` 决定切片位置、`translate` 的 3~5px 决定错位幅度；`2.6s` / `3.1s` 两个互素周期让红青不同步。
- 爆发强度改 `.glitch.hot` 的 `0.4s / 0.5s / 0.18s`，按钮持续时间改 `setTimeout` 的 `900`。
- 配色与字号：红 `#ff3d67`、青 `#00e5ff`、本体 `#f3f4f6`，字号 `clamp(40px, 9vw, 86px)`、`letter-spacing: 4px`。

### 注意事项

- 伪元素用负 `z-index` 压在文字后面，因此 `.glitch` 自身不能有不透明背景，否则红青层会被盖住。
- 换文案漏掉 `data-text` 同步是这套实现最常见的坑（HTML 里也必须保留 `data-text` 属性）。
- `clip-path` + `translate` 持续合成，字号最大 86px 时低端机会掉帧，可缩短动画或降低位移量。
- 扫描线层 `z-index: 5` 高于文字层，但 `pointer-events: none` 保证不挡点击；若页面里还有其他浮层，
  要重新安排这层的层级关系。
- 源码未处理 `prefers-reduced-motion`，对闪烁敏感的用户建议加媒体查询关掉两套故障动画。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
