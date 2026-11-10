<template>
  <div class="toast-wrap">
    <div class="demo">
      <button type="button" class="btn success" @click="show('保存成功', 'success')">成功</button>
      <button type="button" class="btn error" @click="show('操作失败，请重试', 'error')">失败</button>
      <button type="button" class="btn warning" @click="show('磁盘空间不足', 'warning')">警告</button>
      <button type="button" class="btn info" @click="show('已复制到剪贴板', 'info')">信息</button>
    </div>

    <div class="stack" aria-live="polite">
      <transition-group name="toast">
        <div
          v-for="t in toasts"
          :key="t.id"
          class="toast"
          :class="t.type"
          @click="remove(t.id)"
        >
          <span class="icon">{{ icons[t.type] }}</span>
          <span class="msg">{{ t.msg }}</span>
          <span class="bar"><i :style="{ animationDuration: t.duration + 'ms' }"></i></span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastItem {
  id: number
  msg: string
  type: ToastType
  duration: number
}

const toasts = ref<ToastItem[]>([])

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i'
}

let uid = 0

function show(msg: string, type: ToastType = 'info', duration = 2600) {
  const id = ++uid
  toasts.value.push({ id, msg, type, duration })

  // 最多同时显示 4 条
  if (toasts.value.length > 4) {
    toasts.value.splice(0, toasts.value.length - 4)
  }

  window.setTimeout(() => remove(id), duration)
  return id
}

function remove(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

defineExpose({ show, remove })
</script>

<style scoped>
.toast-wrap {
  width: 100%;
  max-width: 460px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.demo {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.btn {
  padding: 9px 20px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover { transform: translateY(-1px); }

.btn.success { border-color: #16a34a; color: #16a34a; }
.btn.error { border-color: #dc2626; color: #dc2626; }
.btn.warning { border-color: #d97706; color: #d97706; }
.btn.info { border-color: #2563eb; color: #2563eb; }

.btn.success:hover { background: rgba(22, 163, 74, 0.1); }
.btn.error:hover { background: rgba(220, 38, 38, 0.1); }
.btn.warning:hover { background: rgba(217, 119, 6, 0.1); }
.btn.info:hover { background: rgba(37, 99, 235, 0.1); }

/* 右上角堆叠 */
.stack {
  position: relative;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--vp-c-bg, #fff);
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-left-width: 4px;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
  font-size: 14px;
  cursor: pointer;
  overflow: hidden;
}

.toast.success { border-left-color: #16a34a; }
.toast.error { border-left-color: #dc2626; }
.toast.warning { border-left-color: #d97706; }
.toast.info { border-left-color: #2563eb; }

.icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.toast.success .icon { background: #16a34a; }
.toast.error .icon { background: #dc2626; }
.toast.warning .icon { background: #d97706; }
.toast.info .icon { background: #2563eb; }

.msg { flex: 1; color: var(--vp-c-text-1, #213547); }

/* 底部倒计时进度条 */
.bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: transparent;
}

.bar i {
  display: block;
  height: 100%;
  width: 100%;
  transform-origin: left;
  background: currentColor;
  opacity: 0.45;
  animation-name: countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.toast.success .bar i { background: #16a34a; }
.toast.error .bar i { background: #dc2626; }
.toast.warning .bar i { background: #d97706; }
.toast.info .bar i { background: #2563eb; }

@keyframes countdown {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

/* 进出场动画 */
.toast-enter-active { transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1); }
.toast-leave-active { transition: all 0.3s ease; }

.toast-enter-from { opacity: 0; transform: translateX(60px); }
.toast-leave-to { opacity: 0; transform: translateX(60px); }

.toast-move { transition: transform 0.3s ease; }
</style>
