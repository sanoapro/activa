# upgrade edu 2026–2027

Deck de 28 diapositivas del programa comercial, estilo Google for Education.
Se publica en **https://sanoapro.github.io/activa/paginas/upgrade-edu/**

Un solo archivo, autocontenido: markup, CSS, JS e imágenes en base64 viven dentro de
`index.html`. Se abre con doble clic, sin servidor y sin compilar nada.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. ~790 KB, casi todo imágenes en base64. |
| `og.png` | Vista previa de WhatsApp (1200×630). |

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
