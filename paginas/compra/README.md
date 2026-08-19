# Cotizador de compra directa

Arma la cotización de compra de un colegio **partida por partida** —equipos, licencias,
programas y servicios— y produce la propuesta lista para imprimir o mandar. Es una herramienta
de trabajo, no una presentación: guarda borradores, lleva folio y revisión, y lo que imprime
llega al cliente.

Se publica en **https://sanoapro.github.io/activa/paginas/compra/**

Un solo archivo autocontenido, salvo el motor de movimiento compartido. No hay build: se edita
y se recarga.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo: markup, CSS, catálogo, motor de cálculo, persistencia, impresión y pruebas. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Todavía no existe** — ver el final de este archivo. |

Las etiquetas `og:` apuntan a `og.png` con **URL absoluta**: WhatsApp no lee rutas relativas. La
imagen va junto a la página, como manda [`docs/estructura.md`](../../docs/estructura.md).

La página lleva `<meta name="robots" content="noindex, nofollow">`: tiene el catálogo de precios
de compra y los datos bancarios de la empresa. Se manda por enlace, no se busca.

---

## Cómo está organizado por dentro

Cuatro pasos, en el orden en que el comercial los recorre:

| Sección | Título | Qué se hace ahí |
|---|---|---|
| `#s1` | Catálogo | Busca la partida por concepto o número de parte y la agrega |
| `#s2` | Partidas de la cotización | Captura cantidades y años, reordena, ajusta el concepto |
| `#s3` | Cierre de la cotización | Total, desglose de IVA y la tabla tal como la verá el colegio |
| `#s4` | Datos para la propuesta | Colegio, contactos, vigencia, firma, datos fiscales y bancarios |

El catálogo son **37 partidas** repartidas en seis familias (`FAMILIES`): equipos y accesorios,
protección y filtrado, plataformas y licencias, programas activa, servicios y soporte, y equipo
seminuevo.

## Dónde se cambian los precios y las reglas

Todo vive en dos objetos congelados al principio del `<script>`, y **nada más**:

- `APP_CONFIG` — fecha del catálogo, tasa y etiqueta de IVA, días de vigencia (31), límites de
  cantidad (1 a 999 999), años (1 a 25), renglones (200) y longitud del concepto, y los datos
  por omisión del vendedor y del proveedor.
- `CATALOG` — una entrada por partida: `k`, `part`, `fam`, `n`, `d`, `price` (**neto, sin IVA**),
  `unit`, `annual`, `minQty` y `note`.

Cero precios literales en la lógica. Agregar una partida o mover un precio es editar `CATALOG`.

Las **bajas del 19-ago-2026** están anotadas en el comentario de `CATALOG` y no deben
recuperarse del Excel: ya no se venden.

## La aritmética

- Los precios del catálogo son **netos, sin IVA**.
- Importe de un renglón = `cantidad × precio`, y en las licencias anuales
  `cantidad × años × precio`.
- El **IVA se calcula una sola vez, sobre el subtotal**, nunca renglón por renglón: así no se
  arrastran centavos.
- No hay descuentos. Es una decisión comercial cerrada el 19-ago-2026; cuando exista, el renglón
  va en el `.res-side`, entre el subtotal y el IVA.

## Qué bloquea qué

Un renglón sin cantidad —o una licencia anual sin años— **no suma al total** y no aparece en la
tabla de revisión ni en la propuesta; el paso 2 lo marca como pendiente y el paso 3 lo avisa.
Un renglón por debajo de su `minQty` marca error y bloquea el documento.

Cuando el cálculo no es confiable, `body.calc-invalid` **atenúa todo el bloque financiero** y el
motivo viaja pegado al total, en el subtítulo de la barra de acciones: es lo único que el
comercial tiene siempre a la vista. Un guion mudo con la causa cuatro secciones más abajo se lee
como herramienta rota.

## Persistencia, folio y revisión

