import { startTracking, type Observer } from './sectionTracker.ts';

export function mountSection(target: object, makeObserver: () => Observer): () => void {
  const stop = startTracking(target, makeObserver);
  return () => stop();
}
