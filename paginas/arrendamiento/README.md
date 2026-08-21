# Cotizador de arrendamiento de equipo

Cotiza **arrendamiento de equipo Chromebook para colegios**: renta mensual fija en pesos, a 3 o
4 años, con seguro, Securly y carritos de carga. Es una **herramienta de trabajo** del equipo
comercial —guarda borradores, lleva folio y revisión— cuya salida (pantalla, PDF y correo) está
diseñada para verse **frente al cliente**.

Se publica en **<https://sanoapro.github.io/activa/paginas/arrendamiento/>**

No es una versión recortada del [cotizador Upgrade Edu](../cotizador/): es una herramienta nueva
que hereda su lenguaje visual —**el mismo acento azul**, ver «Sistema visual» abajo—, su
arquitectura y sus disciplinas, con su propio modelo de datos. Un solo archivo de
~3,000 líneas, autocontenido salvo el motor de movimiento compartido. No hay build: se edita y
se recarga.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo: markup, CSS, motor de cálculo, persistencia, impresión y pruebas. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público y no lleva precios. |

Las etiquetas `og:` apuntan con **URL absoluta**: WhatsApp no lee rutas relativas. La página
lleva `<meta name="robots" content="noindex, nofollow">`: contiene el catálogo de costos y la
tasa del arrendamiento dentro de su JavaScript. Se manda por enlace, no se busca.

---

## La restricción que gobierna toda la página

**El cliente solo ve dos cifras**: el **total mensual** y el **total a pagar**, ambas con su
desglose de IVA (subtotal + IVA 16% + total). Más el detalle de *qué* incluye —cuántos equipos
de cada tipo, plazo, seguro, Securly, carritos— **sin precios por componente**.

Es información interna y **no se pinta** en la vista normal, ni viaja en el documento, el correo
o el escenario compartido:

- la tasa anual (24%) y la mensual,
- el precio unitario de cada renglón y sus componentes,
- el total financiado,
- la mensualidad y la anualidad unitarias,
- los precios de catálogo de cada concepto.

Cómo se garantiza:

1. **La vista por defecto es la de cliente.** El HTML estático no contiene un solo precio en el
   markup; nada interno se "oculta con CSS".
2. **Modo interno explícito** (`btnInternal`, arriba a la derecha). Su estado vive en la variable
   de módulo `INTERNAL_MODE`, **fuera de `APP_STATE`**: jamás entra a `localStorage`, al JSON
   exportado, al hash ni al escenario. Arranca **apagado** en cada carga. Al encender se **crea**
   el panel (`#sInterno`); al apagar se **elimina del DOM** (`.remove()`, no `hidden`). El botón
   encendido se pinta ámbar para que en pantalla compartida sea evidente que hay que apagarlo.
3. **El saneador del escenario (`sanitizeScenarioPayload`) solo acepta los campos del esquema
   v1** y descarta cualquier otro: un hash o código manipulado no puede encender el modo interno
   ni introducir estado.
4. `buildProposal()`, `buildPrintDocument()` y `buildMailModel()` consumen **únicamente** los
   campos de cliente del resultado; nunca leen `CATALOG` ni `result.internal`. La suite lo
   custodia con una lista de cadenas prohibidas (`LeaseTests.FORBIDDEN`).
5. Nada interno en `title=`, `aria-*`, `data-*` ni tooltips (pensado para pantalla compartida).

**El único lugar donde el catálogo existe completo es el `<script>`** (la página es
autocontenida y sin build, igual que el cotizador guarda ahí sus precios). Por eso el `noindex` y
por eso la página se comparte por enlace y nunca se proyecta con el código fuente abierto.

---

## De dónde sale cada número

La fuente es `docs/Cotizador de arrendamiento y compra (1).xlsx`, hoja **`Arrendamiento`**.
Solo dos zonas de esa hoja son autoritativas:

- **El catálogo `O3:Q15`** (precios SIN IVA, celda `Q2`).
- **La aritmética de las filas 4-5 y 17-18**: `PMT(tasa/12, años×12, PV)×−1`, con el prorrateo
  de carritos de `M20 = N20/D17` (la celda marcada «USAR ESTE PARA CARRITOS»).

Lo que del Excel **no** se usa, a propósito:

- Los bloques `L3:M12` y `L16:M25` son **borradores del vendedor con etiquetas cruzadas**
  (`L5` dice «Securly» y contiene 1,390, que es el precio del Seguro a 3 años; `L6` dice
  «Seguro» con 1,870, que es el de 4 años). Sirvieron solo para reconstruir la fórmula.
