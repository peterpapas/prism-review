export function createGroups() {
  return { update(_id, patch) {
    if (patch.$unset?.lastActivity) throw new Error('lastActivity is required');
    if (!patch.$set?.lastActivity) throw new Error('lastActivity is required');
    return patch.$set.lastActivity;
  } };
}
