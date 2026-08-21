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
| `og.png` | Vista previa de WhatsApp (1200×630). |
| `og-source.html` | La lámina de 1200×630 con la que se genera `og.png`. |

Las etiquetas `og:` apuntan a `og.png` con **URL absoluta**: WhatsApp no lee rutas relativas. La
imagen va junto a la página, como manda [`docs/estructura.md`](../../docs/estructura.md).

La página lleva `<meta name="robots" content="noindex, nofollow">`: tiene el catálogo de precios
de compra y los datos bancarios de la empresa. Se manda por enlace, no se busca.

---

## Cómo está organizado por dentro

Tres pasos, en el orden en que el comercial los recorre:

| Sección | Título | Qué se hace ahí |
|---|---|---|
| `#s1` | Catálogo y captura | Busca, agrega con `+` y captura cantidad y años en la misma fila |
| `#s2` | Datos de la propuesta | Colegio, contactos, vigencia, datos fiscales y bancarios |
| `#s3` | Cierre | Total, desglose de IVA y la tabla tal como la verá el colegio |

**Se captura arriba y se cierra abajo.** El 21-ago-2026 los datos del colegio pasaron delante del
cierre, para que las tres herramientas se recorran igual: primero todo lo que se captura
—partidas y colegio—, y al final la revisión de lo que se va a mandar. De paso `#s1` estrenó su
«Paso 1»: la numeración visible arrancaba en el 2 desde que se fusionaron dos pasos.

**Buscar y agregar eran dos pasos y dejaron de serlo.** Antes el catálogo era una
rejilla de 37 tarjetas —seis pantallas de scroll— y la cantidad se capturaba en un
paso 2 aparte: por cada renglón había un viaje de ida y vuelta. Ahora es una sola
tabla densa donde el botón de la izquierda agrega y esa misma celda pasa a ser el
campo de cantidad.

Hay una razón técnica que obligaba a elegir uno de los dos sitios: el motor manda
el foco al primer error usando el `id` `lqty-<renglón>`, y ese `id` solo puede
existir una vez en el documento.

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
tabla de revisión ni en la propuesta; su propia fila lo dice en la columna de importe —«Falta la
cantidad», «Faltan los años»— y el cierre lo avisa. Un renglón por debajo de su `minQty` tiñe la
fila y bloquea el documento.

Cuando el cálculo no es confiable, `body.calc-invalid` **atenúa todo el bloque financiero** y el
motivo viaja pegado al total, en el subtítulo de la barra de acciones: es lo único que el
comercial tiene siempre a la vista. Un guion mudo con la causa cuatro secciones más abajo se lee
como herramienta rota.

## Persistencia, folio y revisión

Todo en `localStorage`, con prefijo `activa.compra.*`: cotización actual, índice, una entrada
por cotización, contador diario del folio, perfil del vendedor, copias de recuperación y máximo
de revisión. Sin `localStorage` la herramienta **sigue cotizando**; solo deja de guardar, y lo
dice en el estado de guardado del encabezado.

El límite son **20 borradores** (`MAX_DRAFTS`). Al llegar, la herramienta **se niega a crear el
21** en vez de desalojar el más viejo en silencio, y avisa dos antes. Si el navegador se queda
sin espacio, el guardado falla con banner permanente y copia de recuperación; si otra pestaña
guardó una versión más nueva, **no se sobrescribe**: se conserva la ajena, se respalda la tuya y
el banner se queda puesto hasta resolverlo.

## Impresión

`window.doPrint()` → `preparePrint()` espera tipografías e imágenes, construye el documento
completo dentro de `#printRoot`, y con `body.pp-on` el `@media print` **oculta la aplicación
entera** y muestra solo el documento: portada acotada a una hoja, encabezado repetido y pie
fijo.

La espera de imágenes lleva **tope de 3 segundos por imagen**. Sin él, una imagen que ya había
fallado dejaba la promesa pendiente para siempre —su evento `error` ya se disparó y no vuelve— y
`Ctrl+P` se quedaba pulsado sin imprimir y sin explicar nada. Vencido el plazo se imprime igual:
mejor el documento sin logotipo que ningún documento.

Verificado en Chrome con **1, 40 y 200 partidas**: sin hojas en blanco y con la portada
completa.

