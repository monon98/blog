# MONON98's Blog

基于 [VitePress 2.0](https://vitepress.dev/) 构建的个人技术博客，部署在 GitHub Pages。

## 项目结构

```
├── .vitepress/           # VitePress 配置
│   ├── config.mts        # 站点配置
│   ├── nav.ts            # 导航栏
│   └── sidebar.ts        # 侧边栏自动生成
├── src/
│   ├── docs/             # 文档内容
│   │   ├── collection/   # 收藏箱（个人 + 转载）
│   │   ├── develop/      # 开发笔记
│   │   ├── code/         # 面试代码题（LeetCode 初级算法 / 前端手写题）
│   │   └── interview/    # 面试题（JS/TS/Vue/React/浏览器/Node 等）
│   ├── components/       # Vue 组件
│   └── index.md          # 首页
├── .github/workflows/    # GitHub Actions 部署
├── package.json
└── pnpm-lock.yaml
```

## 核心特性

- **零配置侧边栏**：基于文件系统自动生成，按数字前缀排序
- **面试题体系**：覆盖 JS/TS/Vue/React/浏览器/Node/网络/手写题/LeetCode
- **VitePress 2.0 (Vite 8 + Rolldown)**：冷启动快、构建快、HMR 极速
- **GitHub Actions 自动部署**：推送到 main 分支自动构建并部署到 GitHub Pages

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 本地预览构建产物
pnpm preview
```

## 内容约定

- 文档放在 `src/docs/` 对应分类目录下
- 文件名使用数字前缀排序：`01. 标题.md`、`02. 标题.md`
- 侧边栏自动根据目录结构生成，标题自动去除数字前缀
- 面试题统一使用 `::: details` 折叠块，包含题目、解析、代码、复杂度

## 部署

推送到 `master` 分支触发 GitHub Actions 自动构建并部署到 GitHub Pages。

访问地址：https://monon98.github.io/blog/

## 许可证

MIT License