export async function countActive(collection) {
  return collection.countDocuments({ active: true });
}
