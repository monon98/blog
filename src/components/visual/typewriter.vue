<template>
  <div class="typewriter">
    <p class="text">
      <span>{{ display }}</span>
      <i class="caret" :class="{ blink: !done }"></i>
    </p>

    <div class="ctrl">
      <button type="button" @click="toggle">{{ running ? '暂停' : '重播' }}</button>
      <span class="meta">速度 {{ speed }} 字/秒</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text?: string
    /** 每秒打出的字符数 */
    speed?: number
  }>(),
  {
    text: '把一段文字逐字打出来——这就是打字机效果，常用于首页标语与加载文案。',
    speed: 12
  }
)

const index = ref(0)
const running = ref(true)

let timer: number | undefined

const display = computed(() => props.text.slice(0, index.value))
const done = computed(() => index.value >= props.text.length)

function clear() {
  if (timer !== undefined) {
    window.clearInterval(timer)
    timer = undefined
  }
}

function play() {
  clear()
  running.value = true
  timer = window.setInterval(() => {
    if (index.value >= props.text.length) {
      clear()
      running.value = false
      return
    }
    index.value += 1
  }, 1000 / props.speed)
}

function toggle() {
  if (running.value) {
    clear()
    running.value = false
  } else {
    if (done.value) index.value = 0
    play()
  }
}

watch(
  () => props.text,
  () => {
    index.value = 0
    play()
  }
)

onMounted(play)
onUnmounted(clear)
</script>

<style scoped>
.typewriter {
  width: 100%;
  max-width: 560px;
  padding: 22px 24px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 12px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.text {
  margin: 0;
  min-height: 72px;
  font-size: 17px;
  line-height: 1.8;
  color: var(--vp-c-text-1, #213547);
}

.caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: var(--vp-c-brand, #3451b2);
}

.caret.blink {
  animation: blink 0.9s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
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
  transition: border-color 0.2s, background 0.2s;
}

button:hover {
  border-color: var(--vp-c-brand, #3451b2);
  background: var(--vp-c-bg-alt, #f1f1f4);
}

.meta {
  font-size: 12px;
  color: var(--vp-c-text-2, #6b7280);
}
</style>
