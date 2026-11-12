---
layout: doc
navbar: true
sidebar: false
---

# 08. 浏览器信息展示（Vue 组件）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<Info />

## 二、代码实现

`<script setup>` 单文件组件，仅依赖 `vue`，可直接复制到任意 Vue 3 项目。

::: details 展开完整源码
<<< ../../components/widget/info.vue
:::

## 三、使用讲解

### 实现原理

- 核心是两个工具：`isBrowser = computed(() => typeof window !== 'undefined')` 判定运行环境；`getBrowserInfo(getter, fallback)` 泛型函数——浏览器环境执行 getter 取值，否则返回 fallback，一行解决 SSR 安全访问。
- 九项信息全部用 `computed` 而非 `ref`：`userAgent / platform / mobile / onLine / effectiveType / rtt / downlink / jsHeapSizeLimit / totalJSHeapSize`，惰性求值、无订阅开销，值只依赖读取时的环境（如 `onLine` 随网络变化在下次渲染时自动刷新）。
- 非标准 API 全部带可选链降级：`navigator.userAgentData?.platform`（UAData 仅 Chromium）、`navigator.connection?.effectiveType`（Network Information 仅 Chromium）、`performance?.memory`（内存信息仅 Chrome 且需开关），取不到时落到 `'Server' / false / '4g' / 0` 等可显示的默认值。
- Vue 版本直接 `import { version } from 'vue'` 展示，无需硬编码。

### 如何调整

- 增删信息项只需加一行 computed + 模板一行 `<p>`；`fallback` 决定 SSR 和不支持场景的展示值。
- 想做成实时刷新（如 `navigator.onLine` 变化即更新），给对应项加事件监听并触发依赖收集——computed 只在渲染期读取时才重算。
- 样式模板留空，接入项目时按需补 scoped 样式即可。

### 注意事项

- `userAgentData` / `connection` / `memory` 都是非标准 API，Safari/Firefox 下必然是 fallback 值，展示「0」或「4g」不代表真实数据。
- `performance?.memory` 里的 `?.` 是给整体 `performance` 的保险，`jsHeapSizeLimit` 等子属性 Chromium 才有。
- `isBrowser` 在 hydration 时为 true（客户端渲染），若需严格同构一致可改为编译期常量 `import.meta.env.SSR` 判断。

<script setup>
import Info from '@components/widget/info.vue'
</script>