- Las filas 37-49 («PRECIO LIGA 11 jun») son una cotización de **compra** ajena al arrendamiento.

## Dónde se cambian los precios y las reglas

Todo el negocio vive en **un** objeto congelado con `deepFreeze`: **`CATALOG`** (busca
`CATÁLOGO DEL ARRENDAMIENTO` en `index.html`, ~línea 780). Cambiar un precio es editar un número
ahí y nada más; cada valor cita su celda:

| Campo | Celda | Valor |
|---|---|---|
| `tasaAnual` | `F4` | 0.24 |
| `iva` | — | 0.16 |
| `equipos.estudiante.precio` | `Q4` | 7,740.00 |
| `equipos.docente.precio` | `Q5` | 9,450.00 |
| `ceu` | `Q12` | 750.00 |
| `porPlazo[3].securly` / `[4].securly` | `Q7` / `Q8` | 1,050.00 / 1,400.00 |
| `porPlazo[3].seguro` / `[4].seguro` | `Q10` / `Q11` | 1,390.00 / 1,870.00 |
| `carritos[20]` / `[30]` / `[40]` | `Q13`–`Q15` | 24,374.70 / 26,600.70 / 31,720.50 |

**Después de tocar `CATALOG`, corre `?test=1`.** Los cuatro casos de regresión del Excel están
clavados al centavo y no deben cambiar nunca; si cambias la tasa, esos casos fallarán a
propósito para obligarte a revalidar contra una hoja nueva.

## Decisiones de producto (cerradas el 19 de agosto de 2026)

1. **IVA desglosado.** El motor calcula SIN IVA, idéntico al Excel (las regresiones se prueban
   sin IVA); el documento muestra subtotal + IVA 16% + total en las dos cifras. El desglose se
   construye sobre la mensualidad **ya redondeada a centavos**, para que las tres cifras cuadren
   entre sí y `total a pagar = total mensual × meses` cuadre en la calculadora del colegio.
2. **Equipos mezclados por renglones.** Estudiante y docente en la misma cotización, cada uno
   con su cantidad. PMT es lineal en el monto financiado, así que financiar por renglón y sumar
   es exacto (hay prueba de ello).
3. **CEU solo sobre el equipo docente, automática.** El estudiante (`CZ1104FM4A`) la trae
   «permanente integrada» según su propia descripción de catálogo (`P4`); el bloque 1 del Excel
   suma los $750 precisamente sobre un equipo docente (9,450 + 750).
4. **Seguro y Securly al plazo del contrato.** 3 años → `Q10`/`Q7`; 4 años → `Q11`/`Q8`. Los
   precios a 1 año (`Q9`, `Q6`) quedan fuera de la herramienta: financiar a 36/48 meses un
   servicio que expira a los 12 dejaría al colegio pagando cobertura vencida.
5. **Tasa fija.** Es un término pactado con la arrendadora, no una palanca comercial. No hay
   control de tasa ni en el modo interno; cambiarla es editar `CATALOG.tasaAnual`.
6. **Carritos como lista de renglones** (`{cap, qty}`, mezclables: 1×30 + 3×20). Su costo total
   entra al monto financiado —aritméticamente idéntico al prorrateo `M20` del Excel—. El aviso
   de capacidad (no alcanza / sobra un carrito completo o más) es **informativo y nunca
   bloquea**: mezclar capacidades o dejar holgura puede ser intencional.
7. **Seguro y Securly son todo o nada.** No se marcan por tipo de equipo: dependen del
   dispositivo y aplican a todos los equipos de la cotización, docentes incluidos.
8. **El aviso de capacidad cuenta todos los equipos**, docentes incluidos, y así se queda: es
   informativo y el vendedor decide si mezcla capacidades o deja holgura.
9. **La entrega en el colegio está incluida en el precio** y el documento lo dice; no es un
   renglón cotizable aparte.
10. **La propuesta viaja como PDF o como correo, nunca como enlace a esta herramienta.** El
    catálogo y la tasa viven en el `<script>`: quien abra el enlace y mire el código fuente los
    lee. El enlace y el código `ARRENDA1:` son para mover escenarios entre vendedores.

## La aritmética

