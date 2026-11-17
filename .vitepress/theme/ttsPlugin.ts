import type { MarkdownRenderer } from 'vitepress'

/**
 * markdown-it 插件（面试题专用，门禁 env.relativePath 以 docs/interview/ 开头）：
 * 1. 向文章首个一级标题（H1）之后注入 <ArticleSpeech /> 主播放器
 *    —— 定位在构建期完成（渲染 token 时），保证 SSR 输出与客户端一致、无闪烁；
 *       主题的 doc-before/doc-after 插槽位于 H1 外侧，无法满足"标题下方"的要求
 * 2. 向每个 H2 的 heading_close 之前注入 <H2Speech :index="k" /> 行内播放按钮
 *    —— 组件位于标题行尾（类似 # 锚点）；k 为 H2 的 token 顺序（与 DOM 顺序一致）
 *    —— 放在 inline token 之后，不影响 VitePress 的 TOC/slug 提取（其只读 heading_open+inline）
 *
 * 组件侧再用 route.data.relativePath 做一次门禁兜底。
 */
export function articleSpeechPlugin(md: MarkdownRenderer) {
  md.core.ruler.push('article_speech_inject', (state) => {
    const relativePath = (state.env as { relativePath?: string } | null)?.relativePath
    if (!relativePath?.startsWith('docs/interview/')) return

    const tokens = state.tokens
    const h1Close: number[] = []
    const h2Close: number[] = []
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (token.type !== 'heading_close') continue
      if (token.tag === 'h1' && h1Close.length === 0) h1Close.push(i)
      else if (token.tag === 'h2') h2Close.push(i)
    }

    // H2：插入在 heading_close 之前（组件渲染在标题内部）；倒序插入保证前面的下标仍然有效
    for (let j = h2Close.length - 1; j >= 0; j--) {
      const inject = new state.Token('html_block', '', 0)
      inject.block = true
      inject.content = `\n<H2Speech :index="${j}"></H2Speech>\n`
      tokens.splice(h2Close[j], 0, inject)
    }

    // H1：插入在 heading_close 之后（主播放器位于标题下方）
    if (h1Close.length) {
      const inject = new state.Token('html_block', '', 0)
      inject.block = true
      inject.content = '\n<ArticleSpeech />\n'
      tokens.splice(h1Close[0] + 1, 0, inject)
    }
  })
}
