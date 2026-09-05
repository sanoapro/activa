---
name: presentacion-activa
description: >-
  Operar el repositorio de páginas web de activa (Presentacion-activa): el portal,
  los tres cotizadores, los dos decks, la lámina de precios, el kit comercial y el
  manual de la consola. Úsala al editar cualquier .html de este repo, al tocar
  precios o catálogos, al animar o revisar animación, al agregar o mover una
  página, al regenerar una vista previa og.png, y antes de publicar a GitHub Pages.
  Cubre la regla de compartidos/, las suites ?test=1, la matriz PRECIOS como única
  fuente, y las trampas de file:// y de impresión a PDF.
---

# Páginas web de activa — operación

Sitio estático publicado tal cual desde `main` en <https://sanoapro.github.io/activa/>.
**No hay build, ni CI, ni bundler, ni `node_modules`.** Lo que está en el repositorio es
exactamente lo que se publica.

Este documento es el enrutador. La referencia larga ya existe y no se duplica aquí:

| Antes de… | Lee |
| --- | --- |
| Mover, agregar o reorganizar páginas | `docs/estructura.md` |
| Animar cualquier cosa, o revisar animación | `docs/normativa-motion.md` — **obligatoria** |
| Tocar un precio, un catálogo o un descuento | `docs/matriz-precios/` (el `plan.md` primero) |
| Hablar de producto, alcance u oferta | `docs/portafolio-activa.md` — fuente de verdad |

## Las cinco reglas duras

**1. Todo abre desde `file://`.** El deck y el kit se abren con doble clic frente a un
cliente. Por eso los scripts son **clásicos, nunca módulos ES** (`import` no carga desde
`file://`), las rutas son **relativas** (`../../compartidos/…`) y varias páginas llevan sus
imágenes en base64 embebido. No introduzcas `type="module"`, rutas absolutas de sitio, ni
`fetch` de archivos locales.

**2. La página se lee aunque el JavaScript no cargue.** Nada queda oculto salvo bajo
`html.mo-ready`, clase que pone `Motion.start()`. Un 404 en un script debe dejar la página
**completa y quieta**, no en blanco. Esto no es teoría: el Motion System se publicó en
blanco durante días por un `import` roto.

**3. El PDF es el entregable.** El deck imprime en 16:9 y los cotizadores imprimen la
cotización que recibe el colegio. Cualquier animación nueva se anula en `@media print` —
**y hay que nombrar los pseudoelementos**: `animation: none` sobre el elemento no alcanza a
su `::before` / `::after`, y el hueco solo se ve en la hoja impresa.

**4. Los precios viven en un objeto, nunca en un comentario.** Cada cotizador tiene su
matriz `PRECIOS` ejecutable, de la que lee el resto del archivo; la cabecera declara la
convención de IVA y **no lleva ni una cifra**. El patrón de escribir los precios en un
comentario ya falló cuatro veces en el mismo archivo.

**5. Nada se indexa.** Toda página lleva `<meta name="robots" content="noindex">`: llevan
precio por alumno, descuentos, datos bancarios, catálogos de costo y la postura de
seguridad de colegios con nombre. Un `robots.txt` aquí **no sirve** — el estándar solo lo
lee en la raíz del dominio, que es otro repositorio.

## Precios — dónde está cada cosa

Tres cotizadores, tres convenciones de IVA distintas. **Confundirlas es el error
documentado**: en agosto de 2026 se copió la licencia CEU y el seguro del catálogo de
arrendamiento (sin IVA) al cotizador (con IVA) y cada equipo salió $419.20 por debajo.

| Página | Convención | Matriz |
| --- | --- | --- |
| `paginas/cotizador/` | **con** IVA | `PRECIOS` en su `index.html` |
| `paginas/arrendamiento/` | **sin** IVA | `PRECIOS` en su `index.html` |
| `paginas/compra/` | neto, **sin** IVA | `PRECIOS.partidas`; `CATALOG` solo describe y lee el precio |

