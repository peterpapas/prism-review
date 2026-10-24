// Drafted revision: range checks do not make parseInt consume the whole token.
export function parseDimension(raw: string): number | null {
  const value = parseInt(raw, 10);
  return Number.isFinite(value) && value >= 1 && value <= 20_000 ? value : null;
}
