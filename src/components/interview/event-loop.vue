<template>
  <div class="el">
    <div class="actions">
      <button type="button" @click="pushSync">console.log(同步)</button>
      <button type="button" @click="pushMacro">setTimeout(宏任务)</button>
      <button type="button" @click="pushMicro">Promise.then(微任务)</button>
      <button type="button" class="run" :disabled="idle" @click="runTick">▶ 执行一轮事件循环</button>
    </div>

    <div class="queues">
      <div class="q">
        <h4>宏任务队列 <span>{{ macro.length }}</span></h4>
        <ul>
          <li v-for="(m, i) in macro" :key="'m' + i">{{ m }}</li>
          <li v-if="!macro.length" class="empty">空</li>
        </ul>
      </div>

      <div class="q micro">
        <h4>微任务队列 <span>{{ micro.length }}</span></h4>
        <ul>
          <li v-for="(m, i) in micro" :key="'y' + i">{{ m }}</li>
          <li v-if="!micro.length" class="empty">空</li>
        </ul>
      </div>
    </div>

    <div class="console">
      <div class="console-head">执行输出</div>
      <div class="console-body">
        <p v-for="(l, i) in logs" :key="i" :class="l.type">
          <span class="tag">{{ l.tag }}</span>{{ l.text }}
        </p>
        <p v-if="!logs.length" class="placeholder">点击上方按钮入队，再点击「执行一轮事件循环」观察顺序</p>
      </div>
    </div>

    <button type="button" class="clear" @click="clearAll">清空</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LogItem {
  type: 'sync' | 'macro' | 'micro' | 'info'
  tag: string
  text: string
}

const macro = ref<string[]>([])
const micro = ref<string[]>([])
const logs = ref<LogItem[]>([])

let macroId = 0
let microId = 0
let syncId = 0

const idle = computed(() => macro.value.length === 0 && micro.value.length === 0)

// 同步任务：立即执行，进入调用栈
function pushSync() {
  syncId += 1
  logs.value.push({ type: 'sync', tag: '同步', text: `console.log(${syncId})  ← 立即执行` })
}

// 宏任务：进入宏任务队列
function pushMacro() {
  macroId += 1
  macro.value.push(`setTimeout 回调 #${macroId}`)
  logs.value.push({ type: 'info', tag: '入队', text: `setTimeout 回调 #${macroId} → 宏任务队列` })
}

// 微任务：进入微任务队列
function pushMicro() {
  microId += 1
  micro.value.push(`Promise.then #${microId}`)
  logs.value.push({ type: 'info', tag: '入队', text: `Promise.then #${microId} → 微任务队列` })
}

function drainMicro() {
  while (micro.value.length) {
    const task = micro.value.shift() as string
    logs.value.push({ type: 'micro', tag: '微任务', text: `${task} 执行` })
  }
}

// 一轮事件循环：微任务全部清空 > 才取一个宏任务 > 再清空微任务
function runTick() {
  if (micro.value.length) {
    logs.value.push({ type: 'info', tag: '循环', text: '微任务队列非空 → 全部清空' })
    drainMicro()
    return
  }

  if (macro.value.length) {
    const task = macro.value.shift() as string
    logs.value.push({ type: 'macro', tag: '宏任务', text: `${task} 执行` })
    logs.value.push({ type: 'info', tag: '循环', text: '宏任务执行完 → 清空微任务队列' })
    drainMicro()
    return
  }

  logs.value.push({ type: 'info', tag: '循环', text: '两个队列均为空' })
}

function clearAll() {
  macro.value = []
  micro.value = []
  logs.value = []
  macroId = 0
  microId = 0
  syncId = 0
}
</script>

<style scoped>
.el {
  width: 100%;
  max-width: 640px;
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.actions button {
  padding: 8px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s;
}

.actions button:hover:not(:disabled) {
  border-color: var(--vp-c-brand, #3451b2);
}

.actions button.run {
  background: var(--vp-c-brand, #3451b2);
  border-color: var(--vp-c-brand, #3451b2);
  color: #fff;
}

.actions button.run:hover:not(:disabled) { filter: brightness(1.12); }

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.queues {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 14px;
}

.q {
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 10px;
  background: var(--vp-c-bg, #fff);
}

.q.micro { border-color: rgba(52, 81, 178, 0.4); background: rgba(52, 81, 178, 0.05); }

.q h4 {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--vp-c-text-2, #6b7280);
  display: flex;
  justify-content: space-between;
}

.q h4 span {
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-brand, #3451b2);
}

.q ul {
  list-style: none;
  margin: 0;
  padding: 0;
  min-height: 66px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.q li {
  font-size: 12px;
  padding: 6px 9px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft, #f6f6f7);
  font-family: ui-monospace, Menlo, monospace;
}

.q.micro li { background: rgba(52, 81, 178, 0.12); }

.q li.empty {
  background: transparent;
  color: var(--vp-c-text-3, #9aa0a6);
  text-align: center;
  border: 1px dashed var(--vp-c-divider, #e2e2e2);
}

.console {
  margin-top: 14px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #1f2937;
}

.console-head {
  padding: 8px 14px;
  background: #111827;
  color: #9ca3af;
  font-size: 11px;
  letter-spacing: 1px;
}

.console-body {
  background: #0b1120;
  padding: 12px 14px;
  min-height: 130px;
  max-height: 190px;
  overflow-y: auto;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
  line-height: 1.9;
}

.console-body p { margin: 0; color: #d1d5db; }

.console-body p.sync  { color: #93c5fd; }
.console-body p.macro { color: #fca5a5; }
.console-body p.micro { color: #86efac; }
.console-body p.info  { color: #9ca3af; }

.tag {
  display: inline-block;
  min-width: 46px;
  margin-right: 8px;
  padding: 0 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 10px;
  text-align: center;
}

.placeholder { color: #4b5563 !important; }

.clear {
  margin-top: 12px;
  padding: 7px 18px;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: var(--vp-c-bg, #fff);
  color: var(--vp-c-text-1, #213547);
  font-size: 13px;
  cursor: pointer;
}

.clear:hover { border-color: var(--vp-c-brand, #3451b2); }
</style>
