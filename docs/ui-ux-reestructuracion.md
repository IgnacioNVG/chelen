# Reestructuracion UI/UX - Revista Chelen

## Arquitectura de navegacion

Menu principal:

- Inicio
- Revista
- Arte
- Audiovisual
- Cuadernillos
- Nosotros
- Buscar

La navegacion reduce el primer nivel y agrupa el contenido por logica editorial. Las rutas existentes se conservan como archivos especificos: `/articulos`, `/cartas`, `/grafica` y `/poemas`.

## Secciones

### Inicio

Portada editorial mixta. No separa por formato de inmediato; combina relevancia, actualidad y puertas de entrada a las areas de la revista.

Bloques implementados:

- Articulo destacado.
- Publicaciones recientes.
- Columnas recientes.
- Arte socialista destacado.
- Grafica destacada.
- Produccion audiovisual reciente.
- Cartas al director.
- Cuadernillos.

### Revista

Agrupa la produccion escrita:

- Articulos: textos extensos.
- Columnas: textos breves de opinion o reflexion.
- Cartas al director: intervenciones breves.

### Arte

Agrupa produccion visual y literaria:

- Grafica.
- Poesia.
- Antologias.
- Escritos.
- Otros formatos artisticos futuros.

### Audiovisual

Seccion independiente preparada para:

- Podcast.
- Conversatorios.
- Paneles.

### Cuadernillos

Seccion independiente para publicaciones especiales. Cada cuadernillo deberia modelarse con:

- Titulo.
- Descripcion.
- Portada.
- Autores.
- Fecha.
- Descarga PDF.
- Lectura online.
- Articulos incluidos.

### Nosotros

Puede reutilizar la pagina actual y ordenarse internamente en:

- Presentacion de la revista.
- Linea editorial.
- Equipo.
- Contacto.
- Informacion para colaborar.

## Paginas reutilizables sin cambios mayores

- `/articulos`: archivo escrito ya funcional.
- `/cartas`: archivo de cartas ya funcional.
- `/grafica`: galeria visual ya funcional.
- `/poemas`: poesia y antologias ya funcionales.
- `/nosotros`: base util para concentrar presentacion, equipo y contacto.
- Plantillas individuales de articulos, cartas y poemas.

## Paginas modificadas o agregadas

- `/`: reorganizada como portada editorial.
- Header: menu principal simplificado.
- Footer: agrupacion editorial alineada al nuevo menu.
- `/revista`: nueva pagina agrupadora de produccion escrita.
- `/columnas`: nueva pagina especifica para columnas.
- `/arte`: nueva pagina agrupadora de produccion artistica.
- `/audiovisual`: nueva pagina preparada para categorias audiovisuales.
- `/cuadernillos`: nueva pagina preparada para publicaciones especiales.
- `/buscar`: nueva busqueda client-side sobre el archivo actual.

## Prioridad de cambios

1. Alto impacto / bajo esfuerzo: menu principal, footer, portada editorial mixta.
2. Alto impacto / esfuerzo medio: paginas agrupadoras `/revista` y `/arte`.
3. Impacto medio / bajo esfuerzo: `/buscar`, `/audiovisual`, `/cuadernillos` como estructuras iniciales.
4. Alto impacto futuro / mayor esfuerzo: crear coleccion de contenido para cuadernillos con PDF, portada, articulos asociados y lectura online.
5. Alto impacto futuro / mayor esfuerzo: crear coleccion audiovisual con tipos, embeds, temporadas o ciclos.

## Wireframe conceptual

```text
HEADER
Inicio | Revista | Arte | Audiovisual | Cuadernillos | Nosotros | Buscar

PORTADA
[Masthead Revista Chelen]

[Hero editorial]
Imagen / titulo / bajada / autor / fecha

[Publicaciones recientes]
Card | Card | Card
Card | Card | Card

[Columnas recientes]
Card | Card | Card

[Arte socialista destacado]
Poesia/antologia | Poesia/antologia | Poesia/antologia

[Grafica destacada]
Imagen | Imagen | Imagen

[Produccion audiovisual reciente]
Modulo de entrada a podcast, conversatorios y paneles

[Cartas al director]
Card | Card | Card

[Cuadernillos]
Modulo de entrada a publicaciones especiales

FOOTER
Revista / Arte / Comunidad
```
