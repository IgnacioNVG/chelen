import { collection, config, fields } from '@keystatic/core';

const tagsField = fields.array(fields.text({ label: 'Etiqueta' }), {
  label: 'Etiquetas',
  itemLabel: (props) => props.value,
});

const bodyField = () =>
  fields.markdoc({
    label: 'Contenido',
    extension: 'md',
  });

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'Panel de Administración' },
    navigation: {
      Contenido: ['articulos', 'cartas', 'poemas', 'antologias'],
    },
  },
  collections: {
    articulos: collection({
      label: 'Artículos',
      slugField: 'title',
      path: 'src/content/articulos/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate', 'category', 'author'],
      schema: {
        title: fields.slug({
          name: { label: 'Título' },
        }),
        description: fields.text({
          label: 'Descripción',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: 'Fecha de publicación',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: 'Imagen de portada',
          description: 'Usa imágenes en formato .webp para mantener el sitio liviano.',
          directory: 'src/content/articulos',
          publicPath: './',
        }),
        author: fields.text({
          label: 'Autor',
          defaultValue: 'Redacción',
          validation: { isRequired: true },
        }),
        affiliation: fields.text({
          label: 'Afiliación',
          defaultValue: 'UCh',
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: 'Categoría',
          defaultValue: 'Columna de opinión',
        }),
        tags: tagsField,
        content: bodyField(),
      },
    }),
    cartas: collection({
      label: 'Cartas al Director',
      slugField: 'title',
      path: 'src/content/cartas/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate', 'author', 'affiliation'],
      schema: {
        title: fields.slug({
          name: { label: 'Título' },
        }),
        pubDate: fields.date({
          label: 'Fecha de publicación',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: 'Imagen de portada',
          description: 'Usa imágenes en formato .webp para mantener el sitio liviano.',
          directory: 'src/content/cartas',
          publicPath: './',
        }),
        author: fields.text({
          label: 'Autor',
          validation: { isRequired: true },
        }),
        affiliation: fields.text({
          label: 'Afiliación',
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: 'Categoría',
          defaultValue: 'Cartas al Director',
        }),
        tags: tagsField,
        content: bodyField(),
      },
    }),
    poemas: collection({
      label: 'Poemas',
      slugField: 'title',
      path: 'src/content/poemas/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate', 'author'],
      schema: {
        title: fields.slug({
          name: { label: 'Título' },
        }),
        pubDate: fields.date({
          label: 'Fecha de publicación',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: 'Imagen de portada',
          description: 'Usa imágenes en formato .webp para mantener el sitio liviano.',
          directory: 'src/content/poemas',
          publicPath: './',
        }),
        author: fields.text({
          label: 'Autor',
          defaultValue: 'Anónimo',
          validation: { isRequired: true },
        }),
        category: fields.text({
          label: 'Categoría',
          defaultValue: 'Poesía',
        }),
        tags: tagsField,
        antologia: fields.text({
          label: 'Antología',
          description: 'Opcional. Usa el slug de una antología, por ejemplo: el-poeta-dawson.',
        }),
        content: bodyField(),
      },
    }),
    antologias: collection({
      label: 'Antologías',
      slugField: 'title',
      path: 'src/content/poemas/antologia/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'pubDate', 'editor'],
      schema: {
        title: fields.slug({
          name: { label: 'Título' },
        }),
        description: fields.text({
          label: 'Descripción',
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: 'Fecha de publicación',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: 'Imagen de portada',
          description: 'Usa imágenes en formato .webp para mantener el sitio liviano.',
          directory: 'src/content/poemas',
          publicPath: '../',
        }),
        editor: fields.text({
          label: 'Editor',
          defaultValue: 'Redacción Chelén',
        }),
        category: fields.text({
          label: 'Categoría',
          defaultValue: 'Antología',
        }),
        tags: tagsField,
        content: bodyField(),
      },
    }),
  },
});
