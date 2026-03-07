# To Do Prioritizer

A task prioritization tool that scores your to-dos by urgency, importance, and effort — then ranks them so you know what to tackle first. Includes a confetti celebration when you complete everything.

## Features

- **Smart scoring** — Each task gets a priority score based on deadline urgency, importance (1-5), and effort (1-5)
- **Adjustable weights** — Sliders for urgency, importance, and effort that always sum to 100%
- **Presets** — Balanced, Deadline-driven, Impact-first, and Quick wins
- **Auto-categorization** — Tasks sort into High, Medium, and Low priority sections based on score
- **Reasoning** — Each scored task shows why it ranked the way it did
- **Progress tracking** — Completion counter and progress bar
- **Celebration** — Confetti animation when all tasks are done

## Scoring Formula

```
score = (urgency × w1) + (importance × w2) + ((6 - effort) × w3)
```

- Urgency: Today (5) → No deadline (1)
- Importance: 1–5
- Effort: 1–5 (lower effort = higher score)
- Score 3.5–5.0 = High | 2.0–3.4 = Medium | 0.0–1.9 = Low

## Usage

Open `todo-prioritizer.html` in your browser. That's it.

```bash
git clone https://github.com/NSurawski/todo-prioritizer-app.git
open todo-prioritizer-app/todo-prioritizer.html
```

## Tech Stack

- React 18 (via CDN)
- Tailwind CSS (via CDN)
- No build step required

## License

Free to use, modify, and share.
