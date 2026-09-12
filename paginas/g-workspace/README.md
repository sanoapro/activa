# G-Workspace — cotizador de licencias Google Workspace for Education

<https://sanoapro.github.io/activa/paginas/g-workspace/>

Cotiza **dos SKU y nada más**: Google Workspace for Education **Plus** y **Teaching &
Learning Upgrade**. No es un catálogo: es una **comparativa**. El colegio ve las dos rutas
lado a lado —con su precio anual, su almacenamiento y lo que incluye cada una— y el asesor
marca cuál recomienda. Ese escenario es el que lleva el total a la portada del PDF.

| | |
| --- | --- |
| Archivo | `index.html`, autocontenido (sin build, sin dependencias) |
| Abre desde | `file://` con doble clic, y desde el sitio publicado |
| Externo | `../../compartidos/` → `css/motion.css`, `js/motion.js`, `js/archivo-drive.js` |
| Suite | `?test=1` con servidor local · **56 pruebas** |
| Versión | la de `.vertag` en el encabezado; el `<title>` se reescribe desde ahí al arrancar |

## La regla que gobierna todo: las dos rutas no se suman

**Education Plus incluye todas las funciones de Teaching & Learning.** La decisión del
director es de **alcance** —un área o todo el dominio—, no de «más funciones por más
dinero». Por eso la página **compara** y nunca suma:

- Cada escenario lleva su propio subtotal, su IVA y su total.
- El **escenario recomendado** (los radios `#recA` / `#recB`) decide qué total viaja a la
  barra fija, al paso 3 y a la portada del PDF. Una portada con dos «Inversión total» no
  se puede leer.
- Si los dos escenarios tienen cantidad, la pantalla avisa del traslape. **Ese aviso no se
  imprime**: hay una prueba que lo verifica.

| | Escenario A | Escenario B |
| --- | --- | --- |
| Edición | Education Plus | Fundamentals (sin costo) + Teaching & Learning |
| Alcance | todo el dominio | un área o los docentes |
| Se cobra por | **usuario** = estudiantes **+** personal | **maestro**, desde 1 licencia |

## Precios · matriz `PRECIOS`

**Todos los importes van NETOS, SIN IVA.** El IVA (16 %) se aplica **una sola vez, sobre el
subtotal de cada escenario**; nunca dentro de un precio unitario. Cambiar un precio es
editar el objeto `PRECIOS` y nada más: el resto del archivo lo lee de ahí, y la prueba «La
matriz es la única fuente» comprueba que ninguna cifra esté escrita dos veces.

| Concepto | Valor |
| --- | --- |
| Education Plus | $102.00 · usuario · año |
| Teaching & Learning | $1,225.00 · maestro · año |
| Pool base de almacenamiento | 100 TB, de la institución |
| Adicional por licencia | 20 GB (Plus) · 100 GB (T&L) |
| Meet · Plus | 1,000 participantes · 100,000 espectadores del dominio |
| Meet · T&L | 250 participantes · 10,000 espectadores del dominio |
| IVA | 16 % · Vigencia | 31 días |

> ### ⚠️ Aviso recíproco con `paginas/compra/`
>
> Esos dos precios **también viven** en `paginas/compra/index.html`
> (`PRECIOS.partidas.eduplus` y `.gwtl`). Es una copia manual **a propósito**: cada
> cotizador va autocontenido porque el PDF es el entregable y no puede depender de un
> archivo externo. **Quien cambie un precio aquí lo cambia allá a mano**, y al revés. Los
> dos archivos llevan el aviso junto al número.

### Las tres trampas de esta matriz

1. **El terabyte es decimal: 1 TB = 1,000 GB.** Es lo que usa la hoja de origen, que a
   1,600 × 20 GB los llama 32 TB. Con base 1024 los 140 TB de su ejemplo se vuelven 136.72
   y nada reconcilia. `PRECIOS.gbPorTB` lo fija y hay prueba.
