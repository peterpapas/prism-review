export async function redeemToken(token, collection) {
  if (!token) return null;
  const row = await collection.findOneAndDelete({ token, expiresAt: { $gt: Date.now() } });
  return row?.userId ?? null;
}
