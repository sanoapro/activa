# Cotizador Upgrade Edu 2026–2027

Arma la propuesta de un colegio —dispositivos, licenciamiento, capacitación y soporte— y produce
la cotización lista para imprimir o mandar. Es una **herramienta de trabajo**, no una
presentación: guarda borradores, lleva folio y revisión, y lo que imprime llega al cliente.

Se publica en **<https://sanoapro.github.io/activa/paginas/cotizador/>**

Un solo archivo de ~5 000 líneas, autocontenido salvo el motor de movimiento compartido. No hay
build: se edita y se recarga.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo: markup, CSS, motor de cálculo, persistencia, impresión y pruebas. |
| `og.png` | Vista previa de WhatsApp (1200×630). |

Las etiquetas `og:` apuntan a `og.png` con **URL absoluta**: WhatsApp no lee rutas relativas.
La imagen vivía en `compartidos/img/og-cotizador.png`, contra lo que manda
[`docs/estructura.md`](../../docs/estructura.md) —la vista previa va con su página— y contra lo
que decía el comentario del propio `index.html`. Se movió aquí.

La página lleva `<meta name="robots" content="noindex, nofollow">`: tiene el precio por alumno,
los descuentos y los datos bancarios de la empresa. Se manda por enlace, no se busca.

---

## Cómo está organizado por dentro

Seis secciones, en el orden en que el vendedor las recorre:

| Sección | Título | Qué se hace ahí |
|---|---|---|
| `#s1` | Alumnos, docentes y equipos | Docentes extra, equipos, carritos y licencias |
| `#s2` | Datos de la propuesta | Colegio, contactos, vigencia, fiscales y bancarios |
| `#s3` | Precio y formas de pago | Esquema de pago y desglose año por año |
| `#s4` | Todo lo que incluye | Desglose por área: TI, IP y DP |
| `#s5` | Acompañamiento asignado | Horas de capacitación y visitas según número de alumnos |
| `#s6` | Descuento especial por volumen de redes | Cotización de varios planteles |

**La captura va primero y el precio después**, que es como transcurre una llamada: el vendedor
apunta lo que el colegio le dicta y baja a ver la cifra. Antes el precio abría la página y los
datos vivían en el paso 5, al final de todo.

Las tres áreas —**TI** Tecnologías de la Información, **IP** Innovación y Proyectos, **DP**
Desarrollo Profesional— son las mismas que firman la Carta de Entrega Comercial y las mismas del
[catálogo de productos](../../docs/descripcion-de-productos/catalogo-productos.md).

---

## La pantalla es del vendedor

El colegio nunca ve esta herramienta: recibe el PDF. Por eso el 21-ago-2026 se retiró el hero
completo —etiqueta de ciclo, título grande, chip de IVA, alcance y bloque de folio: **siete
renglones de bienvenida antes de la primera cifra**— y los seis párrafos que explicaban cada
paso. Quien la usa ya sabe cotizar.

Lo que era el hero cabe ahora en una **segunda fila del encabezado** (`.idbar`) de unos 30 px, que
además se queda pegada al bajar:

```text
Upgrade Edu · 1:1 · Chromebooks nuevas · 4 años · 300 alumnos     Folio MM-… · Revisión 1 · Guardado
```

Conserva los ids `#heroPkg` y `#heroScope`, así que el JS que los escribe no cambió. El chip verde
«Todos los precios incluyen IVA» no se perdió: es el sufijo de la etiqueta del precio en la barra
de configuración, que ahora dice **«Precio por alumno · IVA incluido»**. La página bajó de 6 300 a
5 250 px y el ancho pasó de 1 200 a **1 560 px** (`--app-max`).

### Las tarjetas de captura tienen color

Los cinco `details.fold` eran blanco sobre blanco: tarjeta blanca, cuerpo blanco, campos blancos
y —en las secciones con `.alt`— fondo blanco. Cuatro capas del mismo color separadas por un borde
de 1 px.

Ahora cada tarjeta declara su color en dos variables locales, `--fc` y `--ft`, que pintan el filete
superior de 3 px, el degradado del encabezado, el cuadrito del ícono y el filete de apertura:

| Tarjeta | Color |
|---|---|
| Docentes, equipos y carritos | azul |
| Licencias incluidas | verde |
| Colegio y contactos | azul |
| Vigencia, entrega y contacto | rojo |
| Datos fiscales y bancarios | amarillo |

Y la zona de captura se hunde: `.foldb` va en gris azulado y los campos en blanco puro, para que
lo que hay que llenar resalte. Dentro de las tarjetas largas, los bloques de campos se agrupan en
`.fgroup` —una tarjeta blanca por bloque— en vez de flotar bajo un rótulo suelto.

## Dónde se cambian los precios y las reglas

Todos los importes viven en la **MATRIZ DE PRECIOS**: el objeto congelado **`PRECIOS`** (busca
`MATRIZ DE PRECIOS` en `index.html`). La convención de esta página: **todo va CON IVA, de
principio a fin** — los precios ya lo traen; no se agrega en ningún punto. Ojo al traer un
precio del cotizador de **arrendamiento**: aquel catálogo va **sin** IVA, y copiarlo crudo fue
el error del 22-ago-2026.

Los objetos de abajo **derivan** de la matriz: cambiar un precio es editar `PRECIOS`, no ellos
ni la lógica.

| Objeto | Qué fija |
|---|---|
| `PRECIOS` | **Todo el negocio**: `porAlumnoAnual` (los 40 precios por alumno), `equipos`, `porEquipo` (CEU y seguro por plazo), `carritos`, `docenteExtraAnual`, `adicionalAlumnoFactor`, `descuentosLicencia`, `pago`, `factoresAnuales`, `razones`, `stock`, `topePorAlumno`, `volumenRedes`, `acompanamiento`, `limites` y `vigenciaDias` |
| `APP_CONFIG.cycle` | Ciclo `2026-2027`, fecha límite de firma temprana, vigencia (de la matriz) y fecha de entrega |
| `APP_CONFIG.pricing` | La tabla `porAlumnoAnual` de la matriz, por paquete (`edu`, `plus`) y por fila de equipo (`n3`, `n4`, `flip`, `tab`) |
| `APP_CONFIG.discounts` / `annualFactors` / `equipment` / `limits` | Derivan de `pago.descuentos`, `factoresAnuales`, `porEquipo`/`razones` y `limites`/`topePorAlumno` de la matriz |
| `DEVICES` | Las etiquetas del catálogo de dispositivos; los costos los lee de `PRECIOS.equipos`. El precio del equipo va **pelón**: la CEU y el seguro se suman aparte en `deviceUnitCost()` |
| `TERMS` | Los cuatro plazos: `cb3`, `cb4` (Chromebooks nuevas a 3 y 4 años), `fl2` (Flip-Touch seminueva a 2), `tb3` (Tablet a 3). **Cada plazo declara además qué equipos existen**: su equipo de alumno (`alumno`) y los modelos docentes elegibles (`docentes`, con su equipo y su razón, leída de `PRECIOS.razones`); el stock sale de `PRECIOS.stock` |
| `TEACHER_MODELS` | Las etiquetas del modelo `docente` o `estudiante`; el equipo concreto y la razón de cada modelo los pone el plazo |
| `PAYS` | Los tres esquemas: contado, firma antes del corte, firma después; descuentos, mensualidades y porcentaje de agosto salen de `PRECIOS.pago` |
| `LICS` | Las licencias y plataformas; los descuentos al retirar salen de `PRECIOS.descuentosLicencia` |
| `ITEMS` | Cada partida del desglose, con su área, ícono y cantidad |

**Al cambiar de ciclo escolar** se toca `APP_CONFIG.cycle` y `PRECIOS.porAlumnoAnual`.

⚠ **Copia manual declarada**: `compartidos/js/precios-ciclo.js` duplica la tabla
`porAlumnoAnual` y la usan `paginas/precios/` y la lámina 33 del deck. Quien cambie un precio
por alumno en la matriz tiene que actualizar ese archivo a mano; el aviso recíproco está en la
cabecera de la matriz.

---

