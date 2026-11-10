<template>
  <div class="stage" @mousemove="onMove" @mouseleave="onLeave">
    <button
      ref="btnRef"
      type="button"
      class="magnetic"
      :class="{ settling: !active }"
      :style="{ transform: `translate3d(${tx}px, ${ty}px, 0)` }"
      @click="onClick"
    >
      <span>{{ label }}</span>
    </button>

    <p class="hint">{{ clicked ? '🎉 捕获成功' : '把鼠标移近按钮，它会被"吸"过来' }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

withDefaults(
  defineProps<{
    label?: string
    /** 吸附强度 0~1，越大跟手越紧 */
    strength?: number
  }>(),
  {
    label: 'Magnetic',
    strength: 0.4
  }
)

const btnRef = ref<HTMLButtonElement | null>(null)
const tx = ref(0)
const ty = ref(0)
const active = ref(false)
const clicked = ref(false)

let resetTimer: number | undefined

function onMove(e: MouseEvent) {
  const el = btnRef.value
  if (!el) return
  // 用父容器作为感应区，按钮周围留白也能触发
  const stage = el.parentElement
  if (!stage) return

  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2

  const dx = e.clientX - cx
  const dy = e.clientY - cy
  const dist = Math.hypot(dx, dy)
  const radius = Math.max(rect.width, rect.height) * 1.1

  if (dist < radius) {
    active.value = true
    if (resetTimer !== undefined) {
      window.clearTimeout(resetTimer)
      resetTimer = undefined
    }
    tx.value = dx * 0.4
    ty.value = dy * 0.4
  } else {
    reset()
  }
}

function reset() {
  active.value = false
  tx.value = 0
  ty.value = 0
}

function onLeave() {
  reset()
}

function onClick() {
  clicked.value = true
  if (resetTimer !== undefined) window.clearTimeout(resetTimer)
  resetTimer = window.setTimeout(() => {
    clicked.value = false
  }, 1400)
}

onUnmounted(() => {
  if (resetTimer !== undefined) window.clearTimeout(resetTimer)
})
</script>

<style scoped>
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
  min-height: 260px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.1), transparent 60%),
    var(--vp-c-bg-soft, #f6f6f7);
  cursor: default;
}

.magnetic {
  padding: 17px 46px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #0ea5e9, #6366f1);
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(99, 102, 241, 0.4);
  will-change: transform;
}

/* 跟手时无过渡，回弹时加弹性过渡 */
.magnetic {
  transition: transform 0.12s ease-out;
}

.magnetic.settling {
  transition: transform 0.55s cubic-bezier(0.22, 1.6, 0.36, 1);
}

.magnetic:active {
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.45);
}

.hint {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
