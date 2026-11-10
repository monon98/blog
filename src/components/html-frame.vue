<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(
  defineProps<{
    /** 相对 `src/public/` 的路径，例如 `html/hover-card.html` */
    src: string
    /** iframe 的无障碍标题 */
    title?: string
    /** 高度：数字按 px 处理，字符串原样使用 */
    height?: number | string
    loading?: 'lazy' | 'eager'
  }>(),
  {
    title: 'demo',
    height: 480,
    loading: 'lazy',
  }
)

// 统一规范化为以 / 开头，再交给 withBase 补全 base（本项目为 /blog/）
// 注意：withBase 只对以 / 开头的内部路径补 base，相对路径会原样返回
const url = computed(() => {
  const path = props.src.startsWith('/') ? props.src : `/${props.src}`
  return withBase(path)
})

const frameHeight = computed(() =>
  typeof props.height === 'number' ? `${props.height}px` : props.height
)
</script>

<template>
  <iframe
    class="html-frame"
    :src="url"
    :title="title"
    :style="{ height: frameHeight }"
    :loading="loading"
    allowfullscreen
  />
</template>

<style scoped>
.html-frame {
  display: block;
  width: 100%;
  border: 1px solid var(--vp-c-divider, #e2e2e2);
  border-radius: 8px;
  background: #fff;
  overflow: hidden;
}
</style>
