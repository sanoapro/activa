# Precios

Tres láminas de 1280×720 que presentan **los precios del ciclo 2026–2027** de manera visual: el
desglose año por año del escenario que se esté negociando, la matriz del precio por alumno, y los
dos paquetes sin equipos. Es la pieza que se **enseña y se manda**; la que **cotiza** sigue
siendo el [cotizador](../cotizador/).

Abre por el **desglose** a propósito: es la lámina que se enseña en la junta, la que se
fotografía y la que decide. Las otras dos sostienen la conversación cuando hace falta.

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
| 1 | **El desglose** · `lDes` | Escenario elegible (paquete + equipo/plazo + modalidad) en **cuatro columnas-tarjeta**: el año de contrato y las tres formas de pago, año por año, con sus mensualidades. El escenario elegido **es el título** de la lámina. |
| 2 | **El precio por alumno** · `lMat` | La matriz de precio de lista: 4 equipos/plazos × 4 modalidades, con conmutador Edu / Edu Plus, la fila «sin equipos» y la escalera de descuento por volumen para redes (referencia, requiere validación comercial). |
| 3 | **Dos paquetes, sin equipos** · `lPaq` | Upgrade Edu ($3,000) y Upgrade Edu Plus ($3,500): el **precio anual del programa cuando el colegio ya tiene sus propios equipos** —Chromebooks, iPads, los que use—. Más las tres formas de pago. |

Los `id` nombran el **contenido**, no la posición. Antes eran `l1`/`l2`/`l3` y `.l1-cuerpo`…, y al
reordenar las láminas todos mentían a la vez. Si vuelve a cambiar el orden, solo se mueve el
`<section>`: el CSS, el script y la cascada de movimiento van por `id`.

Se navega con los botones de abajo a la derecha, con **← →**, con **1–3**, y **F** alterna
pantalla completa. `#1`, `#2` y `#3` en la URL abren directo esa lámina (enlace compartible); la
lámina actual se refleja en el hash con `replaceState`, sin ensuciar el historial.

> **Los enlaces `#n` repartidos antes de agosto de 2026 apuntan a otra lámina.** El desglose pasó
> de la 3 a la 1 y los paquetes de la 1 a la 3. Quedan dos referencias posicionales escritas en la
> página —la nota al pie de la matriz—; llevan su aviso en el markup.

### Lo que la lámina del desglose **no** lleva

No hay fila de **«total del contrato»**. Es decisión comercial, no un olvido: en la primera visita
se enseña el importe anual por alumno, no la suma de los cuatro años. Tampoco lleva título de
lámina ni la marca «activa · Google for Education Partner»: el escenario elegido ocupa ese sitio,
para que salga en la misma foto que los importes cuando alguien fotografía la pantalla.

El color de las cuatro tarjetas es un **semáforo**, y eso es información, no adorno: azul el eje
de años, y verde → amarillo → rojo las tres formas de pago, de la más barata al precio de lista.
Se lee antes de leer un solo número. El amarillo lleva tinta oscura porque sobre `#f9ab00` el
blanco no llega al contraste mínimo ni a tamaño grande.

## De dónde salen los números — y la regla de oro

**El cotizador es la única fuente de verdad de los precios.** Esta página **ya no lleva su propia
copia**: los precios, los factores anuales, los descuentos, las fechas y la aritmética viven en
[`compartidos/js/precios-ciclo.js`](../../compartidos/js/precios-ciclo.js), que es una **copia
consciente** del `APP_CONFIG` del cotizador.

Se movió allá cuando el deck de [upgrade edu](../upgrade-edu/) estrenó su lámina del desglose:
con dos páginas enseñando los mismos números, una segunda copia pegada a mano es la forma
conocida de que un deck y una cotización digan cifras distintas delante del mismo director.
Regla de [`docs/estructura.md`](../../docs/estructura.md): lo que usa más de una página vive en
`compartidos/`.

> **Al cambiar precios o reglas en el cotizador** (`paginas/cotizador/index.html`, `APP_CONFIG`
> cerca de la línea 1771) **hay que actualizar `compartidos/js/precios-ciclo.js` a mano** — y con
> eso quedan al día esta página y el deck a la vez. Son los mismos objetos con los mismos
> nombres, a propósito, para poder compararlos lado a lado.

**Ese archivo no es opcional.** El motor de movimiento sí lo es —sin él la página se ve completa y
quieta—, pero sin los precios no hay nada que enseñar: si no carga, la página lo dice en pantalla
en vez de quedarse con huecos. Repártela como **carpeta**, no como `index.html` suelto.

La aritmética del desglose replica la cadena del cotizador (`calculatePaymentYear`): precio →
factor anual → descuento **en precisión completa**, y solo se redondea al final. Si un importe
de aquí no coincide con el del cotizador para el mismo escenario, el bug está en el archivo
compartido o en la lámina, nunca en el cotizador.

## Movimiento

Usa el motor compartido de `compartidos/` bajo [`docs/normativa-motion.md`](../../docs/normativa-motion.md).
Solo **`lPaq`** —los paquetes— lleva cascada (tarjetas y formas de pago), velo de cursor e
inclinación en las dos tarjetas, con la envoltura doble `.twrap` → `.paq` del kit para que
cascada e inclinación no se pisen. `go()` relanza esa cascada buscando la lámina **por `id`**, no
por índice: cuando iba por índice (`cur === 0`) el reordenamiento la habría dejado disparándose
en el desglose.

Ni la matriz ni **las cuatro columnas del desglose se animan**: números, precios y totales quedan
quietos siempre (prohibición expresa de la normativa). Los conmutadores solo repintan.

La pradera es la del kit; en la matriz y en el desglose va en versión corta (42 px) para cederle
el alto a los datos. Sus animaciones (`mv-crece`/`mv-mece`) se anulan en `@media print` y con
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
3. **Sin JavaScript** la lámina de paquetes (`lPaq`) se ve completa y quieta —sus rótulos de pago
   están escritos en el markup, y `sincronizaRotulosPago()` solo los realinea con `CFG` cuando hay
   script—; la matriz y las columnas del desglose las arma el JS, así que sin script esas dos
   quedan con su armazón y sin importes. No hay estado roto a medias, pero tampoco números: no
   repartas la página como «estática».
4. **Teclado**: ← → 1 2 3 F, y el foco visible en segmentos y navegación.
5. **«Reducir movimiento»**: todo funciona y nada se mueve; la pradera se ve crecida.
6. **Recorre los conmutadores del desglose** con un plazo de 2 años y con «sin equipos»: las
   cuatro columnas tienen que seguir alineadas con dos filas, y el título no debe nombrar un
   equipo cuando la modalidad es «sin equipos».
