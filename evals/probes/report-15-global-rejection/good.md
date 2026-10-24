Draft 1 src/case/job.js:3 — Invalid as stated. src/case/server.js:4 invokes startup tracking before the job, and src/case/boot.js:2 registers unhandledRejection with the error tracker. The claim that this rejection has no handler is false. A log-only local catch would swallow failure; local context could be added without hiding it.

Suggested comments: none.
