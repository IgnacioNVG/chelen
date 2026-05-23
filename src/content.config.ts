import { defineCollection, z } from 'astro:content';

const articulos = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		author: z.string().default('Redacción'),
		affiliation: z.string().default('UCh'),
		category: z.string().default('Artículo'),
	}),
});

const cartas = defineCollection({
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		author: z.string(),
		affiliation: z.string(),
		category: z.literal('Cartas al Director').default('Cartas al Director'),
	}),
});

const poemas = defineCollection({
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		author: z.string().default('Anónimo'),
		category: z.literal('Poesía').default('Poesía'),
	}),
});

export const collections = { articulos, cartas, poemas };