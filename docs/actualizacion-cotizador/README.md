# La cotización a la medida · actualización del cotizador Upgrade Edu

Un colegio de 700 alumnos pide 30 equipos y un carrito, y quiere el costo repartido entre sus 700
alumnos. El cotizador no podía hacer eso, y esta carpeta contiene el diseño completo con el que
ahora puede.

**Construido el 21-ago-2026**, el mismo día en que Martín contestó las cinco decisiones abiertas.
El resultado vive en [`paginas/cotizador/index.html`](../../paginas/cotizador/index.html) (v5.0,
esquema de estado v5) y el detalle de lo entregado está en [`estado.md`](estado.md).

## Los archivos

| Archivo | Qué es |
|---|---|
| [`plan.md`](plan.md) | El diseño completo: el problema, la regla, el catálogo por plazo, la fórmula, el ejemplo con números, los casos raros y lo que no se toca. **Se lee primero.** |
| [`prompt.md`](prompt.md) | El encargo de implementación, autocontenido, con el que se construyó. |
| [`estado.md`](estado.md) | Qué se construyó, cómo se verificó y qué queda por revisar a mano. |

---

## Por qué no se puede cotizar hoy

El cotizador tiene cinco modalidades. Cuatro derivan la cantidad de equipos de una razón fija
sobre los alumnos —1:1, 1:2, 1:3, 1:4— y darían 700, 350, 234 o 175 equipos. La quinta, «Sin
equipos», cierra los equipos a cero por construcción.

El colegio no está pidiendo una razón. Está pidiendo **treinta**.

El vendedor no tiene salida legítima: puede poner 120 alumnos para que 1:4 dé 30 equipos, pero
entonces cotiza 120 licencias en vez de 700 y el documento describe un colegio que no existe.

## La regla, en una línea

> Lo que se compra **una vez** —el equipo, su licencia CEU, su seguro y el carrito— se divide
> entre **todos los alumnos** y entre **todos los años del contrato**.
> Lo que es **por alumno** —Securly y las demás licencias— ya está en el precio base y no se
> prorratea.

Con los 700 alumnos del ejemplo, 30 Chromebooks nuevas y un carrito a 4 años: **$3,000 de
licencias más $197.21 de fierro prorrateado = $3,197.21 por alumno y año.**

## El prorrateo ya existe

El motor ya divide entre alumnos y entre años: `costExtraEq / students / years` está escrito y en
uso desde hace tiempo, en las modalidades 1:1 a 1:4. Lo único que lo apaga en «Sin equipos» es la
bandera `hasDev = mod > 0`.

**Este plan no inventa aritmética nueva. Abre una puerta que ya está construida.**

---

## Lo que ya está decidido

| Decisión | Qué se eligió |
|---|---|
| Qué se prorratea | Equipo, licencia CEU, seguro y carrito |
| Qué **no** se prorratea | Securly y las demás licencias: son por alumno y ya están en el precio base |
| Entre qué se divide | **Todos** los alumnos del colegio y **todos** los años del plazo |
| CEU y seguro | **Automáticos por equipo.** No hay casilla que capturarlos, y por tanto no hay casilla que olvidar |
| Precio del carrito | **Siempre manual**, en las cinco modalidades. El colegio puede tener ya los suyos, no querer ninguno, o negociarlos aparte |
| Cantidad de carritos | Renglones explícitos en la modalidad a la medida; derivada de los equipos en 1:1 a 1:4, como hoy |
| Plazo de 2 años | Flip-Touch **seminueva**. El docente **solo** puede ser seminuevo: la opción de nuevo no existe en pantalla |
| Plazo de tablet | Tablet **nueva** a 3 años para el alumno; **Chromebook nueva** para el docente |
| Precios de equipo, CEU y seguro | **Lista definitiva del 22-ago-2026**, toda con IVA. Ver [`plan.md`](plan.md) |
| El nombre de la modalidad | «Sin equipos incluidos · a la medida» |
| Qué ve el colegio | Qué recibe y cuánto paga. **El desglose del prorrateo no sale de la pantalla del vendedor** |

## Las cinco decisiones, contestadas el 21-ago-2026

Estaban abiertas y Martín las cerró. El detalle de cada una está en [`plan.md`](plan.md).

| | Qué se preguntaba | Qué se decidió |
|---|---|---|
| **A** | El precio del equipo de **alumno** Flip-Touch seminuevo | **$7,000** (lista definitiva del 22-ago) |
| **B** | Si la Chromebook nueva sigue en $17,000 y $21,000 | **No:** bajaron a **$14,500 / $17,850** el 22-ago |
| **C** | Los precios de la licencia CEU y del seguro, **incluido el seguro a 2 años** | CEU **$870**, seguro **$1,050 / $1,600 / $2,150** a 2/3/4 años, **con IVA**. El 21-ago se habían tomado sin IVA del catálogo de arrendamiento: cotizaban de menos |
| **D** | Si el fierro prorrateado escala año con año y se descuenta | **D-1: sí, con aviso en pantalla al vendedor** |
| **E** | Si el stock de reemplazo aplica a la modalidad a la medida | **Sí, con la misma regla** |

### La decisión D merece leerse

El prorrateo entra en el precio de lista, y el precio de lista recibe el descuento del esquema de
pago. Con el descuento de contado del 10%:

| Esquema | Descuento | Se recupera del fierro | Sobre los $552,200 del ejemplo |
|---|---|---|---|
| Firma después del corte | 0% | 100.5% | +$2,761 |
| Firma antes del corte | −5% | 95.5% | −$24,984 |
| **Contado en agosto** | **−10%** | **90.5%** | **−$52,735** |

El colegio que paga de contado obtiene el 10% **también sobre el equipo**, y el equipo no tiene
margen de dónde salir. **Esto ya pasa hoy** con los equipos docentes adicionales; lo que cambia es
la escala. La recomendación del plan es dejarlo así y **avisarle al vendedor en pantalla**, pero
es una decisión comercial, no técnica.

---

## Un arreglo que sale de regalo

Hoy, en el plazo de 2 años, la fila del equipo de alumno del PDF dice «Chromebook Flip-Touch
seminueva para estudiante» —se renombra sola— pero **la fila del equipo docente dice «Equipo para
docente — modelo docente», y nunca menciona que es seminuevo, en ningún plazo.**

Es un renglón donde un colegio puede leer «nuevo» sin que nadie se lo haya dicho. El catálogo por
plazo lo arregla en las cinco modalidades, no solo en la nueva, porque el problema es del plazo y
no de la modalidad.

## Cómo se trabajó

1. Martín contestó las cinco decisiones abiertas (21-ago-2026).
2. Quedaron escritas en [`plan.md`](plan.md), cada una en su sección, con el número real.
3. Se ejecutó [`prompt.md`](prompt.md) completo: las cuatro fases, en orden.
4. Se verificó con la suite interna (98 pruebas en verde, corridas en Chrome headless) y con los
   pasos de la tabla del encargo que no requieren ojos humanos; el detalle y lo que queda por
   revisar a mano están en [`estado.md`](estado.md).
