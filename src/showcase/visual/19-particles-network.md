---
layout: doc
navbar: true
sidebar: false
---

# 19. 星座连线网络

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/particles-network.html" title="星座连线网络" :height="480" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/particles-network.html
:::

## 三、使用讲解

### 实现原理

- `init()` 按面积自适应生成节点：`count = Math.min(130, Math.floor((W * H) / 11000))`，
  每个节点是 `{ x, y, vx: (Math.random() - 0.5) * 0.5, vy, r: 1.4 + Math.random() * 1.6 }`。
- `frame()` 开头用 `ctx.fillStyle = 'rgba(5, 6, 15, 0.4)'` 半透明铺底，制造轻微拖尾，避免整屏擦除。
- 物理更新：距鼠标小于 120px 时施加斥力 `force = (120 - dm) / 120 * 1.6` 沿背离方向推；
  速度每帧乘 `0.96` 阻尼，模长超过 `2.4` 就截断到 2.4；碰壁 `vx *= -1` 回弹。
- 连线分两轮：节点两两比较，`d < LINK_DIST`（130）画 `rgba(129, 140, 248, (1 - d / 130) * 0.5)`；
  再逐点与鼠标比较，`dm2 < MOUSE_DIST`（170）画青色 `rgba(103, 232, 249, (1 - dm2 / 170) * 0.8)`，
  每画一条 `linkCount++`，最后写进 HUD 的"连线"计数。
- 节点本体用 `#c7d2fe` 实心圆绘制；`mouseleave` 把 `mouse` 置为 `-9999` 让鼠标交互静默，
  `window.resize` 会重新 `resize()` → `init()` 重建全部节点。
- 顶部 HUD 是带 `backdrop-filter: blur(8px)` 的胶囊条，三个 `<b>` 分别实时显示 `nodes.length`、
  `linkCount` 与固定文案"连接距离 130px"，数值用 `font-variant-numeric: tabular-nums` 对齐不跳动。
- 初始速度 `vx = vy = (Math.random() - 0.5) * 0.5`（每帧最多 0.25px），半径 `1.4 + Math.random() * 1.6`，
  这两个值决定节点的漂移幅度与圆点大小。

### 如何调整

- 两个阈值 `LINK_DIST = 130` / `MOUSE_DIST = 170` 决定连线密度，改了要同步更新 HUD 上的"连接距离 130px"文案。
- 密度改 `(W * H) / 11000` 与上限 `Math.min(130, ...)`；手感相关参数是斥力半径 `120`、强度 `1.6`、
  阻尼 `0.96`、速度上限 `2.4`。
- 拖尾浓度 `rgba(5, 6, 15, 0.4)` 数值越小拖尾越长；节点色 `#c7d2fe`、线宽 `lineWidth = 1`。
- 重新开局不用重画 canvas，直接调 `init()` 就会按当前尺寸重造 `nodes`（`resize()` 内部正是先赋尺寸再 `init()`），
  很适合挂一个"重新生成"按钮。

### 注意事项

- 节点连线是 O(n²) 双重循环，130 个节点每帧约 8385 次 `Math.hypot`，数量翻倍开销翻四倍，
  想加到几百个需要换空间网格或四叉树。
- 每帧都改 HUD 的 `textContent` 会触发布局，节点多时可降频（比如每 10 帧）更新。
- `requestAnimationFrame(frame)` 无条件自循环，没有暂停逻辑；嵌进长期挂载的页面时建议监听 `visibilitychange` 停帧。
- 鼠标缺席时 `mouse = { x: -9999, y: -9999 }`（一个远离视口的哨兵值），触屏设备没有 `mousemove`，
  此时只会看到节点间连线、看不到放射到鼠标的青色线。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
