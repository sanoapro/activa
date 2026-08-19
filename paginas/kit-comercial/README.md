# Kit comercial

Una sola lámina de 1280×720 con los accesos que el equipo comercial usa a diario.
Se publica en **https://sanoapro.github.io/activa/paginas/kit-comercial/**

No hay scroll: la lámina se escala para caber entera en cualquier pantalla, igual
que el deck de [upgrade-edu](../upgrade-edu/).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo el kit: markup, CSS y JS en un solo archivo. |
| `descargables/index.html` | **Página 2**: los formatos que el equipo descarga. Sí se desplaza, porque la lista va a crecer. |
| `assets.js` | **Generado.** Retratos del equipo y logos, en base64. No editar a mano. Lo usan las dos páginas. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |
| `QR/` | Códigos QR de los accesos que lo tengan. Se cargan por ruta relativa, no en base64: pesan de más para meterlos en `assets.js`. |

## Las dos páginas se ven igual

Descargables no es una lista suelta: usa el mismo sistema que la lámina —manchas pastel de fondo,
filete Google al canto, pradera animada al pie, título con las letras de colores, tarjetas con
velo bajo el cursor, filete que crece y ⧉ para copiar el enlace—. Lo único propio de la página 2
es lo que exige el scroll: barra de avance, revelado al bajar y una columna lateral que explica
las tres acciones.

Con **un solo** descargable la rejilla se vería a medio llenar, así que la tarjeta pasa a ocupar
el ancho entero y parte las acciones a un panel lateral (clase `.uno`, que el JS pone y quita
solo según cuántos haya). Al llegar el segundo documento vuelve la rejilla, sin tocar nada.

## Movimiento

Las dos páginas usan el motor compartido de `compartidos/`. En la lámina: cascada al armarse,
tarjetas magnéticas que se acercan al cursor, inclinación 3D y confirmación visible al copiar un
enlace. En descargables, lo mismo, más lo que pide el scroll: revelado al bajar y barra de avance.

Cada tarjeta va en envoltura doble —`.twrap` (cascada) → `.tmag` (imán) → `.tile` / `.doc`
(inclinación)— para que los tres `transform` no se pisen entre sí ni con la escala de `#stage`.

La tarjeta **no es un enlace**: es un contenedor con una capa `a.t-link` que la cubre entera
(`inset:0`, `z-index:2`) y una botonera `.t-acts` por encima (`z-index:3`). Los botones son
hermanos de la capa, nunca hijos suyos. Anidarlos dentro del `<a>` —como estaba antes— es HTML
inválido y cada navegador lo resuelve a su manera: el botón QR terminaba abriendo el enlace de la
tarjeta. Cancelar el clic con `preventDefault()` no es garantía; no anidarlos, sí.
Las tarjetas `pronto:true` quedan fuera de todo: no deben sentirse clicables.

La pradera está trazada para 1280 px de ancho. En la lámina eso es exacto; en descargables el
`svg` lleva `min-width:1280px` y el pie recorta, porque comprimirla deja las briznas como agujas.
Y como el crecido de cada brizna es una animación, con «reducir movimiento» se monta ya crecida:
sin esa regla la pradera desaparecería.