```text
precio_renglón   = equipo + (docente? CEU) + (seguro? seguro_plazo) + (securly? securly_plazo)
total_financiado = Σ precio_renglón × cantidad + Σ carritos
r = 0.24/12 = 0.02 ;  n = años × 12
mensualidad_sin_IVA = total_financiado × r / (1 − (1+r)^−n)     ← PMT del Excel × −1
total_pagado_sin_IVA = mensualidad × n
cliente: subtotal = redondeo(mensualidad) ; IVA = redondeo(subtotal × 0.16) ; total = subtotal + IVA
         total_a_pagar = cada componente × n
```

Redondeo con el criterio del cotizador (F-10): `roundFinancial` (6 decimales) en la cadena,
`roundCurrency` (centavos) solo en la frontera con el cliente.

Los cuatro casos de regresión validan la **fórmula**, no el catálogo: sus PV no los puede
producir esta herramienta (13,460 mezcla el seguro a 3 y a 4 años, uno de los borradores
cruzados de la hoja). La **composición** del precio unitario la clava una prueba aparte, con las
cifras escritas a mano y no leídas de `CATALOG`, para que un precio mal transcrito o asignado al
equipo equivocado tumbe la suite: docente a 3 años con seguro y Securly = 12,640 → 575.24 al mes
con IVA; a 4 años = 13,470 → 509.41; estudiante pelón = 7,740 → 303.66 sin IVA; y el carrito de
20 suma 24,374.70 al financiado.

**Casos de regresión clavados** (suite `?test=1`, del propio Excel):

| PV | Meses | Mensualidad unitaria | Total pagado |
|---|---|---|---|
| 13,460.00 | 36 | 528.074196 | 19,010.67105 |
| 13,460.00 | 48 | 438.8207065 | 21,063.39391 |
| 9,858.1785 (×60) | 36 | 386.764464 | 835,411.2422 |
| 9,858.1785 (×60) | 48 | 321.3947143 | 925,616.777 |

---

## Qué bloquea qué

`getReadiness()` devuelve dos estados; el motor es la única fuente de verdad y cada advertencia
`t:"e"` declara en `blocks` qué tumba:

| Estado | Qué habilita | Qué lo rompe |
|---|---|---|
| `calculable` | Que se **vean las dos cifras** | Solo lo financiero: cero equipos, cantidades inválidas, escenario corrupto (`blocks:"price"`) |
| `documentReady` | **PDF** y **correo** | Lo anterior, más los datos documentales: institución, ciudad, fechas, vendedor y su correo, y los **datos fiscales de la empresa** (razón social, RFC con fecha válida y domicilio) |

**La regla que costó cara en el cotizador (F-28) se respeta desde el diseño**: un dato solo
bloquea el precio si de verdad entra en el importe. Una cotización recién abierta trae 30
equipos de estudiante y plazo a 3 años, así que **muestra la mensualidad de inmediato** — hay
una prueba que lo custodia. «Ver propuesta» solo pide `calculable` (con banner de vista
preliminar si faltan datos documentales); el aviso de capacidad de carritos jamás bloquea.

Cuando el precio no es calculable, el motivo se escribe **junto al precio**, en `#actSub` de la
barra de acciones, y el bloque de inversión entero se atenúa y rotula (`calc-invalid` /
`calc-first` para el primer uso).

## Persistencia, folio y revisión

Llaves propias, versionadas, que **no tocan las del cotizador**:

```text
activa.arrendamiento.current.v1        el borrador abierto
activa.arrendamiento.index.v1          el índice de borradores
activa.arrendamiento.quote.v1.<id>     cada cotización
activa.arrendamiento.counter.v1.<…>    consecutivos de folio por día
activa.arrendamiento.revmax.v1.<…>     revisión máxima emitida por raíz de folio
activa.arrendamiento.recovery.v1.<…>   copias de recuperación ante fallo o conflicto
activa.arrendamiento.seller-profile.v1 el perfil del vendedor
activa.arrendamiento.archivo-pendiente.v1  cotizaciones impresas y aún no archivadas en Drive
```

- Máximo **20 borradores**; la importación acepta hasta 2 MB (`fileType:"activa-lease-quote"`).
- El **folio** se valida por estructura (`FOLIO_ROOT_RE`): iniciales, fecha `AAAAMMDD` real,
  consecutivo (o `REC`) y código anticolisión sin `I/O/0/1`.
- La **revisión** nunca se reutiliza (marca de agua `revmax` que sobrevive al borrado) y se
  agota explícitamente en R999.
- Guard de conflicto entre pestañas: comparación de `updatedAt` antes de escribir, copia de
  recuperación al fallar, y escucha del evento `storage` (silenciada mientras corre la suite).
