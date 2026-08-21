# Presentación a padres de familia · 2026–2027

Deck de 18 diapositivas para las juntas con familias del colegio.
Se publica en **<https://sanoapro.github.io/activa/paginas/padres-de-familia/>**

Markup, CSS y JS del deck viven dentro de `index.html`. Se abre con doble clic, sin servidor y
sin compilar nada.

**Ya no es un archivo suelto:** carga el motor de movimiento compartido de `compartidos/`, así
que viaja como carpeta o como zip, no como un `index.html` solo. Fue una decisión deliberada,
para tener un único lugar donde arreglar el movimiento de las cuatro páginas. Fuera de eso no
hay peticiones de red: ni fuentes por CDN, ni librerías de terceros, ni imágenes remotas.
Las fotos y los logotipos que sí usa viven en `compartidos/img/` y se cargan por ruta
relativa, igual que el motor: son locales, no remotos.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. La ilustración sigue siendo SVG en línea con los tokens del sistema; además carga seis fotografías y nueve logotipos de `compartidos/img/` por ruta relativa. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |

## Movimiento y fondo

Usa el motor compartido de `compartidos/` y el vocabulario visual de
[`../upgrade-edu/`](../upgrade-edu/README.md). **Ninguna de las 18 láminas queda en blanco**:
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
de color que cruzaban la lámina al cambiar de bloque narrativo, seis veces en el deck; en una junta
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
- **Contar los cierres al editar a mano.** Hubo una vez un `</div>` de más que cerraba
  `#stage` antes de tiempo y dejaba las últimas láminas fuera del escenario: a sangre
  completa, sin escala y con la decoración descolocada. La lámina que lo contenía se
  retiró en agosto de 2026, pero el modo de fallo sigue siendo posible y **no avisa**:
  `.slide{overflow:hidden}` recorta en silencio. La comprobación es
  `awk '{t+=gsub(/<div/,"&")-gsub(/<\/div>/,"&")}END{print t}' index.html`, que debe dar 0.
- **Impresión:** `Ctrl+P` saca una diapositiva por página en horizontal (18 páginas de
  1280×720). Las fotos sí se imprimen; la decoración que solo existe en movimiento, no.

## La narrativa: no se reordena

Las 18 láminas son un embudo de gestión del cambio:
credibilidad → disonancia → desarme → tranquilidad → solución → prueba social → acción.
Cada `<section class="slide">` lleva un `data-bloque` con su fase, y el indicador de progreso se
colorea a partir de él. **Mover una diapositiva rompe el argumento**, y el bloque D
(«tranquilidad», láminas 9–12) es el corazón: es donde el padre baja la guardia.

| Bloque | Láminas | `data-bloque` |
|---|---|---|
| A · Apertura | 1–2 | `apertura` |
| B · Disonancia y desarme | 3–6 | `disonancia` |
| C · Bisagra | 7–8 | `bisagra` |
| D · Tranquilidad | 9–12 | `tranquilidad` |
| E · Solución | 13–14 | `solucion` |
| F · Resultado y prueba social | 15–16 | `resultado` |
| G · Cierre | 17–18 | `cierre` |

**El deck pasó de 22 a 18 láminas en agosto de 2026.** Se fusionaron protección con
privacidad (hoy la 11, que estrena Securly) y metodologías con casos reales (hoy la 13,
que estrena *impulsa*); se retiraron la del equipo y la de herramientas. Lo que valía de
las dos retiradas no se perdió: el seguro contra daño y robo y el stock de reemplazo
bajaron a la 11, y «no consumen contenido, lo crean» bajó a la 13. **La palabra «jugar»
salió del deck**: a un padre preocupado por las pantallas no le tranquiliza.

**El hash es posicional.** Un enlace `#13` repartido antes del cambio aterriza hoy en
otra lámina.

## Se proyecta tal cual: no hay nada que completar

El deck es **universal por requisito explícito**: cualquier colegio lo proyecta sin rellenar
datos, sin conseguir nada y sin actualizar nada nunca. No quedan marcadores de ningún tipo.
Donde iría una cifra del colegio, el punto está dicho en cualidad y no en cantidad, para que
sea verdad en cualquier plantel.

**Desde agosto de 2026 el deck sí lleva fotografías y logotipos, y eso no rompe la regla.**
Conviene tener clara la distinción, porque es la que decide qué puede entrar:

- **Lo que sigue prohibido** es lo que cada colegio tendría que conseguir: su escudo, fotos
  de su plantel, de sus maestros o de sus estudiantes, y sus cifras. Nada de eso entra.
- **Lo que sí entra** son seis fotografías genéricas —un salón de los ochenta y uno de hoy,
  una niña estudiando, una huella digital, un maestro, un cuaderno— y los logotipos de
  terceros: Google for Education Partner, Securly, IELTS, TOEFL y los de nuestras propias
  plataformas (*motiva*, *beta*, *impulsa*). **Son idénticos en cualquier plantel**, viajan
  en la carpeta y nadie tiene que conseguirlos. Al contrario: son el anclaje de credibilidad
  que al deck le faltaba.

**Cambridge se queda como texto** porque no tenemos su logotipo, igual que en `upgrade-edu`.
Y las tres marcas de certificación se presentan como **ruta**, nunca como aval ni patrocinio.

**No se puso el logotipo de ISTE** aunque está disponible, y es deliberado: las diez
competencias de la lámina 7 **no son** los siete estándares ISTE para estudiantes. Decirlo al
pie en 13 px ya era impreciso; poner el logotipo encima lo volvería una afirmación. Queda
pendiente resolver de qué marco salen realmente —ver `docs/plan-rediseno-padres.md` §5.1—
antes de atribuirlas a nadie.

La única cifra proyectiva (el **60 %** de la lámina 6) se enuncia como proyección y no como
medición, con su línea de honestidad al pie. **Su atribución está pendiente de verificar:**
la lámina nombra a *The Economist* sin título ni año porque no los tenemos, y la cifra que
circula en la literatura es 65 %, atribuida al Foro Económico Mundial y a Cathy Davidson y
bastante discutida. El 60 % es lo que dibujan las seis siluetas de diez. Si un padre pregunta
por la referencia exacta, hoy no hay una que darle: hay que cerrarla antes de proyectar.
