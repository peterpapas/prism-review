import { installErrorTracking } from './boot.js';
import { queueCleanup } from './job.js';
export function startServer(processLike, tracker, defer, work) {
  installErrorTracking(processLike, tracker);
  queueCleanup(defer, work);
}
