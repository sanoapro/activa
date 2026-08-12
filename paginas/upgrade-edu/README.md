# upgrade edu 2026–2027

Deck de 28 diapositivas del programa comercial, estilo Google for Education.
Se publica en **https://sanoapro.github.io/activa/paginas/upgrade-edu/**

Markup, CSS, JS e imágenes en base64 viven dentro de `index.html`. Se abre con doble clic, sin
servidor y sin compilar nada.

**Ya no es un archivo suelto:** desde agosto de 2026 carga el motor de movimiento compartido de
`compartidos/`, así que viaja como carpeta o como zip, no como un `index.html` solo. Fue una
decisión deliberada, para tener un único lugar donde arreglar el movimiento de las cuatro
páginas.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. ~790 KB, casi todo imágenes en base64. |
| `og.png` | Vista previa de WhatsApp (1200×630). |

## Movimiento

Usa el motor compartido: coreografía de entrada en cascada por diapositiva —que se **reinicia**
cada vez que se vuelve a entrar, porque el deck se recorre varias veces en una junta—,
microinteracciones en los controles, seguimiento suave del cursor en portada y cierre, y un campo
de partículas en la portada con la paleta de Google.

La cascada entra por **animación** y no por transición: la regla de realce del propio deck
(`.slide.on .card`) pisa por especificidad la transición de `motion.css`, y una transición no
arranca en el mismo recálculo en que la diapositiva pasa de `display:none` a visible. Con
transición, la cascada degradaba en silencio a «aparecer de golpe».

Las reglas están en [`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son
obligatorias. Al agregar animaciones propias hay que anularlas también en `@media print`: la tecla
`P` imprime a PDF y una hoja en blanco llegaría al cliente.

## Atajos

- `←` `→` navegar
- `O` vista panorámica de todas las diapositivas
- `F` pantalla completa
- `P` imprimir a PDF en 16:9

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