- Sin `localStorage`, `HAS_STORAGE` queda en falso y **la herramienta sigue cotizando** sin
  guardar; el aviso vive en `#storageBanner`, persistente.

## Datos fiscales de la empresa

**Desde el 21-ago-2026 los datos fiscales ya no llevan bloque propio en el cuerpo.** Viajan en
el pie de **cada** hoja, que es la norma de la empresa, y repetirlos en una tarjeta de la
última hoja era decir dos veces lo mismo. La prueba «El documento lleva razón social, RFC y
domicilio fiscal» sigue exigiendo los tres campos, pero ahora los busca dentro de
`.print-runfoot`.

El pliegue **«Datos fiscales de la empresa»** guarda la **razón social**, el **RFC** y el
**domicilio fiscal** de quien emite la propuesta, igual que el cotizador de
[compra](../compra/). Predeterminados en `DEFAULT_SUPPLIER` (busca esa constante), editables por
cotización y guardados con el borrador.

- **No son información interna**: viajan en el documento a propósito. Se imprimen en el bloque
  «Datos fiscales de la empresa» de la sección 3 y la razón social encabeza el **pie repetido de
  cada hoja** del PDF.
- El **RFC** se teclea siempre en mayúsculas y se valida con `rfcOk()`: formato *y* que la fecha
  exista en el calendario (un `230231` se rechaza). Un RFC inválido **bloquea el PDF y el
  correo**, no el precio.
- **Aquí no hay datos bancarios**, a diferencia de compra: el arrendamiento se factura y se
  cobra conforme al contrato con la arrendadora, y una cuenta impresa en la propuesta invitaría
  al colegio a depositar por el canal equivocado. Si algún día se deciden, van en este mismo
  pliegue y en el mismo bloque del documento.

## Compartir un escenario

El escenario viaja en el fragmento como `#scenario=<código>` (`schemaVersion: 1`): equipos,
plazo, seguro, Securly y carritos. **Sin datos personales y sin modo interno** — si el vendedor
manda el enlace al colegio, el colegio ve la vista de cliente. El código `ARRENDA1:<…>` del
modal de gestión es el mismo escenario para moverlo entre equipos. Al recargar, el borrador
guardado siempre gana sobre el propio hash (lección F-01 del cotizador).

**21-ago-2026 · El botón «Compartir» del encabezado se retiró.** Con el archivo en Drive, la
forma natural de mover una cotización es su JSON completo, no el escenario pelón; en su lugar
vive **«Insertar JSON»** (abajo). El escenario sigue funcionando por el hash de la URL y por el
código `ARRENDA1` del modal de Cotizaciones — solo perdió su botón dedicado.

## Insertar JSON

El botón **«Insertar JSON»** del encabezado abre un diálogo con un área de texto: el vendedor
abre el `.json` de una cotización en Drive (el archivo guarda uno junto a cada PDF), **copia
todo el texto y lo pega**. Por dentro es el mismo camino que Cotizaciones → Importar JSON
(`importQuotePayload()`, compartido por las dos puertas): mismas validaciones, mismo diálogo si
el identificador ya existe, mismo respaldo antes de reemplazar. Un texto que no sea JSON
completo avisa qué copiar, sin tocar la cotización abierta.

## Impresión

Camino propio, idéntico en estructura al del cotizador:

1. `window.doPrint()` → `preparePrint()` espera tipografías y construye en `#printRoot`.
2. Con `body.pp-on`, el `@media print` **oculta la aplicación entera** y muestra solo el
   documento; sin `pp-on`, imprimir muestra el aviso de usar «Generar PDF».
3. El documento: portada (colegio, mensualidad con IVA, plazo, folio, vigencia), qué incluye,
   inversión desglosada, condiciones —el cierre del contrato (opción a compra, residual o
   devolución) se remite al contrato de arrendamiento; aquí no se promete nada— y contacto; pie
   repetido con los datos de la empresa y el folio en cada hoja (`position:fixed`) y encabezado
   repetido vía `<thead>` de `.print-shell`.

**La hoja interior no repite la portada** (21-ago-2026). El cuerpo arranca directo en la
sección 1: ni logotipo, ni folio, ni cliente, ni ciudad. Esos datos viven en la portada y en el
encabezado y el pie corridos de cada hoja; repetirlos costaba media hoja y no decía nada nuevo.
En pantalla la identidad la lleva la barra del overlay, que ya rotula institución y folio. Lo
clava la prueba «La hoja interior no repite la portada».