Las matrices son **autocontenidas por página, a propósito**: el PDF es el entregable y no
puede depender de un archivo externo.

`compartidos/js/precios-ciclo.js` es la excepción y hay que tratarlo con cuidado: es una
**copia consciente y manual** del `APP_CONFIG` del cotizador, que sigue siendo la única
fuente de verdad. Lo cargan `cotizador/`, `precios/` y `upgrade-edu/`. **Si cambias precios
en el cotizador, actualízalo a mano** — si no, un deck y una cotización dicen cifras
distintas delante del mismo director. Quien lo consuma debe comprobar `window.PreciosCiclo`
y decir que faltan datos, nunca enseñar una lámina con huecos.

## Probar antes de publicar

Los tres cotizadores traen suite interna. Se corren con el servidor local, no con doble clic:

```bash
python -m http.server 8123
# http://127.0.0.1:8123/paginas/cotizador/?test=1
# http://127.0.0.1:8123/paginas/arrendamiento/?test=1
# http://127.0.0.1:8123/paginas/compra/?test=1
```
El resultado se pinta en `#testReport`. Se dejan **las tres en verde sin editar el valor
esperado de ninguna prueba existente** — si una prueba había que cambiarla, es un hallazgo
que se reporta, no un estorbo que se ajusta.

Como el JavaScript va dentro del HTML, la revisión de sintaxis necesita extraer el
`<script>` a un `.js` temporal antes de `node --check` (el procedimiento exacto está en
`docs/matriz-precios/prompt.md`).

Y la lista de publicación de `normativa-motion.md`: sin JS se lee todo · `Ctrl+P` sin hojas
en blanco · «reducir movimiento» activado · consola sin errores ni 404 · teclado y foco ·
táctil · `Motion.start()` como última línea.

## Qué va en `compartidos/` y qué no

Regla práctica: **si al borrar una página el archivo dejaría de servirle a nadie, era de la
página.** Su paleta, su CSS, su `og.png`, su `og-source.html`, sus datos embebidos y su
`README.md` van dentro de su carpeta.

**No hay hoja de estilos compartida y no debe haberla.** Cada página trae su paleta en su
propio `:root`. Lo único compartido en presentación es `motion.css`, que **a propósito no
lleva un solo color** para no pelearse con ninguna paleta. Si un efecto necesita color, ese
color va en el CSS de la página.

Las imágenes de `compartidos/img/` son **material de origen**: varias páginas llevan sus
imágenes en base64 embebido y estas son la fuente de la que se regeneran. No se borran.

## Al mover o agregar una página

Cuatro lugares hay que tocar, y olvidar uno deja enlaces rotos en producción:

1. Sus propias etiquetas `og:` — **con URL absoluta**; WhatsApp no lee rutas relativas ni
   `data:` URI, y el `og.png` vive en la carpeta de la página, no en `compartidos/`.
2. Las tarjetas del portal `index.html` de la raíz.
3. Las listas `VENTA` e `INTERNA` del kit comercial.
4. Las tablas de `docs/estructura.md` y del `README.md` de la raíz.

La ruta del repositorio **es** la URL. Carpeta nueva en kebab-case, con su `README.md` que
diga qué es, cómo se edita y cómo se regenera lo generado.

## Detalles que confunden a quien llega

- `docs/drive-PDF/archivo-drive.gs` **no corre aquí**. Es la copia inerte del puente que
  vive desplegado en `script.google.com`; existe para tener historial. No se enlaza desde
  ninguna página.
- `paginas/kit-comercial/assets.js` es **generado**. No se edita a mano; su `README.md`
  dice cómo se regenera.
- El `getBoundingClientRect` dentro de `veloPinta` (kit comercial) **es correcto**: se llama
  desde el frame, no desde el evento. No lo "arregles".
- `compartidos/js/motion-lottie.js` y `motion-particles.js` hoy no los carga nadie.
- Todas las clases y todo el CSS del motor llevan prefijo `mo-`. Si agregas algo al motor,
  mantén el prefijo y anótalo en `docs/normativa-motion.md`.