El documento lleva portada con folio, revisión, fecha y vigencia, y dos secciones:

| # | Sección | Qué lleva |
|---|---|---|
| 1 | Partidas de la cotización | La tabla dentro de `.p-tblcard`, el cierre en una tarjeta `.p-hero` y las condiciones en viñetas |
| 2 | Datos bancarios y contacto | Chips de entrega y envío, transferencia con advertencia de titular, contacto del colegio y contacto en activa |

**La hoja interior no repite la portada** (21-ago-2026). El cuerpo arranca directo en la sección
1: ni logotipo, ni folio, ni cliente, ni ciudad. Esos datos viven en la portada y en el
encabezado y el pie corridos de cada hoja; repetirlos costaba media hoja y no decía nada nuevo.
En pantalla la identidad la lleva la barra del overlay, que ya rotula institución y folio.

> **Al medir hojas, usa un perfil de Chrome limpio.** `--user-data-dir` reutilizado conserva
> el `localStorage` de la corrida anterior, y el borrador guardado se suma al de la nueva: los
> conteos crecen solos y el antes/después deja de significar nada. Con perfil limpio y una
> cotización de cinco partidas, compra ocupa **tres hojas** antes y después de este cambio: lo
> que se ganó fue aire dentro de las hojas, no hojas menos.

### El cierre del documento y el pie de cada hoja

**21-ago-2026.** Cuatro correcciones de Martín al revisar los PDF de la papelería v5:

- **El colegio va antes que el vendedor.** El documento cierra con dos bloques rotulados:
  **«Contacto del colegio»** —una tarjeta `.pe` por contacto capturado, en vez de la línea corrida
  separada por barras que a tres contactos era ilegible— y debajo **«Tu contacto en activa»** con
  quien preparó la cotización, su teléfono, su correo y el sitio. Cierra diciendo con quién se
  sigue la conversación.
- **Sin firmas ni «Aceptación del colegio».** La cotización es virtual: se manda como PDF o como
  correo y nadie la firma sobre el papel. Un renglón de firma prometía un acto que no ocurre. Lo
  clava la prueba «El documento no pide firmas», que busca `p-sign` y el rótulo de aceptación.
- **«Cotización válida hasta» salió de la rejilla de contacto**: ya viaja en la portada, en el
  encabezado corrido y en el pie de cada hoja. Lo mismo con entrega y envío, que son condiciones
  comerciales y ahora abren la sección como chips.
- **La portada nombra a quien pidió la cotización.** Debajo del colegio y la ciudad va
  **«A la atención de»** con los contactos capturados, uno por renglón: nombre y correo. Quien
  la recibe tiene que reconocerse en la primera hoja, no en la última. El teléfono y el
  resto se quedan en el bloque del cierre, para no engordar la portada.
- **El pie de cada hoja identifica a la empresa**, que es norma de la casa. `.print-runfoot` pasó
  de una fila a dos: arriba razón social, RFC y domicilio fiscal a 6,4 pt; abajo folio,
  institución, tipo de cotización y vigencia. El bloque de CSS y el marcado son **idénticos en las
  tres páginas**.

El pie mide **11,3 mm** con un domicilio de una línea. Vive `position:fixed` **dentro del área de
contenido**, así que hay que reservarle sitio en el flujo o la última línea de una hoja llena se le
encima: por eso `.print-content.pp-body` pasó de 7 mm a **13 mm** de relleno inferior. Lo que no
debe hacer nunca es invadir el margen de página —ahí Chromium lo fragmenta y su texto reaparece
arriba de la hoja siguiente—, y por eso el `@page` conserva sus 16 mm.

La portada también bajó su tope de altura de 271 mm a **256 mm**. El pie ocupa los últimos
11,3 mm del área de contenido, y sin ese tope la portada se metía debajo con un nombre de
colegio largo: el renglón del folio quedaba tapado por el pie. Medido en el peor caso
—96 caracteres de nombre, `data-len="xxl"`, tres contactos con correos largos— la portada
ocupa 233 mm de contenido en una caja de 250 mm, así que sobra aire.

