export function installErrorTracking(processLike, tracker) {
  processLike.on('unhandledRejection', (error) => tracker.capture(error));
}
