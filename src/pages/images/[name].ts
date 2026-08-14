import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params, locals, request }) => {
  const name = params.name;
  if (!name) {
    return new Response('Not found', { status: 404 });
  }

  const env = (locals as any).runtime?.env;
  if (!env || !env.STORAGE) {
    return new Response('Storage not configured', { status: 500 });
  }

  const bucket = env.STORAGE;
  const object = await bucket.get(name);

  if (!object) {
    return new Response('Image not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  
  // Optional cache control
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new Response(object.body, {
    headers,
  });
};