**La entrega es una constante, no un campo.** Desde el 21-ago-2026 toda cotización de compra
directa dice **«15 días hábiles después de la confirmación del pago»**: en compra el disparador
real es el pago, y el plazo es el mismo para todas. Vive en `APP_CONFIG.delivery` y el campo
«Tiempo de entrega» desapareció de la captura, junto con `validity.delivery` del estado, del
saneador y de `TEXT_BINDINGS`: si nadie puede editarlo, nadie promete otro plazo por descuido.
Los borradores anteriores traen la clave vieja; el saneador lee campo por campo y la descarta,
así que importan sin migración. Lo clava la prueba «La entrega es una leyenda fija».

Los otros dos cotizadores **no** llevan esta leyenda, y es deliberado: en el cotizador Upgrade
Edu la entrega es una fecha del ciclo escolar (`APP_CONFIG.cycle.delivery`) que manda el
calendario, y en arrendamiento el equipo se entrega al firmar el contrato y tras la aprobación
de crédito. Poner ahí «después del pago» sería prometer algo falso.


### Papelería v5

**21-ago-2026.** El vocabulario de tarjetas y chips del documento dejó de ser de esta página y
pasó a ser el de la empresa: vive entre las marcas `/* ===== PAPELERÍA v5 · inicio ===== */` y
`/* ===== PAPELERÍA v5 · fin ===== */` al final del segundo `<style>`, y es **byte a byte el
mismo bloque** que el de `paginas/cotizador/` y `paginas/arrendamiento/`. Para comprobar que no
se separaron:

```sh
for p in cotizador arrendamiento compra; do
  sed -n '/PAPELERÍA v5 · inicio/,/PAPELERÍA v5 · fin/p' paginas/$p/index.html > /tmp/$p.css
done
diff /tmp/cotizador.css /tmp/arrendamiento.css && diff /tmp/cotizador.css /tmp/compra.css
```

No se extrajo a `compartidos/css/`: el PDF es el entregable y una hoja externa que no cargue lo
rompería en silencio. El bloque trae dos capas del mismo marcado —pantalla en px para el overlay
y papel en mm/pt bajo `.pp-body`— con `.p-card` y su familia, `.p-tblcard`, `.p-kpis`,
`.p-fchips` y `.p-hero`. La regla que lo gobierna: **`.p-note` es una línea de 140 caracteres
como máximo**; lo más largo es una `.p-card--terms` con viñetas, o sobra.

Qué cambió aquí en concreto:

- La franja Google de la portada bajó de **10 mm a 2 mm** —a esa altura leía como error de
  maquetación, no como marca— y los 8 mm liberados se devolvieron al aire de la hoja.
- El cierre pasó de tres renglones sueltos (`.p-totals`) a **una tarjeta con el total en grande**
  y el subtotal con su IVA debajo, en el orden en que se calculan.
- La nota de cuatro renglones sobre el IVA se volvió una tarjeta **«Cómo leer los importes»** con
  dos viñetas; las partidas sin costo, un **chip verde** sobre la tabla.
- **Entrega y envío son condiciones comerciales, no datos de contacto**: salieron de la rejilla
  de contacto —que quedó en cuatro celdas parejas— y abren la sección 2 como chips.

Y un defecto que venía de antes y se corrigió en la misma pasada: **la columna de Concepto se
quedaba en dos palabras por renglón.** El número de parte y los dos importes iban en `nowrap` y,
con el ancho automático, se comían el espacio de la única columna que tiene algo que decir. Ahora
la tabla lleva `table-layout:fixed` y un `<colgroup>` con el reparto explícito
—16 / 35 / 16 / 16.5 / 16.5 %—, el número de parte puede partirse y los encabezados de importe
dejaron el `nowrap` con el que se encimaban. Los anchos se declaran **una sola vez**, sin
duplicar por medio: el ancho de una columna no depende de si se ve en pantalla o en papel.

## El archivo en Drive

