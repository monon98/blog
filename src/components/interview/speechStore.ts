import { computed, ref } from 'vue'

/**
 * 有声文章共享状态（模块级单例）：
 * - 主播放器 ArticleSpeech（H1 下注入）与各 H2 行内按钮 H2Speech（每个 h2 内注入）共用
 * - 播放引擎与段间接力仍由 ArticleSpeech 持有（ToSpeech 实例只有一份），
 *   H2 按钮通过 actions.toggle / scope 变更来指挥播放器
 * - 必须 SSR 安全：模块顶层只允许 ref/computed，不得触碰 window/speechSynthesis
 */

/** 朗读段：h2Start 表示该段以 H2 小标题开头（新章节的起点） */
export interface Segment {
  text: string
  h2Start: boolean
}

/** 章节：开篇（首个 H2 之前）或某个 H2 小节，对应连续的段区间 [from, to] */
export interface Chapter {
  title: string
  from: number
  to: number
}

export const segments = ref<Segment[]>([])
export const segIndex = ref(0)
export const phase = ref<'idle' | 'playing' | 'paused' | 'finished'>('idle')
export const rate = ref(1)
/** 朗读范围：-1 = 全文，否则为 chapters 下标（选中章节单独播放） */
export const scope = ref(-1)
/** 正文提取已完成（H2 行内按钮据此显示；SSR 与首帧均为 false） */
export const ready = ref(false)

export const total = computed(() => segments.value.length)

/** 章节列表：开篇（首个 H2 之前）+ 每个 H2 章节 */
export const chapters = computed<Chapter[]>(() => {
  const segs = segments.value
  const list: Chapter[] = []
  let i = 0
  while (i < segs.length && !segs[i].h2Start) i++
  if (i > 0) list.push({ title: '开篇', from: 0, to: i - 1 })
  for (; i < segs.length; i++) {
    if (segs[i].h2Start) {
      list.push({ title: segs[i].text.split('\n')[0], from: i, to: i })
    } else if (list.length) {
      list[list.length - 1].to = i
    }
  }
  return list
})

/** 开篇章是否存在（首段不以 H2 开头）→ H2 文档序号换算章节下标时的偏移 */
const introOffset = computed(() => (segments.value.length && !segments.value[0].h2Start ? 1 : 0))

/** 当前朗读范围（全文或选中章节）的段区间 */
export const rangeFrom = computed(() => (scope.value < 0 ? 0 : (chapters.value[scope.value]?.from ?? 0)))
export const rangeTo = computed(() =>
  scope.value < 0 ? total.value - 1 : (chapters.value[scope.value]?.to ?? total.value - 1),
)
export const rangeLen = computed(() => Math.max(rangeTo.value - rangeFrom.value + 1, 0))
export const current = computed(() => (rangeLen.value ? segIndex.value - rangeFrom.value + 1 : 0))

/** 当前段所属章节下标（无则 -1） */
export const activeChapter = computed(() => {
  const i = segIndex.value
  const list = chapters.value
  for (let c = list.length - 1; c >= 0; c--) {
    if (i >= list[c].from) return c
  }
  return -1
})

/** 当前朗读到第几个 H2（0-based 文档序；在开篇章中为 -1） */
export const activeH2 = computed(() => {
  const c = activeChapter.value
  if (c < introOffset.value) return -1
  return c - introOffset.value
})

/** 播放器注册给 H2 行内按钮的动作（挂载时注入，卸载时清除） */
export const actions: { toggle?: () => void } = {}

/** 第 k 个 H2（0-based 文档序）对应的章节下标；无对应章节返回 -1 */
export function h2ChapterIndex(k: number): number {
  const ci = k + introOffset.value
  return ci < chapters.value.length ? ci : -1
}

/**
 * H2 行内按钮点击：
 * - 当前正在朗读该章（或该章为当前范围）→ 暂停/继续
 * - 否则切到该章并播放（scope 变更由播放器内的 watch 执行跳转与开播）
 */
export function toggleH2(k: number): void {
  const ci = h2ChapterIndex(k)
  if (ci < 0) return
  if (ci === activeChapter.value && actions.toggle) actions.toggle()
  else scope.value = ci
}

/** 播放器卸载（切页）时复位共享状态；rate 保留用户选择 */
export function resetStore(): void {
  segments.value = []
  segIndex.value = 0
  phase.value = 'idle'
  scope.value = -1
  ready.value = false
}
