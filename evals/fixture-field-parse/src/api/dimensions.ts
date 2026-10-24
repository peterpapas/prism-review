// Final revision: reject partial numeric tokens before parsing.
export function parseDimension(raw: string): number | null {
  const digitsOnly = /^\d+$/;
  if (!digitsOnly.test(raw)) return null;
  const value = parseInt(raw, 10);
  return Number.isFinite(value) && value >= 1 && value <= 20_000 ? value : null;
}