Cada PDF generado puede además quedar **archivado en Google Drive**, en
`3. Compra/‹correo del vendedor›/`, con su JSON al lado para reabrirlo después. El diseño
completo vive en [`docs/drive-PDF/`](../../docs/drive-PDF/); la lógica es una sola copia para
los tres cotizadores: [`compartidos/js/archivo-drive.js`](../../compartidos/js/archivo-drive.js).
El enganche es idéntico al de [arrendamiento](../arrendamiento/), cuyo README lo describe
completo; aquí son las mismas cinco piezas: el contenedor `#archivoDrive` (al final del paso 3),
el `<script>` del módulo, `ArchivoDrive.montar({page:"compra", …})`, y las tres llamadas —
`capturar()` en `preparePrint()` y en la ruta de `Ctrl+P`, `mostrar()` en `afterprint`,
`revisarPendiente()` en `renderDocumentMeta()`—. La huella de impresión ya existía en esta
página; el archivo solo la aprovecha.

- El bloque no existe hasta generar un PDF; `datos()` se congela **al imprimir**, no al subir.
- El JSON archivado viaja con el sobre de Exportar (`fileType:"activa-compra-quote"`), así que
  se reabre con **Importar JSON** tal cual.
- Lo no subido queda marcado bajo `activa.compra.archivo-pendiente.v1` y el bloque reaparece en
  ámbar al reabrir la cotización — se vuelve a elegir el PDF, sin reimprimir.
- Si el módulo no carga o el puente no responde, la página cotiza igual que hoy: el archivo es
  una capa encima, nunca un requisito.

## Pruebas internas

Se abren con **`?test=1`**: 49 pruebas sobre el IVA, el catálogo contra la tabla confirmada el
19-ago-2026, las bajas, los seminuevos, los mínimos, la persistencia, el escapado y el
documento. Toda pasada de presentación tiene que dejarlas igual: **si una cambia de resultado,
se tocó lógica y se revierte**.

Siete de las 49 nacieron de una revisión adversarial el 20-ago-2026, y cada una existe porque un
defecto introducido a propósito pasaba desapercibido:

| Prueba | El defecto que atrapa |
|---|---|
| `esc() escapa los cinco caracteres, siempre` | Cambiar un carácter del regex de `esc()` dejaba la suite entera en verde |
| `El documento impreso no acepta marcado del cliente` | Lo mismo, en la salida que llega al colegio |
| `El correo no acepta marcado del cliente` | Lo mismo, en el HTML del correo |
| `Con un renglón sin capturar, el total se declara parcial` | La cifra grande afirmaba «Total con IVA» faltando renglones |
| `El separador de millares se acepta, no se traga` | «3,000» vaciaba el campo sin decir por qué |
| `Una imagen rota no deja la impresión colgada` | `Ctrl+P` se quedaba esperando para siempre |
| `El conflicto entre pestañas deja un aviso que no se va solo` | El estado más peligroso solo avisaba con un toast |

El corredor **rechaza las pruebas asíncronas registradas con `test()`**: una función `async` que
él no espera se aprobaría sin comprobar nada. Para eso está `asyncTest()`, que las encola, las
resuelve con plazo de 5 s y repinta el informe.

> En jsdom sin navegador, `Autoguardado normal realiza tres escrituras` falla por los
> temporizadores del entorno, no por el código. **En Chrome pasan las 49.**

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
`.shead`/`.kick`, `.cfg`, `.result`/`.res-side`/`.res-main`/`.kv`/`.rowhead`, `details.fold`,
`.grid2`/`.grid3`/`.f`/`.hint`/`.field-error`, `.miniLbl`/`.tagx`, `.btn` y variantes,
`.inline-action`, `.chip`, `.warns`/`.warn`, `.toast`, `.tbox`/`.tscroll`/`.tfoot`/`.gh`,
`.actbar`/`.actprice`, el pie, y el documento imprimible completo (`p-*` y `cv-*`).

**Lo que hubo que crear, y por qué:**

- **`.cattbl` y `.crow`**, la tabla del catálogo. Cuelga de `.tbox`/`.tscroll`/`.tfoot` y usa los
  `.gh` del cotizador como encabezado, pero **no existe allá**: el cotizador no vende partidas
  sueltas ni captura renglones libres. Sustituye a la rejilla `.igrid`/`.item`, que se probó
  primero y resultó demasiado espaciosa para 37 partidas.
- **`.qcell`**: la celda de cantidad. El botón `.addbtn` y el campo ocupan el mismo sitio y la
  misma altura, para que la fila **no salte** al agregar.