`Ctrl+P` directo también funciona cuando el documento está listo (guard en `beforeprint`).

**Huella de impresión** (agregada con el archivo en Drive, calcada de compra y del cotizador):
`printSignature()` / `PRINT_READY_SIGNATURE` recuerdan con qué estado se construyó `#printRoot`;
`markChanged()` la invalida y `beforeprint` solo reconstruye si cambió. Su papel importante es
garantizar que la instantánea que congela el archivo en Drive corresponde al PDF que salió.

## El archivo en Drive

Cada PDF generado puede además quedar **archivado en Google Drive**, en la carpeta del correo
del vendedor. El diseño completo vive en [`docs/drive-PDF/`](../../docs/drive-PDF/); la lógica
es una sola copia para los tres cotizadores: [`compartidos/js/archivo-drive.js`](../../compartidos/js/archivo-drive.js).
Esta página fue la primera en estrenarlo (compra y cotizador siguen).

Cómo se engancha, y es todo lo que otra página necesita replicar:

1. Un contenedor vacío (`#archivoDrive`, al final de la sección de inversión).
2. `ArchivoDrive.montar({page, endpoint, token, contenedor, datos})` — busca
   `archivo en Drive` en el `index.html`.
3. Tres llamadas: `capturar()` al preparar la impresión (también en la ruta de `Ctrl+P`),
   `mostrar()` en `afterprint`, y `revisarPendiente(quoteId)` en `renderDocumentMeta()` —es
   idempotente: solo trabaja cuando cambia la cotización—.

Lo que hay que saber:

- **El bloque no existe hasta generar un PDF.** Aparece después del diálogo de impresión
  (aunque el vendedor haya cancelado: pudo haber guardado) y ofrece elegir ese PDF y subirlo.
- **`datos()` se congela al imprimir, no al subir.** Si se edita en medio, el JSON archivado
  sigue correspondiendo al PDF. El JSON viaja con el sobre de Exportar
  (`fileType:"activa-lease-quote"`), así que lo archivado se reabre con **Importar JSON** tal cual.
- **Subir es opcional pero insistente**: al imprimir, la cotización se marca bajo
  `activa.arrendamiento.archivo-pendiente.v1` y, si no se sube, el bloque reaparece en ámbar al
  reabrirla — se vuelve a elegir el PDF (sigue en el disco), sin reimprimir. Al archivar con
  éxito la marca se quita.
- **El nombre del archivo en Drive lo arma el puente** (número correlativo + colegio · fecha ·
  folio); la página solo coteja que el PDF elegido contenga el folio sugerido y avisa —sin
  bloquear— si no coincide.
- **`ARCHIVO_ENDPOINT` ya apunta al puente desplegado** (21-ago-2026). Si se vaciara, el bloque
  lo diría y nada se rompe. Desde `file://` explica que hay que usar la URL publicada. Si el
  módulo compartido no cargara, todas las llamadas van con `?.` y la página cotiza igual que hoy.

## Pruebas internas

`?test=1` corre la suite y la dibuja en `#testReport` — **41 pruebas**: los cuatro casos de
regresión, la composición del precio unitario, la linealidad de PMT, el prorrateo de carritos
mixtos, el desglose de IVA, CEU solo docente, seguro/Securly por plazo, el precio visible en una
cotización recién abierta, que el aviso de carritos nunca bloquea, que el modo interno arranca
apagado / no viaja / se elimina del DOM, que documento, correo y escenario no contienen datos
internos, tipos estrictos en la importación, borradores incompletos que sobreviven a
exportar/importar, folio, revisiones, conflicto entre pestañas, rollback de escrituras, y los datos
fiscales de la empresa (RFC con fecha real, presencia en el documento, bloqueo del PDF si faltan, y
que sobreviven a exportar e importar).

**Conviene correrla después de tocar precios o reglas.**

## Los tres pasos

| Sección | Título | Qué se hace ahí |
|---|---|---|
| `#s1` | Equipos y servicios | Seguro, Securly y los renglones de carrito |
| `#s2` | Datos de la propuesta | Colegio, fiscales, vigencia y contacto |
| `#s3` | Inversión mensual | La mensualidad y todo lo que ampara |

