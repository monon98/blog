---
layout: doc
navbar: true
sidebar: false
---

# 21. 流星雨

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/meteor.html" title="流星雨" :height="480" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/meteor.html
:::

## 三、使用讲解

### 实现原理

- `buildStars()` 按面积铺星星：`n = Math.floor((W * H) / 5200)`，每颗有半径 `r = rand*1.3 + 0.3`、
  闪烁相位 `tw` 与速度 `sp = 0.4 + rand * 1.2`；帧循环里透明度算 `a = 0.35 + Math.sin(t / 700 * s.sp + s.tw) * 0.35`。
- 每帧用概率生成流星：`Math.random() < density * 0.014`（`density` 默认 5 → 每帧约 7% 概率）调用 `spawn2()`。
- `spawn2()` 出生在 `x = W * 0.3 + rand * W * 0.8`、`y = -60 - rand * H * 0.3`，速度 `8 + rand * 10`，
  方向 `vx = -speed * 0.55, vy = speed * 0.85`（向左下），拖尾长 `len = 80 + rand * 160`，
  `hue = Math.random() > 0.72 ? 195 : 46` 决定约 28% 是蓝流星。
- 拖尾用 `createLinearGradient(head → 尾点)`：金色走 `rgba(255, 245, 200, 0.95)` → `rgba(253, 224, 71, 0.55)` → 透明，
  蓝色走 `rgba(220, 240, 255, 0.95)` → `rgba(125, 211, 252, 0.55)` → 透明；`lineWidth = 2.2`、`lineCap = 'round'`，
  头部再画一个半径 1.8 的白点。
- 出界判定 `mt.x < -250 || mt.y > H + 250` 时 `meteors.splice(m, 1)` 回收，并把 `count` 更新到 HUD。
- 月亮是纯 CSS：`.moon` 58px 径向渐变球体 + 双层 `box-shadow` 光晕，`::after` 用背景色 `#040714` 的圆遮出月牙。
- 动画入口是 `resize()` → `requestAnimationFrame(frame)`；`frame(t)` 每帧的顺序固定：`clearRect`、
  按 `t` 画星星、按概率 `spawn2()`、倒序更新流星并回收、最后再挂下一次 rAF。
- 夜空底色也是 CSS：`body` 背景为 `linear-gradient(180deg, #040714 0%, #0b1026 55%, #131a3a 100%)`，
  月亮与 HUD 都是浮在 canvas 之上的 `position: fixed` 元素。

### 如何调整

- 底部滑块 `density`（1~10，默认 5）对应概率公式 `density * 0.014`，想更频可直接放大系数。
- 星星密度 `(W * H) / 5200`、流星速度 `8 + rand * 10`、拖尾 `80 + rand * 160` 控制画面丰满度与速度感。
- 两套拖尾渐变色写在 `frame()` 的 `if (mt.hue === 46)` 分支里，蓝/金比例由 `spawn2()` 的 `0.72` 阈值控制。

### 注意事项

- 源码里还保留了另一版 `spawn()`（用 `Math.PI * 0.72` 约 215° 方向），但每帧实际调用的是 `spawn2()`，
  调参时别改错函数。
- `resize()` 会重建全部星星并让 canvas 尺寸归零重设，窗口拖动过程中画面会瞬间清空。
- 每颗流星每帧都 `createLinearGradient` 新建渐变对象，流星密集时可考虑缓存或改用纯色 + 透明度渐变。
- `density` 的 `input` 回调用的是普通函数（依赖 `this.value`），改成箭头函数会取不到值。
- HUD 的"已划过"只在 `spawn2()` 里 `count++`，被弃用的 `spawn()` 并不计数——改错函数时计数也会一起失灵。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
