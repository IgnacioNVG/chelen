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