## La cotización a la medida (21-ago-2026)

La modalidad 0 dejó de llamarse «Sin equipos · solo licenciamiento» y ahora es **«Sin equipos
incluidos · a la medida»**: cotiza las licencias de todos los alumnos **más los equipos que el
colegio realmente pidió** —el caso que la motivó: 700 alumnos, 30 equipos y un carrito—,
prorrateados entre todos los alumnos y todos los años del contrato. El diseño completo y las
cinco decisiones que lo cerraron viven en
[`docs/actualizacion-cotizador/`](../../docs/actualizacion-cotizador/).

La regla, en una línea: **lo que se compra una vez —el equipo, su licencia CEU, su seguro y el
carrito— se divide entre todos los alumnos y todos los años; lo que es por alumno ya está en el
precio base y no se prorratea.**

- El estado nuevo es `scenario.proRata` (`{stu, doc, carts:[{cap,qty,price}]}`), que solo existe
  en la modalidad 0 y se normaliza a ceros en las demás.
- **CEU y seguro son automáticos por equipo**: no hay casilla que capturarlos, y por tanto no hay
  casilla que olvidar. Los precios están en `APP_CONFIG.equipment`.
- **El precio del carrito es siempre manual**, en las cinco modalidades; en la modalidad a la
  medida los carritos son renglones explícitos (capacidad, cantidad, precio) y el precio 0 es
  válido sin autorización: el colegio puede tener ya los suyos.
- **El stock de reemplazo aplica con la misma regla** (2 % nuevos, 20 % seminuevos).
- **Decisión D-1**: el fierro prorrateado entra al precio de lista y escala y se descuenta como
  todo lo demás. La caja de cálculo del vendedor enseña la cuenta completa y el **porcentaje de
  recuperación del fierro** bajo el esquema elegido; ese dato es de pantalla y **no viaja** al
  PDF, al correo ni al escenario — lo custodia la prueba «El prorrateo no viaja al documento».
- Con equipos capturados, `modLbl` dice **«a la medida»**; sin ellos sigue diciendo «sin
  equipos». La advertencia `NO_DEVICES` solo se emite si de verdad no hay equipos.

## Qué bloquea qué

Hay **tres** estados de preparación, no dos, y confundirlos es caro. `getReadiness()` los devuelve:

| Estado | Qué habilita | Qué lo rompe |
|---|---|---|
| `calculable` | Que se **vea el precio** por alumno | Solo lo financiero: alumnos, precio no positivo o no finito, precio implausible, carrito por razón sin precio, escenario corrupto |
| `proposalReady` | El botón **Ver propuesta** | Lo anterior, más cualquier decisión obligatoria pendiente (hoy: el modelo de equipos docentes, cuando el plazo ofrece más de uno) |
| `documentReady` | **PDF** y **correo** | Lo anterior, más todo dato documental por capturar: institución, ciudad, fechas, RFC, banco… |

El motor es la única fuente de verdad: cada advertencia `t:"e"` declara en `blocks` si tumba el
**precio** (`"price"`) o solo el **documento** (`"document"`). `engineErrorsToIssues()` no decide, traduce.

> **La regla que hay que respetar.** Un dato solo puede llevar `blocks:"price"` si de verdad entra en
> el importe por alumno. El modelo de equipos docentes no entra —mueve `eqDocInc` y el parque que
> describe el documento, nunca `list` ni los esquemas de pago— y por eso vaciaba el precio de **toda
> cotización recién abierta**: el estado inicial nace sin modelo elegido. Solo funcionaba en las
> máquinas con borradores heredados de `v2`/`v3`, porque `migrateDeviceFields()` les fija `docente`.
> La suite estaba en verde mientras tanto, porque una prueba afirmaba el comportamiento roto.

Cuando el precio sí es incalculable, el motivo se escribe **junto al precio**, en `#actSub` de la
barra de acciones, que es lo único siempre a la vista. Un `—` mudo con la causa cuatro secciones más
abajo se lee como herramienta rota, y así se reportó.

---

## Persistencia, folio y revisión

Guarda en `localStorage`, con estas llaves (versión `v3`, y migra desde `v2`):

