export interface Observer { observe(target: object): void; disconnect(): void }

export function startTracking(target: object, makeObserver: () => Observer): () => void {
  const observer = makeObserver();
  observer.observe(target);
  return () => observer.disconnect();
}
