export function createOrder(requestId: string) {
  const normalized = requestId.trim();
  return { requestId: normalized };
}
