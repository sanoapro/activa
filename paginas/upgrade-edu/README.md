# upgrade edu 2026–2027

Deck de 34 diapositivas del programa comercial, estilo Google for Education.
Se publica en **https://sanoapro.github.io/activa/paginas/upgrade-edu/**

Markup, CSS, JS e imágenes en base64 viven dentro de `index.html`. Se abre con doble clic, sin
servidor y sin compilar nada.

**Ya no es un archivo suelto:** desde agosto de 2026 carga dos archivos de `compartidos/`, así
que viaja como carpeta o como zip, no como un `index.html` solo.

| Archivo compartido | Qué pasa si falta |
|---|---|
| `js/motion.js` | Nada grave: el deck queda completo, quieto y navegable (regla 4 de la normativa). |
| `js/precios-ciclo.js` | La **lámina 33** se queda sin precios y lo dice en pantalla. No es opcional. |

Las dos son la misma decisión: un único lugar donde arreglar el movimiento —y ahora los
precios— de todas las páginas, en vez de una copia por archivo.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. ~790 KB, casi todo imágenes en base64. |
| `og.png` | Vista previa de WhatsApp (1200×630). |

## Movimiento

Usa el motor compartido: coreografía de entrada en cascada por diapositiva —que se **reinicia**
cada vez que se vuelve a entrar, porque el deck se recorre varias veces en una junta—,
microinteracciones en los controles, seguimiento suave del cursor en portada y cierre, y un campo
de partículas conectadas en la portada con los **cuatro colores** de Google.

La cascada entra por **animación** y no por transición: la regla de realce del propio deck
(`.slide.on .card`) pisa por especificidad la transición de `motion.css`, y una transición no
arranca en el mismo recálculo en que la diapositiva pasa de `display:none` a visible. Con
transición, la cascada degradaba en silencio a «aparecer de golpe».

### Qué se mueve y dónde

Transiciones y respuestas, que no pertenecen a ninguna diapositiva:

| Pieza | Cuándo | Dónde vive |
|---|---|---|
| **Onda Material** | en cada avance, desde el punto del clic (o desde el canto por el que se avanza con el teclado) | `.mv-ondas`, dentro de `#stage` |
| **Onda del desplegable** | al presionar una píldora `.exp-h`, desde el punto del dedo y en el siguiente color de Google | `.mv-ripple`, dentro de la propia píldora |

**El barrido de capítulo se retiró en agosto de 2026**, a petición del cliente. Eran cuatro
barras de color que cruzaban la lámina al entrar a un divisor; en una junta se leían como un
parpadeo y no como puntuación. Los cuatro cortes del deck ya los marcan los divisores mismos.
Si vuelve, va a [`docs/normativa-motion.md`](../../docs/normativa-motion.md) primero.

**La onda se calibró en la misma fecha.** Antes eran dos círculos de 1280 px de radio con 110 ms
de diferencia, resueltos en 740 ms: un disco más ancho que el escenario cruzando la lámina
entera en menos de un segundo, y por duplicado. Ahora es **uno solo, de 620 px, en 1.1 s**.
Rompe el tope de 900 ms de la normativa a propósito — esa regla protege lo que hace *esperar*, y
esto no bloquea nada, porque la lámina ya cambió. Alargarlo es justo lo que lo vuelve discreto.

La onda del desplegable escucha `pointerdown` y no `click`: tiene que salir con el dedo
abajo, no al soltarlo — es la diferencia entre «te oí» y «ya terminé». Es la única
respuesta táctil a un control *dentro* de una lámina; el resto del cromo usa las clases
`mo-` del motor compartido.

Motivos por diapositiva:

**Las 33 de contenido tienen motivo propio.** No hay lámina muerta entre la portada y el cierre:
era el defecto que arrastraba el deck, con todo el movimiento concentrado en la primera y la
última. La 34.ª —el desglose— es la excepción declarada: ahí lo que manda son las cifras.

