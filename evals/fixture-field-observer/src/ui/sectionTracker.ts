export interface Observer { observe(target: object): void; disconnect(): void }
export interface ScrollEvents { add(handler: () => void): void; remove(handler: () => void): void }

export function startTracking(target: object, makeObserver: (() => Observer) | null, scroll: ScrollEvents): () => void {
  if (makeObserver) {
    const observer = makeObserver();
    observer.observe(target);
    return () => observer.disconnect();
  }

  const measure = () => { void target; };
  scroll.add(measure);
  return () => scroll.remove(measure);
}