```text
activa.cotizador.current.v3      el borrador abierto
activa.cotizador.index.v3        el índice de borradores
activa.cotizador.quote.v3.<id>   cada cotización
activa.cotizador.counter.v3.<…>  consecutivos de folio
activa.cotizador.revmax.v3.<…>   revisión máxima emitida
activa.cotizador.recovery.v3.<…> recuperaciones ante fallo
activa.cotizador.seller-profile.v3  el perfil del vendedor
activa.cotizador.archivo-pendiente.v1  cotizaciones impresas y aún no archivadas en Drive
```

- Máximo **20 borradores** (`MAX_DRAFTS`); la importación acepta hasta 2 MB.
- El **folio** se valida por estructura, no solo por caracteres: iniciales, fecha `AAAAMMDD` real,
  consecutivo (o `REC`) y código anticolisión de un alfabeto sin `I`, `O`, `0` ni `1`. Ver
  `FOLIO_ROOT_RE`.
- La **revisión** sube al reemitir; a partir de la 2 el documento declara que sustituye anteriores.
- Si `localStorage` no está disponible, `HAS_STORAGE` queda en falso y la herramienta sigue
  cotizando sin guardar; el aviso sale en `#storageBanner`.

## Compartir un escenario

El estado completo viaja en el fragmento de la URL como `#scenario=<código>`, sincronizado con
`debounce` y escuchado con `hashchange`. Compartir es mandar el enlace: quien lo abre ve la misma
cotización. El esquema es `schemaVersion: 5` —agregó `proRata` para la cotización a la medida— y
hay migración desde la 2, la 3 y la 4, cubierta por pruebas; la de v4 → v5 entra con `proRata` en
ceros y no mueve ningún precio.

**21-ago-2026 · El botón «Compartir» del encabezado se retiró.** Con el archivo en Drive, la
forma natural de mover una cotización es su JSON completo; en su lugar vive **«Insertar JSON»**:
un diálogo donde el vendedor pega el texto del `.json` copiado del visor de Drive (o de un
export). Por dentro es el mismo camino que Cotizaciones → Importar JSON
(`importQuotePayload()`, compartido por las dos puertas). El escenario sigue funcionando por el
hash de la URL y por el código `ACTIVA3` del modal de Cotizaciones — solo perdió su botón.

## Impresión

Es la salida que llega al cliente, así que tiene camino propio:

1. `window.doPrint()` llama a `preparePrint()`, que espera las tipografías y las imágenes.
2. `preparePrint()` construye el documento completo dentro de `#printRoot`.
3. Con `body.pp-on`, el `@media print` **oculta toda la aplicación** y muestra solo `#printRoot`.

El documento impreso lleva portada con folio, revisión, fecha y vigencia, y seis secciones:

| # | Sección | Qué lleva |
|---|---|---|
| 1 | Todo lo que incluye el programa | Tira de conteos del acompañamiento y las tres áreas TI · IP · DP |
| 2 | Alcance del programa | Conteos de estudiantes, equipos, docentes y usuarios con licencia, más las reglas en viñetas |
| 3 | Inversión | La cifra del esquema elegido en una tarjeta `.p-hero`; los comparativos que el vendedor marcó, en tarjetas menores |
| 4 | Esquema de pago | El desglose año por año del esquema o esquemas visibles |
| 5 | Accesos a plataformas | Tarjetas con logotipo y dirección |
| 6 | Datos bancarios y contacto | Chips de entrega y envío, transferencia con advertencia de titular, contacto del colegio y contacto en activa |

**Las filas del equipo docente toman su nombre del catálogo** (21-ago-2026). Antes estaban
escritas a mano y nunca decían «seminuevo» en ningún plazo: en el plazo de 2 años un colegio
podía leer «nuevo» sin que nadie se lo dijera. Ahora dicen «Flip-Touch seminueva · docente» en
`fl2` y «Chromebook nueva · docente» en `tb3`, en las cinco modalidades, y lo clava la prueba
«El documento nombra el seminuevo».