| Diapositiva | Movimiento |
|---|---|
| 1 · portada | olas de líneas · red de partículas en los 4 colores · círculos que siguen al cursor |
| 2 · contexto | nubes de color a la deriva |
| 3 · quiénes somos | **anillo de carga** que gira por azul → rojo → amarillo → verde y se abre para dejar el `16` |
| 4 · plano | **pulso de los ejes**: cuatro vetas de color salen del origen y recorren los brazos · los cuatro emblemas al agua derivan |
| 5 · 9 · 14 · 20 · divisores | aros de encendido · **geometría flotante** con paralaje de cursor · **píldoras** que suben en cascada |
| 6 · Chromebooks | globo de meridianos que gira |
| 7 · 10 · 13 · 21 · 25 · 27 | **trazos de pizarra**: subrayado o círculo a mano alzada sobre la palabra clave |
| 8 · continuidad | **halo de resguardo**: un aro concéntrico sale de cada medallón y los cuatro se turnan, cada uno en su color |
| 11 · Canva | los cursores de los dos colaboradores se mueven sobre el lienzo |
| 12 · Wayground | la paloma y los puntos de la ilustración laten |
| 13 · Everway · 17 · motiva | **píldoras** que suben en cascada, con aro de marca al pasar el cursor |
| 15 · 24 | **pulso de flujo**: las flechas de la banda de proceso se empujan en orden |
| 16 · eleva | **subrayado a mano** sobre «seis componentes», en el amarillo de su propio eje |
| 17 · 23 | **ondas de Google Assistant**: las dos láminas donde alguien escucha del otro lado |
| 18 · beta | la escalera de niveles sube peldaño por peldaño |
| 19 · integra | el emblema de sincronización gira |
| 26 · PLUS | **flecha a mano** que se traza sola y se balancea hacia la píldora |
| 28 · piloto · la oferta | **subrayado a mano** sobre «Piloto» · **anillo de carga** alrededor del `$0` (aro de 150 px: a 74 px la cifra ya no cabe en el de 96) |
| 29 · 30 · piloto | cascada de la rejilla, con pictograma en cada renglón |
| 31 · piloto · proceso y calendario | un punto recorre la banda del coach en cuatro tiempos —una parada por semana de aula— y descansa |
| 32 · piloto · resultados | **subrayado a mano** sobre «datos propios» · cascada de la rejilla |
| 33 · el desglose | **ninguno propio, a propósito**: los importes no se animan (prohibición expresa de la normativa) y las cuatro columnas entran con el `.body`, como un bloque |
| 34 · cierre | confeti que estalla desde el centro · vaivén de las letras de Google · tarjetas que se inclinan |

Y en todas las de contenido, los círculos pastel del fondo derivan muy despacio (`.mv-flota`,
16 s por ciclo). La clase la reparte la coreografía, no el markup.

Sigue habiendo **una sola animación focal por lámina**: lo que se agregó no compite con lo que
ya había, y las láminas que sí tenían motivo propio no se tocaron. Las píldoras son *entrada*,
no ambiente — terminan y se quedan quietas—, por eso conviven con el motivo de su lámina.

**Las partículas conectadas siguen siendo solo de la portada.** Es deliberado: las láminas de
contenido están cubiertas de tarjetas opacas de borde a borde, y un campo de fondo ahí no se
vería. El plano cartesiano —la lámina de «tecnología y estrategia» del deck— resuelve lo mismo
con el pulso de los ejes, que además dice de dónde sale todo.

### La regla del estado base

Toda pieza nueva declara qué se ve cuando las guardas `mv-` apagan la animación —miniaturas,
impresión, «reducir movimiento»—, y hay dos casos opuestos:

- **Marcas que deben llegar al PDF** (subrayado, círculo, flecha): el estado base es el trazo
  **completo** y la animación va del trazo vacío al completo. Apagarla deja la marca puesta.
- **Transiciones** (las ondas) y el anillo: el estado base es **invisible**. Apagarlas las
  borra, en vez de dejar una barra de color atravesada en la hoja impresa.

Los trazos se redibujan solos en cada visita sin una línea de JS: la diapositiva inactiva es
`display:none`, y eso reinicia las animaciones CSS. Lo mismo vale para las píldoras.

**Si el motivo se dibuja en un `::before` o un `::after`**, hay que saber que `animation:none`
sobre el elemento **no** llega a sus pseudoelementos. Las guardas `mv-` ya los incluyen
explícitamente (`[class*="mv-"]::before,[class*="mv-"]::after`), pero es la clase de error que
no se ve hasta tener la hoja impresa en la mano: el halo de la 8 habría seguido latiendo en las
miniaturas y en el PDF.

