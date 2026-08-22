# El plan

Diseño completo de la cotización a la medida en el cotizador Upgrade Edu. Redactado el 21 de
agosto de 2026.

---

## El problema

Un colegio de **700 alumnos** pide **30 equipos** y **un carrito**, y quiere el precio repartido
entre sus 700 alumnos. Necesita 700 licencias, pero solo 30 equipos, 30 seguros, 30 licencias CEU
y un carrito.

Hoy eso no se puede cotizar. El cotizador tiene cinco modalidades y las cinco fallan aquí:

| Modalidad | Qué hace | Por qué no sirve |
|---|---|---|
| 1:1 | Un equipo por alumno | Serían 700 equipos, no 30 |
| 1:2 | Un equipo por cada 2 alumnos | 350 equipos |
| 1:3 | Un equipo por cada 3 alumnos | 234 equipos |
| 1:4 | Un equipo por cada 4 alumnos | 175 equipos |
| **Sin equipos** | Solo licenciamiento | **Ningún equipo, ni uno** |

Las cuatro primeras derivan la cantidad de equipos de una razón fija sobre los alumnos. El colegio
no está pidiendo una razón: está pidiendo **treinta**. Y la quinta, que sería la puerta natural,
cierra los equipos a cero por construcción.

El vendedor no tiene salida. Puede mentir en el número de alumnos —poner 120 para que 1:4 dé 30
equipos— pero entonces cotiza 120 licencias en vez de 700, y el documento que recibe el colegio
describe un colegio que no existe.

---

## La regla, en una línea

> Lo que se compra **una vez** —el equipo, su licencia CEU, su seguro y el carrito— se divide
> entre **todos los alumnos** y entre **todos los años del contrato**.
> Lo que es **por alumno** —Securly y las demás licencias— ya está en el precio base y no se
> prorratea.

Esa frase es todo el diseño. El resto de este documento es cómo se escribe en el código y qué
hace falta decidir para escribirla.

---

## La buena noticia: el prorrateo ya existe

El motor del cotizador ya divide entre alumnos y entre años. Está en
[`paginas/cotizador/index.html`](../../paginas/cotizador/index.html), líneas 2210-2213:

```js
const adjEqDoc   = (students > 0 && years > 0 ? costExtraEq / students / years : 0) + adjDocExtra;
const adjCart    = students > 0 && years > 0 ? cartTot / students / years : 0;
const listRaw    = base - discLic + adjEqDoc + adjStuExtra + adjCart;
```

`costExtraEq / students / years` **es** el prorrateo que pide el colegio. Se usa hoy para los
equipos docentes adicionales y para los carritos, en las modalidades 1:1 a 1:4.

Lo único que lo apaga en la modalidad «Sin equipos» es una bandera:

```js
const hasDev = mod > 0;
```

Con `hasDev` en falso, el motor pone a cero los equipos, el carrito y los adicionales; el estado
los borra al cambiar de modalidad (`resetStateForModel`, línea 3001) y la interfaz deshabilita
los campos. Tres capas custodiando la misma decisión.

**Este plan no inventa aritmética nueva. Abre una puerta que ya está construida.**

---

## Las cinco decisiones abiertas — **contestadas el 21-ago-2026**

Estas cinco cosas no se podían deducir del código ni del Excel. Martín las cerró el 21 de agosto
de 2026, y con ellas la implementación arranca.

### A · El precio del equipo de alumno Flip-Touch seminuevo

**Decidido: `$8,000`, igual que el del docente.** Es el mismo equipo seminuevo; alumno y docente
al mismo precio.

### B · Los precios de la Chromebook nueva siguen o cambian

**Decidido: siguen.** `studentDeviceCost: 17000` y `teacherDeviceCost: 21000` (líneas 1927-1928)
valen para la Chromebook nueva en los cuatro plazos, y el equipo docente del plazo de tablet —que
por decisión es una Chromebook nueva— cuesta ese mismo `$21,000`.

### C · El precio de la licencia CEU y del seguro, y el seguro a 2 años

