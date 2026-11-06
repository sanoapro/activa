# Kit comercial

Una sola lámina de 1280×720 con los accesos que el equipo comercial usa a diario.
Se publica en **<https://sanoapro.github.io/activa/paginas/kit-comercial/>**

No hay scroll: la lámina se escala para caber entera en cualquier pantalla, igual
que el deck de [upgrade-edu](../upgrade-edu/).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo el kit: markup, CSS y JS en un solo archivo. |
| `privado/index.html` | **Página 2, «Privado»**: ligas para compartir, páginas internas y descargables. Sí se desplaza, porque las listas van a crecer. |
| `descargables/index.html` | Solo redirige a `privado/`. Era la página 2 hasta nov-2026; se conserva para no romper la liga vieja. |
| `assets.js` | **Generado.** Retratos del equipo y logos, en base64. No editar a mano. Lo usan las dos páginas. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |
| `QR/` | Códigos QR de los accesos que lo tengan. Se cargan por ruta relativa, no en base64: pesan de más para meterlos en `assets.js`. |

## Las dos páginas se ven igual

Privado no es una lista suelta: usa el mismo sistema que la lámina —manchas pastel de fondo,
filete Google al canto, pradera animada al pie, título con las letras de colores, tarjetas con
velo bajo el cursor, filete que crece y ⧉ para copiar el enlace—. Lo único propio de la página 2
es lo que exige el scroll: barra de avance, revelado al bajar y una columna lateral que explica
las tres acciones.

Una sección con **una sola** tarjeta se vería a medio llenar, así que la tarjeta pasa a ocupar
el ancho entero y parte las acciones a un panel lateral (clase `.uno`, que el JS pone y quita
solo, **por sección**, según cuántas haya). Hoy le toca a Descargables. Al llegar la segunda
tarjeta vuelve la rejilla, sin tocar nada.

## Movimiento

Las dos páginas usan el motor compartido de `compartidos/`. En la lámina: cascada al armarse,
tarjetas magnéticas que se acercan al cursor, inclinación 3D y confirmación visible al copiar un
enlace. En Privado, lo mismo, más lo que pide el scroll: revelado al bajar y barra de avance.

Cada tarjeta va en envoltura doble —`.twrap` (cascada) → `.tmag` (imán) → `.tile` / `.doc`
(inclinación)— para que los tres `transform` no se pisen entre sí ni con la escala de `#stage`.

La tarjeta **no es un enlace**: es un contenedor con una capa `a.t-link` que la cubre entera
(`inset:0`, `z-index:2`) y una botonera `.t-acts` por encima (`z-index:3`). Los botones son
hermanos de la capa, nunca hijos suyos. Anidarlos dentro del `<a>` —como estaba antes— es HTML
inválido y cada navegador lo resuelve a su manera: el botón QR terminaba abriendo el enlace de la
tarjeta. Cancelar el clic con `preventDefault()` no es garantía; no anidarlos, sí.
Las tarjetas `pronto:true` quedan fuera de todo: no deben sentirse clicables.

La pradera está trazada para 1280 px de ancho. En la lámina eso es exacto; en Privado el
`svg` lleva `min-width:1280px` y el pie recorta, porque comprimirla deja las briznas como agujas.
Y como el crecido de cada brizna es una animación, con «reducir movimiento» se monta ya crecida:
sin esa regla la pradera desaparecería.

