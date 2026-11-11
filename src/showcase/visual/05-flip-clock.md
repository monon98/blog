---
layout: doc
navbar: true
sidebar: false
---

# 05. 倒计时翻页时钟

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/flip-clock.html" title="倒计时翻页时钟" :height="400" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/flip-clock.html
:::

## 三、使用讲解

### 实现原理

- 每个数字位 `.digit` 是 `perspective: 400px` 的 3D 容器，内含 `.val` 面片。
  数字变化时 `setDigit()` 先加 `flip-out` 播放 `flipOut 0.3s ease-in`（`rotateX(0 → -90deg)`），
  300ms 后由 `setTimeout` 把 `textContent` 换成新值并切到 `flip-in`（`rotateX(90deg → 0)`）。
- `render()` 把剩余秒 `left` 拆成 `mm` / `ss`（`String(m).padStart(2, '0')`），依次调用 `setDigit(cells.m1, mm[0])` 等 4 个单元。
  `setDigit` 开头比对 `valEl.textContent === String(next)`，值相同直接 return，避免同值重播动画。
  每次 `render()` 都会同时检查 4 个位，只有真正变化的位才触发翻页动画。
- 计时由 `start()` 里的 `setInterval(tick, 1000)` 驱动，`tick()` 每次 `left -= 1` 后调用 `render()`；
  `left === 0` 时 `stop()` 并把按钮文字置为「已结束」。
  控制区三个按钮「开始/暂停」「重置」「+30s」分别绑 `toggle` / `reset` / `plus` 的 `addEventListener`。
- 翻页钟的中缝靠两层叠加：`.val` 用双段线性渐变（`#374151 0%~49.9%` / `#1f2937 50%~100%`）分出上下半，
  `.digit::before` 再画一条 `rgba(0, 0, 0, 0.55)`、`height: 1px`、`z-index: 3` 的黑线。
- `render()` 末尾给 `#clock` toggle `done` 类（`left === 0` 时），整排数字变红 `#f87171`；
  分隔符 `:` 用 `blink 1s steps(1) infinite` 每秒闪一次。
  DOM 里始终只有一个 `.val` 面片（就地改 `textContent`），翻页过程不会累积节点。

### 如何调整

- 总时长改脚本顶部的 `TOTAL = 300`（秒，默认 5 分钟）；「+30s」按钮对应 `left += 30`，改加时步长就在这里。
- 翻页速度需两处同步：`.digit.flip-out / .flip-in` 的 `0.3s` 与 `setDigit()` 里 `setTimeout(..., 300)`。
- 卡片尺寸在 `.digit` 的 `width: 62px; height: 88px; font-size: 46px`；
  `perspective: 400px` 越小 3D 翻转越夸张，改大则更平缓。

### 注意事项

- `.val` 上的 `backface-visibility: hidden` 与 `transform-origin: center` 缺一不可，
  去掉会露出面片背面，在翻转中途出现镜像数字。
- 连点「+30s」可能让同一位数字排队触发翻页，源码只靠「值相同就 return」做最基础的拦截。
  快速连点时新旧动画会重叠，新一轮 `flip-out` 会直接覆盖上一轮的 `flip-in`。
- `setInterval` 在后台标签页会被浏览器节流，长时间倒计时会漂移，
  严谨场景应改用 `Date.now()` 差值校正。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
