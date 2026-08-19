---
name: vitepress-component
description: Use when creating or editing Vue components in src/components/ or standalone HTML demos in src/html/. Covers component patterns, Vite aliases, and demo showcase integration.
---

# VitePress Component Development

## Component locations

| Path | Purpose |
|------|---------|
| `src/components/` | Vue SFC components for VitePress pages |
| `src/html/` | Standalone HTML demo files (not routed by VitePress) |
| `src/showcase/` | Markdown pages that embed demos |

## Existing components

- `draw-canvas.vue` — Canvas drawing component
- `hover-button.vue` — Hover effect button
- `info.vue` — Information display
- `random-scroll.vue` — Random scroll effect
- `snowflakes.vue` — Snowflake animation

## Vite aliases

Configured in `.vitepress/config.mts` under `vite.resolve.alias`:

- `@` → `/` (root of `srcDir`, i.e. `src/`)
- `@components` → `/components` (i.e. `src/components/`)

Use these in imports:
```vue
<script setup>
import Info from '@components/info.vue'
</script>
```

## Adding a new component

1. Create `<name>.vue` in `src/components/`
2. Import in markdown pages using Vite alias paths
3. For showcase demos, create a matching `src/showcase/<name>.md`

## HTML demos

`src/html/` files are standalone — they do not go through VitePress routing. They can reference components via `<script>` tags but are not part of the built site navigation.

## Conventions

- Use Vue 3 `<script setup>` syntax
- No external UI library — components are self-contained
- Content language: Chinese (中文) for any user-facing text in components
