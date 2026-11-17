import type { MarkdownRenderer } from 'vitepress'

/**
 * markdown-it 插件：在面试题文章的首个一级标题（H1）之后注入 <ArticleSpeech />。
 *
 * - 定位在构建期完成（渲染 token 时），保证 SSR 输出与客户端一致、无闪烁；
 *   主题的 doc-before/doc-after 插槽位于 H1 外侧，无法满足"标题下方"的要求。
 * - 门禁：env.relativePath 相对 srcDir（如 docs/interview/05. vue/01. 基础概念.md），
 *   只注入面试题目录；组件侧再用 route.data.relativePath 做一次兜底。
 */
export function articleSpeechPlugin(md: MarkdownRenderer) {
  md.core.ruler.push('article_speech_inject', (state) => {
    const relativePath = (state.env as { relativePath?: string } | null)?.relativePath
    if (!relativePath?.startsWith('docs/interview/')) return

    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type === 'heading_close' && token.tag === 'h1') {
        const inject = new state.Token('html_block', '', 0)
        inject.block = true
        inject.content = '\n<ArticleSpeech />\n'
        tokens.splice(i + 1, 0, inject)
        break
      }
    }
  })
}
