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
	'Filosofía e ideas',
] as const;

export type Tema = (typeof TEMAS)[number];

import { authorSlug } from './authorSlug';

/** Slug URL-safe de un tema. Ej: "Izquierda y socialismo" → "izquierda-y-socialismo". */
export const temaSlug = (tema: string): string => authorSlug(tema);

/** Mapa slug → tema canónico, para resolver rutas /tema/[slug]. */
export const TEMA_BY_SLUG = new Map<string, Tema>(
	TEMAS.map((tema) => [temaSlug(tema), tema]),
);
