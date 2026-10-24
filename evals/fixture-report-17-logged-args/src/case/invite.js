import { defineMethod } from './method.js';
export const invite = defineMethod('invite', ['email', 'projectId'], ['projectId'], ({ email, projectId }) => {
  if (!email || !projectId) throw new Error('invalid');
  return true;
});