**Se captura arriba y se cotiza abajo**, que es como transcurre una llamada. El 21-ago-2026 las
dos casillas que más mueven la mensualidad —Seguro contra daños y Securly— salieron de dentro de
la tarjeta de resultado, donde estaban mezcladas con la lista de lo que incluye: se capturaban
justo donde se lee el precio, que es al revés. Ahora abren el paso 1.

El panel del modo interno se ancla al **elemento del precio**, no al número de sección:

```js
document.getElementById("invMensual").closest("section").insertAdjacentElement("afterend", section);
```

Enseña tasa, monto financiado y total pagado, así que pertenece junto a la Inversión. Anclarlo
así lo deja donde debe aunque el orden vuelva a cambiar.

## La pantalla es del vendedor; el papel es del colegio

Son dos superficies con dueños distintos y se diseñaron por separado.

**La herramienta no la ve el colegio.** Por eso el 20-ago-2026 se quitó el hero completo —etiqueta,
título grande, chip de IVA, alcance y bloque de folio: doce renglones de bienvenida antes de la
primera cifra— y los párrafos explicativos de cada paso. Folio, revisión y estado de guardado se
mudaron al encabezado, en pequeño. La cotización completa entra ahora en una pantalla y la
página mide 2 200 px en vez de 2 800. El ancho pasó de 1 200 a **1 560 px** (`--app-max`).

El panel de inversión abre el desglose que el vendedor necesita para defender la cifra por
teléfono: subtotal mensual, IVA y total a pagar, en renglones legibles en vez de apretados en un
subtítulo. Y lo dice con todas sus letras: **el total a pagar es dato de trabajo y no sale en la
propuesta ni en el correo.**

### Ningún texto suelto

Regla de esta pasada, en las dos superficies: si algo hay que explicar, se explica **dentro de la
tarjeta a la que pertenece**. Los tres párrafos que describían cada paso se retiraron el
21-ago-2026: quien usa esto ya sabe cotizar. Para eso está `.cardnote` en la aplicación y `.p-card`
en el documento. La pista de los carritos bajó a la caja de cotejo; las tres notas sueltas del
documento se volvieron una tarjeta de **Condiciones** con viñetas y su advertencia dentro; la tabla
de inclusiones vive en `.p-tblcard`; los contactos, en su propia tarjeta.

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

**21-ago-2026.** El vocabulario de tarjetas y chips del documento dejó de ser de esta página y
pasó a ser el de la empresa: vive entre las marcas `/* ===== PAPELERÍA v5 · inicio ===== */` y
`/* ===== PAPELERÍA v5 · fin ===== */` al final del `<style>`, y es **byte a byte el mismo
bloque** que el del cotizador y el de compra. Para comprobar que no se separaron:

```sh
for p in cotizador arrendamiento compra; do
  sed -n '/PAPELERÍA v5 · inicio/,/PAPELERÍA v5 · fin/p' paginas/$p/index.html > /tmp/$p.css
done
diff /tmp/cotizador.css /tmp/arrendamiento.css && diff /tmp/cotizador.css /tmp/compra.css
```

No se extrajo a `compartidos/css/`: el PDF es el entregable y una hoja externa que no cargue lo
rompería en silencio. El bloque trae dos capas del mismo marcado —pantalla en px para el overlay
y papel en mm/pt bajo `.pp-body`— con `.p-card` y su familia, `.p-tblcard`, `.p-kpis` (tira de
conteos), `.p-fchips` (chips de dato) y `.p-hero` (la tarjeta de una sola cifra). La regla que lo
gobierna: **`.p-note` es una línea de 140 caracteres como máximo**; lo más largo es una
`.p-card--terms` con viñetas, o sobra.

Dos cambios de portada en la misma pasada: la franja Google bajó de **10 mm a 2 mm** —a esa
altura leía como error de maquetación, no como marca— y los 8 mm liberados se devolvieron al aire
de la hoja. Y el pie del documento y la tarjeta de firmas, que venían **sin capa de papel** y
heredaban píxeles de pantalla, ya tienen la suya: el pie abría con 26 px de margen y empujaba las
firmas a una hoja propia casi vacía.

## El documento no enseña el total general

**Decisión del 20-ago-2026.** La propuesta y el correo muestran **la mensualidad y cuántas son**,
y nada más:

- La portada: la renta mensual grande, y entre los tres datos duros «Mensualidades · 36 iguales»
  donde antes iba el total a pagar.
- La sección de inversión: dos tarjetas, la renta mensual con su IVA desglosado y, al lado, el
  plazo en grande —`36` sobre «mensualidades iguales y consecutivas»— con la explicación de cómo
  corren.
