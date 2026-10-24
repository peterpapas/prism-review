export function createStore(rows) {
  return { update(id, patch) {
    const row = rows.get(id);
    if (!row) return 0;
    Object.assign(row, patch);
    return 1; // number of matched documents, including no-op matches
  } };
}
