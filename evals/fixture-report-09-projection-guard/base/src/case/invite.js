export async function canInvite(id, db) {
  const project = await db.findOne(id, { name: 1 });
  if (!project) return false;
  if (project.accessType === 'invite-only') return false;
  return true;
}
