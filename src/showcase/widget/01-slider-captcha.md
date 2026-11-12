---
layout: doc
navbar: true
sidebar: false
---

# 01. 滑块拼图验证码（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/slider-captcha.html" title="滑块拼图验证码" :height="500" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/slider-captcha.html
:::

## 三、使用讲解

### 实现原理

- 背景用 `makeBg()` 生成 SVG 渐变 data URI，`stage` 和 `piece` **共用同一张图**：缺口 `left = targetX` 随机（60~250px），拼图块用 `background-position: -targetX px -34px` 精确取到缺口处内容，平移到目标位置即严丝合缝。
- 拖拽用「手柄驱动拼图」：`onMove` 读手柄在滑轨中的归一化比例 `ratio ∈ [0,1]`，`setX(ratio * maxDrag())` 换算为拼图位移（`maxDrag = stage.clientWidth - 46`），同一次调用里同步更新 `piece.left`、`handle.left`、`fill.width` 与提示文字透明度。
- 事件全部绑在 `document` 上的 `mousemove / mouseup`（配合 `handle` 的 `mousedown` 起手），拖出容器也不会丢事件；同时支持 touch 事件（`e.touches ? e.touches[0].clientX : e.clientX` 兼容两套坐标）。
- `endDrag` 后 `check()` 判定：`|currentX - targetX| <= TOLERANCE(6px)` 通过并锁定 `solved`；否则给三个元素临时加 `transition: left .3s` 回弹到 0，320ms 后清空 transition 恢复可拖。

### 如何调整

- 顶部常量 `PIECE = 46`（拼图边长）与 `TOLERANCE = 6`（容差）控制难度；`targetX` 的随机区间在 `init()` 的 `60 + Math.floor(Math.random() * 190)`。
- 换背景把 `makeBg()` 返回的 SVG 换成真实图片 URL 即可，注意 `piece` 的 `background-size: 320px 160px` 要与图片尺寸一致。
- 「换一张」按钮即重新执行 `init()`：重置状态、重新随机缺口、拼图归零，接真实接口时在这一步发起请求。

### 注意事项

- 真实验证码需服务端参与（缺口位置下发 + 结果校验），前端 `check()` 只做即时反馈，可被绕过。
- 拖拽期间监听在 `document` 上，`endDrag` 要确保一定被调用（`mouseup/touchend` 都绑了），否则 `dragging` 卡 true。
- `e.preventDefault()` 放在 `passive: false` 的 touch 监听里才生效，否则浏览器会警告并中断。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
