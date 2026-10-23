export const requireAuth = (handler: (req: any) => unknown) => (req: any) => {
  if (!req.user) throw new Error('Unauthorized');
  return handler(req);
};
