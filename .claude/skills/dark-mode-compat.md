---
name: dark-mode-compat
description: Ensure new or modified UI elements have dark mode CSS overrides
autoInvoke:
  - pattern: "todo-prioritizer.html"
---

# Dark Mode Compatibility

When adding or modifying UI elements in `todo-prioritizer.html`, ensure dark mode works correctly.

## How dark mode works
- Dark mode uses a `body.dark-mode` CSS class toggle (not Tailwind `dark:` variants)
- All dark mode styles are CSS overrides in the `<style>` block using `body.dark-mode .class-name` selectors with `!important`
- The toggle state is persisted to localStorage

## Required steps when touching UI

1. **Check which Tailwind classes you're using** — any of these need dark mode overrides:
   - Backgrounds: `bg-white`, `bg-slate-50`, `bg-slate-200`, `bg-brand-50`
   - Borders: `border-slate-200`, `border-slate-300`, `border-slate-100`
   - Text: `text-slate-800`, `text-slate-700`, `text-slate-600`, `text-slate-500`, `text-slate-400`
   - Shadows: `shadow-card`, `shadow-card-hover`, `shadow-panel`
   - Hover states: `hover:bg-slate-200`, `hover:bg-slate-100`, `hover:bg-brand-50`

2. **If using an already-mapped class**, no new CSS needed — the existing override handles it.

3. **If introducing a NEW Tailwind class** not in the list above, add a corresponding `body.dark-mode .new-class` override to the dark mode section in `<style>`.

## Color mapping reference
| Light mode | Dark mode equivalent |
|---|---|
| `bg-white` / `#ffffff` | `#1e293b` (slate-800) |
| `bg-slate-50` / `#f8fafc` | `#0f172a` (slate-900) |
| `bg-slate-200` | `#334155` (slate-700) |
| `text-slate-800` | `#e2e8f0` (slate-200) |
| `text-slate-700` | `#cbd5e1` (slate-300) |
| `text-slate-600/500` | `#94a3b8` (slate-400) |
| `border-slate-200` | `#334155` (slate-700) |
| `border-slate-300` | `#475569` (slate-600) |
| Input backgrounds | `#0f172a` with `#475569` borders |
| Priority badge bg (red/amber/emerald-50) | Same hue at 10% opacity |
