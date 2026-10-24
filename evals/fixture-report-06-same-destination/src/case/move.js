export async function moveContact(oldEmail, newEmail, crm) {
  const sourceId = await crm.find(oldEmail);
  const targetId = await crm.upsert(newEmail);
  if (sourceId === targetId) return targetId;
  await crm.copyAssociations(sourceId, targetId);
  await crm.deleteAssociations(sourceId);
  await crm.clearRole(sourceId);
  return targetId;
}
