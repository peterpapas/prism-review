// Earlier implementation: strict integer conversion, but no explicit token check.
export function parseDimension(raw: string): number | null {
  const value = Number(raw);
  return Number.isInteger(value) && value >= 1 && value <= 20_000 ? value : null;
}
