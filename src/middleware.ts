import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Protect /admin routes (except login) and /api/admin routes
  const isAdminRoute = path.startsWith('/admin') && !path.startsWith('/admin/login');
  const isApiAdminRoute = path.startsWith('/api/admin');

  if (isAdminRoute || isApiAdminRoute) {
    const session = context.cookies.get('admin_session');
    
    if (!session || session.value !== 'authenticated') {
      if (isApiAdminRoute) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return context.redirect('/admin/login');
    }

    // Assign mock user data since we just do simple auth for now
    context.locals.user = { id: 1, username: 'admin' };
  }

  return next();
});
