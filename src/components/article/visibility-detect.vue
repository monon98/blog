<template>
  <div class="visibility-detect">
    <div class="state" :class="{ hidden: !visible }">
      <span class="dot"></span>
      {{ visible ? '页面可见' : '页面已隐藏' }}
    </div>

    <ul class="stats">
      <li>
        <span>隐藏次数</span>
        <b>{{ hideCount }}</b>
      </li>
      <li>
        <span>累计隐藏</span>
        <b>{{ totalHidden }}s</b>
      </li>
      <li>
        <span>本次隐藏</span>
        <b>{{ currentHidden }}s</b>
      </li>
    </ul>

    <p class="tip">切换浏览器标签页、最小化窗口或切到后台即可触发 visibilitychange</p>

    <button type="button" @click="reset">重置统计</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(true)
const hideCount = ref(0)
const totalHidden = ref(0)
const currentHidden = ref(0)

let hiddenAt = 0
let timer: number | undefined

function onVisibilityChange() {
  if (document.hidden) {
    visible.value = false
    hideCount.value += 1
    hiddenAt = Date.now()
    timer = window.setInterval(() => {
      currentHidden.value = Math.floor((Date.now() - hiddenAt) / 1000)
    }, 250)
  } else {
    visible.value = true
    if (hiddenAt) {
      totalHidden.value += Math.floor((Date.now() - hiddenAt) / 1000)
    }
    currentHidden.value = 0
    hiddenAt = 0
    if (timer !== undefined) {
      window.clearInterval(timer)
      timer = undefined
    }
  }
}

function reset() {
  hideCount.value = 0
  totalHidden.value = 0
  currentHidden.value = 0
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (timer !== undefined) {
    window.clearInterval(timer)
  }
})
</script>

<style scoped>
.visibility-detect {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.state {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #16a34a;
}

.state.hidden {
  color: #dc2626;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 0 currentColor;
  animation: pulse 1.6s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
  70% { box-shadow: 0 0 0 8px rgba(0, 0, 0, 0); opacity: 0.6; }
  100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); opacity: 1; }
}

.stats {
  list-style: none;
  margin: 18px 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.stats li {
  padding: 12px 8px;
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.stats span {
  display: block;
  font-size: 12px;
  color: var(--vp-c-text-2, #6b7280);
  margin-bottom: 4px;
}

.stats b {
  font-size: 22px;
  font-variant-numeric: tabular-nums;
}

.tip {
  margin: 0 0 16px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2, #6b7280);
}

button {
  width: 100%;
  padding: 9px 16px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

button:hover {
  border-color: var(--vp-c-brand, #3451b2);
  background: var(--vp-c-bg-alt, #f1f1f4);
}
</style>
