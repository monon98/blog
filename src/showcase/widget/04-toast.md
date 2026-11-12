---
layout: doc
navbar: true
sidebar: false
---

# 04. Toast 消息（Vue 组件）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<Toast />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/widget/toast.vue
:::

## 三、使用讲解

### 实现原理

- 单一数据源 `toasts = ref<ToastItem[]>`，每项 `{ id, msg, type, duration }`；`show()` push 进数组并返回 `id`，同时 `setTimeout(duration)` 自动调 `remove(id)`——渲染完全由数组驱动。
- 上限保护：`if (toasts.length > 4) splice(0, length - 4)`，超出时裁掉最旧的，防止狂点刷屏。
- 倒计时进度条是纯 CSS：`<i>` 宽 100%、`transform-origin: left`，`@keyframes countdown` 把 `scaleX` 从 1 走到 0；`animation-duration` 由行内 `:style="{ animationDuration: t.duration + 'ms' }"` 注入，每条 toast 时长自适应。
- 进出场用 `<transition-group name="toast">`：`translateX(60px)` 滑入滑出，列表重排由 `.toast-move` 平滑衔接；容器 `aria-live="polite"` 让屏幕阅读器播报。
- 对外 API 通过 `defineExpose({ show, remove })` 暴露，父组件用模板 ref 即可命令式调用。

### 如何调整

- 默认时长在 `show()` 的 `duration = 2600`（毫秒）；并发上限改 `> 4` 那个数字；类型集是 `ToastType` 联合类型 + `icons` 映射表，加新类型需同步改 CSS 的 `.toast.<type>` 配色。
- 图标/文案插槽化：把 `icons[t.type]` 换成 slot 即可支持自定义内容。
- 想全局单例，可把 `toasts` 提到模块级或用 `createApp` 外挂 App 渲染。

### 注意事项

- `show()` 里的 `window.setTimeout` 在 SSR 下不可用，若组件在服务端渲染且会自动调用，需 `import.meta.env.SSR` 判断或 `onServerPrefetch` 规避。
- `remove` 用 `filter` 重建数组（而非 `splice`），保证 `transition-group` 的 leave 动画拿到稳定的旧/新列表差异。
- 手动点击 toast 即 `remove(t.id)` 关闭，但对应 `setTimeout` 仍在跑——重复 remove 因 filter 幂等无害，追求严谨可记录 timer 句柄并在 remove 时 `clearTimeout`。

<script setup>
import Toast from '@components/widget/toast.vue'
</script>
