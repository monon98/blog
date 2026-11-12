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
    collection/     # 收藏箱 (personal 只剩通用软件；开发相关已迁至 develop/汇总/)
      personal/
      reposts/      # 转载 (android / window / 前端 等子目录)
    develop/        # 开发笔记 (有 index.md 落地页，nav 有「开发笔记」入口)
      汇总/         # 5 个收集类文件：技术栈 / 开发工具 / 开源资源 / 前端收藏箱 / 三方库依赖收集
      css/ javascript/ vue/ angular/ sql/ other/
    code/           # 面试代码题 (01. leetcode / 02. 前端编程题，已从 interview/ 独立成导航)
    interview/      # 面试题 (根目录只放 index.md + 0. 在线面试题网站收集 + 99. 其他面试难题汇总)
      01-18 主题目录 / 21. web3/ (01-04: web3基础、btc、eth、tron) / 25. webpack / 26. vite
  components/       # Vue components，按分组分子目录 (article/ visual/ interview/ widget/)
  html/             # （原指令源码已移除，并入 showcase/widget/15-img-fallback 关联的 HTML 案例）
  showcase/         # Demo showcase pages（每分组一个 <group>.md + index.md）
  public/
    html/<group>/   # 原生 HTML 案例，会被拷进 dist，可用 HtmlFrame iframe 内嵌
```

### Content organization conventions

- 每个目录分区配 `index.md` 落地页，用相对链接列出子页面；新增页面后同步更新落地页和 `src/index.md` 首页卡片。
- 数字前缀决定侧边栏排序（字符串序）：`101.` 会排在 `10.` 之后、`11.` 之前 —— 编号别超过两位数，保持同一位数宽度。
- 移动/改名文件前：先 grep 全库引用并同步更新，再用 `git mv`（保留 rename 历史），最后 `pnpm build` 验证（构建期会校验死链，通过 = 全站无断链）。

## Sidebar generation

Sidebar in `.vitepress/sidebar.ts` auto-generates from the filesystem. File/directory names use numeric prefixes (e.g. `0. Introduction`). The `cleanName()` function strips these prefixes for display. To add content, just drop `.md` files into the right `src/docs/` subdirectory — sidebar updates automatically.

## Conventions

- Content language: Chinese (中文)
- No test suite or CI checks beyond build+deploy
- Vite aliases: `@` → `/`, `@components` → `/components` (relative to `srcDir`)
- 条目格式沿用「编号. [名称](链接) — 一句话说明」

## Gotchas

- 原生 HTML 案例必须放 `src/public/html/<group>/`（ASCII kebab-case）才能被 iframe 内嵌；`src/html/` 不进 dist 且目录已移除（原 `imgFallback.js.js` 指令源码并入 `widget/img-fallback.html`）
- 案例分组与详情页规范见 `.opencode/skills/demo-showcase/SKILL.md`（article / visual / interview / widget 四组；§11 详情页模板）
- The `scripts/` directory is empty — don't rely on any script tooling
- No `.env` files or environment variables configured
- **`pnpm preview` 会缓存启动时刻的文件列表**：启动后新建的页面一律 404（症状像"没有构建出页面"）。重新 build 后必须重启 preview 才能看到新页面
- **dev server（`pnpm dev`）遇文件变动会短暂 502 / 空白页**：浏览器验证时遇到空页先重试，不要误判为死链；5173 被占用时会自动落到 5174
- PowerShell 输出中文文件名乱码：先 `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8`
- **md 页面是整页编译成 Vue 模板**：正文行内反引号代码含 `{{ }}` 会被当插值执行（曾致 31 个详情页 SSR TypeError、文档页内容渲染成 `0`），必须用 `<span v-pre>` 包裹；围栏代码块与 `<<<` snippet 天然安全。改完 md 后 `pnpm build` 若退出码 0，仍要 grep 输出确认无 `TypeError`
- 侧边栏每个子目录会显示一个多余的 "index" 条目（`index.md` 的既有行为），guide/interview 均如此，属已知非 bug

## Session history

- `4b6c079` 案例展示详情页体系（demo-showcase Skill §11）：
  - 四组 57 个案例全部配独立详情页 `src/showcase/<group>/NN-<name>.md`：visual 32（`faa0523`）+ article 5 / interview 5 / widget 15（`c44eed5`）；结构为 返回链接 →（关联文章/题目）→ 一、展示用例 → 二、代码实现（`::: details` + `<<<` 真实源文件）→ 三、使用讲解（实现原理/如何调整/注意事项，基于真实源码写）
  - 分组页 `src/showcase/<group>.md` 每案例演示行下加 `[完整页面：用例 · 代码 · 讲解 →](./<group>/NN-name)`；`7c68348` 首页改为四组导航落地页
  - Skill 新增 §11 详情页模板 + §7 分组页链接写法 + 质量清单项；讲解写法、HTML/Vue 页文案差异、`../../` 路径基准均入规范
- `12eb19d` 整理内容目录结构并补充导航入口：
  - 「好用的三方库依赖收集」扩充至 22 分类约 150 库，unocss 归入新建的「CSS / 样式」分类
  - 新增 `develop/index.md` 落地页 + 导航「开发笔记」入口；修复首页 3 处坏链并新增开发笔记卡片
  - interview 中等整理：`101. leetcode`→`19.`、`102. 前端编程题`→`20.`、散落的 web3/btc/eth/tron 归入新建 `21. web3/`（01-04 编号）；19 版《移动零》（68 行）覆盖 101 版（52 行）；侧边栏排序错乱修复
- `43b927f` 整合收集类文件到 `develop/汇总/`：
  - `collection/personal/` 下技术栈、开发工具、开源资源、前端收藏箱 4 个开发相关文件迁入；`personal/` 只剩 `1. 好用工具软件汇总`，`collection/index.md` 加 tip 跨引用
  - `develop/tool/好用的三方库依赖收集` 一并移入，空 `tool/` 目录删除
  - 5 文件整合为 `develop/汇总/`（用户选定方案，不建 index.md，落地页直接列链接）
