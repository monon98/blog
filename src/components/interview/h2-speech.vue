<script setup lang="ts">
import { computed } from 'vue'
import { activeH2, phase, ready, toggleH2 } from './speechStore'

/**
 * H2 行内播放按钮（面试题专用）
 *
 * - 由 .vitepress/theme/ttsPlugin.ts 在每个 h2 的 heading_close 前注入（组件位于标题行尾）
 * - index 为该 h2 的文档序号（插件按 token 顺序编号，与 DOM 中 h2 顺序一致）
 * - 经 speechStore 与主播放器共享状态：点击 = 单独播放该章 / 暂停·继续，朗读中高亮
 * - SSR 时 ready=false 不渲染（正文提取在主播放器 onMounted 完成），无水合不一致
 */

const props = defineProps<{ index: number }>()

const active = computed(() => ready.value && activeH2.value === props.index)
const playingHere = computed(() => active.value && phase.value === 'playing')

function onClick() {
  toggleH2(props.index)
}
</script>

<template>
  <button
    v-if="ready"
    type="button"
    class="h2-speech"
    :class="{ on: active }"
    :aria-label="playingHere ? '暂停本章朗读' : '播放本章'"
    :title="playingHere ? '暂停' : '播放本章'"
    @click.stop="onClick"
  >
    {{ playingHere ? '⏸️' : '▶️' }}
  </button>
</template>

<style scoped>
.h2-speech {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  padding: 0 2px;
  border: none;
  background: transparent;
  font-size: 0.72em;
  line-height: 1;
  cursor: pointer;
  opacity: 0.45;
  vertical-align: middle;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.h2-speech:hover {
  opacity: 1;
  transform: scale(1.15);
}

.h2-speech.on {
  opacity: 1;
}
</style>
