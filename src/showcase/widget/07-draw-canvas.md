---
layout: doc
navbar: true
sidebar: false
---

# 07. 画布绘图（Vue 组件）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<DrawCanvas :width="560" :height="300" backgroundColor="#ffffff" color="#000000" borderColor="red" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/widget/draw-canvas.vue
:::

## 三、使用讲解

### 实现原理

- 生命周期骨架：`onMounted` 里设 `canvas.width/height`、取 `getContext('2d')`、初始化 `fillStyle/strokeStyle/lineWidth` 并 `clearCanvas()` 填底色，同时绑 `mousedown/mouseup/touchstart/touchend`；`onBeforeUnmount` 对称移除全部监听并 `unWatchColor()`。
- 画线采用「按下起笔、移动连线」：`startDrawing` 里 `ctx.save() + beginPath() + moveTo(offsetX, offsetY)`，并**临时**追加 `mousemove/touchmove`；`stopDrawing` 移除这两个监听、`closePath() + restore()`——move 监听只在拖拽期间存在，抬起后零开销。
- 橡皮擦是模式切换：`eliminate()` 翻转 `isDrawing`，移动回调里按模式选参数——画笔态用 `lineWidth` + 颜色，橡皮态强制 `lineWidth = 10` + `strokeStyle = backgroundColor`（用背景色描线即视觉擦除）。
- 触摸端坐标换算：`touchmove` 用 `getBoundingClientRect()` 后 `clientX - rect.x`（鼠标端直接用 `e.offsetX`）。
- 导出：`toDataURL(imageType)` 生成 base64，动态创建 `<a download="canvas.png">` 并 `click()`；格式由 `v-model` 的 select（PNG / JPEG / WebP）决定，扩展名从 `imageTypeOptions.label` 反查。

### 如何调整

- 尺寸、底色、边框、初始颜色全是 props（`width: 500 / height: 200 / backgroundColor: black / color: white / borderColor: white / downloadFileName: canvas`），分组页示例传了 `560×300` 白底黑线红框。
- CSS 用 `v-bind(backgroundColor)` 把 props 引进 scoped 样式，改 canvas 背景与边框只需传 prop。
- 擦除宽度是硬编码 `10`，想跟随笔头改 `onMouseMove/onTouchMove` 两处；`lineWidth` 下限目前没有（可减到 0 以下），可加 `Math.max(1, ...)` 保护。

### 注意事项

- 移动回调里 `ctx.strokeStyle = color` 传的是 **ref 对象**而非 `color.value`——canvas 收到非法值会保留上一次颜色，真实项目应写 `color.value`（`changeColor` 里是对的）。
- `e.preventDefault()` 在 touchmove 上未设 `passive: false`，部分浏览器会告警；需要完全接管滚动时要显式声明。
- `clearCanvas` 是 `fillRect` 填底色而非 `clearRect`（清成透明），底色即 `backgroundColor` prop。

<script setup>
import DrawCanvas from '@components/widget/draw-canvas.vue'
</script>
