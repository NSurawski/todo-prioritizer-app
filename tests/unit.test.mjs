/**
 * Unit tests for pure logic functions from todo-prioritizer.html
 * Run with: node --test tests/unit.test.mjs
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

// --- Functions under test (duplicated from todo-prioritizer.html) ---

function getUrgencyFromDate(dueDate) {
  if (!dueDate) return 1;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const days = Math.floor((due - today) / 86400000);
  if (days <= 0) return 5;
  if (days <= 3) return 4;
  if (days <= 7) return 3;
  if (days <= 30) return 2;
  return 1;
}

function getDueDateLabel(dueDate) {
  if (!dueDate) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + "T00:00:00");
  const days = Math.floor((due - today) / 86400000);
  if (days < 0) return { text: `${-days}d overdue`, color: "text-red-500 font-semibold" };
  if (days === 0) return { text: "Due today", color: "text-amber-500 font-semibold" };
  if (days === 1) return { text: "Due tomorrow", color: "text-amber-500" };
  if (days <= 7) return { text: `Due in ${days}d`, color: "text-slate-500" };
  return { text: due.toLocaleDateString("en-US", { month: "short", day: "numeric" }), color: "text-slate-400" };
}

function calcScore(task, weights) {
  const [w1, w2, w3] = weights.map(w => w / 100);
  const urgency = getUrgencyFromDate(task.dueDate);
  return urgency * w1 + task.importance * w2 + (6 - task.effort) * w3;
}

function scoreToLabel(score) {
  if (score >= 3.5) return "high";
  if (score >= 2.0) return "med";
  return "low";
}

function generateReasoning(task, weights) {
  const [w1, w2, w3] = weights.map(w => w / 100);
  const uScore = getUrgencyFromDate(task.dueDate) * w1;
  const iScore = task.importance * w2;
  const eScore = (6 - task.effort) * w3;
  const scores = [
    { label: "Due soon", val: uScore },
    { label: "High impact", val: iScore },
    { label: "Quick win", val: eScore },
  ];
  scores.sort((a, b) => b.val - a.val);
  if (scores[0].val === scores[1].val) {
    return scores[0].label + " + " + scores[1].label.toLowerCase();
  }
  return scores[0].label + " dominates priority";
}

// --- Helper ---

function dateFromToday(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// --- Tests ---

describe("getUrgencyFromDate", () => {
  test("no due date → 1", () => {
    assert.equal(getUrgencyFromDate(""), 1);
    assert.equal(getUrgencyFromDate(null), 1);
    assert.equal(getUrgencyFromDate(undefined), 1);
  });

  test("overdue → 5", () => {
    assert.equal(getUrgencyFromDate(dateFromToday(-1)), 5);
    assert.equal(getUrgencyFromDate(dateFromToday(-30)), 5);
  });

  test("due today → 5", () => {
    assert.equal(getUrgencyFromDate(dateFromToday(0)), 5);
  });

  test("1–3 days away → 4", () => {
    assert.equal(getUrgencyFromDate(dateFromToday(1)), 4);
    assert.equal(getUrgencyFromDate(dateFromToday(3)), 4);
  });

  test("4–7 days away → 3", () => {
    assert.equal(getUrgencyFromDate(dateFromToday(4)), 3);
    assert.equal(getUrgencyFromDate(dateFromToday(7)), 3);
  });

  test("8–30 days away → 2", () => {
    assert.equal(getUrgencyFromDate(dateFromToday(8)), 2);
    assert.equal(getUrgencyFromDate(dateFromToday(30)), 2);
  });

  test("31+ days away → 1", () => {
    assert.equal(getUrgencyFromDate(dateFromToday(31)), 1);
    assert.equal(getUrgencyFromDate(dateFromToday(365)), 1);
  });
});

describe("getDueDateLabel", () => {
  test("no due date → null", () => {
    assert.equal(getDueDateLabel(""), null);
    assert.equal(getDueDateLabel(null), null);
  });

  test("overdue shows 'Xd overdue' with red styling", () => {
    const label = getDueDateLabel(dateFromToday(-3));
    assert.equal(label.text, "3d overdue");
    assert.equal(label.color, "text-red-500 font-semibold");
  });

  test("due today", () => {
    const label = getDueDateLabel(dateFromToday(0));
    assert.equal(label.text, "Due today");
    assert.equal(label.color, "text-amber-500 font-semibold");
  });

  test("due tomorrow", () => {
    const label = getDueDateLabel(dateFromToday(1));
    assert.equal(label.text, "Due tomorrow");
    assert.equal(label.color, "text-amber-500");
  });

  test("2–7 days shows 'Due in Nd'", () => {
    const label = getDueDateLabel(dateFromToday(5));
    assert.equal(label.text, "Due in 5d");
    assert.equal(label.color, "text-slate-500");
  });

  test("8+ days shows formatted date with muted color", () => {
    const label = getDueDateLabel(dateFromToday(30));
    assert.equal(label.color, "text-slate-400");
    assert.ok(label.text.length > 0, "should have non-empty date text");
  });
});

describe("calcScore", () => {
  const balanced = [40, 40, 20];

  test("max inputs → 5.0", () => {
    // overdue (urgency=5), importance=5, effort=1 → 5*0.4 + 5*0.4 + 5*0.2 = 5.0
    const task = { dueDate: dateFromToday(-1), importance: 5, effort: 1 };
    assert.equal(calcScore(task, balanced), 5.0);
  });

  test("min inputs → 1.0", () => {
    // no date (urgency=1), importance=1, effort=5 → 1*0.4 + 1*0.4 + 1*0.2 = 1.0
    const task = { dueDate: "", importance: 1, effort: 5 };
    assert.equal(calcScore(task, balanced), 1.0);
  });

  test("mid inputs → 2.2", () => {
    // urgency=1, importance=3, effort=3 → 0.4 + 1.2 + 0.6 = 2.2
    const task = { dueDate: "", importance: 3, effort: 3 };
    assert.ok(Math.abs(calcScore(task, balanced) - 2.2) < 0.0001);
  });

  test("deadline-driven preset weights urgency heavily", () => {
    const deadlineDriven = [60, 30, 10];
    const urgentTask = { dueDate: dateFromToday(-1), importance: 1, effort: 5 };
    const relaxedTask = { dueDate: "", importance: 5, effort: 1 };
    // urgentTask: 5*0.6 + 1*0.3 + 1*0.1 = 3.4
    // relaxedTask: 1*0.6 + 5*0.3 + 5*0.1 = 0.6 + 1.5 + 0.5 = 2.6
    assert.ok(calcScore(urgentTask, deadlineDriven) > calcScore(relaxedTask, deadlineDriven));
  });

  test("quick-wins preset elevates low-effort tasks", () => {
    const quickWins = [20, 30, 50];
    const easyTask = { dueDate: "", importance: 3, effort: 1 };
    const hardTask = { dueDate: "", importance: 3, effort: 5 };
    assert.ok(calcScore(easyTask, quickWins) > calcScore(hardTask, quickWins));
  });
});

describe("scoreToLabel", () => {
  test("high: score >= 3.5", () => {
    assert.equal(scoreToLabel(3.5), "high");
    assert.equal(scoreToLabel(4.0), "high");
    assert.equal(scoreToLabel(5.0), "high");
  });

  test("med: 2.0 <= score < 3.5", () => {
    assert.equal(scoreToLabel(2.0), "med");
    assert.equal(scoreToLabel(3.0), "med");
    assert.equal(scoreToLabel(3.49), "med");
  });

  test("low: score < 2.0", () => {
    assert.equal(scoreToLabel(1.9), "low");
    assert.equal(scoreToLabel(1.0), "low");
    assert.equal(scoreToLabel(0), "low");
  });

  test("boundary values", () => {
    assert.equal(scoreToLabel(3.5), "high");
    assert.equal(scoreToLabel(2.0), "med");
    // just below thresholds
    assert.equal(scoreToLabel(3.4999), "med");
    assert.equal(scoreToLabel(1.9999), "low");
  });
});

describe("generateReasoning", () => {
  test("urgency is dominant factor", () => {
    // overdue task with urgency-heavy weights → "Due soon dominates priority"
    const task = { dueDate: dateFromToday(-1), importance: 1, effort: 5 };
    const weights = [60, 20, 20];
    // uScore=5*0.6=3.0, iScore=1*0.2=0.2, eScore=1*0.2=0.2
    assert.equal(generateReasoning(task, weights), "Due soon dominates priority");
  });

  test("importance is dominant factor", () => {
    const task = { dueDate: "", importance: 5, effort: 5 };
    const weights = [20, 70, 10];
    // uScore=1*0.2=0.2, iScore=5*0.7=3.5, eScore=1*0.1=0.1
    assert.equal(generateReasoning(task, weights), "High impact dominates priority");
  });

  test("effort (quick win) is dominant factor", () => {
    const task = { dueDate: "", importance: 1, effort: 1 };
    const weights = [20, 30, 50];
    // uScore=1*0.2=0.2, iScore=1*0.3=0.3, eScore=5*0.5=2.5
    assert.equal(generateReasoning(task, weights), "Quick win dominates priority");
  });

  test("tie shows both top factors", () => {
    const task = { dueDate: "", importance: 1, effort: 5 };
    const weights = [50, 50, 0];
    // uScore=1*0.5=0.5, iScore=1*0.5=0.5, eScore=1*0=0
    assert.equal(generateReasoning(task, weights), "Due soon + high impact");
  });
});
