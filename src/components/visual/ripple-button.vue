<template>
  <button
    ref="btnRef"
    type="button"
    class="ripple-button"
    @click="onClick"
  >
    <span class="label">{{ label }}</span>
    <span
      v-for="r in ripples"
      :key="r.id"
      class="ripple"
      :style="{ left: r.x + 'px', top: r.y + 'px', width: r.size + 'px', height: r.size + 'px' }"
    ></span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: '点击产生涟漪'
  }
)

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

const btnRef = ref<HTMLButtonElement | null>(null)
const ripples = ref<Ripple[]>([])
let uid = 0

function onClick(e: MouseEvent) {
  const el = btnRef.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  // 覆盖按钮对角线，保证从点击点扩到边缘
  const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2

  const id = ++uid
  ripples.value.push({ id, x, y, size })

  window.setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, 650)
}
</script>

<style scoped>
.ripple-button {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  padding: 13px 34px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-size: 15px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.35);
  transition: transform 0.15s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.ripple-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(99, 102, 241, 0.45);
}

.ripple-button:active {
  transform: translateY(0) scale(0.98);
}

.label {
  position: relative;
  z-index: 1;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.55);
  transform: translate(-50%, -50%) scale(0);
  pointer-events: none;
  animation: ripple 0.6s ease-out forwards;
}

@keyframes ripple {
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}
</style>
