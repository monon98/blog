<template>
  <div class="counter-roll">
    <div class="grid">
      <div class="stat" v-for="(item, i) in items" :key="i">
        <div class="num">
          <span class="prefix">{{ item.prefix }}</span>
          <span class="value">{{ item.shown.toFixed(item.decimals) }}</span>
          <span class="suffix">{{ item.suffix }}</span>
        </div>
        <div class="label">{{ item.label }}</div>
        <div class="bar"><i :style="{ width: (item.progress * 100).toFixed(1) + '%' }"></i></div>
      </div>
    </div>

    <div class="ctrl">
      <button type="button" @click="replay">↻ 重新滚动</button>
      <span class="tip">进入视口自动从 0 滚到目标值（easeOutExpo 缓动收尾）</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

interface CounterItem {
  label: string
  target: number
  decimals: number
  prefix: string
  suffix: string
  shown: number
  progress: number
}

const props = withDefaults(
  defineProps<{
    /** 停留多少秒开始滚动 */
    duration?: number
  }>(),
  { duration: 2 }
)

const items = reactive<CounterItem[]>([
  { label: '构建耗时', target: 62, decimals: 0, prefix: '-', suffix: '%', shown: 0, progress: 0 },
  { label: '首屏时间', target: 0.86, decimals: 2, prefix: '', suffix: 's', shown: 0, progress: 0 },
  { label: 'Lighthouse', target: 98, decimals: 0, prefix: '', suffix: '', shown: 0, progress: 0 },
  { label: '累计下载', target: 12.4, decimals: 1, prefix: '', suffix: 'k', shown: 0, progress: 0 }
])

let raf = 0
let observer: IntersectionObserver | undefined

/** easeOutExpo：前快后慢，收尾平滑 */
function easeOutExpo(t: number): number {
  return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function roll() {
  cancelAnimationFrame(raf)
  const total = props.duration * 1000
  const start = performance.now()

  items.forEach((it) => {
    it.shown = 0
    it.progress = 0
  })

  function frame(now: number) {
    const t = Math.min(1, (now - start) / total)
    const e = easeOutExpo(t)

    items.forEach((it) => {
      it.shown = it.target * e
      it.progress = e
    })

    if (t < 1) raf = requestAnimationFrame(frame)
  }

  raf = requestAnimationFrame(frame)
}

function replay() {
  roll()
}

onMounted(() => {
  const el = document.querySelector('.counter-roll')
  if (!el) {
    roll()
    return
  }

  if (typeof IntersectionObserver !== 'undefined') {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            roll()
            observer?.disconnect()
            observer = undefined
          }
        })
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
  } else {
    roll()
  }
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
})
</script>

<style scoped>
.counter-roll {
  width: 100%;
  max-width: 620px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 12px;
}

.stat {
  padding: 16px 14px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #f6f6f7);
}

.num {
  display: flex;
  align-items: baseline;
  gap: 2px;
  font-variant-numeric: tabular-nums;
}

.prefix,
.suffix {
  font-size: 15px;
  color: var(--vp-c-text-2, #6b7280);
}

.value {
  font-size: 30px;
  font-weight: 700;
  line-height: 1.1;
  background: linear-gradient(135deg, #6366f1, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.label {
  margin-top: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2, #6b7280);
}

.bar {
  margin-top: 10px;
  height: 4px;
  border-radius: 999px;
  background: var(--vp-c-default-soft, #eef0f3);
  overflow: hidden;
}

.bar i {
  display: block;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #6366f1, #22d3ee);
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
  transition: border-color 0.2s;
}

button:hover {
  border-color: var(--vp-c-brand, #3451b2);
}

.tip {
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
