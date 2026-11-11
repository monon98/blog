---
layout: doc
navbar: true
sidebar: false
---

# 12. CSS 镂空遮罩（原生 HTML）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HtmlFrame src="html/visual/css-mask.html" title="CSS 镂空遮罩" :height="460" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/visual/css-mask.html
:::

## 三、使用讲解

### 实现原理

- `.outer-box` 铺满父级（`width: 100%; height: 100%`）并涂天蓝底色 `background-color: skyblue`，
  `border-radius: 20px`、`overflow: hidden`，外加 `box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3)` 的投影。
- `.inner-box` 尺寸 `80% × 80%`，`background-color: transparent` + `border: 10px solid white`，
  用 `position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)` 精确居中，
  `z-index: 1` 保证压在外框背景之上。
- 关键在 `box-shadow: 0 0 0 3000px rgba(0, 0, 0, 0.5)`：`blur = 0`、`spread = 3000px` 的实心外阴影
  从 inner-box 边界向外扩 3000px，把整块 skyblue 蒙上 50% 黑；
  而 `box-shadow` 不绘制在元素自身盒内，所以中间窗口保持透亮 —— 视觉上就是「镂空」。
  蒙版只覆盖外框内部区域，靠 `overflow: hidden` 裁掉溢出到页面的多余阴影。
- `body` 用 `display: flex; justify-content: center; align-items: center; height: 100vh`
  让外框在页面里居中，页面底色 `white`。
- `border: 10px solid white` 的白框夹在黑色蒙版与透亮窗口之间，形成清晰的高亮轮廓；
  `.outer-box` 的 `overflow: hidden` 把溢出的 3000px 阴影裁在框内。

### 如何调整

- 蒙版浓度改 `rgba(0, 0, 0, 0.5)` 的 alpha（`1` 即全黑），窗口大小改 `.inner-box` 的 `width / height: 80%`。
- 白框粗细改 `border: 10px solid white`，圆角由内外两个元素各自的 `border-radius: 20px` 控制，
  想做非圆角窗口改这里即可。
- `spread` 的 `3000px` 只要远大于容器对角线就够，设更大值不会增加额外绘制成本（按矩形扩展）。

### 注意事项

- `overflow: hidden` 是安全阀，去掉后 3000px 的巨大阴影会溢出盖住整页其他内容。
- 该方案只能把「同元素背景」蒙暗露出下层色块，无法真正挖穿到更底层的内容；
  需要穿透时应改用 `mask-image` 或 `clip-path`。
  `z-index: 1` 只保证 inner-box 压在外框背景之上，外框里再放内容需另设层级。
- 纯 CSS 零脚本，兼容性很好；但蒙版是静态的，若要跟随鼠标移动高亮窗口，
  需配合 JS 改 `left / top` 或 CSS 变量，注意 `translate(-50%, -50%)` 居中要一起保留。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