- **`.famrow`**: el encabezado de familia es una fila de la propia tabla, no un bloque aparte,
  para que las columnas no se desalineen entre grupos. Lleva el `.aico` y el `.acount` del
  cotizador dentro.
- **`.detrow`**: la descripción larga sirve una vez, la primera. Ocupar sitio permanente por ella
  es lo que volvía el catálogo ilegible, así que se pliega, y en los renglones ya agregados esa
  misma fila hospeda el campo de **concepto** y el botón de duplicar la partida.
- **`.fchip`**: filtro por familia. El `.seg` del cotizador es para dos o tres opciones; aquí son
  siete y tienen que envolver. Usa `aria-pressed`, como el `.seg`.
- **Las tablas cuelgan de `.tbox`, no de `table` suelto.** En el cotizador las reglas de `table`,
  `th` y `td` son globales; aquí eso repintaría también las tablas del documento impreso y de la
  vista previa del correo, que traen las suyas.
- **`.tbox th.txt`/`td.txt`**: la columna de concepto no es una cifra, así que no se alinea a la
  derecha ni se recorta en una línea, al revés que las numéricas.

En 760 px la tabla **deja de ser tabla**: cada partida se vuelve un bloque con la cantidad a la
izquierda, y el nombre y el importe arriba. Un scroll horizontal de seis columnas no se puede
usar con una mano.

**Lo que no se copió:** el acento morado `--plus` y `body[data-pkg="plus"]`, la escalera de años
(`.ladder`/`.rung`/`.yrchip`), el volumen de redes (`.vgrid`/`.vrow`/`.vtrack`), las áreas
TI/IP/DP, los esquemas `.cfg-pay`, `.pay`, `.cartopt`, `.lic` y la navegación de seis pasos.
Aquí son tres pasos y una sola tabla.

### La búsqueda, y por qué tiene atajos

Con 37 partidas y seis familias, escribir es más rápido que buscar con el ojo:

- **`/`** enfoca el buscador desde cualquier punto de la página, salvo si ya estás escribiendo.
- **`Enter`** agrega cuando la búsqueda dejó **una sola** coincidencia y deja el foco en la
  cantidad. Con varias, no adivina: lo dice y espera.
- La coincidencia se **resalta** en el concepto, para ver por qué salió esa fila.
- Los **chips de familia** acotan sin borrar lo escrito.
- **«Solo agregadas»** convierte la tabla en la cotización: se ordena por renglón —el orden en
  que se imprime— y **solo ahí** aparecen las flechas de reordenar, porque solo ahí ese orden
  significa algo.

### La fila de identidad

El encabezado lleva una segunda fila que dice de quién es la cotización y de qué catálogo sale:

```
Compra directa · Instituto Thomas Jefferson · Querétaro, Qro. · catálogo del 19 de agosto de 2026
                                                    Folio MM-… · Revisión 1 · Guardado localmente
```

Sin colegio capturado dice **«sin institución»** en cursiva, que es información y no un guion
mudo. Lo escribe `renderDocumentMeta()`, que ya se ocupaba del folio y la revisión. Existe porque
con veinte borradores guardados la única forma de saber en cuál estabas era bajar al último paso
y abrir un pliegue.

### Las tarjetas de captura tienen color

Los tres `details.fold` eran blanco sobre blanco y su único color vivía en un cuadrito de 34 px.
Ahora cada tarjeta declara `--fc` y `--ft`, que pintan el filete superior de 3 px, el degradado
del encabezado, el ícono y el filete de apertura: **azul** para colegio y contactos, **rojo** para
vigencia y contacto, **amarillo** para lo fiscal y bancario. La zona de captura se hunde en gris
azulado con los campos en blanco puro, y los bloques largos se agrupan en `.fgroup`.

> Las reglas quedan acotadas a `.fold`, `.foldb` y `.fgroup` a propósito: la tabla del catálogo
> usa `.crow`, y un selector suelto que la alcanzara repetiría el desastre del commit `6125135`.

### Sin hero, y por qué

La página abría con etiqueta, título, chip de IVA, alcance, folio, revisión, estado de guardado,
«Paso 1», otro título y un párrafo de instrucciones: **doce renglones de presentación antes de
la primera partida**. Quien la usa es un comercial que ya sabe cotizar y abre la herramienta
veinte veces al día.

