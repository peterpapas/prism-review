import { startTracking, type Observer, type ScrollEvents } from './sectionTracker.ts';

export function mountSection(target: object, makeObserver: (() => Observer) | null, scroll: ScrollEvents): () => void {
  const stop = startTracking(target, makeObserver, scroll);
  return () => stop();
}
