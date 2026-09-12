# Los precios de G-Workspace

Tablas de la matriz `PRECIOS` de `paginas/g-workspace/index.html` y cómo se aplican. Dos SKU
y nada más: Google Workspace for Education **Plus** y **Teaching & Learning Upgrade**.
Valores verificados el **12-sep-2026** contra `G-Workspace - México.csv`, la hoja de origen,
que **no está en el repositorio**.

> **⚠ Convención: TODOS los precios son NETOS, SIN IVA.** El IVA (16 %) se aplica **una sola
> vez, sobre el subtotal de cada escenario**, nunca dentro de un precio unitario: así no se
> arrastran centavos licencia por licencia.

> **⚠ Aviso recíproco.** Estos dos precios **también viven** en `paginas/compra/index.html`
> (`PRECIOS.partidas.eduplus` y `.gwtl`). Es una copia manual **a propósito**: cada cotizador
> va autocontenido porque el PDF es el entregable y no puede depender de un archivo externo.
> Quien cambie un precio en una página lo cambia en la otra a mano. Los dos archivos llevan
> el aviso escrito junto al número.

## Las reglas de aplicación, primero

| Regla | Cómo funciona |
|---|---|
| Importe de un escenario | `licencias × años × precio unitario` — las dos licencias son **anuales** |
| IVA | 16 % sobre el subtotal **de cada escenario**, una sola vez |
| **Las dos rutas no se suman** | Se **comparan**. Education Plus incluye todo lo de Teaching & Learning: la decisión es de alcance, no de funciones |
| Total de la propuesta | El del **escenario recomendado**, que el asesor marca con un radio. Es el que va a la portada del PDF |
| Base de cobro · Plus | **Por usuario total: estudiantes + personal** |
| Base de cobro · T&L | **Por maestro**, desde 1 licencia |
| Descuentos | **No hay** |
| Mínimos comerciales | **No hay.** El único requisito es cualitativo: Plus debe cubrir todo el dominio |
| Entrega | Hoy reusa la de compra directa: **15 días hábiles después de la confirmación del pago**. Pendiente de confirmar con Martín — en licencias el acto real es la asignación en la Consola de Google Admin |
| Vigencia | 31 días |
| Límites de captura | Conteos 0 a 999,999 · años 1 a 25 |

Del total, paso a paso:

1. Cada escenario: `licencias × años × precio unitario`.
2. Subtotal del escenario = ese importe.
3. IVA = 16 % del subtotal del escenario.
4. Total del escenario = subtotal + IVA.
5. El total de la propuesta es el del escenario recomendado. **Nunca la suma de los dos.**

## Licencias · anuales, netas

| Concepto | Precio | Unidad | Nota |
|---|---|---|---|
| Google Workspace for Education Plus | $102.00 | usuario / año | **Debe cubrir todo el dominio**: estudiantes y personal |
| Google Workspace Teaching & Learning | $1,225.00 | maestro / año | Cuando entra por área, no por dominio completo. Desde 1 licencia |

## Almacenamiento

| Concepto | Valor |
|---|---|
| Pool base | **100 TB**, de la institución. Es el mismo en toda edición |
| Adicional por licencia · Plus | 20 GB |
| Adicional por licencia · T&L | 100 GB |
| Conversión | **1 TB = 1,000 GB** (decimal) |

Almacenamiento de un escenario = `100 TB + (licencias × GB por licencia) ÷ 1,000`.

## Google Meet

Cifras oficiales de Google, verificadas el 12-sep-2026.

| Edición | Participantes | Transmisión en vivo |
|---|---|---|
| Education Plus | 1,000 | 100,000 espectadores del dominio |
| Teaching & Learning | 250 | 10,000 espectadores del dominio |

En el mismo trabajo se corrigió `docs/portafolio-activa.md`, que decía **500 participantes
para Plus**.

## Las tres trampas de esta matriz

1. **El terabyte es decimal: 1 TB = 1,000 GB.** Es lo que usa la hoja de origen, que a
   1,600 × 20 GB los llama 32 TB. Con base 1024 los 140 TB de su ejemplo se vuelven 136.72 y
   nada reconcilia. `PRECIOS.gbPorTB` lo fija y hay prueba.
2. **Plus se cobra por usuario TOTAL.** La hoja de origen cobraba solo a los estudiantes y
   contaba al personal únicamente para el almacenamiento. Se corrigió el 12-sep-2026 por
   decisión comercial, y así coincide con `docs/portafolio-activa.md` («Plus, una licencia
   por usuario») y con el licenciamiento real de Google. La prueba afirma explícitamente que
   el subtotal del ejemplo **no** son $163,200.
3. **El pool de 100 TB no se cuenta dos veces.** Sumar los dos escenarios daría 241.6 TB,
   cuando un colegio con las dos ediciones tendría 141.6. Otra razón para no sumarlos.

## Reconciliación con la hoja de origen

Su ejemplo: 1,600 estudiantes, 400 de personal, 16 maestros, un ciclo.

| | Escenario A · Plus | Escenario B · T&L |
|---|---|---|
| Licencias | 2,000 usuarios | 16 maestros |
| Subtotal (sin IVA) | $204,000.00 | $19,600.00 |
| IVA 16 % | $32,640.00 | $3,136.00 |
| Total | $236,640.00 | $22,736.00 |
| Almacenamiento | 140 TB | 101.6 TB |

El almacenamiento de los dos y el importe de T&L **cuadran exactos con el CSV**. El importe
de Plus difiere a propósito, por la trampa 2: el CSV daba $163,200 porque no cobraba al
personal.

## Lo que se descartó de la hoja

- La columna **«Precios anteriores»** ($75.83 y $630): no entra ni al configurador ni al PDF.
  Hay prueba que verifica que el documento no contiene ninguna de las dos cifras.
- La nota **«$45 pesos mexicanos al mes»** junto a T&L: no reconcilia con ninguna otra cifra
  del bloque (16 × $45 × 12 = $8,640, y el CSV dice $19,600). El precio bueno es $1,225
  anuales.
- La fila **`T&L Flex`**, que llegó vacía.
