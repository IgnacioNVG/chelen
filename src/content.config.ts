import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { TEMAS } from './lib/taxonomy';

const stripExtension = ({ entry }: { entry: string }) =>
	entry.replace(/\.(md|mdx)$/, '');

const articleId = ({ entry }: { entry: string }) =>
	entry.replace(/\/index\.(md|mdx)$/, '').replace(/\.(md|mdx)$/, '');

/** Descriptores específicos (cola larga). Texto libre; no repetir `category`. */
const tags = z.array(z.string()).default([]);

/** Ejes temáticos amplios (vocabulario controlado y compartido con el CMS). */
const temas = z.array(z.enum(TEMAS)).default([]);

const articulos = defineCollection({
	loader: glob({
		pattern: '**/index.{md,mdx}',
		base: './src/content/articulos',
		generateId: articleId,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			author: reference('columnistas').optional(),
			category: z.enum(['Artículo', 'Columna de opinión', 'Entrevista']).default('Artículo'),
			temas,
			tags,
		}),
});

const cartas = defineCollection({
	loader: glob({
		pattern: '**/index.{md,mdx}',
		base: './src/content/cartas',
		generateId: articleId,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			author: reference('columnistas').optional(),
			category: z.literal('Cartas al Director').default('Cartas al Director'),
			temas,
			tags,
		}),
});

const poemas = defineCollection({
	loader: glob({
		pattern: '*/index.{md,mdx}',
		base: './src/content/poemas',
		generateId: articleId,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			author: z.string().default('Anónimo'),
			category: z.literal('Poesía').default('Poesía'),
			temas,
			tags,
			antologia: z.string().optional(),
		}),
});

const antologias = defineCollection({
	loader: glob({
		pattern: '**/index.{md,mdx}',
		base: './src/content/poemas/antologia',
		generateId: articleId,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			editor: z.string().optional(),
			category: z.literal('Antología').default('Antología'),
			temas,
			tags,
		}),
});

const columnistas = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/columnistas',
		generateId: stripExtension,
	}),
	schema: ({ image }) =>
		z.object({
			name: z.string(),
			role: z.string().default('Columnista'),
			affiliation: z.string().optional(),
			summary: z.string().optional(),
			portrait: image().optional(),
			email: z.union([z.literal(''), z.string().email()]).optional(),
			instagram: z.string().optional(),
			tags,
			featured: z.boolean().default(false),
		}),
});

export const collections = { articulos, cartas, poemas, antologias, columnistas };
