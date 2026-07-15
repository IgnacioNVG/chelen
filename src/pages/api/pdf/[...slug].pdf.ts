import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function getStaticPaths() {
  const articulos = await getCollection('articulos');
  return articulos
    .filter(a => !!a.data.pdf)
    .map(post => ({
      params: { slug: post.id },
    }));
}

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response('Not found', { status: 404 });

  const entry = await getEntry('articulos', slug);
  
  // Si no existe el artículo o no tiene PDF definido en Keystatic
  if (!entry || !entry.data.pdf) {
    return new Response('PDF no encontrado', { status: 404 });
  }

  try {
    // Construimos la ruta real hacia el archivo en colocation
    // entry.data.pdf contiene el nombre del archivo (ej: 'documento.pdf')
    const pdfPath = path.resolve(process.cwd(), `src/content/articulos/${slug}/${entry.data.pdf}`);
    console.log(`[PDF Build] Attempting to read PDF from: ${pdfPath}`);
    const pdfBuffer = await fs.readFile(pdfPath);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        // 'inline' permite que se vea en el visor. Usa 'attachment' si prefieres que se descargue directo.
        'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(entry.data.pdf)}` 
      }
    });
  } catch (e) {
    console.error(`[PDF Build] Error loading PDF for slug ${slug}:`, e);
    return new Response('Error al cargar el archivo', { status: 500 });
  }
}
