/**
 * Convierte un nombre de autor en un slug URL-safe.
 * Ej: "Claudio Valenzuela Ceballos" → "claudio-valenzuela-ceballos"
 */
export function authorSlug(name: string): string {
	return name
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // quitar tildes
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** Normaliza referencias de autor (string o `{ id }` de Astro Content). */
export function resolveAuthorRef(
	author: string | { id: string } | undefined,
): string | undefined {
	if (!author) return undefined;
	return typeof author === 'string' ? author : author.id;
}
