# Presentación a padres de familia · 2026–2027

Deck de 22 diapositivas para las juntas con familias del colegio.
Se publica en **https://sanoapro.github.io/activa/paginas/padres-de-familia/**

Markup, CSS y JS del deck viven dentro de `index.html`. Se abre con doble clic, sin servidor y
sin compilar nada.

**Ya no es un archivo suelto:** carga el motor de movimiento compartido de `compartidos/`, así
que viaja como carpeta o como zip, no como un `index.html` solo. Fue una decisión deliberada,
para tener un único lugar donde arreglar el movimiento de las cuatro páginas. Fuera de eso no
hay peticiones de red: ni fuentes por CDN, ni librerías de terceros, ni imágenes remotas.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. Sin imágenes: toda ilustración es SVG en línea dibujado con los tokens del sistema. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |

## Movimiento y fondo

Usa el motor compartido de `compartidos/` y el vocabulario visual de
[`../upgrade-edu/`](../upgrade-edu/README.md). **Ninguna de las 22 láminas queda en blanco**:
todas llevan una capa `.mv-fondo` (z0, sorda al ratón) con círculos de tinte, iconos SVG
temáticos muy tenues (birrete y libro en las de maestros, escudo y candado en protección,
corazón en la socioemocional, globo terráqueo en la internacional…) y la decoración del
momento narrativo.

**Portado de `upgrade-edu` tal cual** (con el color parametrizado donde el fondo claro lo
pidió): nubes (`mv-nube`), olas (`mv-olas`), pradera que crece y se mece (`mv-pasto` /
`mv-crece` / `mv-mece`), confeti del cierre (`mv-cf`, keyframe renombrado a `mv-cf-est`),
aros que respiran (`mv-onda`) y barrido de luz (`mv-brillo`, sobre el peldaño C1).
**Nuevo de esta página**: globos con los colores de Google que suben con vaivén
(`mv-globo`), flechas que entran y laten señalando el momento importante (`mv-flecha`),
subrayado que se dibuja bajo la frase clave (`mv-sub`) y aro que respira alrededor de un
medallón (`mv-late`).

**Vocabulario Google, repartido por todo el deck** (agosto de 2026). Antes el movimiento
ambiental vivía solo en la portada y en el cierre. Ahora, con la paleta de marca en cuatro
tokens (`--g-azul` `--g-rojo` `--g-amar` `--g-verd`): ondas de Assistant (`mv-voz`, láminas 3,
13 y 21), pulsación Material al avanzar (`mv-ondamat`, global), red de partículas en los
cuatro colores (`data-red` en las láminas 1, 7 y 20), spinner evolutivo alrededor de una cifra
(`mv-anillo`), geometría flotante con paralaje de cursor (`mv-geo`), trazos de pizarra y
círculo de foco (`mv-r` + `mv-traza`), píldoras de autocompletado (`mv-pill`), hilo multicolor
en la barra de progreso, y deriva ambiental en los 28 círculos de fondo (`mv-flota`).
El detalle de qué va dónde y por qué está en
[`docs/plan-rediseno-padres.md`](../../docs/plan-rediseno-padres.md) §8.

**El barrido de capítulo se retiró** (agosto de 2026, a petición del cliente). Eran cuatro barras
de color que cruzaban la lámina al cambiar de bloque narrativo, seis veces en las 22; en una junta
se leían como un parpadeo y no como puntuación. La estructura de los siete bloques ya la marcan el
ritmo del contenido y el hilo multicolor de la barra de avance.

**La onda se calibró en la misma fecha.** Antes eran dos círculos de 1500 px con 110 ms de
diferencia, resueltos en 740 ms: un disco más ancho que el escenario cruzando la lámina entera en
menos de un segundo, y por duplicado. Ahora es **uno solo, de 620 px, en 1.1 s**. Rompe el tope de
900 ms de la normativa a propósito — esa regla protege lo que hace *esperar*, y esto no bloquea
nada, porque la lámina ya cambió.

La energía sigue el embudo: festivo en la apertura (olas, nubes, globos, partículas),
contenido y en rojos tenues en la disonancia, amarillo con aros en la bisagra, **sereno en el
bloque D** (nubes lentas, verdes suaves, la pradera; sin estallidos ni cascadas: ahí el padre
baja la guardia), con color y aros en la solución, tono de logro en el resultado, y el cierre
—que queda proyectado durante las preguntas— con confeti, globos y olas. Las cifras (+2 M,
+90, 16, 5, +200 M) **no se animan nunca**; se anima lo que las rodea.

Los bucles decorativos son lentos (4–12 s) y los acentos de entrada cortos (≤ .5 s), como
manda la normativa. En **impresión** sobrevive todo lo estático congelado en su estado final
(círculos, iconos, nubes, olas, globos, pasto crecido, flechas, subrayados) y se apaga lo que
solo existe en movimiento (confeti, aros, ondas y el canvas de partículas). En **móvil**
(`< 1024px`) la decoración pesada no se pinta (`.mv-fondo`, `.shape`, `.mv-flecha`,
`.mv-brillo`).

Todo lo que el motor esconde vive bajo `html.mo-ready`: si `motion.js` no carga, el deck se ve
completo y navega igual (las clases `mv-` son CSS puro y no dependen de él). Las reglas están
en [`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son obligatorias.

## Cómo se regenera la vista previa de WhatsApp

`og-source.html` dibuja la tarjeta de 1200×630 con los tokens de esta página — sin escudo del
colegio, a propósito: la presentación es una plantilla que se reutiliza en varios colegios.
Para volver a exportarla después de un cambio:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/padres-de-familia/og.png \
  paginas/padres-de-familia/og-source.html
```

Las URLs de las etiquetas `og:` son absolutas: WhatsApp no lee rutas relativas ni `data:` URI.
Si el sitio cambia de dominio hay que actualizarlas a mano. WhatsApp cachea la vista previa por
URL: si cambia la imagen y el enlace ya se compartió, hay que forzar el refresco añadiendo
`?v=2` al final del enlace.

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
- **Un `</div>` de más, ya corregido.** La lámina 17 cerraba `#stage` antes de tiempo y las
  láminas 18–22 quedaban fuera del escenario: se veían a sangre completa, sin escala y con la
  decoración descolocada. Si el HTML se toca a mano, contar los cierres de esa zona.
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

## Se proyecta tal cual: no hay nada que completar

El deck es **universal por requisito explícito**: cualquier colegio lo proyecta sin rellenar
datos, sin conseguir fotos ni logotipos y sin actualizar nada nunca. No quedan marcadores de
ningún tipo. Donde antes iba una foto o un logotipo hay SVG en línea o tratamiento
tipográfico del propio sistema; donde antes iba una cifra del colegio, el punto está dicho en
cualidad, no en cantidad, para que sea verdad en cualquier plantel. La única cifra proyectiva
(«La mayoría de estos niños trabajará en profesiones que todavía no existen», lámina 6) se
enuncia como proyección, no como medición, con su línea de honestidad al pie.
