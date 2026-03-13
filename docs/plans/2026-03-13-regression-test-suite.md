# Regression Test Suite — Copilot CLI Guide

> **For Copilot:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create and execute 200 regression tests covering navigation, layout, UI, typography, responsive, dark mode, accessibility, content, and UX — fixing all issues found.

**Architecture:** Tests stored in SQL `tests` table with status tracking. Execute via Playwright on live site (https://copilot-cli-guide.vercel.app/). Fix issues in source code, rebuild, push, verify.

**Tech Stack:** Playwright MCP (browser automation), React/Vite/Tailwind (source), Vercel (deployment)

---

## Execution Strategy

### Phase 1: Critical Layout & Table Fixes (FIRST)
Run all critical+high Layout tests (LAY-01 through LAY-30) since user's screenshot shows table alignment issues. Fix all problems found before moving on.

### Phase 2: Critical Navigation & Content
Run Navigation (NAV) and Content (CNT) critical tests to ensure core functionality works.

### Phase 3: Responsive & Dark Mode
Test responsive breakpoints (375px, 768px, 1024px, 1440px) and dark mode across all pages.

### Phase 4: UI Components & Typography
Test interactive elements, modals, search, filters, font rendering.

### Phase 5: Accessibility & UX Polish
Test ARIA, keyboard nav, focus management, visual polish.

### After Each Fix
1. `cd app && npm run build`
2. `git add -A && git commit && git push origin master`
3. Wait ~40s for Vercel deploy
4. Re-test on live site to verify fix

### Test Status Values
- `pending` — not yet tested
- `pass` — tested and working correctly
- `fail` — tested and found broken
- `fixed` — was broken, now fixed and verified
- `skip` — not applicable or can't test

### SQL Tracking
```sql
-- Get next tests to run
SELECT id, title FROM tests WHERE status = 'pending' AND priority = 'critical' LIMIT 10;

-- Mark test result
UPDATE tests SET status = 'pass', tested_at = CURRENT_TIMESTAMP WHERE id = 'LAY-01';
UPDATE tests SET status = 'fail', tested_at = CURRENT_TIMESTAMP, fix_description = 'description' WHERE id = 'LAY-02';

-- Progress check
SELECT status, COUNT(*) FROM tests GROUP BY status;
```
