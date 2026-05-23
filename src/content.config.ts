import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stripExtension = ({ entry }: { entry: string }) =>
	entry.replace(/\.(md|mdx)$/, '');

/** Etiquetas temáticas; no repetir el valor de `category`. */
const tags = z.array(z.string()).default([]);

const articulos = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/articulos',
		generateId: stripExtension,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			author: z.string().default('Redacción'),
			affiliation: z.string().default('UCh'),
			category: z.enum(['Columna de opinión', 'Entrevista']).default('Columna de opinión'),
			tags,
		}),
});

const cartas = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/cartas',
		generateId: stripExtension,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			author: z.string(),
			affiliation: z.string(),
			category: z.literal('Cartas al Director').default('Cartas al Director'),
			tags,
		}),
});

const poemas = defineCollection({
	loader: glob({
		pattern: '*.{md,mdx}',
		base: './src/content/poemas',
		generateId: stripExtension,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			author: z.string().default('Anónimo'),
			category: z.literal('Poesía').default('Poesía'),
			tags,
			antologia: z.string().optional(),
		}),
});

const antologias = defineCollection({
	loader: glob({
		pattern: '**/*.{md,mdx}',
		base: './src/content/poemas/antologia',
		generateId: stripExtension,
	}),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			heroImage: image().optional(),
			editor: z.string().optional(),
			category: z.literal('Antología').default('Antología'),
			tags,
		}),
});

export const collections = { articulos, cartas, poemas, antologias };
