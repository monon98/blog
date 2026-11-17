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
- **Theme**: `.vitepress/theme/`（`index.ts` extends 默认主题 + 注册全局组件；`ttsPlugin.ts` markdown-it 插件向面试题文章 H1 下注入有声阅读播放器）
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
    code/           # 面试代码题 (01. leetcode / 02. 前端编程题 / 03. 数据库编程题=LeetCode SQL 全量 323 题，已从 interview/ 独立成导航)
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
- **`@leelaa/vitepress-plugin-extended` 的引入方式被 config.mts 的 regex alias 限定**：只能 `import ToSpeech from '包名'`（默认导入，被直连到 `dist/ToSpeech.js`）——从库入口 `index.js` 导入会拖入 mermaid/three/d3（主题 chunk 曾膨胀到 1053KB）；`<ToSpeech>` 使用前必包 `<ClientOnly>`——其 setup 的 immediate watch 会调 `stop()` 裸读 `speechSynthesis`，SSR 必抛 ReferenceError

## Session history

- `5ae4c28` 有声文章按 H2 分章节：章节下拉 + 每个 H2 行内独立播放按钮（用户选定「并存都保留」+「标题行尾内联」）：
  - 新增模块级共享 store `src/components/interview/speechStore.ts`（segments/segIndex/phase/rate/scope/chapters/ready + `actions.toggle` 由播放器挂载时注入），主播放器与 `h2-speech.vue` 按钮共用；H2 按钮经 `toggleH2(k)` 指挥：非当前章 = 改 scope（播放器内 watch 执行跳转开播），当前章 = 暂停/继续；朗读中该章按钮高亮 ⏸️
  - `ttsPlugin.ts` 重写：向每个 h2 的 `heading_close` **前**注入 `<H2Speech :index="k" />`（组件在标题行尾；k=token 顺序=DOM 顺序）；注入点在 inline token 之后，VitePress TOC/slug 只读 heading_open+inline → 侧边栏/目录不受影响（已实测）
  - H2 文档序号 → 章节下标换算：`introOffset`（首段非 h2Start 即有开篇章则 +1）；章节下拉 `<select>` 用 `:value` + `@change`（**原生 select 上 `:model-value` 无效**，不驱动选中项）
  - 踩坑 3 处：① 原生 `<select>` 绑定须 `:value`+`@change`，`:model-value` 是组件 v-model 语义、对原生元素不生效；② 引擎 voice 冷启动期（~2.5s）`pause()` 因库 `isPlaying=false` 静默失效 → watch `isPlaying` 转 true 且 phase 仍为 paused 时补一次 `pause()`；③ **speechSynthesis 是浏览器全局**，跨测试遗留的 paused/卡死状态（cancel() 不清 paused 标志、被取消 utterance 使 speaking 卡 true）会让新 utterance 排队永不启动（onstart 不触发、进度冻结 0:00）→ 每次开播/接力前 `primeEngine()`（cancel + 必要时 resume；恢复路径不调用以免重读本段）
  - 实测 dev 全矩阵过：启动/暂停(pd=true)/恢复/开篇「已读完」/切章/倍速不跳段/停止、全文 1.6s 自然进 2/21 段接力、切页停播+store 复位、非面试题页无残留、TOC 无污染、vue/01 4 h2=4 按钮、vue/02 行内按钮截图视觉确认；`pnpm build` exit=0，preview 生产冒烟（章节点击播放/暂停/6 项下拉/零报错）通过
- `e980012` 有声文章分段与小标题对齐：提取逻辑从 `textContent` 整块切分改为 TreeWalker 按文本节点遍历（`extractUnits`），块级祖先切换处断行、H1-H6 行标记为小标题并强制开新段（一个小标题起一段，段仍受 200 字上限约束，超长段句级续切）；`br` 替换为 `\n` 文本节点断行。dev 实测 21/21 小标题全部位于段首、播放正常零报错，preview 生产冒烟通过
  - 附带结论：切倍速会重置本段进度 + 变化显示时长是 **Web Speech API 限制**——`utterance.rate` 在 `speak()` 后不可改（只能 cancel 重读），且 API 无播放位置接口（时长为库按字数÷语速估算）；如需进度连续可改为"倍速下一段生效"
