<template>
  <div class="skeleton-demo">
    <div class="bar">
      <span class="title">骨架屏 Skeleton</span>
      <button type="button" @click="reload">{{ loading ? '加载中…' : '重新加载' }}</button>
    </div>

    <!-- 骨架屏 -->
    <div v-if="loading" class="card sk" aria-hidden="true">
      <div class="row">
        <div class="sk-item avatar shimmer"></div>
        <div class="col grow">
          <div class="sk-item line w60 shimmer"></div>
          <div class="sk-item line w40 shimmer"></div>
        </div>
      </div>
      <div class="sk-item line w100 shimmer"></div>
      <div class="sk-item line w90 shimmer"></div>
      <div class="sk-item line w75 shimmer"></div>
    </div>

    <!-- 真实内容 -->
    <div v-else class="card">
      <div class="row">
        <div class="avatar">📄</div>
        <div class="col grow">
          <strong>内容加载完成</strong>
          <span class="sub">骨架屏在数据就位前占位，避免布局跳动</span>
        </div>
      </div>
      <p class="body">
        骨架屏用与真实结构一致的灰块提示加载状态，相比转圈 spinner 能显著降低
        CLS（累积布局偏移），并让用户对即将出现的内容形态有预期。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const loading = ref(true)
let timer: number | undefined

function reload() {
  loading.value = true
  if (timer !== undefined) window.clearTimeout(timer)
  timer = window.setTimeout(() => {
    loading.value = false
    timer = undefined
  }, 1600)
}

onMounted(() => {
  // 初次进入走一次加载（必须在挂载后，SSR 阶段无 window）
  reload()
})

onUnmounted(() => {
  if (timer !== undefined) window.clearTimeout(timer)
})
</script>

<style scoped>
.skeleton-demo {
  width: 100%;
  max-width: 460px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1, #213547);
}

button {
  padding: 6px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.2s;
}

button:hover:not(:disabled) {
  border-color: var(--vp-c-brand, #3451b2);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.card {
  padding: 18px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 12px;
  background: var(--vp-c-bg, #fff);
}

.row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  flex-shrink: 0;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.grow { flex: 1; }

.line {
  height: 12px;
  border-radius: 6px;
}

.w40 { width: 40%; }
.w60 { width: 60%; }
.w75 { width: 75%; }
.w90 { width: 90%; }
.w100 { width: 100%; }

.card.sk .line:first-of-type { margin-top: 16px; }

.card.sk .line + .line { margin-top: 10px; }

.sub {
  font-size: 12px;
  color: var(--vp-c-text-2, #6b7280);
}

strong { font-size: 15px; color: var(--vp-c-text-1, #213547); }

.body {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2, #6b7280);
}

/* 骨架占位基础样式 */
.sk-item {
  background: var(--vp-c-default-soft, #eef0f3);
}

.avatar.sk-item { height: 48px; border-radius: 50%; }

/* 微光扫过动画 */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.65),
    transparent
  );
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer::after { animation: none; }
}
</style>
