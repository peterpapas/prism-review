export function Page({ projectId }) {
  return projectId ? 'loaded ' + projectId : 'missing';
}
