import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		heroImage: z.string().optional(),
		// Añadimos estos campos obligatorios
		author: z.string(),
		affiliation: z.string(),
		category: z.string().default('Columna de opinión'),
	}),
});

export const collections = { blog };