- El correo: la mensualidad y el número de mensualidades.

El porqué: un arrendamiento se decide por la mensualidad y por cuántas son. Poner la suma de las
36 al lado invita a compararla contra el precio de contado, que es otra operación y otra
decisión. El motor **sigue calculando** `totalPagar` —lo necesita el vendedor y lo cubren las
pruebas—; simplemente no se imprime.

Y el documento dice qué se está adquiriendo: cada renglón de la tabla lleva **el concepto y su
descripción** —modelo, memoria, pantalla, qué cubre el seguro, qué hace Securly, para cuántos
equipos es el carrito—, no solo el nombre.

## La fila de identidad

El encabezado lleva una segunda fila de unos 30 px que dice qué se está cotizando y para quién, y
que se queda pegada al bajar:

```text
Arrendamiento · 134 equipos · 3 años (36 mensualidades) · con seguro · con Securly · 4× carrito para 30
                                                    Folio MM-… · Revisión 1 · Guardado localmente
```

El resumen vivo (`#heroScope`) estaba escondido dentro de la tarjeta de resultado; ahora encabeza
la página. El JS que lo escribe no cambió: mismo id, un solo elemento.

## Las tarjetas de captura tienen color

Los cuatro `details.fold` eran blanco sobre blanco —tarjeta blanca, cuerpo sin fondo, campos
blancos— y su único color vivía en un cuadrito de 34 px. Ahora cada tarjeta declara `--fc` y
`--ft`, que pintan el filete superior de 3 px, el degradado del encabezado, el ícono y el filete
de apertura:

| Tarjeta | Color |
|---|---|
| Carritos de carga | verde |
| Colegio y contactos | azul |
| Datos fiscales de la empresa | amarillo |
| Vigencia y contacto | rojo |

La zona de captura se hunde en gris azulado con los campos en blanco puro, y dentro de los
pliegues largos los bloques se agrupan en `.fgroup` en vez de flotar bajo un rótulo suelto.

## Sistema visual

La página aplica el sistema de [`paginas/cotizador/`](../cotizador/): mismos tokens en su
propio `:root`, mismos nombres de clase, sin hoja compartida y **sin una sola tipografía
cargada** (las pilas de `--disp`, `--body` y `--mono` degradan solas).

**El acento es el azul de Google, igual que en el cotizador y en el de compra.** No es un
descuido: `--acc` pinta los filetes, los cuadros numerados y los chips del documento impreso, y
un acento por herramienta produciría tres papelerías distintas saliendo de la misma empresa.
Las tres se distinguen por el hero, el `.kick` y su `og.png`. El verde queda reservado a su
significado —confirmado o ahorro—: el chip `.iva`, las casillas `.lic.on`, la palomita `.ok` y
el estado «guardado».

**Componentes reusados tal cual:** `.gbar`, `.gdots`, `.hbar`/`.logo`/`.vertag`, la marca
embebida (`.brand-logo-img`, `.brand-partner`, `.google-g`, con la misma imagen del cotizador
dentro del archivo), `.hnav`, `.cfgbar`/`.cfgin`/`.cfgf`/`.cfgprice`, `.hero`/`.tag`/`.iva`/
`.herorow`, `.shead`/`.kick`, `.cfg`, `.result`/`.res-side`/`.res-main`/`.kv`/`.rowhead`,
`.igrid`/`.item`/`.iico`/`.qty`/`.ok`/`.item.out`, `.licgrid`/`.lic`, `details.fold`,
`.grid2`/`.grid3`/`.f`/`.hint`/`.field-error`, `.miniLbl`/`.tagx`, `.btn` y variantes,
`.inline-action`, `.seg`, `.chip`, `.warns`/`.warn`, `.toast`, `.tbox`/`.tscroll`/`.tfoot`/
`.gh`, `.actbar`/`.actprice`, el pie, y el documento imprimible completo (`p-*` y `cv-*`).

**Lo que hubo que adaptar, y por qué:**

- **Las tablas cuelgan de `.tbox`, no de `table` suelto.** En el cotizador las reglas de
  `table`, `th` y `td` son globales; aquí eso repintaría también las tablas del documento
  impreso y de la vista previa del correo, que traen las suyas.
- **`.cartrow`** (renglón de carrito) no existe allá: `.cartopt` es una tarjeta de opción
  **excluyente** y aquí los carritos se acumulan por renglones de capacidad distinta. Está
  construido con los tokens de allá y los campos `.f`.
