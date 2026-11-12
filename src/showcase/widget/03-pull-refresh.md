---
layout: doc
navbar: true
sidebar: false
---

# 03. 下拉刷新（原生 HTML）

← [返回实用交互组件列表](../widget)

## 一、展示用例

<HtmlFrame src="html/widget/pull-refresh.html" title="下拉刷新" :height="620" />

## 二、代码实现

单文件自包含（样式与脚本全内联），整文件复制到任意项目即可运行。

::: details 展开完整源码
<<< ../../public/html/widget/pull-refresh.html
:::

## 三、使用讲解

### 实现原理

- 下拉不移动列表本体，而是**撑开指示器**：`.indicator { height: 0 }` 初始隐藏，`setIndicator(y)` 实时写 `height`，配 `transition: height .3s` 让松手回弹平滑；箭头在 `.release` 态 `rotate(180deg)` 表示「可释放」。
- 阻尼函数 `dampen(raw) = min(120, raw * 0.55)`：手指位移打 5.5 折且上限 `MAX_PULL = 120px`，产生「越拉越沉」的手感；仅当 `pullY >= THRESHOLD(70)` 时列表额外 `translateY(pullY * 0.35)` 轻微跟随。
- 触发条件收得很紧：`onDown` 里 `if (list.scrollTop > 0) return`——只有列表**停在顶部**才进入 `pulling` 状态，正常滚动不受影响；`refreshing` 期间全面屏蔽手势。
- 释放 `onUp`：恢复 transition、清列表位移，`pullY >= 70` 走 `refresh()`（指示器定高 70px → `.loading` 转圈 1100ms → `prepend` 两条新消息 → 500ms 后高度收回 0），否则直接 `setIndicator(0)` 复位。

### 如何调整

- 三个手感参数在顶部：`THRESHOLD = 70`（触发线）、`MAX_PULL = 120`（上限）、`dampen` 里的 `0.55`（阻尼系数）。
- 「模拟刷新耗时」是 `refresh()` 里的 `1100` 和收起延时 `500`，接真实接口时把 `setTimeout` 换成 `await fetch(...)`，`addItem(true)` 放在请求成功分支。
- 事件同时绑了鼠标（`mousedown/mousemove/mouseup`）与触摸（`touchstart/touchmove/touchend`），去掉一组即可按平台裁剪。

### 注意事项

- touch 监听均 `{ passive: true }`：本例下拉期不阻止页面滚动，若要完全接管手势需改 `passive: false` 并 `preventDefault`，注意 iOS 兼容。
- `refreshing` 状态机（初始 → 拉动中 → 刷新中）漏判会导致重复触发，新增分支时保持三态互斥。
- 新条目靠 `.item` 的 `slideIn` 动画淡入，`prepend` + 动画组合是「刷新出新内容」的关键视觉反馈。

<script setup>
import HtmlFrame from '@components/html-frame.vue'
</script>