Las reglas están en [`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son
obligatorias.

## Cómo se usa

- Clic en una tarjeta → abre el destino en pestaña nueva.
- Pasar el cursor y clic en **⧉** → copia el enlace al portapapeles (para mandarlo por WhatsApp).
- Teclas **1–9** y **0** → abren el acceso correspondiente, en el orden en que se leen (izquierda a derecha, de arriba abajo). El **0** es el décimo, como en cualquier barra de tareas; con doce accesos, los dos últimos (Reembolso y Compra directa) quedan sin atajo — no hay más teclas de un dígito. **D** → descargables. **F** → pantalla completa.
- Botón **QR** (solo en las tarjetas que traen `qr`) → abre el código a pantalla completa sobre
  fondo blanco, para que la sala lo escanee. Se sale con el botón **← Volver al kit** (arriba a la
  izquierda, donde vive el «atrás» de cualquier navegador), con **Esc**, con la ✕ o tocando el fondo.
  El botón con palabras no sobra sobre la ✕: quien llega desde una tarjeta tiene que VER la salida.
  A diferencia del ⧉, se ve siempre y no solo al pasar el cursor: en un evento hay que saber que
  el código existe, y en una pantalla proyectada muchas veces no hay cursor que pasar.
- Las láminas **apartadas** (sin `url`, marcadas con `pronto:true`) no abren nada: existen para
  que el equipo sepa que esa herramienta viene en camino.
- En **descargables**: cada tarjeta abre el documento de tres formas y el **⧉** copia el enlace de
  copia, que es el que se manda por WhatsApp —quien lo reciba obtiene su propia copia, no la del
  que lo mandó—. **Esc** regresa al kit.

## Cómo agregar o cambiar un enlace

En `index.html`, al final, están las tres listas `VENTA`, `EVENTOS` e `INTERNA` —una por fila de la lámina—. Cada entrada es:

```js
{ id:'cotizador',          // llave del icono en el objeto ICO
  nombre:'Cotizador',
  color:'--blue',          // token de color (ver :root)
  color2:'#0d47a1',        // tono oscuro del degradado del icono
  tinte:'--blue-t',        // pastel del velo y del chip
  desc:'…',                // una línea, máximo dos renglones
  host:'sanoapro.github.io',
  url:'https://…' }
```

Si el acceso nuevo necesita otro pictograma, se agrega su `path` al objeto `ICO`
con la misma llave del `id`, en retícula 24×24 de Material.

El campo **`qr`** es opcional y apunta a la imagen del código (`qr:'./QR/loquesea.png'`).
Lo acompañan **`qrTitulo`** y **`qrLema`**, que son lo que la lámina del código pone en grande
—titular y oferta— en vez del nombre de la tarjeta. `qrLema` admite marcado (se pinta con
`innerHTML`) porque lleva resaltados: `<b class="gem">` da el degradado de la marca Gemini y
`<b class="gratis">` el verde del «sin costo». Es texto nuestro, escrito en esa misma lista;
nada de ahí viene de fuera.
Con eso basta: la tarjeta gana el botón y la lámina a pantalla completa, sin tocar nada más.
El diálogo `#qr` vive **fuera** de `#stage` a propósito —la lámina va escalada por `transform`,
y un `position:fixed` colgado de ella se escala también y deja de cubrir la pantalla—.

Un QR con recorte de fantasía (estrella, logo al centro) es un QR al filo del estándar: por eso
la lámina lo pinta lo más grande que quepa y le añade un margen blanco propio, que es la zona de
silencio que el PNG recortado no trae. **Cada QR nuevo hay que probarlo con un teléfono de
verdad** antes de llevarlo a un evento; que el archivo contenga la URL correcta no garantiza que
una cámara lo levante.

La retícula es de **5 + 3 + 4**: venta lleva cinco accesos, eventos tres, y proceso
interno pasó a cuatro cuando entró el cotizador de **Compra directa** (ago-2026) — es una
herramienta de venta, pero la fila de venta ya estaba llena, así que la fila interna
cambió su clase a `.g4`, cuya densidad ya existía. Las tres filas miden lo mismo de alto
(≈106 px por tarjeta) y por eso la tarjeta es horizontal, con el icono al costado.

Las filas apretadas **se aprietan solas** por clase de rejilla: `.g4` (286 px por tarjeta)
baja el icono a 38 y el cuerpo un punto; `.g5` (≈229 px, la fila de venta desde que entró
el cotizador de arrendamiento) baja el icono a 34 y el cuerpo otro punto. No es densidad
porque sí — con el tamaño de la fila de tres, «Presentación comercial» se parte en dos
líneas y la tarjeta rebasa los 106 px. **Las descripciones de la fila de cinco tienen que
quedarse en una idea corta** (≈55 caracteres, dos líneas a 10.5 px); si crecen, desbordan.
Una sexta tarjeta en esa fila ya no cabe con este diseño: ahí toca repartir de nuevo, no
seguir apretando.

La base de datos vive en **eventos** y no en proceso interno a propósito: se llena el
día del evento, con el registro en la mano.

## Cómo agregar un descargable

En `descargables/index.html`, la lista `DOCS`. Con el **id del documento de Google** basta:
las tres acciones —copia a Drive, PDF y Word— se derivan de él.

```js
{ id:'responsiva',        // llave del icono en el objeto ICO de esa página
  nombre:'Carta Responsiva',
  tipo:'Documento de Google',
  color:'--blue', color2:'#0d47a1', tinte:'--blue-t',
  desc:'…',
  docId:'1Af5…',          // el id que aparece en la URL del documento
  nota:'…' }              // opcional, al pie de la tarjeta
```

El documento tiene que estar compartido como **«cualquiera con el enlace, lector»**; si no,
quien abra `/copy` verá una pantalla de permiso en vez de la copia.

## Cómo se regenera `assets.js`

Los retratos y logos salen del objeto `BRAND` del deck, para no duplicar imágenes.
Se corre desde la raíz del repositorio:

```bash
python -c "
import json
l=open('paginas/upgrade-edu/index.html',encoding='utf-8').read().split('\n')[4077]
b=json.loads(l[l.index('{'):l.rindex('}')+1])
keep=['vJuan','vMartin','vJosue','vRoberto','vVicky','vZeni','activa','gfepartner','upgradeedu']
open('paginas/kit-comercial/assets.js','w',encoding='utf-8').write(
  'window.BRAND = '+json.dumps({k:b[k] for k in keep},ensure_ascii=False)+';\n')
"
```

(El `4077` es el índice de la línea donde vive `const BRAND` en el deck; si el
deck cambia, hay que buscarla de nuevo.)

## Cómo se regenera la vista previa de WhatsApp

`og-source.html` dibuja la tarjeta de 1200×630 con los mismos logos e iconos del
kit. Para volver a exportarla después de un cambio:

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/kit-comercial/og.png \
  paginas/kit-comercial/og-source.html
```

Las URLs de las etiquetas `og:` son absolutas: WhatsApp no lee rutas relativas ni
`data:` URI. Si el sitio cambia de dominio hay que actualizarlas a mano.

WhatsApp cachea la vista previa por URL. Si cambia la imagen y el enlace ya se
compartió, hay que forzar el refresco añadiendo `?v=2` al final del enlace.

## Notas

- La página lleva `<meta name="robots" content="noindex">`: es para el equipo, no
  para buscadores. Los destinos igual piden credenciales.
- El pasto animado es el mismo de la diapositiva 22 del deck: cada brizna crece
  desde el suelo una vez y luego se mece a perpetuidad.
- Todo respeta `prefers-reduced-motion`.
