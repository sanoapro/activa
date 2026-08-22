# Los precios del cotizador Upgrade Edu

Tablas de la matriz `PRECIOS` de `paginas/cotizador/index.html` y cómo se aplican. Lista
definitiva de Martín, verificada el 22-ago-2026.

> **⚠ Convención: TODOS los importes van CON IVA, de principio a fin.** Los precios ya lo
> traen; no se agrega en ningún punto del cálculo. Por eso **nunca** se copia un precio del
> catálogo de arrendamiento (que va sin IVA) sin multiplicarlo por 1.16 antes: hacerlo crudo
> fue el error del 22-ago-2026.

> **⚠ Copia manual declarada:** `compartidos/js/precios-ciclo.js` duplica la tabla de precios
> por alumno y la usan `paginas/precios/` y la lámina 33 del deck. Quien cambie un precio por
> alumno tiene que actualizar ese archivo a mano.

---

## El precio por alumno y por año

Es el corazón de la herramienta: un precio **anual por alumno**, según paquete, plazo y
modalidad de equipos.

**Paquete edu**

| Plazo | Sin equipos | 1:4 | 1:3 | 1:2 | 1:1 |
|---|---:|---:|---:|---:|---:|
| Chromebook nueva · 3 años | $3,000 | $4,225 | $4,633.33 | $5,450 | $7,900 |
| Chromebook nueva · 4 años | $3,000 | $3,975 | $4,300 | $4,950 | $6,900 |
| Flip-Touch seminueva · 2 años | $3,000 | $3,300 | $3,400 | $3,600 | $4,200 |
| Tablet nueva · 3 años | $3,000 | $3,300 | $3,400 | $3,600 | $4,200 |

**Paquete plus**

| Plazo | Sin equipos | 1:4 | 1:3 | 1:2 | 1:1 |
|---|---:|---:|---:|---:|---:|
| Chromebook nueva · 3 años | $3,500 | $4,725 | $5,133.33 | $5,950 | $8,400 |
| Chromebook nueva · 4 años | $3,500 | $4,475 | $4,800 | $5,450 | $7,400 |
| Flip-Touch seminueva · 2 años | $3,500 | $3,875 | $4,000 | $4,250 | $5,000 |
| Tablet nueva · 3 años | $3,500 | $3,875 | $4,000 | $4,250 | $5,000 |

**Cómo se aplica.** La modalidad dice cuántos alumnos comparten un equipo: en 1:4 el colegio
recibe un equipo por cada 4 alumnos, en 1:1 uno por alumno; «Sin equipos» es la modalidad **a
la medida** (ver al final). El precio de la celda ya incluye equipos, licencias, plataformas y
acompañamiento del paquete: no se le suma nada más, salvo los ajustes de las secciones
siguientes.

Los precios de dos celdas con centavos se escriben completos en la matriz: $4,633.333333 y
$5,133.333333 (el redondeo a centavos ocurre al final del cálculo, no en la tabla).

## Los cuatro plazos

| Plazo | Años | Equipo del alumno | Stock | Modelos docentes elegibles |
|---|---|---|---|---|
| `cb3` · Chromebooks nuevas | 3 | Chromebook nueva | 2 % | docente (1:20) o estudiante (1:10) |
| `cb4` · Chromebooks nuevas | 4 | Chromebook nueva | 2 % | docente (1:20) o estudiante (1:10) |
| `fl2` · Flip-Touch seminueva | 2 | Flip-Touch seminueva | **20 %** | solo docente seminuevo (1:20) |
| `tb3` · Tablet | 3 | Tablet nueva | 2 % | solo Chromebook nueva docente (1:20) |

**Cómo se aplica el stock.** Es la reserva de reemplazo que se entrega junto con el parque:
2 % de los equipos de estudiante solicitados en equipos nuevos y 20 % en seminuevos. No se
asigna a usuarios y **no genera licencias ni póliza adicionales**; el seguro y la CEU cubren el
parque entregado.

## Cuánto cuesta un equipo · siempre con CEU y seguro

El precio de catálogo va **pelón**; a cada equipo, por cualquier puerta que entre, se le suman
**siempre** su licencia CEU y su seguro al plazo:

| Equipo | Precio pelón |
|---|---:|
| Chromebook nueva (alumno) | $14,500 |
| Chromebook nueva · docente | $17,850 |
| Flip-Touch seminueva (alumno) | $7,000 |
| Flip-Touch seminueva · docente | $9,000 |
| Tablet nueva | $10,000 |

| Por cada equipo, sin excepción | Importe |
|---|---:|
| Licencia Chrome Education Upgrade | $870 |
| Seguro a 2 años (plazo seminueva) | $1,050 |
| Seguro a 3 años (plazos Chromebook y tablet a 3) | $1,600 |
| Seguro a 4 años (plazo Chromebook a 4) | $2,150 |

**Ejemplo:** una Chromebook nueva de alumno en el plazo de 4 años cuesta
$14,500 + $870 + $2,150 = **$17,520**.

## Carritos de carga

| Capacidad | Precio |
|---|---:|
| 20 Chromebooks | $28,280 |
| 30 Chromebooks | $30,860 |
| 40 Chromebooks | $36,800 |

**Cómo se aplican.** El precio sale del catálogo por capacidad; el vendedor decide **cuántos**,
nunca cuánto cuestan. Hay carrito en las modalidades 1:4, 1:3 y 1:2 (en 1:1 cada alumno
resguarda su equipo) y en la cotización a la medida se capturan como renglones
capacidad × cantidad. Regalarlos exige autorización expresa.

