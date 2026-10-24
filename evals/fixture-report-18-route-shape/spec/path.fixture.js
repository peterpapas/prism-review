import { reportUrl, ROUTE_PATHS } from '../src/case/paths.js';
export function weakTest() {
  return reportUrl('7').includes(ROUTE_PATHS.REPORTS.path ? ROUTE_PATHS.REPORTS.path : '/reports');
}
