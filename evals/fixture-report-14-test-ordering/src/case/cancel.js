export async function cancel(all, sequence, notify) {
  if (all) await sequence.claim();
  await notify();
}
