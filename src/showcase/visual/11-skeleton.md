---
layout: doc
navbar: true
sidebar: false
---

# 11. 骨架屏（Vue 组件）

← [返回纯视觉特效列表](../visual)

## 一、展示用例

<Skeleton />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/visual/skeleton.vue
:::

## 三、使用讲解

### 实现原理

- 组件无 props，内部 `loading = ref(true)`；`reload()` 先置 `loading = true`，
  再 `window.setTimeout(..., 1600)` 置回 `false`；`onMounted` 里调用 `reload()` 走首次加载
  （源码注释注明 SSR 阶段无 `window`，必须挂载后才执行）。
- 模板用 `v-if="loading"` 切换两棵结构完全一致的子树：骨架 `.card.sk`（带 `aria-hidden="true"`）
  与真实内容 `.card`（头像 + 两行标题 + 三段正文），结构对齐是压低 CLS 的关键。
  按钮文案同样随状态切换：加载中显示「加载中…」，完成显示「重新加载」。
- 占位块用宽度工具类 `w40 / w60 / w75 / w90 / w100`（`width: 40% ~ 100%`），
  行高 `height: 12px; border-radius: 6px`，头像 `.avatar.sk-item` 固定 `48px` 圆形，
  底色 `var(--vp-c-default-soft, #eef0f3)`。
  真实内容里的头像 `.avatar` 同样是 `48px` 圆形，保证切换时头像不跳位。
- 微光扫过：`.shimmer::after` 是一条 `transparent → rgba(255, 255, 255, 0.65) → transparent` 渐变，
  起步 `translateX(-100%)`，`animation: shimmer 1.4s infinite` 扫到 `translateX(100%)`。
- `@media (prefers-reduced-motion: reduce)` 中 `.shimmer::after { animation: none }`，
  系统开启「减少动态」时静止显示占位块，不循环播放扫光。

### 如何调整

- 加载时长改 `reload()` 里的 `1600`（毫秒）；占位行宽改 `.w60`、`.w90` 等类的百分比。
- 扫光速度改 `shimmer 1.4s`，亮度改渐变中间色 `rgba(255, 255, 255, 0.65)`。
- 卡片尺寸在 `.skeleton-demo` 的 `max-width: 460px`，
  行间距由 `.col { gap: 7px }` 与 `.card.sk .line + .line { margin-top: 10px }` 控制。

### 注意事项

- 骨架与真实 DOM 的结构、尺寸必须一致，否则 `loading` 翻转瞬间仍会出现布局跳动，
  骨架屏就失去意义。
- `timer` 在 `reload()` 里先 `clearTimeout` 再开新的，连点「重新加载」不会叠加定时器；
  `onUnmounted` 同样清理，避免路由切走后定时器泄漏。
- 这是纯演示版，内部用定时器模拟加载；真实项目应由请求状态驱动 `loading`，
  并按实际接口耗时决定占位时长。

<script setup>
import Skeleton from '@components/visual/skeleton.vue'
</script>
