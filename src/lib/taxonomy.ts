/**
 * Vocabulario CONTROLADO de temas (ejes temáticos amplios).
 *
 * Es el nivel superior del sistema de etiquetas de dos niveles:
 *   - `temas`  → lista cerrada y compartida; sirve para clasificar y descubrir
 *                contenido ENTRE secciones (artículos, cartas, poemas...).
 *   - `tags`   → texto libre; descriptores específicos / cola larga
 *                (nombres propios, hechos puntuales: "Kast", "Isla Dawson").
 *
 * Esta constante es la ÚNICA fuente de verdad: la importan tanto
 * `keystatic.config.ts` (para el desplegable del CMS) como
 * `src/content.config.ts` (para validar el build). Editar aquí los actualiza
 * a ambos a la vez y evita que vuelvan a desincronizarse.
 *
 * Reglas al etiquetar:
 *   - Temas: máx. 3 por pieza. Si merece una página /tema/[slug], es tema.
 *   - Tags: no repetir nombres de temas ni de category.
 *   - Tags: nombres propios capitalizados; conceptos en minúscula salvo
 *     primera letra (ej. "Salud mental", "Estallido social").
 */
export const TEMAS = [
	'Política',
	'Izquierda y socialismo',
	'Economía',
	'Feminismos',
	'Educación',
	'Movimientos sociales',
	'Ultraderecha y democracia',
	'Historia y memoria',
	'Cultura',
	'Salud',
	'Internacional',
	'Teoría e ideas',
] as const;

export type Tema = (typeof TEMAS)[number];

/**
 * Vocabulario SUGERIDO de tags (cola larga). No es cerrado: sirve como guía
 * en el CMS y para normalizar el archivo. Agrupado por familia editorial.
 */
export const TAGS_SUGERIDOS = [
	// Lugar y contexto
	'Chile',
	'Política chilena',
	'Política latinoamericana',
	'Suecia',
	// Figuras e instituciones
	'Kast',
	'Gobierno',
	'Antonio Gramsci',
	'Nicos Poulantzas',
	'Aristóteles España',
	'Junaeb',
	// Conceptos teóricos
	'Neoliberalismo',
	'Marxismo',
	'Materialismo histórico',
	'Hegemonía cultural',
	'Fascismo',
	'Neofascismo',
	'Fascismo social',
	'Estatismo autoritario',
	'Socialismo democrático',
	'Anticapitalismo',
	'Socialdemocracia',
	'Lucha de clases',
	// Movimientos y eventos
	'Estallido social',
	'Mayo del 68',
	'Movimiento estudiantil',
	'Movimiento secundario',
	'Unidad Popular',
	'Renovación socialista',
	'Isla Dawson',
	// Temas transversales específicos
	'Cuidados',
	'Salud mental',
	'Violencia política',
	'Tomas',
	'Migración',
	'Fútbol',
	'Catolicismo',
	'Feminismo anticapitalista',
] as const;

/** Slugs de temas renombrados → slug actual (para redirects). */
export const TEMA_SLUG_REDIRECTS: Record<string, string> = {
	'filosofia-e-ideas': 'teoria-e-ideas',
};

import { authorSlug } from './authorSlug';

/** Slug URL-safe de un tema. Ej: "Izquierda y socialismo" → "izquierda-y-socialismo". */
export const temaSlug = (tema: string): string => authorSlug(tema);

/** Mapa slug → tema canónico, para resolver rutas /tema/[slug]. */
export const TEMA_BY_SLUG = new Map<string, Tema>(
	TEMAS.map((tema) => [temaSlug(tema), tema]),
);

const normalizeLabel = (value: string) => value.trim().toLowerCase();

/**
 * Valida que los tags no repitan temas ni la categoría de la pieza.
 * Usado en el build (content.config.ts) para detectar duplicaciones editoriales.
 */
export function validateEditorialTags(
	temas: readonly string[],
	tags: readonly string[],
	category?: string,
): string[] {
	const errors: string[] = [];
	const blocked = new Set([
		...temas.map(normalizeLabel),
		...(category ? [normalizeLabel(category)] : []),
	]);

	for (const tag of tags) {
		const normalized = normalizeLabel(tag);
		if (blocked.has(normalized)) {
			errors.push(
				`El tag «${tag}» duplica un tema o la categoría; usa solo el campo «temas».`,
			);
		}
	}

	return errors;
}

/** URL de descubrimiento para un tema canónico. */
export const temaHref = (tema: string): string => `/tema/${temaSlug(tema)}`;
