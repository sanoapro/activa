# Precios

Tres láminas de 1280×720 que presentan **los paquetes y los precios del ciclo 2026–2027** de
manera visual: los dos paquetes con sus formas de pago, la matriz del precio por alumno, y el
desglose año por año con sus descuentos. Es la pieza que se **enseña y se manda**; la que
**cotiza** sigue siendo el [cotizador](../cotizador/).

Se publica en **https://sanoapro.github.io/activa/paginas/precios/**

No hay scroll: cada lámina se escala para caber entera en cualquier pantalla, igual que el
[kit comercial](../kit-comercial/), del que hereda el sistema de diseño —tokens Google, título
con letras de colores, manchas pastel, pradera al pie—.

La página lleva `<meta name="robots" content="noindex, nofollow">`: tiene el precio por alumno
y los descuentos. Se manda por enlace, no se busca.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo: markup, CSS, datos y JS en un solo archivo. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |

## Las tres láminas

| # | Lámina | Qué cuenta |
|---|---|---|
| 1 | **Dos paquetes, un ecosistema** | Upgrade Edu (desde $3,000) y Upgrade Edu Plus (+$500: Everway, Escuela para Padres y Docentes, TKT), más las tres formas de pago: contado −10 %, firma temprana −5 %, firma tardía a lista. |
| 2 | **El precio por alumno** | La matriz de precio de lista: 4 equipos/plazos × 4 modalidades, con conmutador Edu / Edu Plus, la fila «sin equipos» y la escalera de descuento por volumen para redes (referencia, requiere validación comercial). |
| 3 | **El desglose, año por año** | Escenario elegible (paquete + equipo/plazo + modalidad) desglosado año por año con las tres formas de pago, mensualidades y el total del contrato con su ahorro. |

Se navega con los botones de abajo a la derecha, con **← →**, con **1–3**, y **F** alterna
pantalla completa. `#2` y `#3` en la URL abren directo esa lámina (enlace compartible); la
lámina actual se refleja en el hash con `replaceState`, sin ensuciar el historial.

## De dónde salen los números — y la regla de oro

**El cotizador es la única fuente de verdad de los precios.** Esta página lleva una **copia
consciente** de esa configuración en el bloque `CFG` de su script (busca «COPIA CONSCIENTE»):
precios por paquete/fila/modalidad, factores anuales, descuentos por forma de pago, fecha de
firma temprana y la tabla de volumen.

> **Al cambiar precios o reglas en el cotizador** (`paginas/cotizador/index.html`,
> `APP_CONFIG` cerca de la línea 1771) **hay que actualizar el `CFG` de esta página a mano.**
> Son los mismos objetos con los mismos nombres, a propósito, para poder compararlos lado a lado.

La aritmética del desglose replica la cadena del cotizador (`calculatePaymentYear`): precio →
factor anual → descuento **en precisión completa**, y solo se redondea al final. Si un importe
de aquí no coincide con el del cotizador para el mismo escenario, el bug es de esta página.

## Movimiento

Usa el motor compartido de `compartidos/` bajo [`docs/normativa-motion.md`](../../docs/normativa-motion.md).
Solo la lámina 1 lleva cascada (paquetes y formas de pago), velo de cursor e inclinación en las
dos tarjetas —con la envoltura doble `.twrap` → `.paq` del kit, para que cascada e inclinación
no se pisen—. Las **tablas de las láminas 2 y 3 no se animan**: números, precios y totales
quedan quietos siempre (prohibición expresa de la normativa). Los conmutadores solo repintan.

La pradera es la del kit; en las láminas 2 y 3 va en versión corta (42 px) para cederle el alto
a las tablas. Sus animaciones (`mv-crece`/`mv-mece`) se anulan en `@media print` y con
«reducir movimiento» la brizna se monta ya crecida (`transform:none`), porque sin la animación
se quedaría en su estado inicial `scaleY(0)` y la pradera desaparecería.

## Impresión

`Ctrl+P` imprime **las tres láminas, una por hoja**, aunque en pantalla solo se vea una: las
láminas se ocultan con una clase propia (`.on`) y no con `hidden`, precisamente para que la
regla de `@media print` pueda mostrarlas todas. `@page` va a 1280×720 para que cada hoja sea
la lámina exacta.

## Cómo se regenera la vista previa de WhatsApp

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/precios/og.png \
  paginas/precios/og-source.html
```

Las URLs de las etiquetas `og:` son absolutas: WhatsApp no lee rutas relativas ni `data:` URI.
WhatsApp cachea la vista previa por URL; si cambia la imagen y el enlace ya se compartió, se
fuerza el refresco añadiendo `?v=2` al enlace.

## Al tocar esta página

1. **Compara contra el cotizador**: mismo escenario, mismos importes, centavo a centavo.
2. **Imprime** (`Ctrl+P`): tres hojas, ninguna en blanco, pradera completa.
3. **Sin JavaScript** la lámina 1 se ve completa y quieta; las tablas de la 2 y la 3 las arma
   el JS, así que sin script esas dos quedan con su cabecera y sin filas — no hay estado roto
   a medias, pero tampoco números: no repartas la página como «estática».
4. **Teclado**: ← → 1 2 3 F, y el foco visible en segmentos y navegación.
5. **«Reducir movimiento»**: todo funciona y nada se mueve; la pradera se ve crecida.
