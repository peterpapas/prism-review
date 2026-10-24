export function navigateInClient(path, render) {
  history.pushState({}, '', path);
  render(path); // no full-page HTML response or new server head
}
