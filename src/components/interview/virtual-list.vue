<template>
  <div class="vl">
    <div class="stats">
      <span>列表总数 <b>{{ total.toLocaleString() }}</b></span>
      <span>已渲染 <b>{{ rendered }}</b> 个</span>
      <span>DOM 节省 <b>{{ saved }}</b></span>
    </div>

    <div ref="containerRef" class="list" @scroll="onScroll">
      <!-- 上占位：撑出总高度 -->
      <div :style="{ height: paddingTop + 'px' }"></div>

      <div
        v-for="item in visibleItems"
        :key="item.id"
        class="row"
        :class="{ alt: item.id % 2 === 0 }"
      >
        <span class="id">#{{ item.id }}</span>
        <span class="text">{{ item.text }}</span>
      </div>

      <!-- 下占位 -->
      <div :style="{ height: paddingBottom + 'px' }"></div>
    </div>

    <p class="tip">
      只渲染视口内 ±buffer 条，滚动时动态计算偏移——万级数据也只挂载几十个节点。
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    total?: number
    itemHeight?: number
    /** 视口上下额外渲染的缓冲行数 */
    buffer?: number
  }>(),
  {
    total: 10000,
    itemHeight: 38,
    buffer: 5
  }
)

interface Item {
  id: number
  text: string
}

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(420)

// 一次性生成全部数据（真实项目中通常来自接口）
const items: Item[] = Array.from({ length: props.total }, (_, i) => ({
  id: i + 1,
  text: `虚拟列表条目 ${i + 1} —— 这条数据不会常驻 DOM`
}))

const start = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
)

const end = computed(() =>
  Math.min(
    props.total,
    Math.ceil((scrollTop.value + viewportHeight.value) / props.itemHeight) + props.buffer
  )
)

const visibleItems = computed(() => items.slice(start.value, end.value))

const rendered = computed(() => visibleItems.value.length)
const saved = computed(
  () => `${(100 - (rendered.value / props.total) * 100).toFixed(2)}%`
)

const paddingTop = computed(() => start.value * props.itemHeight)
const paddingBottom = computed(
  () => (props.total - end.value) * props.itemHeight
)

function onScroll() {
  const el = containerRef.value
  if (el) scrollTop.value = el.scrollTop
}

let observer: ResizeObserver | undefined

onMounted(() => {
  const el = containerRef.value
  if (!el) return
  viewportHeight.value = el.clientHeight

  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => {
      viewportHeight.value = el.clientHeight
    })
    observer.observe(el)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.vl {
  width: 100%;
  max-width: 520px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 10px;
  font-size: 13px;
  color: var(--vp-c-text-2, #6b7280);
}

.stats b {
  color: var(--vp-c-brand, #3451b2);
  font-variant-numeric: tabular-nums;
}

.list {
  height: 420px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
  background: var(--vp-c-bg, #fff);
  contain: strict;
}

.row {
  display: flex;
  align-items: center;
  gap: 14px;
  height: 38px;
  padding: 0 16px;
  font-size: 13px;
  border-bottom: 1px solid var(--vp-c-divider, #f0f1f3);
}

.row.alt { background: var(--vp-c-bg-soft, #f6f6f7); }

.id {
  font-family: ui-monospace, Menlo, monospace;
  color: var(--vp-c-text-3, #9aa0a6);
  min-width: 62px;
}

.text {
  color: var(--vp-c-text-1, #213547);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tip {
  margin: 10px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
