# El encargo

Prompt autocontenido para implementar la cotización a la medida en el cotizador Upgrade Edu. Se
le pasa completo a una sesión de Claude Code parada en la raíz del repositorio.

> **Documento histórico (22-ago-2026).** Este encargo ya se ejecutó, y los precios que
> aparecen abajo eran los **provisionales** del 21 de agosto: $17,000 / $21,000 de Chromebook
> nueva, $8,000 de seminueva, el `PENDIENTE` en cero. Todos quedaron superados por la lista
> definitiva, que está en [`plan.md`](plan.md) y es la única que vale. Se conserva tal cual
> porque documenta cómo se construyó, no cuánto cuestan hoy las cosas.

**Antes de ejecutarlo, [`plan.md`](plan.md) tiene que estar leído.** Este documento dice *qué
construir*; el plan dice *por qué así*, y sin eso las decisiones de aquí parecen arbitrarias.

**Y antes de ejecutarlo, las cinco decisiones abiertas del plan tienen que estar contestadas.**
Están en la sección «Las cinco decisiones abiertas» y cada una es un número que entra directo al
precio que paga un colegio. Si alguna sigue sin respuesta, **para y pregunta**: no inventes un
precio ni lo dejes en cero «por ahora». Un cero que se cuela a producción cotiza equipos gratis.

---

## Contexto

Este repositorio publica todas las páginas web de activa en GitHub Pages. **No hay build, ni CI,
ni bundler, ni `node_modules`**: lo que está aquí es exactamente lo que sirve el navegador. Cada
página es un `index.html` autocontenido, con su markup, su CSS, su motor de cálculo, su
persistencia, su impresión y sus pruebas internas adentro. Lo único compartido vive en
`compartidos/`.

El archivo a tocar es **uno solo**: `paginas/cotizador/index.html`, unas 4,560 líneas.

La herramienta cotiza el programa Upgrade Edu para colegios. El vendedor captura alumnos,
docentes, equipos y licencias; la herramienta calcula un **precio por alumno y por año**, lo
escala con factores anuales según el plazo, le aplica el descuento del esquema de pago y produce
un PDF que llega al colegio.

**El colegio nunca ve la herramienta: recibe el PDF.** Esa distinción gobierna todo lo que sigue.

---

## El problema que hay que resolver

Un colegio de 700 alumnos pide 30 equipos y un carrito, y quiere el costo repartido entre sus 700
alumnos. Necesita 700 licencias pero solo 30 equipos, 30 seguros, 30 licencias CEU y un carrito.

Las cinco modalidades de la herramienta fallan: cuatro derivan la cantidad de equipos de una razón
fija sobre los alumnos (1:1, 1:2, 1:3, 1:4) y la quinta —«Sin equipos»— cierra los equipos a cero
por construcción.

**La modalidad «Sin equipos» deja de significar *no se puede* y pasa a significar *a la medida*:**
cotiza las licencias de todos los alumnos, más los equipos que el colegio realmente pidió,
prorrateados entre todos los alumnos y todos los años del contrato.

---

## Lo que hay que construir

Cuatro fases. **Se hacen en orden**, y la suite (`?test=1`) tiene que quedar en verde al final de
cada una antes de empezar la siguiente.

---

### Fase 1 · El catálogo de equipos por plazo

Hoy hay dos precios de equipo para los cuatro plazos, en `APP_CONFIG.equipment` (líneas
1927-1928):

```js
teacherDeviceCost: 21000,
studentDeviceCost: 17000,
includedTeacherDeviceRatio: {docente:20, estudiante:10},
```

Eso deja de ser cierto: **el plazo decide qué equipos existen**, no solo entre cuántos años se
divide.

| Plazo | Equipo de alumno | Equipos de docente elegibles | Años |
|---|---|---|---|
| `cb3` Chromebook nueva · 3 años | Chromebook nueva | modelo docente · o · modelo estudiante | 3 |
| `cb4` Chromebook nueva · 4 años | Chromebook nueva | modelo docente · o · modelo estudiante | 4 |
| `fl2` Flip-Touch seminueva · 2 años | Flip-Touch **seminueva** | **Flip-Touch seminueva docente, y nada más** | 2 |
| `tb3` Tablet · 3 años | **Tablet nueva** | **Chromebook nueva docente, y nada más** | 3 |

Retirar los tres campos de arriba y declarar, junto a los demás objetos congelados:

```js
const DEVICES = deepFreeze({
  cbAlumno:  {label:"Chromebook nueva",                cost:17000},   // ← decisión B
  cbDocente: {label:"Chromebook nueva · docente",      cost:21000},   // ← decisión B
  flAlumno:  {label:"Chromebook Flip-Touch seminueva", cost:0},       // ← decisión A · PENDIENTE
  flDocente: {label:"Flip-Touch seminueva · docente",  cost:8000},
  tablet:    {label:"Tablet nueva",                    cost:10000}
});
```

