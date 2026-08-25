# AGENTS.md

## Quick start

```bash
pnpm install
pnpm dev
```

## Key commands

- `pnpm dev` — local dev server (auto-opens, binds 0.0.0.0)
- `pnpm build` — production build → `dist/`
- `pnpm preview` — preview built site locally

No lint, typecheck, or test scripts exist. Do not add code quality tooling unless asked.

## Architecture

- **Framework**: VitePress 2.0.0-alpha.19 (Vite 8 + Rolldown), configured in `.vitepress/config.mts`
- **CSS minify**: `esbuild`（config 中显式指定，绕过 lightningcss 对主题样式的压缩报错）
- **Source dir**: `src/` (not root). Content lives in `src/docs/`
- **Output dir**: `dist/`
- **Base path**: `/blog/` — all generated URLs are prefixed with this
- **Package manager**: pnpm (lockfile v9). CI pins pnpm 9.12.3
- **Node**: 22 (CI)
- **Deploy**: GitHub Actions on push to `master` branch → GitHub Pages

## Content structure

```
src/
  index.md          # Home page (VitePress frontmatter layout)
  docs/
    collection/     # 收藏箱 (personal + reposts subdirs)
    develop/        # 开发笔记
    guide/          # 技术导航
    interview/      # 面试题
  components/       # Vue components (draw-canvas, hover-button, etc.)
  html/             # Standalone HTML demos (not VitePress pages)
  showcase/         # Demo showcase pages
  public/           # Static assets
```

## Sidebar generation

Sidebar in `.vitepress/sidebar.ts` auto-generates from the filesystem. File/directory names use numeric prefixes (e.g. `0. Introduction`). The `cleanName()` function strips these prefixes for display. To add content, just drop `.md` files into the right `src/docs/` subdirectory — sidebar updates automatically.

## Conventions

- Content language: Chinese (中文)
- No existing AGENTS.md, CLAUDE.md, .cursorrules, or copilot-instructions
- No test suite or CI checks beyond build+deploy
- Vite aliases: `@` → `/`, `@components` → `/components` (relative to `srcDir`)

## Gotchas

- `src/html/` contains standalone HTML files, not VitePress markdown pages — don't treat them as routable content
- The `scripts/` directory is empty — don't rely on any script tooling
- No `.env` files or environment variables configured