Todo en `localStorage`, con prefijo `activa.compra.*`: cotización actual, índice, una entrada
por cotización, contador diario del folio, perfil del vendedor, copias de recuperación y máximo
de revisión. Sin `localStorage` la herramienta **sigue cotizando**; solo deja de guardar, y lo
dice en el estado de guardado del hero.

## Impresión

`window.doPrint()` → `preparePrint()` espera tipografías e imágenes, construye el documento
completo dentro de `#printRoot`, y con `body.pp-on` el `@media print` **oculta la aplicación
entera** y muestra solo el documento: portada acotada a una hoja, encabezado repetido y pie
fijo.

## Pruebas internas

Se abren con **`?test=1`**: 42 pruebas sobre el IVA, el catálogo contra la tabla confirmada el
19-ago-2026, las bajas, los seminuevos, los mínimos, la persistencia y el documento. Toda pasada
de presentación tiene que dejarlas igual: **si una cambia de resultado, se tocó lógica y se
revierte**.

---

## Sistema visual

La página aplica el sistema de [`paginas/cotizador/`](../cotizador/): mismos tokens en su propio
`:root`, mismos nombres de clase, sin hoja compartida y **sin una sola tipografía cargada** (las
pilas de `--disp`, `--body` y `--mono` degradan solas).

**El acento es el azul de Google, igual que en el cotizador y en el de arrendamiento.** Antes
esta página era verde. Se cambió el 19-ago-2026 porque `--acc` pinta los filetes, los cuadros
numerados y los chips del documento impreso, y un acento por herramienta produciría tres
papelerías distintas saliendo de la misma empresa. Las tres se distinguen por el hero, el
`.kick` y su `og.png`. El verde queda reservado a su significado —confirmado o ahorro—: el botón
de correo, la palomita `.ok`, el chip del propio remitente, `.kv.save`, el importe «Sin costo» y
el estado «guardado».

**Componentes reusados tal cual:** `.gbar`, `.gdots`, `.hbar`/`.logo`/`.vertag`, la marca
embebida, `.hnav`, `.cfgbar`/`.cfgin`/`.cfgf`/`.cfgprice`, `.hero`/`.tag`/`.iva`/`.herorow`,
`.shead`/`.kick`, `.cfg`, `.result`/`.res-side`/`.res-main`/`.kv`/`.rowhead`,
`.area`/`.ahead`/`.aico`/`.acount`/`.igrid`/`.item`/`.item.out`, `details.fold`,
`.grid2`/`.grid3`/`.f`/`.hint`/`.field-error`, `.miniLbl`/`.tagx`, `.btn` y variantes,
`.inline-action`, `.chip`, `.warns`/`.warn`, `.toast`, `.tbox`/`.tscroll`/`.tfoot`/`.gh`,
`.actbar`/`.actprice`, el pie, y el documento imprimible completo (`p-*` y `cv-*`).

**Lo que hubo que adaptar o crear, y por qué:**

- **`.item--part`**, la variante de tarjeta de esta página. El `.item` del cotizador describe una
  inclusión —icono y texto—; aquí la tarjeta **vende una partida** y necesita pie con precio y
  botón. Misma caja, mismos tokens, una sola columna, y adentro `.cpart`, `.cunit`, `.cyear`,
  `.cmin`, `.cnote`, `.cfoot` y `.cprice`, todos con tokens de allá. `.item.out` marca la partida
  sin precio de lista.
- **Las tablas cuelgan de `.tbox`, no de `table` suelto.** En el cotizador las reglas de `table`,
  `th` y `td` son globales; aquí eso repintaría también las tablas del documento impreso y de la
  vista previa del correo, que traen las suyas.
- **`.tbox th.txt`/`td.txt`**: la columna de concepto no es una cifra, así que no se alinea a la
  derecha ni se recorta en una línea, al revés que las tres numéricas.
- **`.lrow` y compañía** (el editor de partidas del paso 2) no tienen equivalente en el
  cotizador, que no captura renglones libres. Se conservan, repasados con los tokens.

