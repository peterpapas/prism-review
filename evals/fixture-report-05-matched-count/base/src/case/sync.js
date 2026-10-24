export async function syncExternalId(id, externalId, store) {
  await store.update(id, { externalId });
  return { ok: true };
}
