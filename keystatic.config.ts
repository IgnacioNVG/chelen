import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'Panel de Administración' }
  },
  collections: {
    articulos: collection({
      label: 'Artículos',
      slugField: 'title',
      path: 'src/content/articulos/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({
          name: { label: 'Título' },
        }),
        description: fields.text({
          label: 'Descripción',
          multiline: true,
        }),
        pubDate: fields.date({
          label: 'Fecha de publicación',
          defaultValue: { kind: 'today' },
        }),
        heroImage: fields.image({
          label: 'Imagen de portada (Solo formato .webp)',
          description: 'Por favor, sube únicamente imágenes en formato .webp.',
          directory: 'src/content/articulos',
          publicPath: './',
        }),
        author: fields.text({
          label: 'Autor',
          defaultValue: 'Vicente Espinoza',
        }),
        affiliation: fields.text({
          label: 'Afiliación',
          defaultValue: 'Instituto Nacional',
        }),
        category: fields.text({
          label: 'Categoría',
          defaultValue: 'Opinión',
        }),
        tags: fields.array(fields.text({ label: 'Etiqueta' }), {
          label: 'Etiquetas',
          itemLabel: props => props.value,
        }),
        content: fields.document({
          label: 'Contenido',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'src/content/articulos',
            publicPath: './',
          },
        }),
      },
    }),
  },
});