**Lo que no se copió:** el acento morado `--plus` y `body[data-pkg="plus"]`, la escalera de años
(`.ladder`/`.rung`/`.yrchip`), el volumen de redes (`.vgrid`/`.vrow`/`.vtrack`), las áreas
TI/IP/DP, los esquemas `.cfg-pay`, `.pay`, `.cartopt`, `.lic` y la navegación de seis pasos.
Aquí son cuatro pasos y una sola lista de partidas.

### El chip del hero avisa, no afirma

El `.iva` del cotizador dice «Todos los precios incluyen IVA» **en verde**. Aquí no puede: los
precios son netos. Dice **«Precios netos, sin IVA · el IVA se agrega una sola vez, al final»** y
va en tono de advertencia (`--g-yel-t` / `--g-yel-d`). El verde afirma; esto avisa. Por lo mismo,
el `.cv-cap` de la portada impresa es amarillo y no verde.

### La sumatoria y la tabla de revisión

El `.res-side` dice **Total** con el importe **con IVA** en `--mono` a 33 px, el `.sub` aclara
«IVA 16 % incluido», y bajo el filete van dos `.kv`: subtotal sin IVA e IVA. Nada más.

A su derecha, el `.res-main` lleva la **tabla de revisión**: es literalmente lo que va a leer el
colegio, con las columnas **Cantidad · Concepto · No. de parte · Precio unitario · Importe** —las
tres numéricas en `--mono`, a la derecha— y las dos últimas agrupadas bajo un `.gh.c2` que repite
que son precios sin IVA. Es de **solo lectura**: la captura vive en el paso 2, porque meter
inputs en celdas empeora la captura en pantallas angostas. Usa las mismas funciones de formato
que el documento impreso (`printQtyLabel`, `printUnitPrice`, `moneyOrFree`), así que no puede
divergir de lo que se imprime. La vigencia del catálogo va en el `.tfoot`.

## Movimiento

Motor compartido de `compartidos/`, en **nivel contenido**: microinteracciones en botones,
`Motion.botonEstado()` en las acciones que tardan, cascada corta al cargar y barra de avance de
3 px **absoluta dentro de `.cfgbar`**, para no alterar la altura que mide
`setupDynamicOffsets()`.

Lo que **no** se anima, por [`docs/normativa-motion.md`](../../docs/normativa-motion.md):
números y totales (`#barTotal`, `#actPrice`, el `.big` del resultado y toda celda de tabla),
campos de formulario y los `details.fold` que los contienen, e indicadores con `aria-live`
propio (`#saveState`, folio, revisión, `#warnBox`). El `@media print` del motor compartido anula
el revelado; `prefers-reduced-motion` apaga todo.

## Accesibilidad

Bordes de campo con `--field-line` (contraste ≥ 3:1), foco visible siempre, `.tscroll` enfocable
por teclado, `::after` de −10 px en los cierres de `.chip` y 28 px de área táctil en
`pointer:coarse`, `aria-live` en el estado de guardado y en la caja de avisos, y `aria-hidden`
más `focusable="false"` en los `svg` decorativos.

## Dónde está dada de alta

- **Portal** (`index.html` de la raíz): tarjeta «Cotizador de compra directa».
- [`docs/estructura.md`](../../docs/estructura.md): carpeta y URL de publicación.

## Pendiente

**Falta `og.png`.** Las cuatro etiquetas `og:`/`twitter:` ya apuntan a
`https://sanoapro.github.io/activa/paginas/compra/og.png`, pero el archivo no existe: al
compartir el enlace por WhatsApp no sale vista previa. Se genera como en
[`paginas/arrendamiento/`](../arrendamiento/), con un `og-source.html` de 1200×630 que se
captura.

## Al tocar esta página

1. Corre **`?test=1` antes y después**. Mismo resultado o se revierte.
2. Imprime con `Ctrl+P` completo: portada, partidas, datos bancarios y firmas.
3. Ábrela en ventana privada: con tu `localStorage` lleno no ves lo que ve un comercial que
   entra por primera vez.
4. Zoom al 200 % y ventana de 360 px.
5. Sin red y sin `localStorage`: tiene que seguir cotizando.
