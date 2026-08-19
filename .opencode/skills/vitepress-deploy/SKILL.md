---
name: vitepress-deploy
description: Use when working with build, deployment, CI/CD, or GitHub Pages configuration. Covers VitePress build output, GitHub Actions workflow, pnpm setup, and deployment troubleshooting.
---

# VitePress Deploy & Build

## Build commands

```bash
pnpm install    # Install dependencies (uses pnpm, lockfile v9)
pnpm build      # Production build → dist/
pnpm preview    # Preview built site locally
pnpm dev        # Local dev server (auto-opens, binds 0.0.0.0)
```

No lint, typecheck, or test scripts exist.

## Build output

- Output directory: `dist/`
- Base path: `/blog/` — all URLs prefixed with this
- Gitignored: `dist/` and `.cache/`

## CI/CD

GitHub Actions workflow at `.github/workflows/deploy.yml`:

- Triggers on push to `master` branch (NOT `main`)
- Uses pnpm 9.12.3 (pinned)
- Uses Node 22
- Deploys to GitHub Pages via `actions/deploy-pages@v5`
- Concurrency: only one deploy at a time, does not cancel in-progress

## Environment requirements

- **Node**: 22 (matches CI)
- **Package manager**: pnpm with lockfile v9
- No `.env` files or environment variables needed

## VitePress config

From `.vitepress/config.mts`:

- `srcDir: './src'` — source is `src/`, not repo root
- `cacheDir: './.cache'` — cache is project-local
- `outDir: './dist'` — build output
- `base: '/blog/'` — GitHub Pages subpath
- `lastUpdated: true` — requires `fetch-depth: 0` in CI (already configured)
- Dev server: `host: '0.0.0.0'`, `open: true`

## Link format rules

- Use relative paths without `.md` extension
- Escape spaces as `%20` in links
- Example: `[Text](./06.%20路由与状态管理#section)`

## SSR considerations

- When using browser-only objects (window, navigator, performance), add conditionals:
```javascript
if (typeof window !== 'undefined') {
  // browser-only code
}
```
- Always run build after changes to verify no SSR errors

## Troubleshooting

- If build fails, check `pnpm-lock.yaml` version matches pnpm 9.x
- `lastUpdated` requires git history — CI uses `fetch-depth: 0`
- Base path `/blog/` means local preview may need `--base /blog/` flag
- Cache issues: delete `.cache/` directory
