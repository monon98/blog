<template>
  <div class="dt">
    <div
      class="stage"
      @mousemove="onMove"
      @mouseleave="onLeave"
    >
      在此区域移动鼠标触发事件
    </div>

    <div class="panels">
      <div class="panel">
        <h3>防抖 Debounce <small>300ms 后才执行</small></h3>
        <div class="stat"><span>原始事件</span><b>{{ raw }}</b></div>
        <div class="stat"><span>实际处理</span><b>{{ debounced }}</b></div>
        <p class="log">{{ lastDebounce || '等待输入停止…' }}</p>
      </div>

      <div class="panel">
        <h3>节流 Throttle <small>每 300ms 最多一次</small></h3>
        <div class="stat"><span>原始事件</span><b>{{ raw }}</b></div>
        <div class="stat"><span>实际处理</span><b>{{ throttled }}</b></div>
        <p class="log">{{ lastThrottle || '按固定频率执行…' }}</p>
      </div>
    </div>

    <div class="ctrl">
      <button type="button" @click="reset">重置</button>
      <span class="tip">原始事件持续触发时：防抖只在停顿后执行一次，节流按固定频率执行</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const raw = ref(0)
const debounced = ref(0)
const throttled = ref(0)
const lastDebounce = ref('')
const lastThrottle = ref('')

const DEBOUNCE_MS = 300
const THROTTLE_MS = 300

let debounceTimer: number | undefined
let lastThrottleTime = 0

function now() {
  return Date.now()
}

function onMove() {
  raw.value += 1

  // ---- 防抖：每次触发都重置计时器，只有停止触发 300ms 后才执行 ----
  if (debounceTimer !== undefined) window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    debounced.value += 1
    lastDebounce.value = `停顿 ${DEBOUNCE_MS}ms 后执行 @ ${format(now())}`
    debounceTimer = undefined
  }, DEBOUNCE_MS)

  // ---- 节流：只有距上次执行超过 300ms 才放行 ----
  const t = now()
  if (t - lastThrottleTime >= THROTTLE_MS) {
    lastThrottleTime = t
    throttled.value += 1
    lastThrottle.value = `每 ${THROTTLE_MS}ms 放行一次 @ ${format(t)}`
  }
}

function onLeave() {
  if (debounceTimer !== undefined) {
    window.clearTimeout(debounceTimer)
    debounceTimer = undefined
  }
}

function reset() {
  raw.value = 0
  debounced.value = 0
  throttled.value = 0
  lastDebounce.value = ''
  lastThrottle.value = ''
  lastThrottleTime = 0
  if (debounceTimer !== undefined) {
    window.clearTimeout(debounceTimer)
    debounceTimer = undefined
  }
}

function format(t: number) {
  const d = new Date(t)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${String(d.getMilliseconds()).padStart(3, '0')}`
}

onUnmounted(() => {
  if (debounceTimer !== undefined) window.clearTimeout(debounceTimer)
})
</script>

<style scoped>
.dt {
  width: 100%;
  max-width: 620px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.stage {
  padding: 34px 20px;
  border: 2px dashed var(--vp-c-divider, #d5d9e0);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  text-align: center;
  font-size: 14px;
  color: var(--vp-c-text-2, #6b7280);
  cursor: crosshair;
  user-select: none;
  transition: border-color 0.2s, background 0.2s;
}

.stage:hover {
  border-color: var(--vp-c-brand, #3451b2);
  background: var(--vp-c-bg-alt, #f1f1f4);
}

.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 14px;
}

@media (max-width: 560px) {
  .panels { grid-template-columns: 1fr; }
}

.panel {
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
  background: var(--vp-c-bg, #fff);
}

.panel h3 {
  margin: 0 0 12px;
  font-size: 14px;
  color: var(--vp-c-text-1, #213547);
}

.panel small {
  display: block;
  font-weight: 400;
  font-size: 11px;
  color: var(--vp-c-text-3, #9aa0a6);
  margin-top: 3px;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  padding: 6px 0;
  color: var(--vp-c-text-2, #6b7280);
}

.stat b {
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-brand, #3451b2);
}

.log {
  margin: 10px 0 0;
  min-height: 34px;
  font-size: 11px;
  line-height: 1.6;
  font-family: ui-monospace, Menlo, monospace;
  color: var(--vp-c-text-3, #9aa0a6);
  word-break: break-all;
}

.ctrl {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

button {
  padding: 7px 18px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
}

button:hover { border-color: var(--vp-c-brand, #3451b2); }

.tip {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