Y en cada plazo de `TERMS`, dos campos nuevos: `alumno` (una llave de `DEVICES`) y `docentes` (la
lista de opciones elegibles, cada una con su llave, su equipo y su razón de inclusión). La forma
exacta está en el plan, sección «Cómo se escribe».

**Reglas de esta fase, todas obligatorias:**

1. **Las llaves `docente` y `estudiante` se conservan.** Son los valores que ya guarda
   `scenario.teacherDeviceModel`. En `fl2` y `tb3` simplemente solo existe `docente`. Así **ningún
   borrador existente necesita migración de ese campo**.
2. **Con una sola opción de docente, la pantalla no pregunta.** El `fieldset` de modelo docente
   (`#teacherModelGrid`, líneas 1270-1284) se construye desde `TERMS[term].docentes`. Si la lista
   tiene un elemento, se preselecciona y el bloque no pide una decisión que no existe. La
   advertencia bloqueante `TEACHER_MODEL` no se emite en ese caso.
3. **Las filas del equipo docente del desglose toman su nombre del catálogo.** Hoy están escritas
   a mano en `ITEMS` (líneas 1987-1993) y **nunca dicen «seminuevo», en ningún plazo**. La fila
   del equipo de alumno ya se renombra sola con `dyn: r => r.t.device + " para estudiante"`; las
   de docente tienen que hacer lo mismo con el `label` del `DEVICES` que les toque.
   **Este es el punto entero de la fase.** Hoy, en el plazo de 2 años, el PDF que recibe el
   colegio describe un equipo docente nuevo cuando es seminuevo.
4. **El rótulo de costos de la interfaz** —hoy fijo en `costos de catálogo: docente $21,000 ·
   estudiante $17,000`, línea 1268— se escribe desde el catálogo del plazo elegido.
5. **Al cambiar de plazo**, si el modelo docente elegido no existe en el nuevo, se cambia al único
   disponible y **se avisa con un toast**. Nunca se cambia en silencio: el vendedor tiene que
   enterarse de que su cotización cambió de equipo.

---

### Fase 2 · La modalidad a la medida cotiza equipos

**El corazón del encargo.** El motor ya sabe prorratear: en `quote()`, líneas 2210-2213, ya
existe `costExtraEq / students / years`. Lo que lo apaga es `const hasDev = mod > 0`.

**Estado nuevo.** El esquema sube de **v4 a v5** (`APP_CONFIG.schemaVersion`). Un campo nuevo en
`scenario`:

```js
proRata: {
  stu:  0,      // equipos de alumno
  doc:  0,      // equipos de docente
  carts: []     // [{cap: 20|30|40, qty: 1..99, price: 0..10000000}]
}
```

- Se declara en `defaultState()` (línea 2366).
- Se sanea en `sanitizeScenarioPayload()` (línea 2408) con los mismos validadores estrictos que
  el resto: `strictInteger`, `strictEnum`, `strictFiniteNumber`. Nada de coerciones silenciosas.
- Se normaliza a ceros cuando `mod > 0`, igual que hoy `eqDoc`/`eqStu` se normalizan a ceros
  cuando `mod === 0`. Un campo latente que reaparece como cargo al cambiar de modalidad es un
  defecto que esta página ya sufrió antes (ver `resetStateForModel`, línea 2995).
- `sanitizeSavedQuote` acepta `[2,3,4,5]` con `allowLegacy` y migra: **v4 → v5 pone `proRata` en
  ceros**. Es seguro por construcción, porque en v4 la modalidad 0 no podía tener equipos.
- `teacherDeviceModel` **se reutiliza tal cual**. No hay campo nuevo para el modelo de docente.

**La fórmula.** En `quote()`:

```text
costoFierro = proRata.stu × (costoEquipoAlumno  + CEU + seguroDelPlazo)
            + proRata.doc × (costoEquipoDocente + CEU + seguroDelPlazo)
            + Σ carts (qty × price)

adjProRata  = alumnos > 0 && años > 0 ? costoFierro / alumnos / años : 0

listRaw     = base - discLic + adjEqDoc + adjStuExtra + adjCart + adjProRata
```

- `alumnos` son **todos los alumnos del colegio**, no los que reciben equipo.
- `años` son `TERMS[term].years`.
- **La licencia CEU y el seguro se suman solos, por equipo, siempre.** No hay casilla que
  capturarlos ni desmarcarlos: si hay 30 equipos hay 30 CEU y 30 seguros. Los precios salen de la
  decisión C.
