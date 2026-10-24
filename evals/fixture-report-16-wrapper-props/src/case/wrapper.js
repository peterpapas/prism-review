export function withParams(loadPage) {
  return async function render(routeParams) {
    const Page = (await loadPage()).Page;
    return Page({ ...routeParams });
  };
}
