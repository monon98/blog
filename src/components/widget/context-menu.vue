<template>
  <div
    ref="areaRef"
    class="menu-area"
    @contextmenu.prevent="onOpen"
  >
    <p class="hint">在此区域<span>右键</span>唤出自定义菜单</p>

    <p class="last" v-if="lastAction">上次操作：{{ lastAction }}</p>
    <p class="last muted" v-else>尚未选择任何菜单项</p>

    <!-- 自定义右键菜单 -->
    <teleport to="body">
      <transition name="menu">
        <div
          v-if="visible"
          ref="menuRef"
          class="ctx-menu"
          :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
          @click.stop
        >
          <button
            v-for="(item, i) in items"
            :key="i"
            type="button"
            class="ctx-item"
            :class="{ danger: item.danger, divided: item.divided }"
            @click="onPick(item)"
          >
            <span class="ico">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <span class="shortcut" v-if="item.shortcut">{{ item.shortcut }}</span>
          </button>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'

interface MenuItem {
  label: string
  icon: string
  shortcut?: string
  divided?: boolean
  danger?: boolean
}

const items: MenuItem[] = [
  { label: '新建文件', icon: '📄', shortcut: 'Ctrl+N' },
  { label: '打开目录', icon: '📁', shortcut: 'Ctrl+O' },
  { label: '复制', icon: '⎘', shortcut: 'Ctrl+C' },
  { label: '粘贴', icon: '📋', shortcut: 'Ctrl+V', divided: true },
  { label: '重命名', icon: '✎' },
  { label: '删除', icon: '🗑', shortcut: 'Del', danger: true, divided: true }
]

const areaRef = ref<HTMLElement | null>(null)
const menuRef = ref<HTMLElement | null>(null)

const visible = ref(false)
const pos = reactive({ x: 0, y: 0 })
const lastAction = ref('')

function onOpen(e: MouseEvent) {
  pos.x = e.clientX
  pos.y = e.clientY
  visible.value = true

  nextTick(() => {
    const el = menuRef.value
    if (!el) return
    // 防止菜单超出视口
    const rect = el.getBoundingClientRect()
    if (rect.right > window.innerWidth) pos.x = window.innerWidth - rect.width - 8
    if (rect.bottom > window.innerHeight) pos.y = window.innerHeight - rect.height - 8
  })
}

function onPick(item: MenuItem) {
  lastAction.value = `${item.icon} ${item.label}`
  close()
}

function close() {
  visible.value = false
}

function onDocClick() {
  close()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
  window.addEventListener('blur', close)
  window.addEventListener('resize', close)
  window.addEventListener('scroll', close, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('blur', close)
  window.removeEventListener('resize', close)
  window.removeEventListener('scroll', close, true)
})
</script>

<style scoped>
.menu-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 220px;
  border: 2px dashed var(--vp-c-divider, #d5d9e0);
  border-radius: 12px;
  background:
    repeating-linear-gradient(
      45deg,
      var(--vp-c-bg-soft, #f6f6f7),
      var(--vp-c-bg-soft, #f6f6f7) 12px,
      var(--vp-c-bg, #fff) 12px,
      var(--vp-c-bg, #fff) 24px
    );
  cursor: context-menu;
  user-select: none;
  text-align: center;
}

.hint {
  margin: 0;
  font-size: 14px;
  color: var(--vp-c-text-2, #6b7280);
}

.hint span {
  color: var(--vp-c-brand, #3451b2);
  font-weight: 600;
}

.last {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-1, #213547);
}

.last.muted { color: var(--vp-c-text-3, #9aa0a6); }
</style>

<style>
/* 菜单 teleport 到 body，需用全局样式（非 scoped） */
.ctx-menu {
  position: fixed;
  z-index: 9999;
  min-width: 190px;
  padding: 6px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.ctx-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #1f2937;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.ctx-item:hover { background: #f1f5f9; }

.ctx-item.danger { color: #dc2626; }
.ctx-item.danger:hover { background: #fef2f2; }

.ctx-item.divided {
  border-top: 1px solid #f1f5f9;
  margin-top: 4px;
  padding-top: 10px;
}

.ctx-item .ico { width: 16px; text-align: center; }
.ctx-item .shortcut {
  margin-left: auto;
  font-size: 11px;
  color: #9ca3af;
}

/* 进出场 */
.menu-enter-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.menu-leave-active { transition: opacity 0.12s ease, transform 0.12s ease; }
.menu-enter-from { opacity: 0; transform: scale(0.94); }
.menu-leave-to { opacity: 0; transform: scale(0.96); }
</style>
