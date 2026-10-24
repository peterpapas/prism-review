export async function redeemToken(token, collection) {
  if (typeof token !== 'string' || token.length === 0) return null;
  const row = await collection.findOneAndDelete({ token, expiresAt: { $gt: Date.now() } });
  return row?.userId ?? null;
}