**La hoja interior no repite la portada** (21-ago-2026). El cuerpo arranca directo en la sección
1: ni logotipo, ni folio, ni cliente, ni ciudad. Esos datos viven en la portada y en el
encabezado y el pie corridos de cada hoja; repetirlos costaba media hoja y no decía nada nuevo.
En pantalla la identidad la lleva la barra del overlay, que ya rotula institución y folio.

### El documento no imprime cómo se armó el precio

**Decisión de Martín, 21-ago-2026.** El colegio debe ver **qué recibe** y **cuánto paga**, no la
mecánica del precio. Salieron de la propuesta, del PDF y del correo:

- la **tabla de conciliación** (precio base, licencias retiradas −$, adicionales +$, carritos +$,
  redondeo a centavos): era el menú con el que un cliente renegocia renglón por renglón;
- la nota del **precio exacto a seis decimales**;
- la nota de **cómo se aplica el descuento** del esquema;
- la lista de **licencias retiradas con su importe**: el documento enumera lo que se incluye, no
  lo que se descontó;
- el precio sin descuento etiquetado **«Precio regular»** —el badge quedó como «Esquema
  estándar»— y la línea «Sin descuento aplicado»: enseñaban el techo desde el cual pedir más;
- el **rastro de autorización del carrito** (quién lo autorizó y cuándo), que es dato interno del
  vendedor. El compromiso sigue en el papel, como chip: «N carritos de M equipos · incluidos sin
  costo».

Los **conteos sí se quedan** —son lo que el colegio contrata— pero en una tira de tarjetas
`.p-kpis`, no en una tabla que se leía como hoja de cálculo. El motor sigue calculando todo: lo
que cambió es qué se imprime. Lo clava la prueba «El documento no imprime cómo se armó el
precio», que busca cada uno de esos rastros por su nombre y falla si reaparece.

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
contenido**, y su sitio se reserva **en cada hoja** con un `tfoot` espaciador de **13 mm** en
`.print-shell`, que Chromium repite al pie de todas las hojas igual que repite el `<thead>`.
(Corrección del 21-ago-2026: antes la reserva era un relleno inferior del flujo, que solo
protegía la última hoja — en una hoja intermedia llena, la última línea quedaba **debajo** del
pie.) Lo que no debe hacer nunca es invadir el margen de página —ahí Chromium lo fragmenta y su
texto reaparece arriba de la hoja siguiente—, y por eso el `@page` conserva sus 16 mm.

La portada también bajó su tope de altura de 271 mm a **256 mm**. El pie ocupa los últimos
11,3 mm del área de contenido, y sin ese tope la portada se metía debajo con un nombre de
colegio largo: el renglón del folio quedaba tapado por el pie. Medido en el peor caso
—96 caracteres de nombre, `data-len="xxl"`, tres contactos con correos largos— la portada
ocupa 233 mm de contenido en una caja de 250 mm, así que sobra aire.

### Papelería v5

El vocabulario de tarjetas y chips del documento vive entre las marcas
`/* ===== PAPELERÍA v5 · inicio ===== */` y `/* ===== PAPELERÍA v5 · fin ===== */` al final del
`<style>`, y es **byte a byte el mismo bloque** que el de `paginas/arrendamiento/` y el de
`paginas/compra/`. Para comprobar que no se separaron:

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

En la misma pasada la franja Google de la portada bajó de **10 mm a 2 mm** —a esa altura leía
como error de maquetación, no como marca— y los 8 mm liberados se devolvieron al aire de la hoja.
Entre eso y la cabecera repetida, el PDF de una cotización típica pasó de **seis hojas a cinco**.

---

## El archivo en Drive

Cada PDF generado puede además quedar **archivado en Google Drive**, en
`1. upgrade_edu/‹correo del vendedor›/`, con su JSON al lado para reabrirlo después. El diseño
completo vive en [`docs/drive-PDF/`](../../docs/drive-PDF/); la lógica es una sola copia para
los tres cotizadores: [`compartidos/js/archivo-drive.js`](../../compartidos/js/archivo-drive.js).
El enganche es idéntico al de [arrendamiento](../arrendamiento/), cuyo README lo describe
completo; aquí son las mismas cinco piezas: el contenedor `#archivoDrive` (al final del paso 3),
el `<script>` del módulo, `ArchivoDrive.montar({page:"cotizador", …})`, y las tres llamadas —
`capturar()` en `preparePrint()` y en la ruta de `Ctrl+P`, `mostrar()` en `afterprint`,
`revisarPendiente()` en `renderDocumentMeta()`—. La huella de impresión ya existía en esta
página; el archivo solo la aprovecha.