Las reglas están en [`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son
obligatorias.

## Cómo se usa

- Clic en una tarjeta → abre el destino en pestaña nueva.
- Pasar el cursor y clic en **⧉** → copia el enlace al portapapeles (para mandarlo por WhatsApp).
- Teclas **1–9** y **0** → abren el acceso correspondiente, en el orden en que se leen (izquierda a
  derecha, de arriba abajo). El **0** es el décimo, como en cualquier barra de tareas; con quince
  accesos, los cinco últimos quedan sin atajo — no hay más teclas de un dígito. **P** → Privado
  (la **D** de los antiguos Descargables sigue funcionando como alias). **F** → pantalla completa.
- Botón **QR** (solo en las tarjetas que traen `qr`) → abre el código a pantalla completa sobre
  fondo blanco, para que la sala lo escanee. Se sale con el botón **← Volver al kit** (arriba a la
  izquierda, donde vive el «atrás» de cualquier navegador), con **Esc**, con la ✕ o tocando el fondo.
  El botón con palabras no sobra sobre la ✕: quien llega desde una tarjeta tiene que VER la salida.
  A diferencia del ⧉, se ve siempre y no solo al pasar el cursor: en un evento hay que saber que
  el código existe, y en una pantalla proyectada muchas veces no hay cursor que pasar.
- Las láminas **apartadas** (sin `url`, marcadas con `pronto:true`) no abren nada: existen para
  que el equipo sepa que esa herramienta viene en camino.
- El botón **Privado** (candado, en la cabecera de «Proceso interno») abre la página 2. Su número
  es cuántas tarjetas se pueden abrir allá —hoy **06**— y **se cambia a mano** en `index.html`
  al agregar o quitar una.
- En **Privado**: cada tarjeta dice a quién se le puede mandar («Se puede mandar» en verde,
  «Solo equipo» en rojo). El **⧉** copia la liga; en los descargables copia el enlace de copia,
  así quien lo reciba obtiene su propia copia, no la del que lo mandó. En pantallas táctiles el
  ⧉ se ve siempre, porque no hay cursor que pasar. **Esc** regresa al kit.

## Cómo agregar o cambiar un enlace

En `index.html`, al final, están las tres listas `VENTA`, `EVENTOS` e `INTERNA` —una por fila de la
lámina—. Cada entrada es:

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

La retícula es de **5 + 5 + 5**: venta lleva los cotizadores, las listas de precio y el
comparador de licencias; eventos las tres presentaciones más el taller y el registro; y
proceso interno las cuatro herramientas del equipo más **Quiénes somos**
(nov-2026: el comunicado de uso responsable pasó a Privado y su lugar lo tomó Quiénes somos;
ago-2026: las dos presentaciones bajaron a eventos y la base de
datos salió del kit; sep-2026: el manual de la consola cerró la fila interna, que era de
tres, y G-Workspace llevó la de venta a cinco; el deck del Proyecto Piloto llevó la de
eventos a cinco, y el comunicado sobre el acuerdo de la SEP hizo lo mismo con la interna).
**Las tres filas están llenas**: el siguiente acceso ya no cabe en ninguna.
Las tres filas miden lo mismo de alto (≈106 px por tarjeta) y por eso la tarjeta es
horizontal, con el icono al costado.

Las filas apretadas **se aprietan solas** por clase de rejilla: `.g4` (286 px por tarjeta,
hoy sin uso) baja el icono a 38 y el cuerpo un punto; `.g5` (≈229 px) baja el
icono a 34 y el cuerpo otro punto — la usan **venta**, desde que entró G-Workspace
(12-sep-2026), **eventos**, desde que entró el deck del Proyecto Piloto, e **interna**, desde
que entró el comunicado de uso responsable (22-sep-2026). No es densidad porque sí — con el tamaño de la
fila de tres, «Presentación comercial» se parte en dos líneas y la tarjeta rebasa los
106 px. **Las descripciones de las filas de cuatro y de cinco tienen que quedarse en una
idea corta** (≈55 caracteres, dos líneas); si crecen, desbordan. Una sexta tarjeta en una
de esas filas ya no cabe: de ahí en adelante toca repartir de nuevo, no seguir apretando.

Las dos presentaciones viven en **eventos** y no en herramientas de venta a propósito: son
láminas para proyectar delante de gente, no cosas con las que se arma un precio.

## La página Privado

Reúne lo que es **para el equipo y no para proyectar**, en tres secciones. Cada una es una lista
al final de `privado/index.html`; el HTML se arma solo.

| Sección | Lista | Qué lleva hoy |
| --- | --- | --- |
| Para compartir | `COMPARTIR` | Invitación a la Capacitación Canva (12-nov), MasterClass de Gemini (YouTube) y MasterClass de Canva **apartada** |
| Conocimiento del equipo | `INTERNAS` | Los cinco programas, Comparativa de competidores y Uso responsable |
| Descargables | `DOCS` | Carta Responsiva |

**«Privado» es una etiqueta, no una cerradura.** GitHub Pages es público y la página no pide
contraseña: cualquiera con la liga entra, y la Comparativa trae prospectos. La protección es no
repartir la liga de Privado; por eso cada tarjeta dice si se manda o no. Si eso deja de bastar,
hay que sacar esas páginas del repositorio, no esconderlas mejor.

### Cómo agregar una liga (Para compartir o Conocimiento del equipo)

```js
{ id:'video',               // llave del icono en el objeto ICO de esa página
  nombre:'MasterClass de Gemini',
  tipo:'Video de YouTube',  // el chip bajo el nombre
  color:'--blue', color2:'#0d47a1', tinte:'--blue-t',
  aud:'si',                 // 'si' = se puede mandar · 'no' = solo equipo
  audTxt:'…',               // opcional: otro texto para esa etiqueta
  desc:'…',
  url:'https://…',          // sin parámetros de rastreo (el si= de YouTube se quita)
  accion:'Ver en YouTube',  // texto del botón; por omisión «Abrir»
  nota:'…' }                // opcional, al pie
```

Una tarjeta con **`pronto:true`** y sin `url` queda **apartada**: borde punteado, «Próximamente»,
sin botón, sin ⧉ y sin imán. Es la de la **MasterClass de Canva**: cuando llegue su liga, se quita
`pronto`, se pone `url`, `aud:'si'` y `accion:'Ver en YouTube'`.

Sin JavaScript las tarjetas no se arman: un bloque `<noscript>` arriba repite las mismas ligas.
**Si se agrega o quita una tarjeta, se cambia también ahí.**

**Pendiente con fecha:** la invitación a la Capacitación Canva vence el **jueves 12 de noviembre
de 2026** (campo `vence`). Después se quita o se cambia por la grabación.

### Cómo agregar un descargable

En `privado/index.html`, la lista `DOCS`. Con el **id del documento de Google** basta:
las tres acciones —copia a Drive, PDF y Word— se derivan de él.

```js
{ id:'responsiva',        // llave del icono en el objeto ICO de esa página
  nombre:'Carta Responsiva',
  tipo:'Documento de Google',
  color:'--blue', color2:'#0d47a1', tinte:'--blue-t',
  desc:'…',
  docId:'1Af5…',          // el id que aparece en la URL del documento
  aud:'si',               // a quién se le puede mandar
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
l=next(x for x in open('paginas/upgrade-edu/index.html',encoding='utf-8')
       if x.startswith('const BRAND = {'))
b=json.loads(l[l.index('{'):l.rindex('}')+1])
keep=['vJuan','vMartin','vJosue','vRoberto','vVicky','vZeni','activa','gfepartner','upgradeedu']
open('paginas/kit-comercial/assets.js','w',encoding='utf-8').write(
  'window.BRAND = '+json.dumps({k:b[k] for k in keep},ensure_ascii=False)+';\n')
"
```

La línea se **busca** por su inicio (`const BRAND = {`) en vez de leerse por
índice. Antes estaba escrita a mano —`[4077]`— y para agosto de 2026 el deck ya
había crecido hasta la 5430: el procedimiento documentado había dejado de
funcionar sin que nadie se enterara, porque solo se corre al cambiar un retrato.

**`keep` es una lista blanca a propósito.** El deck lleva los logotipos de todas
las plataformas —impulsa, motiva, securly, integra…— y el kit no los usa: solo
los seis retratos, `activa`, el distintivo de partner y `upgradeedu`. Agregar
una marca al deck no obliga a regenerar este archivo.

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
  para buscadores. Los destinos de la lámina igual piden credenciales; los de Privado, no.
- El pasto animado es el mismo de la diapositiva 22 del deck: cada brizna crece
  desde el suelo una vez y luego se mece a perpetuidad.
- Todo respeta `prefers-reduced-motion`.