- **Securly no entra aquí.** Es por alumno y ya está dentro del precio base.

**Los campos de salida del motor se rellenan igual que siempre.** `stuReq`, `eqDocTot`,
`eqStuTot`, `totalEq`, `stock` y `carts` tienen que incluir los equipos prorrateados, para que el
desglose y los conteos del documento funcionen sin tocarse. `hasDev` deja de ser `mod > 0` y pasa
a ser «hay equipos», por la razón que sea.

**Carritos.** En esta modalidad son **renglones explícitos** con capacidad, cantidad y precio
unitario, mezclables, como en `paginas/arrendamiento/index.html` líneas 1449-1462. En las
modalidades 1:1 a 1:4 la cantidad se sigue derivando de `ceil(stuReq / cartCap)` y no se toca.

> **El precio del carrito es siempre manual, en las cinco modalidades.** Decisión de Martín: el
> colegio puede tener ya los suyos, puede no querer ninguno o puede negociarlos aparte. No se
> declara catálogo de precios de carrito.

**Interfaz.** La modalidad 0 se llama **«Sin equipos incluidos · a la medida»**. La tarjeta
«Docentes, equipos y carritos» del paso 1 (`#foldEq`) cambia de contenido en vez de
deshabilitarse: bloque de equipos de alumno, bloque de equipos de docente con el modelo del plazo,
y renglones de carrito. Más una **caja de cálculo** —del estilo del `#cartBox` que ya existe— que
enseñe la cuenta completa: costo del fierro, entre cuántos alumnos, entre cuántos años, cuánto
suma al precio por alumno.

> El vendedor tiene que poder explicarle el número al colegio por teléfono sin abrir una hoja de
> cálculo. Esa caja es la diferencia entre una herramienta y una caja negra.

**Con la decisión D-1** (ver plan), esa caja incluye además el porcentaje de recuperación del
fierro bajo el esquema de pago elegido. **Ese dato es del vendedor y no sale de la pantalla.**

---

### Fase 3 · El documento

1. **Las compuertas por modalidad de `ITEMS` se encienden por cantidad, no por modalidad.** Hoy
   las filas de equipo usan arreglos fijos `DEV = [0,1,1,1,1]` y `[0,1,1,1,0]` (líneas 1978,
   1996-2010), que las apagan en la modalidad 0. Tienen que encenderse si hay equipos.
   Cuidado con la fila del **carrito**, cuyo arreglo es `[0,1,1,1,0]`: está apagada tanto en la
   modalidad 0 como en 1:1, y el `why` explica por qué en cada caso. Al abrirla en la modalidad
   a la medida, el `why` de 1:1 se conserva intacto.
2. **`modLbl`** (línea 3172) dice `"sin equipos"`. Con equipos capturados tiene que decir
   **`"a la medida"`**; sin ellos, sigue diciendo `"sin equipos"`. Se pinta en el chip de la
   portada, en el correo y en el pie corrido.
3. **La advertencia `NO_DEVICES`** (línea 2264) solo se emite si de verdad no hay equipos.
4. **Los textos de la sección «Alcance del programa»** que hoy afirman que la modalidad sin
   equipos no entrega dispositivos (líneas 3260-3263, 3303) tienen que decir la verdad nueva.

**Lo que NO cambia, y hay que custodiar activamente:**

> **El documento no imprime cómo se armó el precio.** Es una decisión cerrada de Martín el
> 21-ago-2026, con su prueba propia («El documento no imprime cómo se armó el precio»). El costo
> del fierro, el desglose del prorrateo, la caja de cálculo y el porcentaje de recuperación son
> **de la pantalla del vendedor** y no viajan al PDF, al correo ni al escenario compartido.
> El colegio ve **qué recibe** y **cuánto paga**. Los 30 × $17,000 son cuenta interna.

Los **conteos sí se quedan** —son lo que el colegio contrata—: cuántos equipos, de qué tipo,
cuántas licencias, cuántos carritos.

---

### Fase 4 · Pruebas

La suite vive en el propio archivo y corre con `?test=1`. Agregar, como mínimo:

