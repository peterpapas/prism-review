Draft 1 src/ui/sectionTracker.ts:7 — Invalid. The observer branch returns `observer.disconnect()` at src/ui/sectionTracker.ts:8; the fallback also removes its listener at src/ui/sectionTracker.ts:13. The caller invokes the returned cleanup at src/ui/sectionView.ts:5. Both allocated subscriptions are released.

Suggested comments: none.
