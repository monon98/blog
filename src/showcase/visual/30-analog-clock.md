---
layout: doc
navbar: true
sidebar: false
---

# 30. SVG 模拟指针时钟

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/analog-clock.html" title="SVG 模拟指针时钟" :height="540" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/analog-clock.html
:::

## 三、使用讲解

### 实现原理

- **表盘结构**：`viewBox="0 0 300 300"` 的 SVG 内放
  `<circle class="face" cx="150" cy="150" r="140">`（`fill: #0f172a; stroke: #334155; stroke-width: 3`），
  三根指针都是 `<line>`，统一由 CSS `transform-origin: 150px 150px` 绕表盘中心旋转。
- **刻度生成**：JS 循环 60 次用 `createElementNS` 创建 `<line>`，`angle = i * 6 * Math.PI / 180`，
  `i % 5 === 0` 为长刻度（内径 `r1 = 118`，`.tick.major` 是 `#94a3b8` 宽 4），
  短刻度 `r1 = 124` 宽 2，外径统一 `r2 = 132`，坐标用 `sin / cos` 三角函数算出。
- **指针规格**：时针 `y2 = 82`、宽 7、色 `#e2e8f0`；分针 `y2 = 52`、宽 5、色 `#a5b4fc`；
  秒针 `y1 = 164 → y2 = 38`、宽 2.5、色 `#f43f5e`（y1 超过中心即尾部配重），
  中心再叠 `pin-outer` r=7 与 `pin-inner` r=3 两层圆点盖住针根。
- **平滑走时**：`frame()` 先取 `now = new Date(Date.now() + offsetMin * 60000)`，
  再算 `s = getSeconds() + ms / 1000`（含毫秒的平滑秒）、`m = getMinutes() + s / 60`、
  `h = getHours() % 12 + m / 60`，分别写 `rotate(h * 30 / m * 6 / s * 6 deg)`，
  因此秒针是连续扫动而不是每秒跳一格。
- **循环与读数**：`frame()` 末尾自调 `requestAnimationFrame(frame)`，同一帧内刷新 `#digital`
  （`pad(n)` 用 `padStart(2, '0')` 补零，毫秒补 3 位），下方数字时钟与指针始终一致。
- **两个开关**：`showSec` 只切 `secondEl.style.display` 与按钮文案；时区
  `zones = [0, 60, -60, 480]` 对应 `['本地', 'UTC+1', 'UTC-1', '东八区']`，
  切换仅修改 `offsetMin` 变量，时间计算逻辑完全不动。

### 如何调整

- 外观调 `.face` 的 `r`（140）与 `stroke-width`，以及 `.hour / .minute / .second` 的
  `stroke-width`（7 / 5 / 2.5）与颜色；12 / 3 / 6 / 9 四个数字是固定 `<text>`，
  坐标依次 `(150,42) / (258,150) / (150,258) / (42,150)`，字号 20px。
- 改 `viewBox` 尺寸时，`transform-origin: 150px 150px` 必须与所有
  `cx / cy / x1 / y1` 的中心值一起同步，否则指针会偏离圆心。
- 想省 CPU 可把 `requestAnimationFrame` 换成 `setInterval(..., 1000)` 并去掉 `ms / 1000`，
  秒针会退化成每秒跳一格的普通走时，功耗更低。

### 注意事项

- SVG 元素上的 CSS `transform` 必须显式写 `transform-origin`（px 单位），
  不写会默认绕 SVG 局部原点 `(0, 0)` 旋转，整根指针会甩出表盘。
- `rAF` 每帧改 3 个 `style.transform` 加一次 `innerHTML`，标签页切到后台时浏览器停渲染
  但回调照跑，长驻页面建议在 `document.hidden` 时直接跳过本轮更新。
- 时区按钮只是演示偏移（`+480` 分钟，不区分夏令时与历史时区），
  真实场景请改用 `Intl.DateTimeFormat` 的 `timeZone` 选项。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