## Docentes y adicionales

| Concepto | Valor |
|---|---|
| Docentes con licencia incluidos | 1 por cada 10 alumnos |
| Equipos docentes incluidos · modelo docente | 1 por cada 20 alumnos |
| Equipos docentes incluidos · modelo estudiante | 1 por cada 10 alumnos |
| Docente extra sin equipo | $1,500 **al año** |
| Equipo de estudiante adicional | 0.8 × precio base por alumno |
| Equipos docentes adicionales | Al costo de catálogo del plazo (pelón + CEU + seguro) |

**Cómo se aplican.** Los docentes incluidos (licencias y equipos) ya están dentro del precio
por alumno; el colegio solo elige el **modelo** de los equipos docentes incluidos, entre los
elegibles del plazo. Lo que exceda esas razones se cobra: el docente extra sin equipo a
$1,500 al año, y los equipos adicionales al costo de catálogo.

## Descuentos al retirar una licencia · por alumno y por año

| Licencia retirada | Descuento |
|---|---:|
| motiva | $200 |
| beta English | $200 |
| Everway (solo Plus) | $80 |
| Las otras nueve licencias | $0 |

**Cómo se aplican.** Se restan del precio por alumno de cada año. El cero de las demás es una
decisión: retirarlas **no** baja el precio.

## Esquemas de pago y factores anuales

| Esquema | Descuento | En agosto | Mensualidades |
|---|---:|---:|---|
| Contado en agosto | 10 % | 100 % | 0 |
| Firma antes del 19-mar-2027 | 5 % | 50 % | 10 |
| Firma a partir del 19-mar-2027 | 0 % | 50 % | 10 |

| Plazo | Factores por año |
|---|---|
| 3 años | 0.94 · 1.02 · 1.10 |
| 4 años | 0.90 · 0.97 · 1.04 · 1.11 |
| 2 años (seminueva) | 1 · 1 |

**Cómo se aplican.** El precio de cada año = precio de lista × factor del año; sobre ese
importe se aplica el descuento del esquema. En los esquemas con mensualidades, el 50 % se paga
en agosto y el resto en 10 mensualidades. El descuento del contado y el de firma temprana
aplican a todo, fierro incluido.

## Descuento por volumen en redes · solo informativo

| Alumnos | Descuento |
|---|---:|
| 500 – 999 | 10 % |
| 1,000 – 1,499 | 15 % |
| 1,500 – 1,999 | 20 % |
| 2,000 – 2,499 | 30 % |
| 2,500 – 2,999 | 40 % |
| 3,000 – 4,999 | 45 % |
| 5,000 + | 55 % |

**Cómo se aplica: no se aplica.** Es material de redes que la herramienta solo **dibuja**; no
entra en ningún cálculo del cotizador.

## Acompañamiento · por número de alumnos

| Hasta | Horas de capacitación virtual | Visitas presenciales | Talleres Escuela para Padres |
|---:|---:|---:|---:|
| 100 | 8 | 0 | 1 |
| 200 | 8 | 1 | 2 |
| 500 | 10 | 2 | 3 |
| 700 | 15 | 2 | 3 |
| Sin tope | 20 | 3 | 4 |

**Cómo se aplica.** El número de alumnos decide la banda, y la banda fija el alcance
contractual que sale impreso en el documento. No mueve el precio.

## Topes y vigencia

| Concepto | Valor |
|---|---|
| Tope de cordura | $250,000 por alumno y año — por encima, el documento se **bloquea** |
| Vigencia de la cotización | 31 días |
| Límites de captura | Alumnos 1 a 999,999 · cantidades 0 a 999,999 |

---

## La cotización a la medida (modalidad «Sin equipos»)

Cotiza las licencias de **todos** los alumnos al precio de la columna «Sin equipos», más los
equipos que el colegio realmente pidió, **prorrateados entre todos los alumnos y todos los años
del contrato**:

1. **Fierro** = Σ (equipos pedidos × costo unitario del plazo) + carritos.
   El costo unitario ya trae CEU y seguro, como todo equipo.
2. **Prorrateo por alumno y año** = fierro ÷ alumnos ÷ años del plazo.
3. **Precio de lista** = precio base «Sin equipos» + prorrateo.

**El ejemplo canónico, clavado en las pruebas** (700 alumnos, 30 Chromebooks a 4 años, 1
carrito de 30): fierro = 30 × $17,520 + $30,860 = **$556,460** → prorrateo = 556,460 ÷ 700 ÷ 4
= **$198.74** → lista = $3,000 + $198.74 = **$3,198.74** por alumno y año.

La regla en una línea: **lo que se compra una vez —equipo, CEU, seguro, carrito— se divide
entre todos los alumnos y todos los años; lo que es por alumno ya está en el precio base y no
se prorratea.**

---

> **Ojo al comparar con las otras herramientas.** El mismo concepto existe a otro precio en
> compra y arrendamiento (netos, sin IVA), y no es un error: estos son lista comercial
> redondeada **con IVA**, no los netos × 1.16 exactos. No los recalcules: cópialos como están.

| Concepto | cotizador (con IVA) | compra (neto) | arrendamiento (neto) |
|---|---:|---:|---:|
| Licencia CEU | $870 | $750 | $750 |
| Carrito de 30 | $30,860 | $26,600.70 | $26,600.70 |
| Seguro 3 años | $1,600 | $1,390 | $1,390 |
| Seguro 4 años | $2,150 | $1,870 | $1,870 |
