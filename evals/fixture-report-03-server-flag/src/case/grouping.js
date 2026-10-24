export async function createGroups(user, input, store) {
  if (!user || (!user.admin && !user.coordinator)) throw new Error('forbidden');
  if (input.isTest) return { preview: true, groups: [] };
  return store.insert({ groups: input.groups });
}
