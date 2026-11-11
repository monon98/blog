---
layout: doc
navbar: true
sidebar: false
---

# 15. 悬浮按钮（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<HoverButton text="hover me" />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/hover-button.vue
:::

## 三、使用讲解

### 实现原理

- props 用解构方式声明：`const { text, icon, iconType, width, height, iconColor, color, ...props } = defineProps({...})`，
  模板里图标是 `<svg v-html="icon" :width="width" :height="height" :color="iconColor">`，文字是 <span v-pre>`<span class="text-button">{{ text }}</span>`</span>。
- 收起态 `.button` 限制 `max-width: 30px`，同时 `.text-button` 是 `max-width: 0; height: 0; overflow: hidden;
  transform: rotateX(90deg)`，文字被压成一条缝并翻转 90° 藏起来，只露出图标。
- hover 时 `.button:hover` 把 `max-width` 放开到 `100%`、背景变 `forestgreen`、文字变 `red`；
  `.button:hover .text-button` 变为 `max-width: 100%; height: 16px; transform: rotateX(0deg)`，文字翻回来。
- 两处都写了 `transition: max-width 0.5s ease`，配合 rotateX 形成"卷帘展开"的 0.5 秒动画。
- 常态视觉是硬编码的：`border: 1px solid #ff00ff`（洋红描边）、`background-color: #00ffff`（青色底）、
  `border-radius: 8px`、`gap: 4px`，文字颜色则通过 `v-bind(color)` 取 props。
- 模板结构就两段：`<svg v-html="icon" ...></svg>` + <span v-pre>`<span class="text-button">{{ text }}</span>`</span>，
  `text` 默认空串、`width / height` 默认 16、`iconColor / color` 默认 `#ffffff`，所以不传任何 props 也能渲染出按钮壳。
- 隐藏文字用的是"双重压缩"：父级 `max-width: 30px` 截断 + 子级 `max-width: 0; height: 0; overflow: hidden`，
  两层同时放开才不会留下残影。

### 如何调整

- `text` 决定展开后显示的文案；`icon`（SVG 字符串，走 `v-html`）配 `width` / `height`（默认均 16）与
  `iconColor`（默认 `#ffffff`）控制左侧图标。
- 想改变展开宽度，调 `.button` 的 `max-width: 30px`（初始）与 `:hover` 的 `max-width: 100%`；
  想改速度，调两处 `transition` 的 `0.5s`。
- `color` props 是唯一真正生效的颜色入口（`v-bind(color)`），可用于换文字色。

### 注意事项

- `backgroundColor`、`hoverColor`、`hoverBackgroundColor`、`iconType` 虽然声明了，但样式里完全没用到，
  hover 的绿底红字是写死的，要换肤得改 CSS 或补上对应的 `v-bind`。
- hover 态的 `border: none; border: 1px solid;` 第二条会用 `currentColor` 补回描边，实际渲染成红/绿细边。
- `@media (prefers-reduced-motion: reduce)` 里把 `transition-duration` 设成了 `1s`（比常态更长），
  若目标是无障碍减动效，应改成 `0.01s` 或 `none`。
- `v-html` 注入的 `icon` 必须是可信内容，别直接拼接用户输入。
- `icon` 不传时 svg 仍是空节点，按钮收起态只剩图标占位与内边距；需要纯文字按钮可删掉 svg 并放宽初始 `max-width: 30px`。

<script setup>
import HoverButton from '@components/visual/hover-button.vue'
</script>
