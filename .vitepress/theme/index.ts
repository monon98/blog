import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import ArticleSpeech from '@components/interview/article-speech.vue'
import H2Speech from '@components/interview/h2-speech.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 有声文章播放器：由 .vitepress/theme/ttsPlugin.ts 注入
    // ArticleSpeech = H1 下的主播放器；H2Speech = 每个 h2 行尾的章节播放按钮
    app.component('ArticleSpeech', ArticleSpeech)
    app.component('H2Speech', H2Speech)
  },
} satisfies Theme