Ahora el encabezado lleva la marca y la navegación; debajo, la fila de identidad con el colegio
y el folio; luego la barra de resumen con las cuatro cifras; y enseguida la línea de
trabajo: **buscador arriba a la derecha**, chip de IVA y contador a la izquierda, y los ocho
filtros en una **rejilla de cuatro columnas** que se lee como índice del catálogo en vez de como
una tira de píldoras de anchos distintos. **La primera fila del catálogo entra en la primera
pantalla.**

Cada partida ocupa un renglón compacto: **el nombre en negritas** con sus etiquetas en la misma
línea —usando el ancho que sobra a la derecha en vez de crecer hacia abajo—, la unidad al lado
del campo de cantidad, y debajo **la descripción de lo que el colegio está comprando**.

### De dónde salen los nombres y las descripciones

`CATALOG` es la única fuente, y su texto se cotejó contra tres lugares, en este orden de
autoridad:

1. **`docs/descripcion-de-productos/catalogo-productos.md`** — la ficha comercial. Manda en el
   *qué es* y en el nombre canónico del producto.
2. **`docs/Costos activa sin IVA.xlsx`** — manda en el dato duro: modelo, capacidad, vigencia,
   número de parte y precio.
3. **[`paginas/cotizador/`](../cotizador/)** — se usó como cotejo de redacción para los
   productos que las dos herramientas comparten (Chrome Education Upgrade, Education Plus,
   Teaching & Learning, Securly, Wayground, Everway, motiva, beta e impulsa), para que el
   colegio no lea dos descripciones distintas del mismo producto según quién le cotice.

De ahí salieron seis correcciones de nombre —`Securly Filter + Securly Classroom`,
`Google Workspace for Education Teaching & Learning`, `Asus Chromebook Rugged CZ1104`,
`Everway (antes TextHelp) · Read&Write, EquatIO y OrbitNote`, `WriQ para Chrome` y los cinco
escalones de seminuevo, que ahora nombran el modelo real (`Chromebook Lenovo 300e G4
seminueva · N años de uso`) en vez de «flip/touch».

La descripción se muestra a **dos líneas** en la fila; el botón de ficha completa abre el texto
entero y la nota comercial. Es el mismo campo `d` que imprime el documento y la tabla de
revisión, así que **lo que el comercial lee en pantalla es exactamente lo que va a leer el
colegio en el PDF**. La búsqueda también mira ahí: escribir «classroom» encuentra Securly y los
dos impulsa, y resalta la coincidencia dentro de la descripción.

El aviso de IVA sobrevive porque es una advertencia, no un adorno: es el chip **`SIN IVA`** en
ámbar (`--g-yel-t` / `--g-yel-d`) a la derecha de los filtros. El verde afirma; esto avisa. Por
lo mismo, el `.cv-cap` de la portada impresa es amarillo y no verde.

### El ancho

La aplicación usa `--app-max: 1560px`, no los 1200 px que heredó del deck. El documento impreso
es A4 por `@page` y la vista de propuesta tiene su propio ancho de lectura de 940 px: **ninguno
de los dos depende del ancho de la aplicación**, así que la tabla del catálogo puede respirar.

### Dos trampas de esta tabla, para que no se repitan

- **`.crow` estaba definida dos veces.** El renglón de contacto (`display:grid` de tres
  columnas) y la fila del catálogo compartían nombre, y la regla de contactos convertía cada
  `<tr>` en una rejilla: la tabla salía con el encabezado por un lado y las celdas encimadas por
  otro. El renglón de contacto ahora se llama **`.ccrow`**.
- **Los campos de la tabla necesitan especificidad.** Desde que la cantidad y los años son
  `type="text"`, la regla global de formularios (`input[type=text]{width:100%}`) **empata** en
  especificidad con `.qwrap input` y gana por ir después: el campo se comía la celda entera y la
  unidad quedaba recortada a cero. Por eso las reglas van ancladas a su celda
  (`.qcell .qwrap input`, `.ycell .ywrap input`).