2. **Plus se cobra por usuario TOTAL**, estudiantes + personal. La hoja de origen cobraba
   solo a los estudiantes y contaba al personal únicamente para el almacenamiento. Se
   corrigió el 12-sep-2026 por decisión comercial, y así coincide con
   `docs/portafolio-activa.md` y con el licenciamiento real de Google. La prueba afirma
   explícitamente que el subtotal del ejemplo **no** son $163,200.
3. **El pool de 100 TB es de la institución y es el mismo en toda edición.** Sumar los dos
   escenarios lo contaría dos veces (140 + 101.6 = 241.6 TB, cuando un colegio con las dos
   ediciones tendría 141.6). Otra razón para no sumarlos nunca.

### Reconciliación con la hoja de origen

La fuente fue **`G-Workspace - México.csv`**, que llegó el 12-sep-2026 y **no está en el
repositorio**: la matriz `PRECIOS`, este README y las pruebas son la única transcripción
que queda de él. Su ejemplo era 1,600 estudiantes, 400 de personal y 16 maestros:

| | Escenario A | Escenario B |
| --- | --- | --- |
| Licencias | 2,000 usuarios | 16 maestros |
| Subtotal | $204,000.00 | $19,600.00 |
| IVA 16 % | $32,640.00 | $3,136.00 |
| Total | $236,640.00 | $22,736.00 |
| Almacenamiento | 140 TB | 101.6 TB |

El almacenamiento de los dos y el importe de T&L **cuadran exactos con el CSV**. El
importe de Plus difiere a propósito, por la trampa 2.

### Lo que se descartó de la hoja

- La columna **«Precios anteriores»** ($75.83 y $630). No entra ni al configurador ni al
  PDF; hay prueba que verifica que el documento no contiene ninguna de las dos cifras.
- La nota **«$45 pesos mexicanos al mes»** junto a Teaching & Learning: no reconcilia con
  ninguna otra cifra del bloque (16 × $45 × 12 = $8,640, y el CSV dice $19,600). El precio
  bueno es $1,225 anuales, confirmado el 12-sep-2026.
- La fila **`T&L Flex`**, que llegó vacía.

## Ficha de producto

El texto de las viñetas viene de `paginas/upgrade-edu/index.html` (lámina 10, «Dos rutas,
según cómo entra el colegio»), que es la redacción ya aprobada para estos dos productos. Lo
que se agregó son las cifras que esa lámina no publicaba: el pool de 100 TB, los GB por
licencia y los participantes de Meet, verificados el 12-sep-2026 contra la comparación
oficial de ediciones de Google.

En el mismo trabajo se corrigió `docs/portafolio-activa.md`, que decía **500 participantes
para Plus**: el dato de Google es **1,000**, y para T&L son **250**.

## El almacenamiento, junto al precio

El bloque de inversión del documento lleva **el almacenamiento del escenario recomendado**
con su composición debajo (`.ph-stor`), no solo la cifra enterrada seis filas más abajo en
la comparativa. Es la segunda cifra que el director compara entre las dos rutas —Plus da
20 GB por licencia sobre el pool y T&L da 100 GB, así que la ruta más cara no siempre es la
que más almacenamiento deja—, y ahí abajo pasaba de largo.

### Por qué el subtexto de la comparativa envuelve

Las celdas de cifra llevan `white-space:nowrap` para que un importe no se parta a media
cantidad. El subtexto de la celda lo heredaba, y en el PDF —donde no hay scroll horizontal
que lo salve, a diferencia de la tabla de trabajo, que vive en `.tscroll`— la línea
«Transmisión para 100,000 espectadores del dominio» se salía de su columna y **se encimaba
con la de al lado**. `.desc` lleva `white-space:normal` en las dos hojas, la de pantalla y
la de papel: la cifra sigue sin partirse y la prosa envuelve.

