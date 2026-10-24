export function isEnabledOnServer(flags, name) {
  return Boolean(flags[name]);
}
