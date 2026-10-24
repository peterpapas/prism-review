export async function syncExternalId(id, externalId, store) {
  const count = await store.update(id, { externalId });
  if (count === 0) throw new Error('not found');
  return { ok: true };
}
