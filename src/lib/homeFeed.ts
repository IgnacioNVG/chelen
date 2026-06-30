import { resolveAuthorRef } from '../lib/authorSlug';
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

export type FeedKind = 'articulo' | 'carta' | 'antologia' | 'poema';

export type FeedItem = {
	id: string;
	kind: FeedKind;
	title: string;
	description?: string;
	pubDate: Date;
	author?: string;
	/** Tipo de pieza (se muestra como etiqueta principal). */
	category: string;
	/** Ejes temáticos amplios (vocabulario controlado, ver lib/taxonomy.ts). */
	temas: string[];
	/** Descriptores específicos (cola larga). No deben repetir `category`. */
	tags: string[];
	href: string;
	image?: ImageMetadata;
	imageLayout: 'landscape' | 'portrait' | 'none';
};

export function buildArticuloItems(articulos: CollectionEntry<'articulos'>[]): FeedItem[] {
	return articulos.map((post) => ({
		id: `articulo-${post.id}`,
		kind: 'articulo',
		title: post.data.title,
		description: post.data.description,
		pubDate: post.data.pubDate,
		author: resolveAuthorRef(post.data.author),
		category: post.data.category,
		temas: post.data.temas,
		tags: post.data.tags,
		href: `/revista/articulos/${post.id}`,
		image: post.data.heroImage,
		imageLayout: post.data.heroImage ? 'landscape' : 'none',
	}));
}

export function buildCartaItems(cartas: CollectionEntry<'cartas'>[]): FeedItem[] {
	return cartas.map((carta) => ({
		id: `carta-${carta.id}`,
		kind: 'carta',
		title: carta.data.title,
		pubDate: carta.data.pubDate,
		author: resolveAuthorRef(carta.data.author),
		category: carta.data.category,
		temas: carta.data.temas,
		tags: carta.data.tags,
		href: `/revista/cartas/${carta.id}`,
		image: carta.data.heroImage,
		imageLayout: carta.data.heroImage ? 'portrait' : 'none',
	}));
}

export function buildPoemaItems(poemas: CollectionEntry<'poemas'>[]): FeedItem[] {
	return poemas
		.filter((poema) => !poema.data.antologia)
		.map((poema) => ({
			id: `poema-${poema.id}`,
			kind: 'poema',
			title: poema.data.title,
			pubDate: poema.data.pubDate,
			author: poema.data.author,
			category: poema.data.category,
			temas: poema.data.temas,
			tags: poema.data.tags,
			href: `/poemas/${poema.id}`,
			image: poema.data.heroImage,
			imageLayout: poema.data.heroImage ? 'portrait' : 'none',
		}));
}

export function buildAntologiaItems(
	antologias: CollectionEntry<'antologias'>[],
	poemas: CollectionEntry<'poemas'>[],
): FeedItem[] {
	return antologias.map((antologia) => {
		const count = poemas.filter((p) => p.data.antologia === antologia.id).length;
		return {
			id: `antologia-${antologia.id}`,
			kind: 'antologia',
			title: antologia.data.title,
			description: `${antologia.data.description} (${count} poema${count !== 1 ? 's' : ''})`,
			pubDate: antologia.data.pubDate,
			author: antologia.data.editor,
			category: antologia.data.category,
			temas: antologia.data.temas,
			tags: antologia.data.tags,
			href: `/poemas/antologia/${antologia.id}`,
			image: antologia.data.heroImage,
			imageLayout: antologia.data.heroImage ? 'portrait' : 'none',
		};
	});
}

export function mergeEditorialFeed(...groups: FeedItem[][]): FeedItem[] {
	return groups
		.flat()
		.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}

export function editionLabel(items: FeedItem[]): string {
	if (items.length === 0) return '';
	const latest = items.reduce((a, b) => (a.pubDate > b.pubDate ? a : b));
	return latest.pubDate.toLocaleDateString('es-CL', {
		month: 'long',
		year: 'numeric',
	});
}
