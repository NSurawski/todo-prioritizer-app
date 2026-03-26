# Todo Prioritizer

Single-file React app (`todo-prioritizer.html`) using Tailwind CDN and Babel standalone.
No build step, no separate JS/CSS files — everything lives in one HTML file.

## Tech Stack
- React 18 (via CDN)
- Tailwind CSS (via CDN with custom config)
- Babel standalone (for JSX in-browser)
- localStorage for persistence

## Conventions
- Use Tailwind utility classes for all styling
- Persist user state (tasks, weights, preferences) to localStorage
- Keep everything in the single HTML file
- Dark mode is implemented via CSS overrides with a `body.dark-mode` class — when adding new UI, ensure dark mode compatibility by using existing Tailwind color classes that have dark overrides (e.g., `bg-white`, `border-slate-200`, `text-slate-700`)
- Follow existing commit message style: `feat:`, `fix:`, `style:`, `docs:` prefixes

## Git Workflow
- Work directly on `source` branch for small changes (single-feature commits)
- Use feature branches with git worktrees only for large features that touch multiple areas or require parallel development
- When using worktrees: branch off `source`, develop in the worktree, merge back when complete

## Architecture
- Scoring formula: `urgency * w1 + importance * w2 + (6 - effort) * w3` where weights sum to 100%
- Priority levels: high (>= 3.5), med (>= 2.0), low (< 2.0)
- Task statuses: `unprioritized`, `active`, `completed`
- Urgency is auto-calculated from due date (not manually set)