Dentro de la composición del almacenamiento los espacios son **duros** (` `): sin eso,
«1,100 × 20 GB» se partía dejando «× 20 GB» solo en la línea siguiente. La frase parte entre
sus partes, nunca dentro de una cantidad.

## Cómo se edita

- **Un precio, el almacenamiento o una cifra de Meet** → `PRECIOS`, y actualiza
  `paginas/compra/` a mano.
- **Una viñeta o una descripción** → `FICHA_BASE`. Solo describe: el precio, los GB y Meet
  se inyectan desde `PRECIOS` por la clave del SKU.
- **El cálculo** → `computeScenarios()`. Es puro y es la única fuente de verdad; la UI
  traduce, no decide. Cada advertencia `t:"e"` declara en `blocks` si tumba el precio
  (`"price"`) o solo el documento (`"document"`).
- **El documento que recibe el colegio** → `buildProposal()` (cuerpo) y
  `buildPrintDocument()` (portada, hojas y pie repetido).

Dos cosas que parecen un descuido y no lo son:

- El encabezado de cada tarjeta es un `<div class="esc-h">`, **no un `<header>`**: el
  selector de elemento `header{position:sticky}` de esta página alcanzaba también a las
  tarjetas y mandaba su encabezado al pie de su propia tarjeta.
- En las pruebas, las cadenas con etiquetas de script van **partidas**
  (`'<scr'+'ipt>…</scr'+'ipt>'`). Un `</script>` literal cierra la etiqueta de la página y
  deja la aplicación sin cargar; el JavaScript sigue siendo válido, así que `node --check`
  lo aprueba y el fallo solo aparece al abrir el archivo.

## Probar antes de publicar

```bash
python -m http.server 8123
# http://127.0.0.1:8123/paginas/g-workspace/?test=1
```

Las **56 pruebas** en verde, sin editar el valor esperado de ninguna. Si una había que
cambiarla, es un hallazgo que se reporta, no un estorbo que se ajusta.

Como el JavaScript va dentro del HTML, la revisión de sintaxis necesita extraer el
`<script>` a un `.js` temporal antes de `node --check` (procedimiento en
`docs/matriz-precios/prompt.md`).

Y la lista de `docs/normativa-motion.md`: sin JS se lee todo · `Ctrl+P` sin hojas en blanco
· «reducir movimiento» activado · consola sin errores ni 404 · teclado y foco · táctil ·
`Motion.start()` como última línea.

El bloque **PAPELERÍA v5** tiene que seguir siendo idéntico al de las otras tres
herramientas:

```bash
diff <(sed -n '/PAPELERÍA v5 · inicio/,/PAPELERÍA v5 · fin/p' paginas/compra/index.html) \
     <(sed -n '/PAPELERÍA v5 · inicio/,/PAPELERÍA v5 · fin/p' paginas/g-workspace/index.html)
```

## Regenerar `og.png`

`og-source.html` es el molde de 1200×630. No se publica ni se enlaza: solo existe para
volver a capturarlo. Desde la raíz del repositorio, con rutas absolutas (con relativas el
navegador no escribe el archivo):

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=<ruta absoluta>/paginas/g-workspace/og.png \
  <ruta absoluta>/paginas/g-workspace/og-source.html
```

WhatsApp cachea la vista previa por URL; si cambia la imagen y el enlace ya se compartió,
se fuerza el refresco con `?v=2`.

## Pendiente de confirmar con Martín

1. **La leyenda de entrega.** Hoy reusa la de compra directa —«15 días hábiles después de
   la confirmación del pago»—, que es norma comercial cerrada **para equipo**. En licencias
   el acto real es la asignación en la Consola de Google Admin. Vive en `PRECIOS.entrega`.
2. **Verificación de estudiantes.** La hoja de origen apunta a
   `goo.gle/studentverification-spanish` como requisito del precio de Plus, y en el
   repositorio no hay una sola mención del trámite. No se agregó ni al configurador ni al
   PDF hasta definir cómo se le explica al colegio.
