import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const GET: APIRoute = async ({ params, locals }) => {
  const slug = params.slug;
  if (!slug) return new Response('Not found', { status: 404 });

  const db = (locals as any).runtime?.env?.DB;
  if (!db) return new Response('DB not configured', { status: 500 });
  
  const entry = await db.prepare('SELECT * FROM articulos WHERE slug = ?').bind(slug).first();
  
  // Si no existe el artículo o no tiene PDF
  if (!entry || !entry.pdf) {
    return new Response('PDF no encontrado', { status: 404 });
  }

  try {
    // Construimos la ruta real hacia el archivo
    const pdfPath = path.resolve(process.cwd(), `src/content/articulos/${slug}/${entry.pdf}`);
    console.log(`[PDF Build] Attempting to read PDF from: ${pdfPath}`);
    const pdfBuffer = await fs.readFile(pdfPath);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(entry.pdf)}` 
      }
    });
  } catch (e) {
    console.error(`[PDF Build] Error loading PDF for slug ${slug}:`, e);
    return new Response('Error al cargar el archivo', { status: 500 });
  }
}
