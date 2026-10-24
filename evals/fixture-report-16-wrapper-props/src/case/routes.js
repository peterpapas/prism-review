import { withParams } from './wrapper.js';
export const route = { path: '/projects/:projectId', Page: withParams(() => import('./page.js')) };
