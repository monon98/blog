<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
// 默认导入：config.mts 中 alias 已把裸包名直连 dist/ToSpeech.js（只依赖 vue）。
// 不能从库入口 index.js 导入——它静态引入全部组件，会把 mermaid/three/d3 拖进主题 chunk（~1MB）。
import ToSpeech from '@leelaa/vitepress-plugin-extended'

/**
 * 有声文章播放器（面试题专用）
 *
 * - 由 .vitepress/theme/ttsPlugin.ts 在文章 H1 标题后注入（构建期定位，SSR 一致）
 * - 文章正文提取 → 按小标题对齐 + 按句分段 → 单个 ToSpeech 实例动态换 text 接力朗读（多次合成）
 * - ToSpeech 必须包在 ClientOnly 内：其 setup 的 immediate watch 会调用 stop()，
 *   stop() 裸读 speechSynthesis，服务端渲染会抛 ReferenceError
 * - 段间接力依赖 ToSpeech 的 expose 状态（exposeProxy 经 proxyRefs 解包，watcher 可直接跟踪）
 */

const route = useRoute()
// 门禁：pageData.relativePath 相对 srcDir（如 docs/interview/05. vue/01. 基础概念.md）
const enabled = computed(() => route.data?.relativePath?.startsWith('docs/interview/'))

// to-speech 库组件通过 expose 暴露 play/pause/toggle/setRate 及 isPlaying/currentTime/progress 等状态
const ttsRef = ref<any>(null)
const supported = ref(true)
const segments = ref<string[]>([])
const segIndex = ref(0)
const phase = ref<'idle' | 'playing' | 'paused' | 'finished'>('idle')
const rate = ref(1)

/** 切倍速时库内部会 stop→replay，短暂的 isPlaying=false 不能被当成"本段播完" */
let suppressAdvanceUntil = 0
let keepAliveTimer: number | null = null
let voicesListener: (() => void) | null = null

const RATES = [0.75, 1, 1.25, 1.5, 2]
/** 单段最大字符数（200 字 ≈ 1 分钟朗读量；过长会触发 Chrome 长语音 15s 卡死问题） */
const MAX_SEGMENT = 200

const total = computed(() => segments.value.length)
const current = computed(() => (total.value ? segIndex.value + 1 : 0))
const playing = computed(() => phase.value === 'playing')
const ready = computed(() => !!ttsRef.value)
const currentText = computed(() => segments.value[segIndex.value] ?? '')

const loading = computed(() => (ttsRef.value?.loading as boolean) ?? false)
const localProgress = computed(() => (ttsRef.value?.progress as number) ?? 0)
const currentTime = computed(() => (ttsRef.value?.currentTime as number) ?? 0)
const totalTime = computed(() => (ttsRef.value?.totalTime as number) ?? 0)

const overallProgress = computed(() => {
  if (phase.value === 'finished') return 100
  if (!total.value) return 0
  // localProgress 是 0-100 的单段进度，需换算成 0-1 再叠加段索引
  return Math.min(((segIndex.value + localProgress.value / 100) / total.value) * 100, 100)
})

