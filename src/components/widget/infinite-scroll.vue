<template>
  <div class="infinite">
    <div class="stats">
      已加载 <b>{{ list.length }}</b> / {{ total }} 条
    </div>

    <div ref="listRef" class="scroll" @scroll="onScroll">
      <div v-for="item in list" :key="item.id" class="row">
        <span class="avatar">{{ item.id % 6 }}</span>
        <div class="meta">
          <b>条目 {{ item.id }}</b>
          <span>{{ item.text }}</span>
        </div>
      </div>

      <!-- 加载状态 -->
      <div class="status">
        <template v-if="loading">
          <span class="spinner"></span> 正在加载…
        </template>
        <template v-else-if="finished">— 已经到底啦 —</template>
        <template v-else>↓ 滚动到底部自动加载</template>
      </div>
    </div>

    <button type="button" class="reset" @click="reset">重置</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    /** 数据总条数 */
    total?: number
    /** 每次加载条数 */
    pageSize?: number
  }>(),
  {
    total: 120,
    pageSize: 15
  }
)

interface Row {
  id: number
  text: string
}

const list = ref<Row[]>([])
const loading = ref(false)
const listRef = ref<HTMLElement | null>(null)

const finished = computed(() => list.value.length >= props.total)

function makeRows(from: number, count: number): Row[] {
  return Array.from({ length: count }, (_, i) => {
    const id = from + i
    return { id, text: `第 ${id} 条数据，滚动到底部会继续追加` }
  })
}

function loadMore() {
  if (loading.value || finished.value) return

  loading.value = true
  // 模拟网络延迟
  window.setTimeout(() => {
    list.value = [...list.value, ...makeRows(list.value.length + 1, props.pageSize)]
    loading.value = false
  }, 600)
}

function onScroll() {
  const el = listRef.value
  if (!el || loading.value || finished.value) return

  // 距底部 60px 内触发
  const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 60
  if (nearBottom) loadMore()
}

function reset() {
  list.value = []
  loading.value = false
  if (listRef.value) listRef.value.scrollTop = 0
  loadMore()
}

onMounted(() => {
  list.value = makeRows(1, props.pageSize)
})
</script>

<style scoped>
.infinite {
  width: 100%;
  max-width: 440px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.stats {
  font-size: 13px;
  color: var(--vp-c-text-2, #6b7280);
  margin-bottom: 8px;
}

.stats b {
  color: var(--vp-c-brand, #3451b2);
  font-variant-numeric: tabular-nums;
}

.scroll {
  height: 340px;
  overflow-y: auto;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
  background: var(--vp-c-bg, #fff);
  padding: 8px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.row:hover { background: var(--vp-c-bg-soft, #f6f6f7); }

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.meta { min-width: 0; }

.meta b {
  display: block;
  font-size: 13px;
  color: var(--vp-c-text-1, #213547);
}

.meta span {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-2, #6b7280);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 0 6px;
  font-size: 12px;
  color: var(--vp-c-text-3, #9aa0a6);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--vp-c-divider, #e2e2e2);
  border-top-color: var(--vp-c-brand, #3451b2);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.reset {
  margin-top: 10px;
  padding: 7px 18px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  cursor: pointer;
}

.reset:hover { border-color: var(--vp-c-brand, #3451b2); }
</style>
