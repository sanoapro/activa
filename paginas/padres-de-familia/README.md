# Presentación a padres de familia · 2026–2027

Deck de 22 diapositivas para las juntas con familias del colegio.
Se publica en **https://sanoapro.github.io/activa/paginas/padres-de-familia/**

Un solo archivo, autocontenido: markup, CSS y JS viven dentro de `index.html`. Se abre con
doble clic, sin servidor y sin compilar nada. No hay una sola petición de red: ni fuentes por
CDN, ni librerías, ni imágenes remotas.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. ~76 KB, sin imágenes embebidas: donde va una foto hay un marcador. |

Falta `og.png` (1200×630) para la vista previa de WhatsApp. Mientras no exista, al compartir el
enlace se ve solo el título y la bajada. Las etiquetas `og:` ya están puestas, con URL absoluta.

## Atajos

- `←` `→` navegar · barra espaciadora avanza
- `Inicio` / `Fin` primera y última
- `F` pantalla completa
- `P` imprimir a PDF en 16:9
- En el teléfono: deslizar con el dedo

Se puede enlazar a una diapositiva concreta con el número en el hash: `…/padres-de-familia/#7`.

## Cómo está armado

- **Sistema de diseño heredado de [`../upgrade-edu/`](../upgrade-edu/README.md).** Los tokens,
  la tipografía, las tarjetas, las píldoras, la tabla, los medallones y la escalera son los de
  ese deck. Si allá cambia un token, aquí hay que reflejarlo a mano: no comparten hoja.
- **Escenario de 1280×720**, escalado con `transform:scale()` como el deck comercial.
- **Responsive de verdad, que el deck comercial no tiene.** Por debajo de 1024 px se apaga el
  escalado uniforme y la lámina pasa a flujo vertical con tipografía en `clamp()`, a una sola
  columna. Un padre que abra el enlace en su teléfono lee texto de tamaño normal, no un 16:9
  encogido.
- **Sin almacenamiento del navegador.** Todo el estado en variables en memoria.
- **Impresión:** `Ctrl+P` saca una diapositiva por página en horizontal (22 páginas de
  1280×720).

## La narrativa: no se reordena

Las 22 láminas son un embudo de gestión del cambio:
credibilidad → disonancia → desarme → tranquilidad → solución → prueba social → acción.
Cada `<section class="slide">` lleva un `data-bloque` con su fase, y el indicador de progreso se
colorea a partir de él. **Mover una diapositiva rompe el argumento**, y el bloque D
(«tranquilidad», láminas 9–13) es el corazón: es donde el padre baja la guardia.

| Bloque | Láminas | `data-bloque` |
|---|---|---|
| A · Apertura | 1–2 | `apertura` |
| B · Disonancia y desarme | 3–6 | `disonancia` |
| C · Bisagra | 7–8 | `bisagra` |
| D · Tranquilidad | 9–13 | `tranquilidad` |
| E · Solución | 14–18 | `solucion` |
| F · Resultado y prueba social | 19–20 | `resultado` |
| G · Cierre | 21–22 | `cierre` |

## Antes de presentar: hay que completar los marcadores

El deck se entrega con marcadores a propósito, para que nadie proyecte un dato inventado.

- **Marcadores de texto** — van resaltados en amarillo, imposibles de pasar por alto. Se
  buscan con `class="mk"`. Son 18: el nombre de un colegio local (2), la fuente del dato de
  «6 de cada 10» (6), datos de pantalla en casa (8), horas de capacitación y maestros
  certificados (9), las horas de uso por nivel (10), qué pasa con la cuenta al egresar y quién
  accede al monitoreo (12), los dos casos sustituibles (16), quién emite la certificación (19),
  el calendario y el canal de dudas (21) y el contacto del colegio (22).
- **Marcadores de imagen** — recuadro de borde punteado con la etiqueta de qué foto va ahí y en
  qué proporción. Se buscan con `class="ph"` (8, fotografías y capturas) y `logotile dash`
  (11, logotipos de certificaciones y universidades).

**Ojo con la lámina 6:** el dato de «6 de cada 10» lleva el marcador
`[FUENTE POR CONFIRMAR]` bien visible. No se presenta sin verificarlo.

## Pendientes conocidos

- Los testimonios de familias entran en la lámina 21, donde ya está apartado su marcador.
- Falta generar `og.png`.
