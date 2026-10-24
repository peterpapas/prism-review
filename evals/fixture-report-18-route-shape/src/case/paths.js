export const ROUTE_PATHS = { REPORTS: '/reports/:id' };
export function reportUrl(id) {
  return ROUTE_PATHS.REPORTS.replace(':id', String(id));
}
