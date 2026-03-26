---
name: scoring-formula
description: Priority scoring formula context for task prioritization logic
autoInvoke:
  - keyword: "score"
  - keyword: "priority"
  - keyword: "weight"
  - keyword: "urgency"
  - keyword: "importance"
  - keyword: "effort"
  - keyword: "formula"
---

# Scoring Formula

## Formula
```
score = urgency * w1 + importance * w2 + (6 - effort) * w3
```
- Weights (`w1`, `w2`, `w3`) are percentages that must sum to 100%
- All inputs (urgency, importance, effort) are on a 1-5 scale
- Effort is inverted (`6 - effort`) so higher effort = lower score contribution

## Urgency calculation
Urgency is **auto-calculated from the due date**, not manually set:
- Overdue or due today: urgency = 5
- Due in 1-3 days: urgency = 4
- Due in 4-7 days: urgency = 3
- Due in 8-14 days: urgency = 2
- Due in 15+ days or no due date: urgency = 1

## Priority labels
Derived from the final score:
- **High**: score >= 3.5
- **Medium**: score >= 2.0
- **Low**: score < 2.0

## Weight presets
- Deadline-driven: urgency 50%, importance 30%, effort 20%
- Impact-first: urgency 20%, importance 50%, effort 30%
- Quick wins: urgency 20%, importance 30%, effort 50%
- Balanced: urgency 34%, importance 33%, effort 33%

## Important behaviors
- When weights change, **all active tasks must be re-scored** immediately (via `rescoreTasks`)
- When a task's due date changes, its urgency and score update accordingly
- Scores use timezone-safe local date formatting (not `toISOString()`)