| # | Prueba |
|---|---|
| 1 | **El ejemplo canónico.** 700 alumnos, 30 equipos de alumno, 1 carrito, plazo de 4 años, paquete Edu → el prorrateo y el `list` dan los importes de la tabla del plan |
| 2 | **El plazo mueve el prorrateo.** El mismo fierro a 2 años cuesta exactamente el doble por alumno y año que a 4 |
| 3 | **CEU y seguro son automáticos.** 30 equipos generan 30 CEU y 30 seguros sin que nadie los capture |
| 4 | **La migración v4 → v5 no mueve ningún precio.** Un borrador v4 de cada modalidad da el mismo `list` antes y después |
| 5 | **En `fl2` no existe el equipo docente nuevo.** `TERMS.fl2.docentes` tiene exactamente una entrada y apunta a un equipo seminuevo |
| 6 | **En `tb3` el docente es Chromebook nueva** y el alumno es tablet |
| 7 | **El documento nombra el seminuevo.** Con `fl2`, el desglose impreso contiene «seminueva» en la fila del equipo docente. **Esta prueba falla hoy** — escríbela primero y confirma que falla |
| 8 | **El prorrateo no viaja al documento.** El costo del fierro, la caja de cálculo y el porcentaje de recuperación no aparecen en el PDF, el correo ni el escenario. Se suma a la lista de cadenas prohibidas de la prueba que ya existe |
| 9 | **Cero equipos cotiza como hoy.** La prueba «Sin equipos: precio = base + docentes extra» (línea 4166) tiene que **seguir pasando sin modificarse**. Si hay que tocarla, algo se rompió |
| 10 | **Los campos latentes se limpian.** Pasar de la modalidad a la medida a 1:2 y de vuelta no deja equipos residuales que reaparezcan como cargo |

---

## Reglas de la casa que aplican aquí

Están en el README de la página y no son negociables:

1. **No cambies la lógica para animar o maquetar.** Si un efecto exige tocar un cálculo, no va.
2. **Toda advertencia `t:"e"` declara en `blocks` qué tumba**: `"price"` si de verdad entra en el
   importe por alumno, `"document"` si el importe es correcto y lo que falta es una decisión.
   Clasificar mal esto fue el origen del defecto «a los demás no les sale el precio»: un dato que
   no movía el precio lo vaciaba en toda cotización recién abierta. **Un dato solo puede llevar
   `blocks:"price"` si de verdad entra en el importe.**
3. **El motor es la única fuente de verdad.** `engineErrorsToIssues()` traduce, no decide.
4. **Los objetos de negocio van congelados** con `deepFreeze`, cerca de la línea 1892. Se editan
   esos objetos, no la lógica.
5. **Nada de dependencias nuevas.** ES2020 plano, en el estilo compacto del resto del archivo.
6. **La página tiene que seguir cotizando sin red y sin `localStorage`.**

---

## Cómo se verifica

| # | Qué se hace | Qué debe pasar |
|---|---|---|
| 1 | Correr `?test=1` **antes** de tocar nada | Se anota cuántas pasan, para comparar |
| 2 | Correr `?test=1` al final de cada fase | Todas en verde |
| 3 | Abrir en **ventana privada** | La herramienta arranca y **muestra precio** sin ningún borrador heredado. Este es el escenario donde vivió el defecto de «no me sale el precio» |
| 4 | Modalidad a la medida, 700 alumnos, 30 equipos, 1 carrito, 4 años | El precio por alumno es el de la tabla del plan |
| 5 | Cambiar el plazo a 2 años sin tocar nada más | El prorrateo se duplica y el equipo docente cambia a seminuevo, con aviso |
| 6 | Plazo de 2 años, cualquier modalidad, generar el PDF | El desglose dice **«seminueva»** en la fila del equipo docente |
| 7 | Plazo de tablet, 1:1 | El alumno lleva tablet, el docente lleva Chromebook nueva, y no hay opción de elegir otra cosa |
| 8 | Generar el PDF de una cotización a la medida | No aparece por ningún lado el costo del fierro, el prorrateo ni el porcentaje de recuperación |
| 9 | Abrir un borrador guardado **antes** del cambio | Mismo precio por alumno que antes, al centavo |
| 10 | Importar un JSON exportado antes del cambio | Igual |
| 11 | Compartir por `#scenario=` y abrir el enlace | Misma cotización |
| 12 | Modalidad a la medida con 0 equipos y 0 carritos | Cotiza solo licencias, exactamente como hoy |
| 13 | `Ctrl+P` | Ninguna sección falta, ninguna hoja sale en blanco |
| 14 | Comparar un PDF de 1:1 con uno de antes del cambio | Idénticos, salvo el nombre del equipo docente en el plazo de seminuevos |

---

## Al terminar

Actualizar [`paginas/cotizador/README.md`](../../paginas/cotizador/README.md): la tabla de objetos
de negocio (`DEVICES` nuevo, `teacherDeviceCost` y `studentDeviceCost` retirados), la sección de
persistencia (llaves `v5`), la de qué bloquea qué, y la lista de pruebas internas.

El README de esa página cuenta la página que existe, no la que existió. Es la disciplina de la
casa y el commit anterior se llamó justamente «La documentación alcanza al rediseño».
