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

Su vista previa de WhatsApp vive en `compartidos/img/og-cotizador.png` y las etiquetas `og:`
apuntan a ella con **URL absoluta** (WhatsApp no lee rutas relativas).

---

## Cómo está organizado por dentro

Seis secciones, en el orden en que el vendedor las recorre:

| Sección | Título | Qué se hace ahí |
|---|---|---|
| `#s1` | Precio y formas de pago | Paquete, plazo, modelo docente, esquema de pago |
| `#s2` | Todo lo que incluye | Desglose por área: TI, IP y DP |
| `#s3` | Acompañamiento asignado | Horas de capacitación y visitas según número de alumnos |
| `#s4` | Ajustes de la cotización | Conciliación de equipos, descuentos, cantidades |
| `#s5` | Datos para la propuesta | Colegio, contactos, vendedor, vigencia |
| `#s6` | Descuento especial por volumen de redes | Cotización de varios planteles |

Las tres áreas —**TI** Tecnologías de la Información, **IP** Innovación y Proyectos, **DP**
Desarrollo Profesional— son las mismas que firman la Carta de Entrega Comercial y las mismas del
[catálogo de productos](../../docs/descripcion-de-productos/catalogo-productos.md).

---

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
3. **Imprime** (`Ctrl+P`) y revisa que no falte ninguna sección ni salgan hojas en blanco.
4. **Prueba sin red y sin `localStorage`**: la herramienta debe seguir cotizando.
5. Comprueba que la barra de configuración siga pegada al bajar.
