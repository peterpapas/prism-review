export async function receive(channelId, secret, db) {
  const profile = await db.profiles.findOne({ channelId });
  if (!profile || profile.secret !== secret) return false;
  return true;
}
