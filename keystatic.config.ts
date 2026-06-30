import { collection, config, fields, singleton } from "@keystatic/core";
import { TEMAS } from "./src/lib/taxonomy";

const tagsField = fields.array(fields.text({ label: "Etiqueta" }), {
  label: "Etiquetas",
  itemLabel: (props) => props.value,
});

// Nivel superior controlado del sistema de etiquetas. Lista canónica
// compartida con src/content.config.ts (ver src/lib/taxonomy.ts).
const temasField = fields.multiselect({
  label: "Temas",
  description:
    "Ejes temáticos amplios para descubrir contenido entre secciones. " +
    "Usa «Etiquetas» para descriptores específicos (nombres propios, hechos puntuales).",
  options: TEMAS.map((t) => ({ label: t, value: t })),
});

const bodyField = () =>
  fields.markdoc({
    label: "Contenido",
    extension: "md",
  });

export default config({
  storage: import.meta.env.DEV
    ? { kind: "local" }
    : {
        kind: "github",
        repo: "IgnacioNVG/chelen",
      },
  ui: {
    brand: { name: "Panel de Administración" },
    navigation: {
      Páginas: ["nosotros"],
      Contenido: ["articulos", "cartas", "poemas", "antologias"],
      Autores: ["columnistas"],
    },
  },
  singletons: {
    nosotros: singleton({
      label: "Página: Nosotros",
      path: "src/content/nosotros/index",
      format: { data: "json" },
      schema: {
        origen_titulo: fields.text({ label: "Título: El Origen", defaultValue: "El Origen" }),
        origen_texto: fields.text({ label: "Texto: El Origen", multiline: true }),
        highlight_box: fields.text({ label: "Caja Destacada", defaultValue: "CHELÉN ES VERIFICAR LA CONVICCIÓN Y PROBAR LA PRÁCTICA" }),
        teoria_titulo: fields.text({ label: "Título: Teoría y Crítica", defaultValue: "Teoría y Crítica" }),
        teoria_texto: fields.text({ label: "Texto: Teoría y Crítica", multiline: true }),
        repensar_titulo: fields.text({ label: "Título: (Re)Pensar(nos)", defaultValue: "(Re)Pensar(nos)" }),
        repensar_texto: fields.text({ label: "Texto: (Re)Pensar(nos)", multiline: true }),
      }
    }),
  },
  collections: {
    articulos: collection({
      label: "Artículos",
      slugField: "title",
      path: "src/content/articulos/*/",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "pubDate", "category", "author"],
      schema: {
        title: fields.slug({
          name: { label: "Título" },
        }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: "Fecha de publicación",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: "Imagen de portada",
          description:
            "Usa imágenes en formato .webp para mantener el sitio liviano.",
          directory: "src/content/articulos/*/",
          publicPath: "./",
        }),
        author: fields.relationship({
          label: "Autor",
          collection: "columnistas",
          validation: { isRequired: false },
        }),
        affiliation: fields.text({
          label: "Afiliación",
          defaultValue: "UCh",
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Categoría",
          // Debe coincidir con el enum de src/content.config.ts (articulos).
          options: [
            { label: "Artículo", value: "Artículo" },
            { label: "Columna de opinión", value: "Columna de opinión" },
            { label: "Entrevista", value: "Entrevista" },
          ],
          defaultValue: "Artículo",
        }),
        temas: temasField,
        tags: tagsField,
        content: bodyField(),
      },
    }),
    cartas: collection({
      label: "Cartas al Director",
      slugField: "title",
      path: "src/content/cartas/*/",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "pubDate", "author", "affiliation"],
      schema: {
        title: fields.slug({
          name: { label: "Título" },
        }),
        pubDate: fields.date({
          label: "Fecha de publicación",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: "Imagen de portada",
          description:
            "Usa imágenes en formato .webp para mantener el sitio liviano.",
          directory: "src/content/cartas/*/",
          publicPath: "./",
        }),
        author: fields.relationship({
          label: "Autor",
          collection: "columnistas",
          validation: { isRequired: false },
        }),
        affiliation: fields.text({
          label: "Afiliación",
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Categoría",
          // Coincide con el literal de src/content.config.ts (cartas).
          options: [
            { label: "Cartas al Director", value: "Cartas al Director" },
          ],
          defaultValue: "Cartas al Director",
        }),
        temas: temasField,
        tags: tagsField,
        content: bodyField(),
      },
    }),
    poemas: collection({
      label: "Poemas",
      slugField: "title",
      path: "src/content/poemas/*/",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "pubDate", "author"],
      schema: {
        title: fields.slug({
          name: { label: "Título" },
        }),
        pubDate: fields.date({
          label: "Fecha de publicación",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: "Imagen de portada",
          description:
            "Usa imágenes en formato .webp para mantener el sitio liviano.",
          directory: "src/content/poemas/*/",
          publicPath: "./",
        }),
        author: fields.text({
          label: "Autor",
          defaultValue: "Anónimo",
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: "Categoría",
          // Coincide con el literal de src/content.config.ts (poemas).
          options: [{ label: "Poesía", value: "Poesía" }],
          defaultValue: "Poesía",
        }),
        temas: temasField,
        tags: tagsField,
        antologia: fields.text({
          label: "Antología",
          description:
            "Opcional. Usa el slug de una antología, por ejemplo: el-poeta-dawson.",
        }),
        content: bodyField(),
      },
    }),
    antologias: collection({
      label: "Antologías",
      slugField: "title",
      path: "src/content/poemas/antologia/*/",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "pubDate", "editor"],
      schema: {
        title: fields.slug({
          name: { label: "Título" },
        }),
        description: fields.text({
          label: "Descripción",
          multiline: true,
          validation: { isRequired: true },
        }),
        pubDate: fields.date({
          label: "Fecha de publicación",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),
        heroImage: fields.image({
          label: "Imagen de portada",
          description:
            "Usa imágenes en formato .webp para mantener el sitio liviano.",
          directory: "src/content/poemas/antologia/*/",
          publicPath: "./",
        }),
        editor: fields.text({
          label: "Editor",
          defaultValue: "Redacción Chelén",
        }),
        category: fields.select({
          label: "Categoría",
          // Coincide con el literal de src/content.config.ts (antologias).
          options: [{ label: "Antología", value: "Antología" }],
          defaultValue: "Antología",
        }),
        temas: temasField,
        tags: tagsField,
        content: bodyField(),
      },
    }),
    columnistas: collection({
      label: "Autores / Columnistas",
      slugField: "name",
      path: "src/content/columnistas/*",
      format: { contentField: "bio" },
      entryLayout: "content",
      columns: ["name", "role", "affiliation"],
      schema: {
        name: fields.slug({
          name: {
            label: "Nombre completo",
            description:
              "Nombre tal como aparece en los artículos y cartas al director.",
          },
        }),
        role: fields.text({
          label: "Rol",
          defaultValue: "Columnista",
          description: "Ej: Columnista, Estudiante, Editor, etc.",
        }),
        affiliation: fields.text({
          label: "Casa de estudios / Afiliación",
          description:
            "Ej: Estudiante de Derecho UCh, Facultad de Arte UChile.",
        }),
        summary: fields.text({
          label: "Presentación personal",
          multiline: true,
          description:
            "Texto libre que el autor/a quiere compartir sobre sí mismo. Aparece en su perfil público.",
          validation: { isRequired: false },
        }),
        portrait: fields.image({
          label: "Foto de perfil",
          description:
            "Usa imagen cuadrada en formato .webp. Se mostrará recortada en círculo.",
          directory: "src/content/columnistas",
          publicPath: "./",
        }),
        email: fields.text({
          label: "Correo electrónico (opcional)",
        }),
        instagram: fields.text({
          label: "Instagram (opcional)",
          description: "Solo el nombre de usuario, sin @.",
        }),
        tags: tagsField,
        featured: fields.checkbox({
          label: "¿Destacado en la página de autores?",
          defaultValue: false,
        }),
        bio: bodyField(),
      },
    }),
  },
});
