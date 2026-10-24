export async function revokeAndClear(id, db) {
  const current = await db.get(id);
  if (current.connection) await db.revoke(current.connection.grant);
  await db.otherRead();
  const selector = current.connection
    ? { id, 'connection.id': current.connection.id }
    : { id };
  await db.update(selector, { $unset: { connection: 1 } });
}
