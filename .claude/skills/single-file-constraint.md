---
name: single-file-constraint
description: Enforce single-file architecture when adding features or refactoring
autoInvoke:
  - keyword: "new file"
  - keyword: "separate file"
  - keyword: "extract"
  - keyword: "refactor"
---

# Single-File Architecture Constraint

This app is intentionally a single-file React application (`todo-prioritizer.html`). All code lives in one HTML file with no build step.

## Rules

1. **Never create separate JS, CSS, or component files** — all React components, styles, and logic stay in `todo-prioritizer.html`
2. **No build tools** — no webpack, vite, esbuild, or similar. The app uses CDN scripts (React, Babel standalone, Tailwind)
3. **No npm/package.json** — all dependencies are loaded via CDN `<script>` tags
4. **Styles go in the `<style>` block** or as Tailwind utility classes inline
5. **New components** are defined as functions in the same `<script type="text/babel">` block

## Why
This keeps the app simple, portable, and deployable as a single static file with zero build configuration. It can be opened directly in a browser or served from any static host.
