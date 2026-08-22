# Los precios del arrendamiento

Tablas de la matriz `PRECIOS` de `paginas/arrendamiento/index.html` y cómo se aplican.
Valores verificados el 22-ago-2026, tomados de la hoja «Arrendamiento» del Excel (cada
precio cita su celda).

> **⚠ Convención: TODOS los importes van SIN IVA**, como el Excel (Q2). El IVA (16 %) se
> desglosa **una sola vez**, al final, sobre la mensualidad ya redondeada a centavos: el
> cliente ve subtotal + IVA + total, y las tres cifras siempre cuadran entre sí.

> **⚠ Todos estos precios son información interna.** Solo pueden verse en el panel del modo
> interno; el documento, el correo y el escenario compartido muestran únicamente mensualidad
> y total con su IVA.

---

## Condiciones financieras

| Concepto | Valor | Celda |
|---|---|---|
| Tasa anual | 24 % | F4 |
| IVA | 16 % | Q2 |
| Plazo 3 años | 36 mensualidades | Q7/Q10 |
| Plazo 4 años | 48 mensualidades | Q8/Q11 |
| Vigencia de la cotización | 31 días | — |

**Cómo se aplica la tasa.** La mensualidad es el pago de una amortización estándar (el PMT del
Excel): `mensualidad = monto financiado × r / (1 − (1+r)^−meses)`, con `r = 24 % ÷ 12`. La tasa
es fija —término pactado con la arrendadora— y no es palanca comercial: no hay control para
moverla, ni siquiera en el modo interno.

## Equipos

| Equipo | Precio | CEU | Celda |
|---|---:|---|---|
| Chromebook estudiante (Asus CZ1104) | $7,740.00 | **Integrada** — no se cobra aparte | Q4 / P4 |
| Chromebook docente (Asus CX3402) | $9,450.00 | **Se suma aparte** ($750.00) | Q5 / Q12 |
| Licencia CEU (Chrome Education Upgrade) | $750.00 | Solo la lleva el equipo docente | Q12 |

**Cómo se aplican.** Cada renglón de equipo arma su costo unitario:
`equipo + CEU (solo docente) + seguro (si se marcó) + Securly (si se marcó)`. Estudiante y
docente pueden mezclarse en la misma cotización; como el PMT es lineal, financiar por renglón y
sumar es exacto.

## Servicios · siempre al plazo del contrato

| Servicio | A 3 años | A 4 años | Celdas |
|---|---:|---:|---|
| Securly (Filter + Classroom + Cloud Filter) | $1,050.00 | $1,400.00 | Q7 / Q8 |
| Seguro contra daños accidentales | $1,390.00 | $1,870.00 | Q10 / Q11 |

**Cómo se aplican.** Son **todo o nada**: si se marcan, aplican a *todos* los equipos de la
cotización (docentes incluidos) y **siempre al plazo del arrendamiento**. Los precios a 1 año
del catálogo (Q6, Q9) quedan fuera a propósito: financiar a 36/48 meses un servicio que expira
a los 12 dejaría al colegio pagando cobertura vencida.

## Carritos de carga y almacenamiento

| Capacidad | Precio | Celda |
|---|---:|---|
| 20 equipos | $24,374.70 | Q13 |
| 30 equipos | $26,600.70 | Q14 |
| 40 equipos | $31,720.50 | Q15 |

**Cómo se aplican.** Se capturan como renglones `{capacidad, cantidad}` y pueden mezclarse
(p. ej. 1×30 + 3×20). Su costo total **entra al monto financiado** —aritméticamente idéntico al
prorrateo M20 del Excel—. Si la capacidad no cuadra con los equipos se avisa, pero nunca
bloquea: compartir carrito entre grupos puede ser intencional.

## Límites de captura

| Qué | Límite |
|---|---|
| Equipos por tipo | 0 a 9,999 |
| Carritos por renglón | 1 a 99 |
| Renglones de carrito | máximo 12 |

---

## De la tabla al precio, paso a paso

1. **Unitario por renglón** = equipo + CEU (solo docente) + seguro + Securly.
2. **Monto financiado** = Σ (unitario × cantidad) + total de carritos.
3. **Mensualidad (sin IVA)** = PMT del financiado a 36 o 48 meses con la tasa anual del 24 %.
4. **Al cliente**: mensualidad redondeada a centavos + IVA 16 % + total; y
   **total a pagar = mensualidad con IVA × meses**, para que la multiplicación que el colegio
   haga a mano cuadre exacta.

**Ejemplo clavado en las pruebas** (1 equipo docente a 3 años con seguro y Securly):
$9,450 + $750 + $1,390 + $1,050 = **$12,640** financiados → mensualidad $495.90 + IVA $79.34 =
**$575.24** → total a pagar $575.24 × 36 = **$20,708.64**.

---

> **Ojo al comparar con las otras herramientas.** El mismo concepto existe a otro precio en
> compra (neto) y en el cotizador Upgrade Edu (con IVA), y no es un error: son productos y
> convenciones distintas. Nunca copies un precio de aquí hacia el cotizador sin reponerle el
> IVA.
