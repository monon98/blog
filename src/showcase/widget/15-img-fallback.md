---
layout: doc
navbar: true
sidebar: false
---

# 15. 图片加载失败兜底指令（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/img-fallback.html" title="图片加载失败兜底指令" :height="640" />

## 二、代码实现

单文件自包含（Vue 3 走 CDN 引入，图片为内联 SVG data URI），整文件复制即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/img-fallback.html
:::

## 三、使用讲解

### 实现原理

- 自定义指令 `v-img-fallback`（值为兜底背景色）：`mounted` 时**克隆 img 的全部 attributes** 创建同形占位 `div`，设 `width/height`（取 `el.width/px`）、背景色、居中样式，文字「图片加载失败」，并 `insertBefore` 插到 img 前面。
- 首次失败兜底：`el.onerror = handleError`，命中即 `img 隐藏 + 占位 div 显示`；`el.src = el.src || ''` 触发一次加载流程。
- `src` 动态变化的重校验是核心：`MutationObserver` 监听 `attributes` 中的 `src` 变更，先乐观恢复 img，再用 `new Image()` **预加载验证**——`onload` 维持显示、`onerror` 走 `handleError` 切回占位，避免闪一下再裂。
- 资源清理：观察者挂 `el._observer`，`beforeUnmount` 里 `disconnect()` 并删除引用，防止组件卸载后观察者泄漏。
- Demo 用「好/坏链接」双 data URI（`broken` 开关切 `:src`）演示行为；两个工具栏按钮 `toggleAll / cycle` 均翻转同一 `broken`。

### 如何调整

- 注册方式在底部：`app.directive('img-fallback', imgFallback)`；拷到 SFC 项目后可抽成文件并 `export default`，或在 `main.ts` 里 `app.directive` 全局注册（原指令源码见 `src/html/imgFallback.js.js`）。
- 占位块样式（圆角 6px、字号 12px、白色文字、「图片加载失败」文案）都是 `mounted` 里的行内 style，可换成传对象：`v-img-fallback="{ color, text }"` 后读 `binding.value.color`。
- 观察其它属性变化：`MutationObserver` 的回调已判 `attributeName === 'src'`，放开即可监听全部属性。

### 注意事项

- 占位 div 是 `el.attributes` 逐个复制（含 class/style），因此 img 的 class 被复制两份——依赖 class 选择器的样式要留意。
- `el.width/px` 依赖 HTML `width` 属性（模板里写的是 `:width="150"`），若只用 CSS 控制尺寸需改读 `getBoundingClientRect()`。
- `MutationObserver` 只看属性变更，整棵 img 被 `v-if` 重建时走的是新节点的 `mounted`，生命周期天然覆盖；`onerror` 与预加载验证双通道，静态/动态 src 场景都兜得住。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
