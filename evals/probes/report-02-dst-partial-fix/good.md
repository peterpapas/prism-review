Draft 1 src/case/schedule.js:13 — Reword. Spring-forward arithmetic is corrected, but the repeated fall-back hour still resolves 01:30 to its first occurrence; src/case/schedule.js:12-13 can return an instant before now. Add a repeated-hour test and advance until the candidate is at or after now.

Suggested comments: none.
