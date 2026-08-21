# Cotizador Upgrade Edu 2026–2027

Arma la propuesta de un colegio —dispositivos, licenciamiento, capacitación y soporte— y produce
la cotización lista para imprimir o mandar. Es una **herramienta de trabajo**, no una
presentación: guarda borradores, lleva folio y revisión, y lo que imprime llega al cliente.

Se publica en **https://sanoapro.github.io/activa/paginas/cotizador/**

Un solo archivo de ~4 150 líneas, autocontenido salvo el motor de movimiento compartido. No hay
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

```
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
| Vigencia, entrega y firma | rojo |
| Datos fiscales y bancarios | amarillo |

Y la zona de captura se hunde: `.foldb` va en gris azulado y los campos en blanco puro, para que
lo que hay que llenar resalte. Dentro de las tarjetas largas, los bloques de campos se agrupan en
`.fgroup` —una tarjeta blanca por bloque— en vez de flotar bajo un rótulo suelto.

## Dónde se cambian los precios y las reglas

Casi todo el negocio vive en objetos congelados con `deepFreeze` cerca de la línea 1764. Se editan
esos objetos, no la lógica.

| Objeto | Qué fija |
|---|---|
| `APP_CONFIG.cycle` | Ciclo `2026-2027`, fecha límite de firma temprana, vigencia (31 días), fecha de entrega, moneda y locale |
| `APP_CONFIG.pricing` | **Los precios por alumno**, por paquete (`edu`, `plus`) y por fila de equipo (`n3`, `n4`, `flip`, `tab`) |
| `APP_CONFIG.discounts` | Contado 10 %, firma temprana 5 % |
| `APP_CONFIG.annualFactors` | Cómo escala el precio año con año según el plazo |
| `APP_CONFIG.equipment` | Costos de equipo y proporción de equipos incluidos por docente |
| `APP_CONFIG.limits` | Topes de cordura. `listPerStudent.max` bloquea el documento si el precio por alumno se sale de rango |
| `TERMS` | Los cuatro plazos: `cb3`, `cb4` (Chromebooks nuevas a 3 y 4 años), `fl2` (Flip-Touch seminueva a 2), `tb3` (Tablet a 3) |
| `TEACHER_MODELS` | Modelo `docente` o `estudiante` para el equipo del profesor |
| `PAYS` | Los tres esquemas: contado, firma antes del corte, firma después |
| `LICS` (≈1991) | Las licencias y plataformas |
| `ITEMS` (≈1860) | Cada partida del desglose, con su área, ícono y cantidad |

**Al cambiar de ciclo escolar** se toca `APP_CONFIG.cycle` y `APP_CONFIG.pricing`; las fechas están
juntas a propósito para que sea un solo lugar.

---

## Qué bloquea qué

Hay **tres** estados de preparación, no dos, y confundirlos es caro. `getReadiness()` los devuelve:

| Estado | Qué habilita | Qué lo rompe |
|---|---|---|
| `calculable` | Que se **vea el precio** por alumno | Solo lo financiero: alumnos, precio no positivo o no finito, precio implausible, carrito sin precio, escenario corrupto |
| `proposalReady` | El botón **Ver propuesta** | Lo anterior, más cualquier decisión obligatoria pendiente (hoy: el modelo de equipos docentes) |
| `documentReady` | **PDF** y **correo** | Lo anterior, más todo dato documental por capturar: institución, ciudad, fechas, RFC, banco… |

El motor es la única fuente de verdad: cada advertencia `t:"e"` declara en `blocks` si tumba el
**precio** (`"price"`) o solo el **documento** (`"document"`). `engineErrorsToIssues()` no decide, traduce.

> **La regla que hay que respetar.** Un dato solo puede llevar `blocks:"price"` si de verdad entra en
> el importe por alumno. El modelo de equipos docentes no entra —mueve `eqDocInc` y el parque que
> describe el documento, nunca `list` ni los esquemas de pago— y por eso vaciaba el precio de **toda
> cotización recién abierta**: el estado inicial nace sin modelo elegido. Solo funcionaba en las
> máquinas con borradores heredados de `v2`/`v3`, porque `migrateDeviceFields()` les fija `docente`.
> La suite estaba en verde mientras tanto, porque una prueba afirmaba el comportamiento roto.

Cuando el precio sí es incalculable, el motivo se escribe **junto al precio**, en `#actSub` de la barra
de acciones, que es lo único siempre a la vista. Un `—` mudo con la causa cuatro secciones más abajo se
lee como herramienta rota, y así se reportó.

---

## Persistencia, folio y revisión

Guarda en `localStorage`, con estas llaves (versión `v3`, y migra desde `v2`):

```
activa.cotizador.current.v3      el borrador abierto
activa.cotizador.index.v3        el índice de borradores
activa.cotizador.quote.v3.<id>   cada cotización
activa.cotizador.counter.v3.<…>  consecutivos de folio
activa.cotizador.revmax.v3.<…>   revisión máxima emitida
activa.cotizador.recovery.v3.<…> recuperaciones ante fallo
activa.cotizador.seller-profile.v3  el perfil del vendedor
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
cotización. El esquema es `schemaVersion: 4` y hay migración desde la 3, cubierta por pruebas.

## Impresión

Es la salida que llega al cliente, así que tiene camino propio:

1. `window.doPrint()` llama a `preparePrint()`, que espera las tipografías y las imágenes.
2. `preparePrint()` construye el documento completo dentro de `#printRoot`.
3. Con `body.pp-on`, el `@media print` **oculta toda la aplicación** y muestra solo `#printRoot`.

El documento impreso lleva portada con folio, revisión, fecha y vigencia, el desglose por áreas,
la inversión, los esquemas de pago, los accesos a plataformas, los datos bancarios con su
advertencia de verificación del titular, y el bloque de firmas.

---

## Pruebas internas

La página trae su propia suite. Se corre agregando `?test=1` a la URL:

```
http://127.0.0.1:8123/paginas/cotizador/?test=1
```

El resultado se dibuja en `#testReport`. Cubre, entre otras cosas, la migración de esquema v3 → v4,
que la importación externa conserve tipos estrictos, que un borrador incompleto sobreviva a
exportar e importar, y que la aritmética histórica no cambie. **Conviene correrla después de tocar
precios o reglas.** Hay además un objeto `Diagnostics` que detecta cotizaciones huérfanas en
`localStorage`.

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
