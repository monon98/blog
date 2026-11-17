import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ArticleSpeech from '@components/interview/article-speech.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 有声文章播放器：由 .vitepress/theme/ttsPlugin.ts 注入到面试题文章 H1 下方
    app.component('ArticleSpeech', ArticleSpeech)
  },
} satisfies Theme
