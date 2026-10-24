export async function removeLink(id, provider, logger) {
  const response = await provider.delete(id);
  if (response.status === 200) return { removed: true };
  if (response.status >= 500) throw new Error('provider unavailable');
  const result = { status: 202, originalStatus: response.status };
  logger.error('manual repair needed', result);
  return result;
}
