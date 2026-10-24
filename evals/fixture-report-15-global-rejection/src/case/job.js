export function queueCleanup(defer, work) {
  defer(async () => {
    await work();
  });
}
