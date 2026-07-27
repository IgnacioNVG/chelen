import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, cookies, redirect, locals }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString();
  const password = formData.get('password')?.toString();

  if (!username || !password) {
    return redirect('/admin/login?error=true');
  }

  try {
    // In Astro with Cloudflare adapter, D1 database is available via locals or env
    // Assuming `env.DB` is configured in wrangler.json and Astro Cloudflare adapter
    const env = (locals as any).runtime?.env;
    if (!env || !env.DB) {
      console.error('Database binding not found.');
      return redirect('/admin/login?error=true');
    }

    const db = env.DB;
    
    // We should use bcrypt or similar, but for this simple setup we can use a basic check
    // or Web Crypto API. For now, let's just query the DB.
    const user = await db.prepare('SELECT * FROM users WHERE username = ?')
                         .bind(username)
                         .first();

    // WARNING: In production, use a proper hashing library (e.g. bcryptjs)
    // Since we are building a fast MVP, let's assume password_hash is just the password for now,
    // OR it's a fixed admin.
    if (!user || user.password_hash !== password) {
      // Allow a fallback default admin if no users exist
      const userCount = await db.prepare('SELECT count(*) as c FROM users').first('c');
      if (userCount === 0 && username === 'admin' && password === 'admin123') {
        // First login: create the admin user
        await db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
                .bind('admin', 'admin123')
                .run();
      } else {
         return redirect('/admin/login?error=true');
      }
    }

    // Set a session cookie
    cookies.set('admin_session', 'authenticated', {
      path: '/',
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return redirect('/admin');

  } catch (error) {
    console.error('Login error:', error);
    return redirect('/admin/login?error=true');
  }
};
