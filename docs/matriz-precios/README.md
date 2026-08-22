# La matriz de precios · una sola fuente de verdad en los tres cotizadores

Los tres cotizadores deciden lo que paga un colegio, y hoy ninguno tiene **un solo lugar donde se
cambien los precios**. Esta carpeta contiene el diseño para que lo tengan.

**Implementado el 22-ago-2026**: las tres matrices `PRECIOS` están construidas, con su prueba
«La matriz es la única fuente», y las tres suites quedaron en verde (42 · 56 · 100) sin editar
el valor esperado de ninguna prueba existente.

## Los archivos

| Archivo | Qué es |
|---|---|
| [`plan.md`](plan.md) | El diseño completo: qué se encontró, cómo queda la matriz y qué cabo suelto hay que jalar en cada página. Cierra con un **apéndice que trae los tres catálogos enteros**, valor por valor. **Se lee primero.** |
| [`prompt.md`](prompt.md) | El encargo de implementación, autocontenido: las cuatro fases, los comandos exactos para correr las pruebas y las fricciones de este entorno. Se le pasa completo a una sesión de Claude Code. |
| [`precios-arrendamiento.md`](precios-arrendamiento.md) | Solo los precios del arrendamiento, en tablas, y cómo se aplican. **Sin IVA** |
| [`precios-compra.md`](precios-compra.md) | Solo los precios de la compra directa, en tablas, y cómo se aplican. **Netos, sin IVA** |
| [`precios-cotizador.md`](precios-cotizador.md) | Solo los precios del cotizador Upgrade Edu, en tablas, y cómo se aplican. **Con IVA** |

**Los dos documentos se bastan solos.** Traen los precios de las tres herramientas, los números de
línea, los comandos verificados y las trampas conocidas: quien los ejecute no debería necesitar ir
a buscar nada más.

---

## Por qué

El 22-ago-2026 la licencia CEU y el seguro se copiaron del catálogo de arrendamiento —que va
**sin** IVA— a un cotizador que trabaja **con** IVA. Cada equipo se cotizó $419.20 por debajo.

El error no fue de aritmética: fue que nadie tenía dónde leer, de un golpe de vista, qué precios
existen y bajo qué convención.

## Lo que se decidió

| | Decisión |
|---|---|
| Tipo | Un objeto **ejecutable** por página, `PRECIOS`. No un comentario: el resto del archivo lee de él |
| Alcance | **Todo el negocio**: importes, tasas, descuentos, factores anuales, razones, stock, topes y acompañamiento |
| IVA | Cada página conserva su convención, pero la matriz **la declara en su primer renglón**, igual en las tres |
| Compra | Los 37 precios se concentran en `PRECIOS.partidas`; `CATALOG` conserva las descripciones y lee el precio |
| Ubicación | Una matriz **por página**, dentro de su `index.html`. Las tres son autocontenidas porque el PDF es el entregable |

## La regla que evita que se pudra

> **La cabecera de la matriz no lleva ni una cifra.** Solo la convención de IVA, la fecha y la
> instrucción. Los números viven en el objeto.

El bloque que hoy existe en el cotizador dibuja los precios en un comentario, y ese patrón ya
falló **cuatro veces en ese mismo archivo**: hay comentarios que citan $17,000, $2,169.20,
$26,600, $627,776, 7,261.538462 y 7,223.076923 — importes que ya no existen. El detalle está en
[`plan.md`](plan.md).

## Estado por página

| | Hoy | Trabajo |
|---|---|---|
| **arrendamiento** | Muy concentrado en `CATALOG`, con la celda del Excel anotada valor por valor | Poco. Fija el formato para las otras dos y hace que `FORBIDDEN` deje de escribirse a mano |
| **compra** | Muy concentrado: `APP_CONFIG` + `CATALOG` de 37 partidas | Medio. Extraer los 37 precios y arreglar dos textos que no se sincronizan |
| **cotizador** | Repartido en 7 objetos. Su «MATRIZ DE PRECIOS» es solo comentario y cubre **16 importes**; fuera quedan unos 90 números | Grueso. Es donde está el problema |

## Tres hallazgos que valen aparte

1. **La lista que protege al cliente en arrendamiento está escrita a mano.** Si cambia un precio y
   nadie la actualiza, la prueba sigue en verde y deja de proteger. Además lleva un `"$490"` que
   es un precio de *compra*, colado por copiar-pegar.
2. **Los porcentajes de stock del cotizador viven dentro de un texto que se imprime en el PDF.**
   Si cambian, el documento seguirá prometiendo 2% y 20%.
3. **En compra, el texto de entrega y la etiqueta de IVA del encabezado no se sincronizan** con la
   configuración: pueden divergir en silencio.

## Cómo se trabaja

1. Leer [`plan.md`](plan.md).
2. Pasarle [`prompt.md`](prompt.md) completo a una sesión de Claude Code parada en la raíz.
3. Verificar con la tabla del final del encargo. **Ningún precio debe moverse.**