function formatTime(s: number): string {
  if (!s || s < 0 || !Number.isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

// ---------- 文本提取与分段 ----------

/** 按句末标点切超长行，再打包成不超过 max 的段 */
function splitSentences(text: string, max: number): string[] {
  const parts = text.match(/[^。！？!?；;]+[。！？!?；;]*/g) || [text]
  const out: string[] = []
  let buf = ''
  for (const raw of parts) {
    const p = raw.trim()
    if (!p) continue
    if (buf && buf.length + p.length > max) {
      out.push(buf)
      buf = p
    } else {
      buf += p
    }
    while (buf.length > max) {
      out.push(buf.slice(0, max))
      buf = buf.slice(max)
    }
  }
  if (buf) out.push(buf)
  return out
}

/** 分段单元：text 为一行文本，heading 标记该行是否为小标题（H1-H6） */
interface Unit {
  text: string
  heading: boolean
}

function splitIntoSegments(units: Unit[], max = MAX_SEGMENT): string[] {
  // 单个超长行先按句末标点切开（首块保留标题标记）
  const pieces: Unit[] = []
  for (const u of units) {
    if (u.text.length <= max) {
      pieces.push(u)
    } else {
      splitSentences(u.text, max).forEach((p, i) => pieces.push({ text: p, heading: u.heading && i === 0 }))
    }
  }
  // 打包：遇到小标题强制开新段（一个小标题起一段），其次受 max 长度约束
  const result: string[] = []
  let cur = ''
  for (const p of pieces) {
    if (!cur) {
      cur = p.text
    } else if (p.heading || cur.length + p.text.length + 1 > max) {
      result.push(cur)
      cur = p.text
    } else {
      cur = `${cur}\n${p.text}`
    }
  }
  if (cur) result.push(cur)
  return result
}

/** 块级标签（用于识别"行"边界与小标题）；容器级标签不参与 */
const BLOCK_SEL = 'p,h1,h2,h3,h4,h5,h6,li,td,th,summary,blockquote,figcaption,tr'
const HEADING_RE = /^H[1-6]$/

/**
 * 提取文章正文为带标题标记的行单元：
 * - 克隆 .vp-doc 后处理，不影响页面
 * - 删除代码块/按钮/锚点/播放器自身（朗读不读代码）
 * - 按文本节点顺序走 DOM：块级元素切换处断行（textContent 不会为块级补换行；
 *   innerinnerText 在折叠 details 上会丢文本，故手动遍历），同一块内 br 产生的 \n 也断行
 * - 文本节点的最近块级祖先若是 H1-H6，该行标记为小标题 → 分段时强制开新段
 */
function extractUnits(clone: HTMLElement): Unit[] {
  const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT)
  const units: Unit[] = []
  let cur = ''
  let curHeading = false
  let lastBlock: Element | null = null
  let started = false

  const flush = () => {
    for (const line of cur.split('\n')) {
      const t = line.trim()
      if (t) units.push({ text: t, heading: curHeading })
    }
    cur = ''
  }

  let node = walker.nextNode()
  while (node) {
    const block = node.parentElement?.closest(BLOCK_SEL) ?? null
    if (!started || block !== lastBlock) {
      flush()
      lastBlock = block
      started = true
      curHeading = !!block && HEADING_RE.test(block.tagName)
    }
    cur += node.textContent
    node = walker.nextNode()
  }
  flush()
  return units
}

function extractSegments(): string[] {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return []
  const clone = doc.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll('pre, script, style, button, svg, canvas, a.header-anchor, [data-tts-root]')
    .forEach((el) => el.remove())
  // br 换成 \n 文本节点：同一块级元素内的换行在遍历时不会触发断行，靠 flush 时按 \n 拆行
  clone.querySelectorAll('br').forEach((br) => br.replaceWith(document.createTextNode('\n')))
  return splitIntoSegments(extractUnits(clone))
}

// ---------- 段间接力 ----------

watch(
  () => ttsRef.value?.isPlaying,
  (now, was) => {
    if (now || !was) return
    // 只有"朗读中自然播完"才推进；用户暂停/停止/切倍速均已改 phase 或落在抑制窗口内
    if (phase.value !== 'playing' || Date.now() < suppressAdvanceUntil) return
    if (segIndex.value < total.value - 1) {
      segIndex.value += 1
      // text 变更会触发库内部 watch→stop()，nextTick 后再 play 读到新文本
      nextTick(() => ttsRef.value?.play())
    } else {
      phase.value = 'finished'
    }
  },
)

/** Chrome 长语音 15s 卡死问题的心跳保活：未暂停时 resume() 是无害 no-op */
watch(phase, (p) => {
  if (p === 'playing') {
    if (keepAliveTimer == null) {
      keepAliveTimer = window.setInterval(() => {
        try {
          if (speechSynthesis.speaking && !speechSynthesis.paused) speechSynthesis.resume()
        } catch {
          /* 忽略 */
        }
      }, 8000)
    }
  } else if (keepAliveTimer != null) {
    clearInterval(keepAliveTimer)
    keepAliveTimer = null
  }
})

// ---------- 播放控制 ----------

function onToggle() {
  if (!ready.value || !total.value) return
  if (phase.value === 'playing') {
    phase.value = 'paused'
    ttsRef.value?.pause()
    return
  }
  if (phase.value === 'paused') {
    phase.value = 'playing'
    ttsRef.value?.toggle() // 内部走 resume 分支
    return
  }
  if (phase.value === 'finished') segIndex.value = 0
  phase.value = 'playing'
  nextTick(() => ttsRef.value?.play())
}

function onStop() {
  phase.value = 'idle'
  segIndex.value = 0
  ttsRef.value?.stop()
}

function onRate(r: number) {
  if (r === rate.value) return
  suppressAdvanceUntil = Date.now() + 600
  rate.value = r
}

// ---------- 生命周期 ----------

onMounted(() => {
  if (!('speechSynthesis' in window)) {
    supported.value = false
    return
  }
  // 预热语音列表，避免首次播放选不到中文语音（库在每次 play 时重新 getVoices）
  speechSynthesis.getVoices()
  voicesListener = () => speechSynthesis.getVoices()
  speechSynthesis.addEventListener('voiceschanged', voicesListener)
  segments.value = extractSegments()
})

onBeforeUnmount(() => {
  if (keepAliveTimer != null) clearInterval(keepAliveTimer)
  if (voicesListener) speechSynthesis.removeEventListener('voiceschanged', voicesListener)
  // 播放中切页由 ToSpeech 自身 onUnmounted→stop() 负责停播
})
</script>

<template>
  <div v-if="enabled && supported && total > 0" class="article-speech" data-tts-root>
    <div class="as-row">
      <span class="as-label">🔊 有声阅读</span>

      <button
        type="button"
        class="as-btn"
        :disabled="!ready"
        :aria-label="playing ? '暂停朗读' : '播放朗读'"
        @click="onToggle"
      >
        {{ loading ? '⏳' : playing ? '⏸️' : '▶️' }}
      </button>

      <button
        type="button"
        class="as-btn"
        :disabled="phase === 'idle'"
        aria-label="停止朗读"
        @click="onStop"
      >
        ⏹️
      </button>

      <div class="as-progress">
        <div class="as-track">
          <div class="as-fill" :style="{ width: overallProgress + '%' }" />
        </div>
        <span class="as-meta">
          {{ phase === 'finished' ? '已读完' : `${current}/${total} 段` }}
          · {{ formatTime(currentTime) }}/{{ formatTime(totalTime) }}
        </span>
      </div>

      <div class="as-rates" role="group" aria-label="播放速度">
        <button
          v-for="r in RATES"
          :key="r"
          type="button"
          :class="{ on: rate === r }"
          @click="onRate(r)"
        >
          {{ r }}×
        </button>
      </div>
    </div>

    <!-- 库组件：默认方形按钮用 CSS 隐藏，只用它的朗读引擎与 expose 状态 -->
    <ClientOnly>
      <ToSpeech ref="ttsRef" :text="currentText" :rate="rate" />
    </ClientOnly>
  </div>
</template>

<style scoped>
.article-speech {
  margin: 1rem 0 1.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  font-size: 14px;
}

/* 隐藏库自带的默认播放按钮（子组件根节点同时携带父级 scope id） */
.article-speech .text-to-speech {
  display: none;
}

.as-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.as-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.as-btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--vp-c-divider);
  border-radius: 50%;
  background-color: var(--vp-c-bg);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.as-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.as-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.as-progress {
  flex: 1 1 180px;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.as-track {
  height: 6px;
  border-radius: 3px;
  background-color: var(--vp-c-default-soft);
  overflow: hidden;
}

.as-fill {
  height: 100%;
  width: 0;
  border-radius: 3px;
  background-color: var(--vp-c-brand-1);
  transition: width 0.25s ease;
}

.as-meta {
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.as-rates {
  display: inline-flex;
  gap: 4px;
}

.as-rates button {
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background-color: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.as-rates button:hover {
  color: var(--vp-c-text-1);
}

.as-rates button.on {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  font-weight: 600;
}

@media (max-width: 640px) {
  .as-rates {
    order: 10;
    flex-basis: 100%;
    justify-content: flex-end;
  }
}
</style>