- `ea08719` 面试题文章新增「有声文章」：基于 `@leelaa/vitepress-plugin-extended` 的 ToSpeech 分段朗读播放器（`src/components/interview/article-speech.vue`）：
  - 定位：markdown-it 插件 `.vitepress/theme/ttsPlugin.ts` 在构建期向面试题文章首个 H1 的 `heading_close` 后注入 `<ArticleSpeech />`（主题 doc-before/doc-after 插槽在 H1 外侧不满足"标题下方"）；门禁双保险 = 插件 `env.relativePath.startsWith('docs/interview/')` + 组件 `route.data.relativePath`（`route.path` 含 `/blog/` base 不可用）
  - 多次合成：单 ToSpeech 实例动态换 `:text` 分段接力（≤200 字/段、句末标点切分），watch expose 的 `isPlaying` 由 true→false 且 phase 仍为 playing 时推进下一段；切倍速用 600ms 抑制窗防误跳段；8s `resume()` 心跳防 Chrome 长语音 15s 卡死
  - 正文提取：克隆 `.vp-doc`、删 `pre`/按钮/锚点/播放器自身，手动给块级标签后插 `\n`（`textContent` 不补换行；保留折叠 details 题解内容）
  - 踩坑 4 处：① ToSpeech 必包 `<ClientOnly>`（setup 的 immediate watch 调 `stop()` 裸读 `speechSynthesis`，SSR 必抛 ReferenceError——SSR 下 `runsImmediately` 的 watch 会执行）；② 库入口 index.js 拖入 mermaid/three/d3，须 regex alias 直连 `dist/ToSpeech.js` + 默认导入（主题 chunk 1053KB→72KB）；③ 进度条公式忘把单段 `progress`(0-100) 除以 100；④ `'paused'` 恢复时未把 phase 改回 `'playing'`（keep-alive/接力失效）
  - 实测：dev + preview（生产）双环境全过——播放/暂停/恢复/停止/重启、切倍速不跳段、19 段接力、1× 单段 33s 连续朗读（跨 15s 阈值×3）自然进段、切页自动停播、非面试题页无播放器、深浅色适配、零控制台报错
- `9161ff3` 面试代码题新增数据库编程题栏目：LeetCode SQL 全量 323 题题解：
  - `src/docs/code/03. 数据库编程题/` 按 8 个知识点分目录：01. 基础查询(30) / 02. 多表连接(45) / 03. 聚合与分组(87) / 04. 子查询与 CTE(24) / 05. 窗口函数(40) / 06. 字符串与日期(36) / 07. 增删改操作(6) / 08. 综合与难题(55)，共 323 题（简单 113 / 中等 144 / 困难 66，含 VIP 付费题 218 道）+ 1 总索引 + 8 分类索引（由脚本生成）
  - 每题页面结构：难度/标签/原题链接 → 题目描述（免费题用 leetcode.cn GraphQL 抓官方原文逐字保留；VIP 题 `translatedContent` 为 null，按表结构 + 测试数据补写并在页首加 VIP 标注引用块）→ 默认折叠的题解（思路 + MySQL 8 实现 + 复杂度）→ 建表与测试数据
  - 全部 323 题的「建表造数 + 题解 SQL」在 Docker MySQL 8.4（容器 `lc-mysql`，端口 3307）逐一实测，**323/323 通过**；`pnpm build` exit=0 无死链无 TypeError，产出 332 个 HTML 页面
  - 分批生产流程：题面抓取 → 两并行子代理按主要知识点分类 323 题 → 切 21 批（16 题/批）由子代理并行写题解 → 脚本全量校验 + 生成索引；期间多次触发 "Free usage limit reached" 免费额度限制，靠跨天重试完成
  - 踩坑记录：① 目录误建在 `src/docs/03. ...` 导致 2 个死链，应放 `src/docs/code/03. ...`；② schemaSql 常见原样不可执行问题——表名大小写不一致（Create 与 Truncate/insert 大小写不同，Linux MySQL 区分大小写，如 3338、3415、3236、第二高的薪水 II）、字符串未转义单引号（2669、3087/3103/3150）、美式日期字面量被严格模式拒绝（607 销售员 `4/1/2006` → `2006-04-01`）、标题尾部空格（1082），均需人工修复后才可通过校验
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
