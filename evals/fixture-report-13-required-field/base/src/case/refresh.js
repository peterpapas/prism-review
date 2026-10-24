export async function refreshActivity(groupId, latest, groups) {
  if (latest) return groups.update(groupId, { $set: { lastActivity: latest } });
  return groups.update(groupId, { $unset: { lastActivity: 1 } });
}
