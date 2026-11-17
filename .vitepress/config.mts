import { defineConfig } from 'vitepress';
import { fileURLToPath } from 'node:url';
import { nav } from './nav.ts';
import { sidebar } from './sidebar.ts';
import { articleSpeechPlugin } from './theme/ttsPlugin.ts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "MONON98's Blog",
  description: 'A VitePress Site',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: 'https://avatars.githubusercontent.com/u/107355305?v=4',
      },
    ],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav,
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/monon98/blog' }],

    search: {
      provider: 'local',
    },
  },
  base: '/blog/',
  srcDir: './src',
  markdown: {
    // 有声文章：面试题文章 H1 下注入 <ArticleSpeech /> 播放器
    config(md) {
      articleSpeechPlugin(md);
    },
  },
  cacheDir: './.cache',
  outDir: './dist',
  lastUpdated: true,
  vite: {
    build: {
      cssMinify: 'esbuild',
    },
    resolve: {
      // 注意顺序：字符串前缀匹配，长的在前
      alias: [
        { find: '@components', replacement: '/components' },
        { find: '@', replacement: '/' },
        // 有声文章：直连 ToSpeech 子模块，避免库入口 index.js 拖入 mermaid/three/d3（主题 chunk 会膨胀 ~1MB）
        {
          find: /^@leelaa\/vitepress-plugin-extended$/,
          replacement: fileURLToPath(
            new URL('../node_modules/@leelaa/vitepress-plugin-extended/dist/ToSpeech.js', import.meta.url),
          ),
        },
      ],
    },
    server: {
      open: true,
      host: '0.0.0.0',
    },
  },
});