- **El encabezado pegajoso no tolera ancestros con `overflow`.** `position:sticky` se mide
  contra el contenedor de desplazamiento más cercano, y tanto `overflow-x:auto` como
  `overflow:hidden` crean uno. Con `.tscroll` y `.tbox` encima, el encabezado se iba 130 px
  hacia abajo y dejaba una banda en blanco. Por eso el catálogo usa **`.catbox`** (sin
  `overflow`) y **`.catscroll`** (visible en escritorio); el desplazamiento horizontal vuelve
  solo por debajo de 1080 px, y ahí el encabezado deja de ser pegajoso, porque no pueden
  coexistir.

### La sumatoria y la tabla de revisión

El `.res-side` dice **Total** con el importe **con IVA** en `--mono` a 33 px, el `.sub` aclara
«IVA 16 % incluido», y bajo el filete van dos `.kv`: subtotal sin IVA e IVA. Nada más.

**Cuando falta capturar un renglón, el precio lo dice.** La barra de resumen pasa de «3» a
«2 de 3», la etiqueta sobre el importe deja de decir «Total con IVA» y pasa a **«Total parcial ·
falta 1 renglón»** en ámbar, y el subtítulo nombra lo que falta. El PDF ya estaba bloqueado, pero
un botón deshabilitado no detiene a quien lee la cifra en voz alta por teléfono.

A su derecha, el `.res-main` lleva la **tabla de revisión**: es literalmente lo que va a leer el
colegio, con las columnas **Cantidad · Concepto · No. de parte · Precio unitario · Importe** —las
tres numéricas en `--mono`, a la derecha— y las dos últimas agrupadas bajo un `.gh.c2` que repite
que son precios sin IVA. Es de **solo lectura**: la captura vive en el paso 1, en la tabla del
catálogo. Usa las mismas funciones de formato que el documento impreso (`printQtyLabel`, `printUnitPrice`, `moneyOrFree`), así que no puede
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

Los campos de cantidad y años son **`type="text"` con `inputmode="numeric"`**, no `type="number"`.
Con `type=number` el navegador se come «3,000» antes de que la validación lo vea: el campo
quedaba vacío, sin mensaje, y el renglón dejaba de sumar en silencio. Ahora «3,000», «3 000» y
« 7 » se capturan y el campo se reescribe normalizado; lo que sigue siendo inválido **conserva el
texto y muestra el error**. Se pierden las flechitas del navegador; se gana no cotizar de menos.

Bordes de campo con `--field-line` (contraste ≥ 3:1), foco visible siempre, `.catscroll`
enfocable por teclado cuando lleva desplazamiento, `::after` de −10 px en los cierres de `.chip` y 28 px de área táctil en
`pointer:coarse`, `aria-live` en el estado de guardado y en la caja de avisos, y `aria-hidden`
más `focusable="false"` en los `svg` decorativos.

## Dónde está dada de alta

- **Portal** (`index.html` de la raíz): tarjeta «Cotizador de compra directa».
- **Kit comercial**: fila **HERRAMIENTAS DE VENTA**, que pasó de cinco a seis accesos para
  recibirla. Vivía en la fila interna solo porque la de venta estaba llena, y eso contradecía la
  decisión del 19-ago-2026. Los contadores de cada franja se calculan de las listas.
- [`docs/estructura.md`](../../docs/estructura.md): carpeta y URL de publicación.

## Al tocar esta página

1. Corre **`?test=1` antes y después**. Mismo resultado o se revierte.
2. Imprime con `Ctrl+P` completo: portada, partidas, datos bancarios y los dos bloques de contacto.
3. Ábrela en ventana privada: con tu `localStorage` lleno no ves lo que ve un comercial que
   entra por primera vez.
4. Zoom al 200 % y ventana de 360 px: **sin desbordamiento horizontal** (verificado a 1440,
   1280, 1024, 900 y 390 px).
5. Sin red y sin `localStorage`: tiene que seguir cotizando.
6. Si tocas la tabla del catálogo, comprueba que el encabezado siga pegado al bajar y que **no
   aparezca una banda en blanco** arriba: es la señal de que volviste a meter un ancestro con
   `overflow`.
7. Si tocas los `@media`, **respeta el orden de mayor a menor**: 1080 → 900 → 760 → 700 → 420 →
   359. Estuvieron desordenados y el bloque de 900 revertía en el teléfono lo que el de 760
   acababa de poner.
