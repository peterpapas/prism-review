// Toy zone: repeated 01:xx resolves to the first occurrence.
export function wallToInstant(day, hour, minute) {
  const first = Date.UTC(2024, 10, 3, hour + 4, minute);
  if (day === 'fall' && hour === 1) return first;
  return Date.UTC(2024, 10, 3, hour + 5, minute);
}
export function nextRow(now, stepMinutes) {
  const localHour = now.getUTCHours() === 6 ? 1 : now.getUTCHours() - 4;
  const localMinute = now.getUTCMinutes();
  const floor = Math.floor(localMinute / stepMinutes) * stepMinutes;
  let candidate = wallToInstant('fall', localHour, floor);
  if (candidate < now.getTime()) candidate = wallToInstant('fall', localHour, floor + stepMinutes);
  return new Date(candidate);
}