Las reglas están en [`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son
obligatorias. Al agregar animaciones propias hay que anularlas también en `@media print`: la tecla
`P` imprime a PDF y una hoja en blanco llegaría al cliente.

## La lámina 33 · el desglose, año por año

La penúltima. Es la misma lámina que abre [`paginas/precios/`](../precios/), traída al deck para
cerrar la junta con el número puesto: el comercial arma el escenario —paquete, equipo y plazo,
modalidad— delante del director, y las cuatro columnas dan el importe **por alumno y por año**
con las tres formas de pago.

Tres cosas que hay que respetar al tocarla:

- **Aquí no se escribe ni un precio.** Salen de
  [`compartidos/js/precios-ciclo.js`](../../compartidos/js/precios-ciclo.js), el mismo archivo que
  alimenta la página de precios. Ese archivo es una copia consciente del `APP_CONFIG` del
  [cotizador](../cotizador/), que sigue siendo la única fuente de verdad.
- **Los tres conmutadores van dentro de `[data-noadv]`.** En este deck un clic sobre la lámina
  AVANZA; elegir un escenario delante del director no puede pasar de diapositiva. Y por lo mismo,
  los botones se construyen una vez y después solo cambian de `aria-pressed`: reconstruir su
  `innerHTML` dentro del propio clic desprendía el botón del DOM antes de que el listener del
  escenario lo mirara, `closest("[data-noadv]")` devolvía `null` sobre un nodo huérfano, y el deck
  avanzaba igual. Es un error que solo aparece al probarlo con el ratón.
- **Sin total del contrato**, decisión comercial: en la primera visita se enseña el importe anual
  por alumno, no la suma de los años. Y sin `brandmark`, porque el rótulo del escenario llega a
  «Upgrade Edu Plus · Chromebook Flip-Touch seminueva · modalidad 1:1 · 2 años» y necesita el
  ancho entero.

El semáforo de las cuatro columnas —azul el eje de años, y verde → amarillo → rojo las tres
formas de pago— es información, no adorno: se lee antes de leer un solo número. El amarillo
lleva tinta oscura porque sobre `#f9ab00` el blanco no llega al contraste mínimo ni a tamaño
grande. Prefijo `dsg-` en todo su CSS: `.seg` ya es de la barra de ejes y `.card` ya lleva el
realce del deck.

## Atajos

- `←` `→` navegar
- `O` vista panorámica de todas las diapositivas
- `F` pantalla completa
- `P` imprimir a PDF en 16:9

## El bloque del proyecto piloto (28–32)

Cinco láminas entre «Por qué activa» (27) y el desglose (33). Cierran la junta con la oferta del
piloto gratuito de cuatro semanas, en este orden: **oferta → trato → preparación → proceso y
calendario → resultados**. Cada una lleva su fase en `data-bloque`.

**El proceso y el calendario son una sola lámina.** Empezaron siendo dos y contaban lo mismo dos
veces: las cuatro semanas de aula SON cuatro de las siete del calendario, y separadas obligaban al
director a cruzar los dos dibujos en su cabeza. Ahora la fase va arriba (preparación · ejecución ·
cierre), el momento en el título de cada semana, y las dos constantes —coach semanal y horas del
docente— en una banda al pie.

**Cada renglón lleva su pictograma.** Once viñetas redondas iguales no distinguen un Chromebook de
una hora de coach; el icono sí, y sin gastar una línea. En la 32, la banda verde del
acompañamiento es la parte que tiene que emocionar: el arco de esa lámina va de la prueba
(entregables) a la aspiración (a dónde llevan) a la petición (la cita).

- **No abren capítulo.** La barra de los cuatro ejes es del programa, no del piloto, y los
  cuatro ejes ya quedaron vendidos en la lámina 25. El bloque lleva su propio hilo —`.ejebar
  .sp-bar`, cinco tramos y rótulo «Piloto · …»— que se lee como lo que es: otra cosa.
- **Prefijo `sp-`** en todo el CSS nuevo, para no chocar con los bloques `sNN-`.
- **Sin logo ni nombre de colegio.** El deck se presenta igual ante cualquier institución; el
  único dato variable de todo el archivo sigue siendo el contacto de la última lámina.
- Las siete semanas del calendario son **rangos de lunes a sábado de 2026** verificados contra
  el calendario real: 12 oct, 19 oct, 26 oct, 2 nov, 9 nov, 16 nov y 23 nov caen todos en lunes.
  Si el piloto se mueve de año, hay que rehacer los siete rangos.

## Notas

- Las imágenes van embebidas a propósito: así el deck se manda por correo o se copia a una
  USB y sigue funcionando. Los originales de esas imágenes están en
  [`compartidos/img/`](../../compartidos/img/) — de ahí se regeneran los base64.
- El objeto `BRAND`, dentro del deck, es también la fuente de
  [`../kit-comercial/assets.js`](../kit-comercial/README.md). Si se cambia un retrato acá, hay
  que regenerar ese archivo.
- Las etiquetas `og:` llevan URL absoluta: WhatsApp no lee rutas relativas ni `data:` URI. Si
  la página se mueve, hay que actualizarlas a mano.
- El contenido de producto sale de [`docs/portafolio-activa.md`](../../docs/portafolio-activa.md),
  que es la fuente de verdad.
- Todo respeta `prefers-reduced-motion` y hay hoja de impresión propia.
