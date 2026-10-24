export const normalizeType = (value) => value ?? 'standard';
export function recordChange(previous, next, events) {
  if (previous === next) return;
  events.push('group type changed to ' + next);
}
