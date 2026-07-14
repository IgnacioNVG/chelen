# Taxonomía editorial de Chelén

Sistema de dos niveles para clasificar y descubrir contenido entre secciones.

## Temas (lista cerrada, 12)

Ejes de lectura transversal. Si algo merece una página `/tema/[slug]`, es un **tema**.

| Tema | Uso |
|------|-----|
| Política | Eje central del archivo |
| Izquierda y socialismo | Identidad editorial |
| Feminismos | Género, cuidados, corporalidad |
| Ultraderecha y democracia | Momento político actual |
| Movimientos sociales | Estudiantil, secundarios, etc. |
| Historia y memoria | Dictadura, UP, Mayo del 68 |
| Educación | Tomas, secundarios, Junaeb |
| Economía | Neoliberalismo, globalización |
| Internacional | Suecia, LatAm |
| Salud | Salud mental, cuidados |
| Cultura | Fútbol, arte, subjetividad |
| Teoría e ideas | Marxismo, gramscianismo, filosofía, teoría política |

**Reglas:** máximo 3 temas por pieza. Fuente canónica: `src/lib/taxonomy.ts`.

## Tags (cola larga, vocabulario sugerido)

Descriptores que **no caben en un tema**: nombres propios, eventos, conceptos puntuales.

**No duplicar:** si ya es tema, no va como tag (ej. no usar «Cultura» como tag si el artículo tiene el tema Cultura).

### Familias sugeridas

**A. Lugar y contexto** — Chile · Política chilena · Política latinoamericana · Suecia

**B. Figuras e instituciones** — Kast · Gobierno · Antonio Gramsci · Nicos Poulantzas · Junaeb

**C. Conceptos teóricos** — Neoliberalismo · Marxismo · Hegemonía cultural · Neofascismo · Estatismo autoritario · Socialismo democrático

**D. Movimientos y eventos** — Estallido social · Mayo del 68 · Movimiento estudiantil · Unidad Popular · Isla Dawson

**E. Temas transversales específicos** — Cuidados · Salud mental · Violencia política · Tomas · Catolicismo · Feminismo anticapitalista

### Normalización

| Problema | Regla |
|----------|-------|
| Estallido Social | Siempre: **Estallido social** |
| Feminismo vs Feminismo anticapitalista | Concepto general vs variante específica |
| Tags que repiten temas | Eliminar; usar solo el campo `temas` |
| Title Case inconsistente | Nombres propios capitalizados; conceptos con primera letra (ej. «Salud mental») |

## Criterio al etiquetar un texto nuevo

1. ¿Este eje merece una página de descubrimiento propia? → **tema**
2. ¿Es un detalle, nombre o concepto que solo aplica a este texto? → **tag**

### Ejemplo

**Democracia vacía**

- Temas: Política · Izquierda y socialismo · Teoría e ideas
- Tags: Chile · Estallido social · Nicos Poulantzas · Fascismo social

## Implementación técnica

- `src/lib/taxonomy.ts` — `TEMAS`, `TAGS_SUGERIDOS`, redirects de slug
- `keystatic.config.ts` — desplegable de temas y guía de tags en el CMS
- `src/content.config.ts` — validación en build (temas canónicos + tags sin duplicar temas)
- Redirect: `/tema/filosofia-e-ideas` → `/tema/teoria-e-ideas`