- El bloque no existe hasta generar un PDF; `datos()` se congela **al imprimir**, no al subir.
- El JSON archivado viaja con el sobre de Exportar (`fileType:"activa-quote"`), así que se
  reabre con **Importar JSON** tal cual.
- Lo no subido queda marcado bajo `activa.cotizador.archivo-pendiente.v1` y el bloque reaparece
  en ámbar al reabrir la cotización — se vuelve a elegir el PDF, sin reimprimir.
- Si el módulo no carga o el puente no responde, la página cotiza igual que hoy: el archivo es
  una capa encima, nunca un requisito.

---

## Pruebas internas

La página trae su propia suite. Se corre agregando `?test=1` a la URL:

```text
http://127.0.0.1:8123/paginas/cotizador/?test=1
```

El resultado se dibuja en `#testReport`. Son **98 pruebas**. Cubren, entre otras cosas, las
migraciones de esquema v3 → v4 y v4 → v5 (esta última sin mover un centavo), que la importación
externa conserve tipos estrictos, que un borrador incompleto sobreviva a exportar e importar, que
la aritmética histórica no cambie, y la cotización a la medida completa: el ejemplo canónico
(700 alumnos, 30 equipos, 1 carrito, 4 años → $3,197.21), que el plazo duplica el prorrateo a
2 años, que CEU y seguro se suman solos, que en `fl2` no existe el equipo docente nuevo y en
`tb3` el docente es Chromebook nueva, que el documento nombra «seminueva» en la fila del equipo
docente, y que el desglose del prorrateo no viaja al PDF ni al correo. **Conviene correrla
después de tocar precios o reglas.** Hay además un objeto `Diagnostics` que detecta cotizaciones
huérfanas en `localStorage`.

---

## Movimiento

Usa el motor compartido de `compartidos/`, en **nivel contenido** a propósito: microinteracciones
en botones, `Motion.botonEstado()` en las seis acciones que tardan (compartir, PDF, correo,
copiar), cascada corta de las secciones al cargar, revelado al bajar en los cuatro bloques
descriptivos largos, y una barra de avance de 3 px al fondo de la barra de configuración.

Lo que **no** se anima, y no debe animarse:

- Números, precios y totales: `#barPrice`, `#actPrice`, `#resYear1`, la escalera de años y las
  tablas. La precisión no se decora.
- Campos del formulario y los `details.fold` que los contienen: un bloque oculto hasta el scroll
  rompería `focusIssue()`, que enfoca el primer error.
- Indicadores de estado con `aria-live` propio: `#saveState`, folio, revisión, `#warnBox`.

Las reglas están en [`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son
obligatorias. Dos cuidados propios de esta página: `@media print` ya anula el revelado del motor, y
si se agregan animaciones hay que anularlas ahí también; y la barra de avance es `position:absolute`
dentro de `.cfgbar` para no alterar la altura que mide `setupDynamicOffsets()`.

---

## Al tocar esta página

1. **No cambies la lógica para animar o maquetar.** Si un efecto exige tocar un cálculo, no va.
2. **Corre `?test=1`** antes y después de cualquier cambio en precios o reglas.
3. **Ábrela en una ventana privada** después de tocar validaciones o reglas. Con tu `localStorage`
   lleno de borradores no ves lo que ve un comercial que entra por primera vez, que es donde vivía
   el defecto de "no me sale el precio".
4. **Imprime** (`Ctrl+P`) y revisa que no falte ninguna sección ni salgan hojas en blanco.
5. **Prueba sin red y sin `localStorage`**: la herramienta debe seguir cotizando.
6. Comprueba que la barra de configuración siga pegada al bajar.
