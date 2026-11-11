---
layout: doc
navbar: true
sidebar: false
---

# 07. 音频频谱可视化

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/audio-spectrum.html" title="音频频谱可视化" :height="440" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/audio-spectrum.html
:::

## 三、使用讲解

### 实现原理

- `initAudio()` 搭链路：`master` 增益（`gain.value = 0.35`）→ `analyser`
  （`fftSize = 512` 即 256 个频段，`smoothingTimeConstant = 0.8`）→ `destination`；
  全部声音由 Web Audio API 现场合成，无外部音频文件。
  点击「▶ 播放」才执行 `initAudio()`，符合浏览器必须由用户手势创建上下文的策略。
- `schedulerTick()` 每 `25ms` 跑一次，`while (nextTime < actx.currentTime + 0.12)` 预排音符；
  `TEMPO = 132`，`STEP_DUR = 60 / TEMPO / 2` 为八分音符，旋律按 `SCALE` 小调五声音阶 16 项循环。
- 每 4 步叠一个低八度低音：`step % 4 === 0` 时 `scheduleNote(nextTime, noteFreq(semi - 12), STEP_DUR * 3.2)`；
  普通音时值是 `STEP_DUR * 1.6`，`start()` 里 `nextTime = actx.currentTime + 0.08` 留出起播余量。
- `scheduleNote()` 单个音色 = `sawtooth` 振荡器 + `lowpass` 滤波器（`2600Hz` 指数滑到 `500Hz`）
  + 增益包络（`0.0001` 用 0.012s 拉到 `0.7`，再在 `dur` 内降到 `0.001`）。
- `draw()` 由 `requestAnimationFrame` 驱动：`getByteFrequencyData(freqData)` 取 256 字节频域，
  频谱柱 `bars = 72`、`gap = 3`，取样下标 `Math.floor(Math.pow(i / bars, 1.7) * (freqData.length - 1))`
  做对数映射让低频更醒目，柱高 `Math.max(3, v * (H * 0.72))`，再叠 2px 白色高光。

### 如何调整

- 节奏改 `TEMPO`（`STEP_DUR` 随之自动计算），基音改 `BASE = 174.61`（F3），旋律改 `SCALE` 数组。
- 柱数 `bars = 72`、间距 `gap = 3`、最高 `H * 0.72`、对数指数 `1.7` 全部在 `draw()` 内。
- 拖尾浓淡改背景填充 `rgba(5, 6, 15, 0.28)` 的 alpha，总音量改 `master.gain.value = 0.35`。

### 注意事项

- `AudioContext` 必须在用户手势里创建并 `resume()`
  （源码在 `start()` 里判断 `actx.state === 'suspended'`），否则浏览器禁止发声。
  首次点击「▶ 播放」时 `initAudio()` 才会 new 出上下文。
- `fftSize = 512` 只有 256 个频段却要画 72 根柱，靠指数取样复用；
  `bars` 调到 256 以上会重复取相同下标，柱子不再有细节差异。
  低频集中在左侧是 `1.7` 次幂映射的结果，想让高频更醒目可把这个指数调小。
- 未播放时 `drawIdle()` 每帧画一条 `Math.sin` 呼吸基准线（振幅 14，`rgba(99, 102, 241, 0.5)` 描边），
  停止后画面不会完全黑掉。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