**Decidido: los precios de arrendamiento aplican tal cual, sin ajuste de IVA**, y el seguro a
2 años se fija en **$910**, siguiendo la línea de 3→4 años (de $1,390 a $1,870 hay $480 por año;
quitarle un año a $1,390 da $910).

| Concepto | Precio | Nota |
|---|---|---|
| Licencia Chrome Education Upgrade | `$750` | Perpetua, por equipo |
| Seguro · 2 años | `$910` | **Nuevo**, decidido el 21-ago-2026 |
| Seguro · 3 años | `$1,390` | Cubre todo el plazo |
| Seguro · 4 años | `$1,870` | Cubre todo el plazo |

### D · Si el equipo prorrateado escala año con año

**Decidido: D-1, con aviso en pantalla al vendedor.** El fierro entra a `list`, escala con los
factores anuales y recibe el descuento del esquema de pago, como todo lo demás. El detalle y los
números: [ver abajo](#la-fuga-del-descuento).

### E · Si el stock de reemplazo aplica

**Decidido: sí aplica, con la misma regla.** El plazo lleva un porcentaje de stock de
sustitución: **2%** en equipos nuevos, **20%** en seminuevos (`stockPct`, líneas 1968-1971).
Sobre 30 equipos seminuevos son 6 equipos de reserva; sobre 30 nuevos, 1. Una sola aritmética del
stock en todas las modalidades.

---

## El catálogo deja de ser dos números y se vuelve una tabla por plazo

Hoy hay un solo precio de equipo de alumno y uno de docente para los cuatro plazos. Eso deja de
sostenerse en cuanto los equipos se prorratean, y además hay una regla comercial que el código no
conoce:

> **El plazo no solo dice entre cuántos años divido. Dice qué equipos existen.**

| Plazo | Equipo de alumno | Equipos de docente que se pueden elegir | Años |
|---|---|---|---|
| Chromebook nueva · 3 años | Chromebook nueva | modelo docente · **o** · modelo estudiante | 3 |
| Chromebook nueva · 4 años | Chromebook nueva | modelo docente · **o** · modelo estudiante | 4 |
| **Flip-Touch seminueva · 2 años** | Flip-Touch **seminueva** | **Flip-Touch seminueva docente, y nada más** | 2 |
| **Tablet · 3 años** | **Tablet nueva** | **Chromebook nueva docente, y nada más** | 3 |

Dos consecuencias que hay que leer despacio:

1. **En el plazo de seminuevos no existe la opción de equipo docente nuevo.** No es una validación
   que avisa: es que la opción no está en la pantalla. Lo que no se puede elegir no se puede
   equivocar.
2. **En el plazo de tablet, el alumno lleva tablet y el docente lleva Chromebook nueva.** Es la
   única combinación mixta del catálogo, y hoy la herramienta no la contempla de ninguna manera.

### Cómo se escribe

Se retiran `teacherDeviceCost` y `studentDeviceCost` de `APP_CONFIG.equipment` y se declara un
catálogo de dispositivos, con los plazos apuntándole:

```js
const DEVICES = deepFreeze({
  cbAlumno:  {label:"Chromebook nueva",                   cost:17000},   // ← decisión B · confirmado
  cbDocente: {label:"Chromebook nueva · docente",         cost:21000},   // ← decisión B · confirmado
  flAlumno:  {label:"Chromebook Flip-Touch seminueva",    cost:8000},    // ← decisión A · igual que docente
  flDocente: {label:"Flip-Touch seminueva · docente",     cost:8000},
  tablet:    {label:"Tablet nueva",                       cost:10000}
});
```

Y dentro de cada plazo de `TERMS`, dos campos nuevos:

```js
cb4: { label:"Chromebooks nuevas · 4 años", row:"n4", sched:S4, years:4,
       device:"Chromebook nueva", stockPct:0.02,
       alumno:  "cbAlumno",
       docentes:[{k:"docente",    dev:"cbDocente", ratio:20, label:"Modelo docente"},
                 {k:"estudiante", dev:"cbAlumno",  ratio:10, label:"Modelo estudiante"}] },

fl2: { label:"Chromebook Flip-Touch seminueva · 2 años", row:"flip", sched:twoFlat, years:2,
       device:"Chromebook Flip-Touch seminueva", stockPct:0.20,
       alumno:  "flAlumno",
       docentes:[{k:"docente", dev:"flDocente", ratio:20, label:"Flip-Touch seminueva docente"}] },

tb3: { label:"Tablet · 3 años", row:"tab", sched:S3, years:3,
       device:"Tablet nueva", stockPct:0.02,
       alumno:  "tablet",
       docentes:[{k:"docente", dev:"cbDocente", ratio:20, label:"Chromebook nueva docente"}] }
```

**Las llaves `docente` y `estudiante` se conservan a propósito.** Son los valores que ya guarda
`scenario.teacherDeviceModel`, así que ningún borrador existente hay que migrarlo: en los plazos
de seminuevo y tablet simplemente solo existe `docente`, y con una sola opción la pantalla la
preselecciona y no pregunta nada.

Esto también retira `APP_CONFIG.equipment.includedTeacherDeviceRatio`, cuyo `{docente:20,
estudiante:10}` pasa a vivir en la fila de cada plazo, que es donde puede variar.

### Esto arregla, de paso, el seminuevo silencioso

Hoy la fila del equipo de **alumno** se renombra sola según el plazo —dice «Chromebook Flip-Touch
seminueva para estudiante»— porque toma el nombre de `r.t.device` (línea 1986).

Las filas del equipo **docente** están escritas a mano y nunca dicen seminuevo, en ningún plazo
(líneas 1988-1993):

```js
{a:"TI",i:P.laptop,c:"b",n:"Equipo para docente — modelo docente",
 d:"Equipo de mayor capacidad para planeación y gestión del profesor.", ...}
```

Con el catálogo por plazo, esa fila toma su nombre de `DEVICES[...].label` igual que la de alumno.
**En el plazo de 2 años el documento dirá «Flip-Touch seminueva · docente», y en el de tablet dirá
«Chromebook nueva · docente».** Es el renglón exacto donde hoy un colegio puede leer «nuevo» sin
que nadie se lo haya dicho.

Este arreglo **no es solo de la modalidad a la medida**: aplica a 1:1, 1:2, 1:3 y 1:4 también,
porque el problema es del plazo, no de la modalidad.

---

## Qué se prorratea y qué no

| Concepto | Cómo se cobra | Va en |
|---|---|---|
| Equipo de alumno | Costo de catálogo, una vez | **Prorrateo** |
| Equipo de docente | Costo de catálogo, una vez | **Prorrateo** |
| Licencia CEU | Por equipo, una vez, **automática** | **Prorrateo** |
| Seguro | Por equipo, por todo el plazo, **automático** | **Prorrateo** |
| Carrito | Precio capturado a mano, una vez | **Prorrateo** |
| Securly Filter + Classroom | Por alumno, por año | Precio base |
| Google Workspace, impulsa, motiva, beta, Wayground, Canva | Por usuario o por alumno | Precio base |
| Capacitación, visitas, soporte | Por institución | Precio base |

**La licencia CEU y el seguro nunca se capturan.** El vendedor pone «30 equipos» y el motor
carga 30 CEU y 30 seguros solo. No hay casilla que se pueda olvidar de marcar, porque no hay
casilla.

> Nota sobre el arrendamiento: allá la Chromebook de alumno trae la licencia CEU permanente
> integrada y solo la del docente la suma aparte (`ceu: false` / `ceu: true`, líneas 1360-1372).
> Aquí no: **todo equipo suma su CEU**, porque así lo pidió el colegio del ejemplo —30 equipos,
> 30 licencias CEU— y porque una excepción por tipo de equipo es un lugar más donde equivocarse.

---

## La fórmula

```text
costoFierro = Σ equipos × (costoEquipo + CEU + seguroDelPlazo)
            + Σ carritos × precioUnitarioCapturado

adjProRata  = costoFierro / alumnos / años

list        = base(licencias) + adjProRata
```

Donde `alumnos` son **todos los alumnos del colegio** —los 700, no los 30 que usan equipo— y
`años` son los del plazo: 2 en seminuevo, 3 en tablet, 3 o 4 en Chromebook nueva.

En el código es una línea más en la suma que ya existe:

```js
const listRaw = base - discLic + adjEqDoc + adjStuExtra + adjCart + adjProRata;
```

---

## El ejemplo completo, con números

**Colegio de 700 alumnos · 30 Chromebooks nuevas de alumno · 1 carrito de 30 · plazo de 4 años ·
paquete Edu.** Con los precios de referencia de las decisiones B y C:

| Concepto | Cuenta | Importe |
|---|---|---|
| Equipos de alumno | 30 × $17,000 | $510,000 |
| Licencias CEU | 30 × $750 | $22,500 |
| Seguro a 4 años | 30 × $1,870 | $56,100 |
| Carrito | 1 × $26,600 | $26,600 |
| **Costo del fierro** | | **$615,200** |
| Entre 700 alumnos | $615,200 ÷ 700 | $878.86 por alumno |
| Entre 4 años | $878.86 ÷ 4 | **$219.71 por alumno y año** |
| Licencias, paquete Edu | base de la modalidad | $3,000 por alumno y año |
| **Precio de lista** | $3,000 + $219.71 | **$3,219.71 por alumno y año** |

Y el mismo colegio, si en vez de Chromebooks nuevas a 4 años pide **seminuevas a 2 años**, divide
el mismo fierro entre 2 en vez de entre 4: el prorrateo se duplica. **El plazo, que hoy en la
modalidad sin equipos no cambia absolutamente nada, pasa a ser una de las palancas más grandes
del precio.**

---

## La fuga del descuento

Esta es la decisión D y hay que verla con números, porque es dinero real.

El prorrateo entra en `list`, y `list` se multiplica por el factor anual del plazo y después se le
aplica el descuento del esquema de pago (`calculatePaymentYear`, líneas 2136-2152). Los factores
del plazo de 4 años son `[0.90, 0.97, 1.04, 1.11]`, que suman **4.02** — o sea que el fierro
dividido entre 4 se recupera al 100.5% si no hay descuento.

Pero con descuento:

| Esquema | Descuento | Se recupera del fierro | Sobre los $615,200 del ejemplo |
|---|---|---|---|
| Firma después del corte | 0% | 100.5% | +$3,082 |
| Firma antes del corte | −5% | 95.5% | **−$27,842** |
| **Contado en agosto** | **−10%** | **90.4%** | **−$58,700** |

El colegio que paga de contado obtiene el 10% de descuento **también sobre el equipo**, y el
equipo no tiene margen de dónde salir: es fierro comprado a un proveedor.

**Esto no es un defecto nuevo del plan: ya pasa hoy** con `adjEqDoc` y `adjCart` en las
modalidades 1:1 a 1:4. La diferencia es la escala. Hoy afecta a un par de equipos docentes
adicionales; con la cotización a la medida afecta a la compra entera.

Hay dos caminos:

| | Qué se hace | Recupera | Costo de implementarlo |
|---|---|---|---|
| **D-1** | El fierro entra a `list` y escala y se descuenta como todo lo demás | 90.4% a 100.5% según esquema | Una línea. Es lo que ya hace la herramienta |
| **D-2** | El fierro se prorratea plano, **fuera** del factor anual y **fuera** del descuento, y se suma después | 100% exacto, siempre | `list` deja de ser un número que fluye por `calculatePaymentYear`; hay que partir el cálculo en dos |

**Recomendación: D-1, más un aviso.** Mantiene una sola aritmética, es consistente con lo que la
herramienta ya hace en las otras modalidades, y un descuento por pronto pago que aplica a toda la
factura es una práctica comercial normal, no un error.

Pero el vendedor no puede estar ciego a esto. Con D-1, la pantalla del vendedor —**nunca el
documento del cliente**— muestra junto al precio:

```text
Fierro prorrateado: $219.71 por alumno y año · recupera 90.4% del costo con el descuento de contado
```

Si Martín prefiere D-2, se implementa D-2; pero entonces el plan crece y hay que rehacer el
desglose año por año.

---

## Qué cambia en el estado

El esquema sube de **v4 a v5**. Se agrega un solo campo a `scenario`:

```js
proRata: {
  stu:  0,                               // equipos de alumno
  doc:  0,                               // equipos de docente
  carts: []                              // [{cap: 20|30|40, qty: 1..99, price: 0..10000000}]
}
```

- **`teacherDeviceModel` se reutiliza tal cual.** Es el mismo concepto —qué equipo reciben los
  docentes— y con el catálogo por plazo ya sabe qué opciones tiene. No hay campo nuevo.
- **Los carritos aquí llevan cantidad y precio explícitos**, en renglones que se pueden mezclar,
  como en el cotizador de arrendamiento (líneas 1449-1462). En las modalidades 1:1 a 1:4 la
  cantidad se sigue derivando de los equipos (`ceil(stuReq / cartCap)`); aquí no hay razón de la
  cual derivarla: el colegio dice cuántos.
- **El precio del carrito es siempre manual, en las cinco modalidades.** Decisión de Martín: el
  colegio puede tener ya los suyos, puede no querer ninguno, o puede negociarlos aparte. Un
  catálogo de precios de carrito daría una cifra por omisión donde debe haber una conversación.

La migración de v4 a v5 es trivial y segura: en v4 la modalidad sin equipos **no podía** tener
equipos, así que todo borrador existente entra con `proRata` en ceros y su precio no se mueve ni
un centavo. Eso hay que clavarlo con una prueba.

---

## Qué cambia en pantalla

La modalidad 0 deja de llamarse «Sin equipos · solo licenciamiento» y pasa a
**«Sin equipos incluidos · a la medida»**.

Al elegirla, la tarjeta «Docentes, equipos y carritos» del paso 1 cambia de contenido en vez de
deshabilitarse:

| Bloque | Hoy en modalidad 0 | Con el cambio |
|---|---|---|
| Docentes | Activo | Igual, sin cambios |
| Equipos de estudiante | Deshabilitado, en cero | **«Equipos de alumno a prorratear»**: un número |
| Equipos para docentes | Deshabilitado, en cero | **«Equipos de docente a prorratear»**: un número, con el modelo del plazo |
| Carrito de carga | Deshabilitado | **Renglones de carrito**: capacidad, cantidad y precio unitario |

Y aparece una caja de cálculo —igual que el `#cartBox` que ya existe— que enseña la cuenta
completa: el costo del fierro, entre cuántos alumnos, entre cuántos años, y cuánto le suma al
precio por alumno. **El vendedor tiene que poder explicarle el número al colegio por teléfono sin
abrir una hoja de cálculo.**

El rótulo de los equipos —hoy fijo en «costos de catálogo: docente $21,000 · estudiante $17,000»,
línea 1268— pasa a escribirse desde el catálogo del plazo elegido.

---

## Qué cambia en el documento

Casi nada, y eso es a propósito. La estrategia es que **el motor rellene los mismos campos de
siempre**: si `totalEq`, `stuReq`, `eqDocTot` y `carts` ya traen los equipos prorrateados, la
mayor parte del desglose funciona sin tocarse.

Lo que sí hay que tocar:

1. **Las compuertas por modalidad.** Las filas de equipo del desglose se encienden con arreglos
   fijos: `DEV = [0,1,1,1,1]`, o sea «apagado en la modalidad 0» (línea 1978). Tienen que
   encenderse **por cantidad, no por modalidad**: si hay equipos, la fila existe.
2. **El nombre del equipo docente**, que pasa a salir del catálogo, como ya se explicó.
3. **La etiqueta de la modalidad.** `modLbl` dice «sin equipos» y se pinta en el chip de la
   portada, en el correo y en el pie. Con equipos capturados tiene que decir **«a la medida»**;
   sin ellos, sigue diciendo «sin equipos», que es la verdad.
4. **La advertencia `NO_DEVICES`** («Modalidad sin equipos: la propuesta cotiza únicamente
   licenciamiento y servicios», línea 2264) solo se emite si de verdad no hay equipos.

**Lo que no cambia:** el documento sigue sin imprimir cómo se armó el precio. La caja de cálculo
del prorrateo es de la pantalla del vendedor y **no viaja** al PDF, al correo ni al escenario
compartido. Esa regla se cerró el 21-ago-2026 y la custodia la prueba «El documento no imprime
cómo se armó el precio». El colegio ve qué recibe y cuánto paga; los 30 × $17,000 son cuenta
interna.

---

## Lo que este plan no toca

- **Las modalidades 1:1 a 1:4 siguen funcionando igual**, salvo por el catálogo de equipos por
  plazo, que sí las alcanza (y las mejora: hoy en el plazo de seminuevos cobran y describen un
  equipo docente nuevo).
- **`adjStuExtra` no se toca.** Los equipos de alumno adicionales en las modalidades compartidas
  se cobran al 80% del precio base por alumno y por año —otra mecánica, otra intención— y así se
  quedan. En la modalidad a la medida no existen los «adicionales»: solo hay equipos, y se cobran
  a costo prorrateado.
- **El precio base de la modalidad 0 no se toca**: $3,000 con Edu y $3,500 con Edu Plus, iguales
  en los cuatro plazos.
- **Los descuentos por retirar licencias** (`LICS[].disc`) siguen restando igual.
- **La impresión, el archivo en Drive, los folios, las revisiones y la papelería v5** no se tocan.

---

## Casos raros que hay que resolver

| Caso | Qué debe pasar |
|---|---|
| 30 equipos y 0 alumnos | El precio no se puede calcular. Ya lo cubre el error `STUDENTS`, que bloquea el precio |
| 0 equipos y 0 carritos en la modalidad a la medida | Es válido: es la cotización de solo licencias de hoy. Precio = base |
| Carritos con precio 0 | Válido y sin advertencia: el colegio ya tiene los suyos. **No aplica aquí la autorización de carrito sin costo**, que es una regla de las modalidades con equipos incluidos |
| Más equipos que alumnos | Válido, pero raro. Advertencia informativa, nunca bloqueo |
| Capacidad de carritos menor que los equipos | Advertencia informativa, como en arrendamiento (`CART_SHORT`) |
| Cambiar de plazo con equipos capturados | Las **cantidades se conservan**; los precios y los nombres cambian solos, porque salen del catálogo del nuevo plazo. Si el modelo de docente elegido no existe en el plazo nuevo, se cambia al único disponible y **se avisa** |
| Cambiar de la modalidad a la medida a 1:2 | Los equipos prorrateados dejan de tener sentido: se limpian, con la confirmación que ya existe en `hasEquipmentAdjustments()` |
| Precio implausible | El tope de `$250,000` por alumno y año sigue vigente y sigue bloqueando |
| Escenario compartido de v4 | Se migra con `proRata` en ceros, sin mover el precio |

---

## Pruebas

La página corre su suite con `?test=1`. Hay que agregar, como mínimo:

1. **La aritmética del ejemplo canónico.** 700 alumnos, 30 equipos, 1 carrito, 4 años → el
   prorrateo da exactamente $219.71 por alumno y año, y `list` da $3,219.71.
2. **El plazo cambia el prorrateo.** El mismo fierro a 2 años cuesta el doble por alumno y año
   que a 4.
3. **CEU y seguro son automáticos.** 30 equipos generan 30 CEU y 30 seguros sin que nadie los
   capture.
4. **La migración v4 → v5 no mueve ningún precio.** Un borrador v4 de cualquier modalidad da el
   mismo `list` antes y después.
5. **En el plazo de seminuevos no existe el equipo docente nuevo.** `TERMS.fl2.docentes` tiene
   exactamente una entrada y apunta a un equipo seminuevo.
6. **En el plazo de tablet el docente es Chromebook nueva** y el alumno es tablet.
7. **El documento nombra el seminuevo.** Con el plazo de 2 años, el desglose impreso contiene la
   palabra «seminueva» en la fila del equipo docente. Esta prueba falla hoy.
8. **El prorrateo no viaja al documento.** La caja de cálculo, el costo del fierro y el porcentaje
   de recuperación no aparecen en el PDF, el correo ni el escenario. Se suma a la lista de cadenas
   prohibidas de la prueba que ya existe.
9. **Cero equipos en la modalidad a la medida cotiza como hoy.** El precio es exactamente el base
   menos los descuentos de licencia: la prueba «Sin equipos: precio = base + docentes extra» tiene
   que seguir pasando sin modificarse.
