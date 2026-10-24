[P2] src/case/callers.js:4 — Supported. addMember still passes the raw legacy type, so recordChange sees undefined versus standard and emits a false type-change message. The expectation in spec/case.fixture.js:4 encodes the bug; normalize the previous value there too.

Suggested comments: none.
