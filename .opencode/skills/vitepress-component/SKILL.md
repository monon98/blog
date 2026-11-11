---
name: vitepress-component
description: Use when creating or editing Vue components in src/components/ or native HTML demos in src/public/html/. Covers grouped subdirectories (article/visual/interview/widget), component patterns, Vite aliases, and demo showcase integration.
---

# VitePress Component Development

## Component locations

| Path | Purpose |
|------|---------|
| `src/components/<group>/` | Vue SFC components, grouped by article/ visual/ interview/ widget/ |
| `src/public/html/<group>/` | Native HTML demos — copied into dist, embeddable via `HtmlFrame` iframe |
| `src/showcase/` | Markdown pages that embed demos (`index.md` + one `<group>.md` per group) |

## Existing components

Grouped under `src/components/<group>/`:

- `article/visibility-detect.vue` — visibilitychange 后台检测
- `visual/` — snowflakes / random-scroll / hover-button / typewriter / ripple-button / magnetic-button / skeleton
- `interview/` — debounce-throttle / event-loop / virtual-list
- `widget/` — draw-canvas / info / toast / context-menu / infinite-scroll

## Vite aliases

Configured in `.vitepress/config.mts` under `vite.resolve.alias`:

- `@` → `/` (root of `srcDir`, i.e. `src/`)
- `@components` → `/components` (i.e. `src/components/`)

Use these in imports:
```vue
<script setup>
import Info from '@components/widget/info.vue'
</script>
```

## Adding a new component

1. Create `<name>.vue` in `src/components/<group>/` (group = article / visual / interview / widget)
2. Import in markdown pages using Vite alias paths (`@components/<group>/<name>.vue`)
3. For showcase demos, append to the group page `src/showcase/<group>.md` and register it in `src/showcase/index.md`

## HTML demos

Native HTML demos go in `src/public/html/<group>/` (ASCII kebab-case, single-file self-contained) so they are copied into `dist/` and can be embedded with `HtmlFrame`.

> 要把原生 HTML 以 iframe 内嵌到展示页（线上可用），HTML 必须放 `src/public/html/` 并用 `HtmlFrame` 组件内嵌。完整规范与模板见 `demo-showcase` skill。

## Conventions

- Use Vue 3 `<script setup>` syntax
- No external UI library — components are self-contained
- Content language: Chinese (中文) for any user-facing text in components
