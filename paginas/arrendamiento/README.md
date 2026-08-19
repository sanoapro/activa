# Cotizador de arrendamiento de equipo

Cotiza **arrendamiento de equipo Chromebook para colegios**: renta mensual fija en pesos, a 3 o
4 años, con seguro, Securly y carritos de carga. Es una **herramienta de trabajo** del equipo
comercial —guarda borradores, lleva folio y revisión— cuya salida (pantalla, PDF y correo) está
diseñada para verse **frente al cliente**.

Se publica en **https://sanoapro.github.io/activa/paginas/arrendamiento/**

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
| `documentReady` | **PDF** y **correo** | Lo anterior, más los datos documentales: institución, ciudad, fechas, vendedor y su correo |

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

## Compartir un escenario

El escenario viaja en el fragmento como `#scenario=<código>` (`schemaVersion: 1`): equipos,
plazo, seguro, Securly y carritos. **Sin datos personales y sin modo interno** — si el vendedor
manda el enlace al colegio, el colegio ve la vista de cliente. El código `ARRENDA1:<…>` del
modal de gestión es el mismo escenario para moverlo entre equipos. Al recargar, el borrador
guardado siempre gana sobre el propio hash (lección F-01 del cotizador).

## Impresión

Camino propio, idéntico en estructura al del cotizador:

1. `window.doPrint()` → `preparePrint()` espera tipografías y construye en `#printRoot`.
2. Con `body.pp-on`, el `@media print` **oculta la aplicación entera** y muestra solo el
   documento; sin `pp-on`, imprimir muestra el aviso de usar «Generar PDF».
3. El documento: portada (colegio, mensualidad con IVA, plazo, folio, vigencia), qué incluye,
   inversión desglosada, condiciones, contacto y firmas; pie repetido con folio en cada hoja
   (`position:fixed`) y encabezado repetido vía `<thead>` de `.print-shell`.

`Ctrl+P` directo también funciona cuando el documento está listo (guard en `beforeprint`).

## Pruebas internas

`?test=1` corre la suite y la dibuja en `#testReport` — **32 pruebas**: los cuatro casos de
regresión, la linealidad de PMT, el prorrateo de carritos mixtos, el desglose de IVA, CEU solo
docente, seguro/Securly por plazo, el precio visible en una cotización recién abierta, que el
aviso de carritos nunca bloquea, que el modo interno arranca apagado / no viaja / se elimina del
DOM, que documento, correo y escenario no contienen datos internos, tipos estrictos en la
importación, borradores incompletos que sobreviven a exportar/importar, folio, revisiones,
conflicto entre pestañas y rollback de escrituras.

**Conviene correrla después de tocar precios o reglas.**

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
