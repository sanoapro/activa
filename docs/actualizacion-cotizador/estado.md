# Estado · construido el 21-ago-2026

La cotización a la medida está **implementada completa** en
[`paginas/cotizador/index.html`](../../paginas/cotizador/index.html), en las cuatro fases del
encargo y con las cinco decisiones de Martín ya adentro. La página pasó de v4.1 a **v5.0** y el
esquema de estado de v4 a **v5**.

## Qué se construyó

| Fase | Qué quedó |
|---|---|
| **1 · Catálogo por plazo** | `DEVICES` (5 equipos con su precio) y `TERMS[..].alumno` / `TERMS[..].docentes` (qué equipos existen en cada plazo, con su razón). `teacherDeviceCost`, `studentDeviceCost` e `includedTeacherDeviceRatio` retirados. En `fl2` y `tb3` hay un solo modelo docente: se preselecciona, no se pregunta, y al cambiar de plazo el modelo se ajusta **con aviso**. Las filas del equipo docente del desglose toman su nombre del catálogo: el PDF de 2 años ya dice «Flip-Touch seminueva · docente» |
| **2 · La modalidad a la medida** | `scenario.proRata` (`{stu, doc, carts:[{cap,qty,price}]}`), esquema v5 con migración desde v2/v3/v4 sin mover un centavo. La fórmula: `fierro = equipos × (costo + CEU $750 + seguro del plazo) + carritos`, `adjProRata = fierro ÷ alumnos ÷ años`, sumado al precio de lista (decisión D-1). CEU y seguro automáticos por equipo. Interfaz: la tarjeta del paso 1 cambia de contenido, con renglones de carrito y la caja de cálculo que enseña la cuenta completa y el % de recuperación del fierro |
| **3 · El documento** | Las filas de equipo se encienden **por cantidad, no por modalidad** (el `why` de 1:1 del carrito quedó intacto). `modLbl` dice «a la medida» con equipos y «sin equipos» sin ellos. `NO_DEVICES` solo se emite sin equipos. El desglose del prorrateo **no viaja** al PDF, al correo ni al escenario |
| **4 · Pruebas** | 11 pruebas nuevas (las 10 del encargo más una de interfaz a nivel DOM); las heredadas que fijaban v4 se actualizaron a v5. **98 de 98 en verde** |

## Las cinco decisiones, como quedaron en el código

| | Decisión | Dónde vive |
|---|---|---|
| A | Flip-Touch seminueva de alumno: **$8,000** | `DEVICES.flAlumno` |
| B | Chromebook nueva sigue en **$17,000 / $21,000** | `DEVICES.cbAlumno` / `DEVICES.cbDocente` |
| C | CEU **$750**; seguro **$910 / $1,390 / $1,870** (2/3/4 años), sin ajuste de IVA | `APP_CONFIG.equipment.ceuUnitCost` / `insuranceByYears` |
| D | **D-1**: el fierro escala y se descuenta; aviso de recuperación en pantalla | `quote()` (adjProRata en `listRaw`) y `renderProRata()` |
| E | El stock aplica con la misma regla (2 % / 20 %) | `quote()` (`stock` sobre `stuReq`) |

## Cómo se verificó

- Suite interna `?test=1` en Chrome headless: **87/87 antes de tocar nada, 98/98 al terminar**.
- El ejemplo canónico da exactamente lo del plan: fierro $615,200 → **$219.71** por alumno y año
  → lista **$3,219.71** (probado en la suite y reproducido por la interfaz real en la prueba DOM).
- Arranque en perfil limpio (equivalente a ventana privada): la herramienta muestra precio, la
  modalidad 0 se llama «Sin equipos incluidos · a la medida» y el rótulo de costos sale del plazo.

## Lo que conviene revisar a mano (no lo cubre la máquina)

1. `Ctrl+P` de una cotización a la medida y de una 1:1: ninguna sección faltante, ninguna hoja en
   blanco (paso 13 del encargo).
2. Comparar un PDF de 1:1 contra uno de antes del cambio: idénticos salvo el nombre del equipo
   docente en el plazo de seminuevos (paso 14). Nota: en el plazo de tablet el equipo de alumno
   ahora dice «Tablet nueva para estudiante» (antes «Tablet…»), como manda el catálogo del plan.
3. Abrir un borrador real guardado antes del cambio y un JSON exportado viejo: mismo precio al
   centavo (las migraciones lo garantizan y están probadas, pero con datos reales se duerme mejor).
