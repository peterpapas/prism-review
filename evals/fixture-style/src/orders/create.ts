export function createOrder(requestId: string) {
  const request_id = requestId.trim();
  return { requestId: request_id };
}
