Draft 1 src/case/paths.js:3 — Invalid. ROUTE_PATHS.REPORTS is already a string at src/case/paths.js:1, so replace at src/case/paths.js:3 works. REPORTS.path would be undefined and make the proposed fix crash. Separately, spec/path.fixture.js:3 has a weak fallback assertion.

Suggested comments: none.
