// src/lib/d1Content.ts
// A wrapper to emulate Astro Content Collections over Cloudflare D1

function parseJson(str: string) {
	try {
		return JSON.parse(str) || [];
	} catch(e) {
		return [];
	}
}

function adaptRecord(record: any) {
  // Mimic the structure of Astro CollectionEntry
  return {
    id: record.slug,
    slug: record.slug,
    body: record.content,
    collection: 'unknown',
    data: {
      ...record,
      pubDate: new Date(record.pubDate),
      temas: parseJson(record.temas),
      tags: parseJson(record.tags),
      author: record.author_slug || record.author,
    }
  };
}

export async function getCollection(db: any, collectionName: string) {
  if (!db) return [];
  const query = `SELECT * FROM ${collectionName} ORDER BY pubDate DESC`;
  try {
    const { results } = await db.prepare(query).all();
    return results.map(adaptRecord);
  } catch (e) {
    console.error(`Error fetching collection ${collectionName}:`, e);
    return [];
  }
}

export async function getEntry(db: any, collectionName: string, slug: string) {
  if (!db) return null;
  const query = `SELECT * FROM ${collectionName} WHERE slug = ?`;
  try {
    const record = await db.prepare(query).bind(slug).first();
    return record ? adaptRecord(record) : null;
  } catch (e) {
    console.error(`Error fetching entry ${collectionName}/${slug}:`, e);
    return null;
  }
}
