import { resolveAuthorRef } from '../lib/authorSlug';
import type { ImageMetadata } from 'astro';

export type FeedKind = 'articulo' | 'carta' | 'antologia' | 'poema';

export type FeedItem = {
	id: string;
	kind: FeedKind;
	title: string;
	description?: string;
	pubDate: Date;
	author?: string;
	category: string;
	temas: string[];
	tags: string[];
	href: string;
	image?: string | ImageMetadata;
	imageLayout: 'landscape' | 'portrait' | 'none';
};

function parseJson(str: string): string[] {
	try {
		return JSON.parse(str) || [];
	} catch(e) {
		return [];
	}
}

export function buildArticuloItems(articulos: any[]): FeedItem[] {
	return articulos.map((post) => ({
		id: `articulo-${post.slug}`,
		kind: 'articulo',
		title: post.title,
		description: post.description,
		pubDate: new Date(post.pubDate),
		author: resolveAuthorRef(post.author_slug),
		category: post.category,
		temas: parseJson(post.temas),
		tags: parseJson(post.tags),
		href: `/escritos/${post.slug}`,
		image: post.heroImage,
		imageLayout: post.heroImage ? 'landscape' : 'none',
	}));
}

export function buildCartaItems(cartas: any[]): FeedItem[] {
	return cartas.map((carta) => ({
		id: `carta-${carta.slug}`,
		kind: 'carta',
		title: carta.title,
		pubDate: new Date(carta.pubDate),
		author: resolveAuthorRef(carta.author_slug),
		category: carta.category,
		temas: parseJson(carta.temas),
		tags: parseJson(carta.tags),
		href: `/escritos/cartas/${carta.slug}`,
		image: carta.heroImage,
		imageLayout: carta.heroImage ? 'portrait' : 'none',
		description: carta.content ? carta.content.substring(0, 100) + '...' : ''
	}));
}

export function buildPoemaItems(poemas: any[]): FeedItem[] {
	return poemas
		.filter((poema) => !poema.antologia_slug)
		.map((poema) => ({
			id: `poema-${poema.slug}`,
			kind: 'poema',
			title: poema.title,
			pubDate: new Date(poema.pubDate),
			author: poema.author,
			category: poema.category,
			temas: parseJson(poema.temas),
			tags: parseJson(poema.tags),
			href: `/poemas/${poema.slug}`,
			image: poema.heroImage,
			imageLayout: poema.heroImage ? 'portrait' : 'none',
		}));
}

export function buildAntologiaItems(
	antologias: any[],
	poemas: any[],
): FeedItem[] {
	return antologias.map((antologia) => {
		const count = poemas.filter((p) => p.antologia_slug === antologia.slug).length;
		return {
			id: `antologia-${antologia.slug}`,
			kind: 'antologia',
			title: antologia.title,
			description: `${antologia.description} (${count} poema${count !== 1 ? 's' : ''})`,
			pubDate: new Date(antologia.pubDate),
			author: antologia.editor,
			category: antologia.category,
			temas: parseJson(antologia.temas),
			tags: parseJson(antologia.tags),
			href: `/poemas/antologia/${antologia.slug}`,
			image: antologia.heroImage,
			imageLayout: antologia.heroImage ? 'portrait' : 'none',
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
