import { addActivity } from './activity.js';
export function editMessage(group, originalMessage, now) {
  addActivity(group, originalMessage, now);
}
