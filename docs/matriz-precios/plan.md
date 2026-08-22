# El plan

Diseño de la matriz de precios de los tres cotizadores. Redactado el 22 de agosto de 2026.

---

## El problema

Cada cotizador guarda sus números a su manera. Ninguno está mal, pero en ninguno se puede
responder de un vistazo a «¿qué precios tiene esta herramienta y cuáles llevan IVA?».

Las consecuencias no son teóricas:

- **El error del 22-ago-2026.** La licencia CEU y el seguro llegaron sin IVA a una herramienta que
  trabaja con IVA. $419.20 de menos por equipo.
- **Cuatro comentarios desincronizados** en el cotizador, que citan importes muertos.
- **Textos que se imprimen en el PDF** con porcentajes escritos a mano que ya nadie sincroniza.
- **Una lista de seguridad escrita a mano** en arrendamiento, que deja de proteger en cuanto
  cambia un precio sin que ninguna prueba se entere.

---

## Lo que encontró la auditoría

### cotizador · el más repartido

Su «MATRIZ DE PRECIOS» ([:2010-2043](../../paginas/cotizador/index.html#L2010)) es **exacta en lo
que cubre** —equipos, CEU, seguro, carritos, docente extra, descuentos de licencia— y `quote()`
no tiene un solo literal de dinero suelto. Pero solo enumera **16 importes** —los cinco equipos,
la CEU, los tres seguros, el docente extra, los tres descuentos de licencia y los tres
carritos— y **fuera quedan unos 90 números comerciales más**.

Fuera quedan:

| Qué | Dónde | Peso |
|---|---|---|
| `APP_CONFIG.pricing` — 40 precios por alumno/año | [:1953](../../paginas/cotizador/index.html#L1953) | **El grueso de la facturación** |
| `discounts` 10% y 5% | [:1947](../../paginas/cotizador/index.html#L1947) | Se aplican a todo, fierro incluido |
| `annualFactors` (9 números) | [:1948](../../paginas/cotizador/index.html#L1948) | Escalan el precio año con año |
| `includedTeacherRatio` 1:10 · `extraStudentDeviceFactor` 0.8 | 1963, 1965 | Deciden cuánto se cobra |
| `TERMS[].stockPct` 2% y 20% · `docentes[].ratio` 20 y 10 | 2064-2079 | Deciden **cuántos** equipos se venden |
| `VOLUME` — 7 bandas de hasta **55%** | [:2257](../../paginas/cotizador/index.html#L2257) | El número comercial más grande, y **no entra en `quote()`**: solo se dibuja |
| `CAP` — horas y visitas | [:2258](../../paginas/cotizador/index.html#L2258) | Alcance contractual que sale impreso |
| `limits.listPerStudent` $250,000 | [:1945](../../paginas/cotizador/index.html#L1945) | Bloquea el documento |

El rótulo «es el único lugar donde se tocan estos importes» es cierto leído estrictamente
—*estos* importes— pero se lee como si fuera la matriz de precios del cotizador, y no lo es.

### compra y arrendamiento · ya casi resueltos

**compra** tiene `APP_CONFIG` —que ya declara «la tasa de IVA vive AQUÍ y solo aquí»— y `CATALOG`
con 37 partidas. El motor no tiene un número de dinero suelto. Le falta concentrar los precios y
tapar dos textos que no se sincronizan.

**arrendamiento** tiene todo en `CATALOG` con la celda del Excel anotada valor por valor
(`/* Q4 */`, `/* Q10 */`). Es el más limpio de los tres.

---

## Las tres convenciones de IVA, que siguen siendo distintas

| | Convención | Dónde entra el IVA |
|---|---|---|
| **cotizador** | Todo **CON IVA**, de principio a fin | En ningún lado: los precios ya lo traen |
| **compra** | Precios **NETOS** | Una vez, sobre el subtotal, inline en `computeQuote` |
| **arrendamiento** | Catálogo **SIN IVA** | Un solo punto: `ivaParts()`, llamado una vez en todo el archivo |

No se unifican: cada una responde a cómo se vende ese producto, y tocarlas obligaría a rehacer
motores financieros ya validados. Lo que se unifica es **que la matriz lo diga, en el mismo
renglón y con el mismo formato en las tres**.

---

## La regla que evita que esto se pudra

> **La cabecera no lleva ni una cifra.** Solo la convención, la fecha y la instrucción.

No es estética. El patrón «escribo el número también en prosa» ya falló cuatro veces en el
cotizador:

| Dónde | Qué dice | Qué es cierto |
|---|---|---|
| [:1851](../../paginas/cotizador/index.html#L1851) | «…el precio de carrito **que teclea el vendedor**» | Ese campo se retiró el 22-ago-2026 |
| [:4449](../../paginas/cotizador/index.html#L4449) | «la lista bajó de 7,261.538462 a **7,223.076923**» | La aserción real es `7269.538462`. Ninguno de los dos coincide |
| [:4750](../../paginas/cotizador/index.html#L4750) | «30 × (17,000 + 870 + 2,169.20) + 26,600 = **627,776**» | Cuatro de esos números están muertos |
| [:4838-4841](../../paginas/cotizador/index.html#L4838) | «el fierro pasó a 627,776, el prorrateo a 224.21…» | Los vivos son 556,460 y 198.74 |

Los cuatro se corrigen o se retiran en este trabajo.

---

## La forma

En cada página, después de los ayudantes de redondeo y **antes de cualquier otra constante de
negocio**:

```js
/* ┌──────────────────────────────────────────────────────────────┐
   │  MATRIZ DE PRECIOS · fuente única de verdad                  │
   │  ⚠  TODOS LOS IMPORTES VAN <CON|SIN> IVA                     │
   │  Cambiar un precio es editar ESTE objeto, y nada más.        │
   │  Aquí no se escriben cifras en prosa: el número vive abajo.  │
   └──────────────────────────────────────────────────────────────┘ */
const PRECIOS = deepFreeze({ … });
```

Misma cabecera, mismo orden de secciones y misma línea de IVA en las tres, para que quien abra
cualquiera reconozca el mapa. Y todo lo demás deriva:

```js
const DEVICES = deepFreeze({
  cbAlumno: {label:"Chromebook nueva", cost: PRECIOS.equipos.cbAlumno}, …
});
```

### Qué entra en cada matriz

**cotizador** — `porAlumnoAnual` (40), `equipos` (5), `porEquipo` (CEU y seguro por plazo),
`carritos` (3), `docenteExtraAnual`, `adicionalAlumnoFactor`, `descuentosLicencia`, `pago`
(descuentos, mensualidades, porcentaje de agosto), `factoresAnuales`, `razones` (1:10 y 20/10),
`stock` (2% y 20%), `topePorAlumno`, `volumenRedes`, `acompanamiento`, `limites`, `vigenciaDias`.

**compra** — `iva`, `vigenciaDias`, `entrega`, `limites`, y `partidas`: las 37 claves con su
precio neto, una por renglón, agrupadas por familia.

**arrendamiento** — `iva`, `tasaAnual`, `equipos` (con su bandera de CEU integrada), `ceu`,
`porPlazo` (meses, securly, seguro), `carritos`, `limites`, `vigenciaDias`. **Se conservan las
anotaciones de celda del Excel**: son la trazabilidad del origen.

---

## Los cabos sueltos, página por página

### cotizador

- `999999` a mano en **7 puntos del HTML** (1220, 1256, 1269, 1271, 1289, 1312, 1314) y **7 del
  JS de producción** (2571, 2801, 3114, 3345, 3347, 3352, 3365), en vez de `limites.cantidad.max`.
  El de [:2263](../../paginas/cotizador/index.html#L2263) **no cuenta**: es el centinela de la
  última banda de `CAP` («sin tope»), y ahí el número es la intención.
- `[0,20,30,40]` a mano en [:2657](../../paginas/cotizador/index.html#L2657) en vez de `CART_CAPS`.
- El `/55` de la gráfica de volumen ([:3801](../../paginas/cotizador/index.html#L3801)) fija a
  mano el máximo del arreglo.
- **Los porcentajes de stock viven dentro del texto de la partida**
  ([:2141](../../paginas/cotizador/index.html#L2141)) **y ese texto se imprime en el PDF**
  —verificado: `esc(it.d)` se pinta en la tabla del documento,
  [:3836](../../paginas/cotizador/index.html#L3836)—: si cambia `stockPct`, el documento seguirá
  prometiendo 2% y 20%.
- Rótulos que `syncStaticCopy()` **no** repone: «1 por cada 20/10 alumnos» (1302, 1305), «50% en
  agosto» (1494, 1495, 3842), los tres «Carrito de N equipos» (1323-1325).
- **Código muerto**: `validatePriceInput()` (3133-3146) no tiene un solo consumidor desde que se
  quitó el campo de precio de carrito, y con él muere `limits.price`. `cycle.currency` y
  `cycle.locale` (1936-1937) no los lee nadie: `money()` tiene `"es-MX"`/`"MXN"` clavados.

### compra

- El texto de entrega ([:1060](../../paginas/compra/index.html#L1060)) duplica
  `APP_CONFIG.delivery` y **nada lo sincroniza**; la etiqueta `IVA 16 %` de `#barIva`
  ([:955](../../paginas/compra/index.html#L955)) tampoco. Se agregan a `syncStaticCopy()`.
- Dos `note` repiten importes a mano: securly ([:1592](../../paginas/compra/index.html#L1592),
  «350 × 3 = 1,050 y 350 × 4 = 1,400») y profe3 ([:1712](../../paginas/compra/index.html#L1712),
  «$4,999.99»). Pasan a derivarse.
- `percent()` ([:1424](../../paginas/compra/index.html#L1424)) es código muerto.

### arrendamiento

- Fallback de plazo clavado en `3` ([:1418](../../paginas/arrendamiento/index.html#L1418)) en vez
  de `PLAZOS[0]`; umbral de `CART_EXCESS` clavado en `20`
  ([:1493](../../paginas/arrendamiento/index.html#L1493)) en vez de la capacidad mínima;
  `validateIntegerInput` duplica `LIMITS.qty.max`
  ([:2013](../../paginas/arrendamiento/index.html#L2013)).
- Los botones de plazo repiten «36 meses» y «48 meses» (843-844); el texto de capacidades repite
  20/30/40 (900).

---

## El caso que más vale: `FORBIDDEN` deja de escribirse a mano

Arrendamiento protege al cliente de ver precios internos con una lista de cadenas prohibidas
([:2963](../../paginas/arrendamiento/index.html#L2963)) y una expresión regular
([:3256](../../paginas/arrendamiento/index.html#L3256)), aplicadas al documento impreso, al correo
y al escenario compartido.

**Ambas están escritas a mano.** Si cambia un precio y nadie las actualiza, la prueba sigue en
verde y deja de proteger nada. Con la matriz se **derivan** de `PRECIOS`: cada importe formateado
con `money()` entra solo.

De paso: `"$490"` está en esa lista y **no es ningún precio de arrendamiento** — es el seguro de
1 año de compra, heredado de un copiar-pegar. Se retira.

---

## Lo que NO cambia

- **Ningún precio se mueve.** Es reorganización. Si al terminar hay que editar el valor esperado
  de una prueba existente, la migración cambió un precio y hay que averiguar por qué.
- **Las tres convenciones de IVA se respetan.** No se toca `ivaParts()`, ni `computeQuote`, ni la
  aritmética del cotizador.
- **Aritmética, persistencia, impresión, folios y papelería v5** no se tocan.
- **Los precios internos de arrendamiento siguen sin salir al cliente**: la matriz vive en el
  `<script>`, se pinta solo en `renderInternalPanel()`, y nunca en `buildProposal()`,
  `buildPrintDocument()` ni `buildMailModel()`.
- **Fuera de alcance**, aunque es el mismo tipo de problema: los datos del proveedor y del
  vendedor están duplicados literalmente en el markup del cotizador (1420-1438, 1585) frente a
  `APP_CONFIG.defaults`, y nada los sincroniza. No son precios; se anotan y se dejan.

---

## Una copia que seguirá existiendo

[`compartidos/js/precios-ciclo.js`](../../compartidos/js/precios-ciclo.js) es una **copia manual
declarada** de la tabla de precios por alumno del cotizador, y la usan `paginas/precios/` y la
lámina 33 del deck. Verificado: la tabla `pricing` existe en esos dos sitios y en ningún otro.

Ese archivo ya advierte que hay que actualizarlo a mano, pero **el cotizador no sabe que existe**:
quien cambia un precio allá no tiene forma de enterarse. La matriz del cotizador llevará el aviso
recíproco, nombrando el archivo y sus dos consumidores.

Unificarlos de verdad obligaría al cotizador a cargar un archivo externo y perder la
autocontención que protege al PDF. Queda fuera.

---

## Pruebas

En cada página, una prueba nueva **«La matriz es la única fuente»** que:

1. comprueba que `PRECIOS` esté congelado;
2. comprueba que **cada constante derivada coincide con su entrada en la matriz** — es lo que
   detecta que alguien vuelva a escribir un importe suelto;
3. fija **explícitamente, con el número escrito a mano**, los importes de cabecera, para que un
   dedazo dentro de la propia matriz también falle.

Las pruebas que hoy repiten la tabla completa —el objeto `esperado` de compra
([:3636](../../paginas/compra/index.html#L3636)) y las composiciones de arrendamiento
([:3041-3059](../../paginas/arrendamiento/index.html#L3041))— **se conservan con sus números a
mano, a propósito**: si leyeran de la matriz dejarían de probar nada.

---

## Orden de trabajo

Una página a la vez, con su suite en verde antes de pasar a la siguiente.

| # | Página | Por qué en ese lugar |
|---|---|---|
| 1 | **arrendamiento** · 41 pruebas | El más pequeño y concentrado. Fija el formato de cabecera que heredan los otros dos, y es donde vive la mejora de `FORBIDDEN` |
| 2 | **compra** · 55 pruebas | Extraer los 37 precios y tapar los dos textos que no se sincronizan |
| 3 | **cotizador** · 99 pruebas | El más repartido. Se hace al final, con el formato ya probado dos veces |

El detalle paso a paso está en [`prompt.md`](prompt.md).

---

## Cómo se sabe que salió bien

La comprobación que manda es una sola, y es de omisión:

> **Las tres suites deben quedar en verde sin editar el valor esperado de ninguna prueba
> existente.** Si hay que tocar un número esperado, la reorganización movió un precio, y eso no
> es lo que se pidió.

A eso se suman: la prueba nueva de cada página, comparar un PDF de cada herramienta antes y
después, confirmar que `FORBIDDEN` derivado sigue atrapando los mismos casos en arrendamiento, y
que las tres siguen cotizando sin red y sin `localStorage`.

Los conteos de partida, verificados el 22-ago-2026 corriendo las tres suites:
**arrendamiento 41 · compra 55 · cotizador 99.**

---
---

# Apéndice · Los valores de hoy

**Extraídos del código el 22-ago-2026 y verificados uno por uno.** Sirven para dos cosas: armar
la matriz sin ir a buscarlos, y comprobar al terminar que **ninguno se movió**.

## cotizador · `paginas/cotizador/index.html` · TODO CON IVA

### Precio por alumno y por año — `APP_CONFIG.pricing`

Índice = modalidad: `0` sin equipos · `1` = 1:4 · `2` = 1:3 · `3` = 1:2 · `4` = 1:1.
Fila = plazo: `n3` Chromebook 3 años · `n4` Chromebook 4 años · `flip` seminueva 2 años ·
`tab` tablet 3 años.

```js
edu : n3  [3000, 4225, 4633.333333, 5450, 7900]
      n4  [3000, 3975, 4300,        4950, 6900]
      flip[3000, 3300, 3400,        3600, 4200]
      tab [3000, 3300, 3400,        3600, 4200]
plus: n3  [3500, 4725, 5133.333333, 5950, 8400]
      n4  [3500, 4475, 4800,        5450, 7400]
      flip[3500, 3875, 4000,        4250, 5000]
      tab [3500, 3875, 4000,        4250, 5000]
```

### Equipos — `DEVICES`

| Clave | Equipo | Costo |
|---|---|---|
| `cbAlumno` | Chromebook nueva | 14500 |
| `cbDocente` | Chromebook nueva · docente | 17850 |
| `flAlumno` | Chromebook Flip-Touch seminueva | 7000 |
| `flDocente` | Flip-Touch seminueva · docente | 9000 |
| `tablet` | Tablet nueva | 10000 |

El precio del equipo va **pelón**: la CEU y el seguro se suman aparte, siempre, vía
`deviceUnitCost()`.

### Por equipo, y el resto

| Concepto | Valor | Constante |
|---|---|---|
| Licencia CEU | 870 | `equipment.ceuUnitCost` |
| Seguro 2 / 3 / 4 años | 1050 / 1600 / 2150 | `equipment.insuranceByYears` |
| Carritos 20 / 30 / 40 | 28280 / 30860 / 36800 | `CART_PRICES` |
| Docente extra, **al año** | 1500 | `equipment.extraTeacherAnnualCost` |
| Adicional de alumno | 0.8 × precio base | `equipment.extraStudentDeviceFactor` |
| Docentes con licencia | 1 por cada 10 alumnos | `equipment.includedTeacherRatio` |
| Descuento contado / firma temprana | 0.10 / 0.05 | `discounts` |
| Factores 3 años | 0.94, 1.02, 1.10 | `annualFactors.three` |
| Factores 4 años | 0.90, 0.97, 1.04, 1.11 | `annualFactors.four` |
| Factores 2 años | 1, 1 | `annualFactors.twoFlat` |
| Mensualidades | 10 | `STD_INSTALLMENTS` |
| Pago en agosto | 100% contado · 50% los otros dos | `PAYS[].augustPercentage` |
| Tope de cordura | 250000 por alumno/año | `limits.listPerStudent.max` |
| Vigencia | 31 días | `cycle.validityDays` |

### Descuentos al retirar licencia — `LICS[].disc`

`motiva` 200 · `beta` 200 · `everway` 80 (solo Plus). **Las otras nueve valen 0**, y ese cero es
una decisión: retirarlas no baja el precio.

### Por plazo — `TERMS`

| Plazo | Años | Stock | Equipo de alumno | Docentes elegibles |
|---|---|---|---|---|
| `cb3` | 3 | 2% | `cbAlumno` | docente (1:20) · estudiante (1:10) |
| `cb4` | 4 | 2% | `cbAlumno` | docente (1:20) · estudiante (1:10) |
| `fl2` | 2 | **20%** | `flAlumno` | solo docente (1:20) |
| `tb3` | 3 | 2% | `tablet` | solo docente (1:20), con `cbDocente` |

### Volumen de redes — `VOLUME` · **no entra en `quote()`, solo se dibuja**

500–999: 10% · 1,000–1,499: 15% · 1,500–1,999: 20% · 2,000–2,499: 30% ·
2,500–2,999: 40% · 3,000–4,999: 45% · 5,000+: 55%

### Acompañamiento — `CAP` · por número de alumnos

| Hasta | Horas | Visitas | Talleres |
|---|---|---|---|
| 100 | 8 | 0 | 1 |
| 200 | 8 | 1 | 2 |
| 500 | 10 | 2 | 3 |
| 700 | 15 | 2 | 3 |
| sin tope | 20 | 3 | 4 |

---

## compra · `paginas/compra/index.html` · TODOS NETOS, SIN IVA

IVA 0.16 · vigencia 31 días · límites: cantidad 1–999999, años 1–25, renglones 200, concepto 250.
Entrega: «15 días hábiles después de la confirmación del pago».

**Las 37 partidas, clave → precio neto:**

```
equipos       ceu               750      proteccion   seguro1           490
              cb-rugged        7740                   seguro3          1390
              cb-essential     9450                   seguro4          1870
              carrito40    31720.50                   securly           350  anual
              carrito30    26600.70
              carrito20    24374.70      plataformas  everway           192  anual
              carrito-tab30 22482.60                  wriq               92  anual
                                                      wayground-est     130  anual
programas     motiva-est        400 anual             eduplus           102  anual
              motiva-doc        400 anual mín 10      gwtl             1225  anual
              beta-est          400 anual
              beta-doc          400 anual mín 10   servicios  soporte1ti   36750
              impulsa-est       990 anual                     soporte2ti    3500
              impulsa-doc       990 anual mín 10             soporte3ti    4000
                                                             hora-coach    3500
                                                             hora-ti       3000
seminuevo     flip1   6034.48   flip4   1379.31   profe1  7844.83   profe4  1793.10
              flip2   4482.76   flip5    862.07   profe2  5827.59   profe5  1379.31
              flip3   3017.24                     profe3  4310.34
```

Los diez seminuevos llevan además `grossRef`, el mismo precio **con** IVA, para verificación:
flip 7000 / 5200 / 3500 / 1600 / 1000 · profe 9100 / 6760 / 5000 / 2080 / 1600.

---

## arrendamiento · `paginas/arrendamiento/index.html` · TODOS SIN IVA

| Concepto | Valor | Celda |
|---|---|---|
| IVA | 0.16 | — |
| Tasa anual | 0.24 | F4 |
| Chromebook estudiante | 7740 · CEU **integrada** | Q4 / P4 |
| Chromebook docente | 9450 · CEU **aparte** | Q5 / Q12 |
| Licencia CEU | 750 | Q12 |
| Plazo 3 años | 36 meses · securly 1050 · seguro 1390 | Q7 / Q10 |
| Plazo 4 años | 48 meses · securly 1400 · seguro 1870 | Q8 / Q11 |
| Carritos 20 / 30 / 40 | 24374.70 / 26600.70 / 31720.50 | Q13–Q15 |
| Límites | cantidad 0–9999 · carritos 1–99 · máx. 12 renglones | — |
| Vigencia | 31 días | — |

**Ojo con el mismo concepto a distinto precio entre herramientas.** No es un error: son productos
y convenciones distintas.

| Concepto | cotizador (con IVA) | compra (neto) | arrendamiento (neto) |
|---|---|---|---|
| Licencia CEU | 870 | 750 | 750 |
| Carrito de 30 | 30860 | 26600.70 | 26600.70 |
| Seguro 3 años | 1600 | 1390 | 1390 |
| Seguro 4 años | 2150 | 1870 | 1870 |

Los del cotizador **no** son los de compra × 1.16 exactos: son lista comercial redondeada. No los
recalcules, cópialos como están.