- **`.calcbox`/`.cr`**: caja informativa azul con el cotejo de capacidad contra equipos. Es
  información, no resultado, y por eso no usa `.kv` ni entra al `.res-side`.
- **`.lic:has(input:focus-visible)`**: el foco se dibuja en la tarjeta porque el cuadro nativo
  mide 16 px y su anillo se pierde contra el borde.

**Lo que no se copió:** el acento morado `--plus` y `body[data-pkg="plus"]`, la escalera de años
(`.ladder`/`.rung`/`.yrchip`), el volumen de redes (`.vgrid`/`.vrow`/`.vtrack`), las áreas
TI/IP/DP, los esquemas `.cfg-pay` y la navegación de seis pasos. Aquí son tres pasos.

### La sumatoria: dos cifras y nada más

El `.res-side` dice **Total mensual** en `--mono` a 33 px, con el plazo y el desglose de IVA en
el `.sub`, y un solo `.kv` con el **Total a pagar**. Ni tasa, ni precio unitario, ni monto
financiado, ni anualidad: eso es del vendedor y vive solo en el modo interno.

### El modo interno se ve a un metro de distancia

El conmutador es un `.seg` de la `.cfgbar` —**Cliente / Interno**— y encendido toma **rojo**, no
el acento: en una pantalla compartida tiene que gritar. El panel va con **borde punteado rojo y
fondo `--g-red-t`**, encabezado por un `.miniLbl` con `.tagx` rojo «Interno · no mostrar al
cliente». Y lo de siempre: **no se oculta con CSS, no se renderiza** —el nodo se crea al
encender y se elimina del DOM al apagar—; `@media print` es una red de seguridad, no el
mecanismo.

El panel se inserta con la clase `mo-in` porque nace de un clic, no del scroll: sin ella heredaba
la opacidad 0 de la cascada `.mo-stagger` y el modo interno parecía encendido sin panel.

## Movimiento

Motor compartido de `compartidos/`, en **nivel contenido**: microinteracciones en botones,
`Motion.botonEstado()` en las acciones que tardan, cascada corta al cargar, barra de avance de
3 px absoluta dentro de `.cfgbar` (no altera la altura que mide `setupDynamicOffsets()`).

Lo que **no** se anima, por [`docs/normativa-motion.md`](../../docs/normativa-motion.md):
números y totales (`#barPrice`, `#actPrice`, `#invMensual`, `#invTotal`), campos de formulario,
e indicadores con `aria-live` propio (`#saveState`, folio, `#warnBox`). El `@media print` anula
la barra de avance y el panel interno además de lo que ya anula el motor.

## Dónde está dada de alta

- **Portal** (`index.html` de la raíz): tarjeta «Cotizador de arrendamiento».
- **Kit comercial**, lista **`VENTA`**. Es una herramienta de venta igual que el cotizador: la
  opera el vendedor para cotizarle a un colegio, y lo que se comparte (enlace, PDF, correo) es
  la vista de cliente. No es proceso interno: el CRM o el portal de TI no se le enseñan a nadie;
  esta página sí. Su alta convirtió la fila de venta en **cinco** tarjetas (`.kc-grid.g5`).
- `docs/estructura.md`: árbol y tabla de URLs.

## Cómo se regenera la vista previa de WhatsApp

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/arrendamiento/og.png \
  paginas/arrendamiento/og-source.html
```

(Con Chrome, el mismo comando cambiando el ejecutable.) WhatsApp cachea la vista previa por
URL; si cambia la imagen y el enlace ya se compartió, se fuerza el refresco con `?v=2`.

## Al tocar esta página

1. **No cambies la lógica para animar o maquetar.** Si un efecto exige tocar un cálculo, no va.
2. **Corre `?test=1`** antes y después de cualquier cambio en precios o reglas.
3. **Ábrela en una ventana privada**: con tu `localStorage` lleno no ves lo que ve un comercial
   que entra por primera vez, y la regla de oro es que la primera pantalla ya muestre precio.
4. **Imprime** (`Ctrl+P`): portada + contenido, sin hojas en blanco y **sin un solo dato
   interno** — ni tasa, ni unitarios, ni total financiado, ni precios de catálogo.
5. **Prueba sin red y sin `localStorage`**: la herramienta debe seguir cotizando.
6. Comprueba que la barra de configuración siga pegada al bajar y que el botón de **modo
   interno vuelva a nacer apagado** en cada recarga.
