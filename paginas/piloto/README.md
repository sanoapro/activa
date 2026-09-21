# Proyecto Piloto

Deck de 12 diapositivas para presentar el piloto a la dirección de un colegio:
cuatro semanas con un grupo real, sin costo, y al final el colegio decide con
evidencia propia.

Se publica en <https://sanoapro.github.io/activa/paginas/piloto/> y se abre con
doble clic. **Ya no es un archivo suelto**: depende de `../../compartidos/` para
el motor de movimiento y para los dos logotipos.

| Archivo compartido | Qué pasa si falta |
| --- | --- |
| `compartidos/css/motion.css` | El deck se ve completo y **quieto** |
| `compartidos/js/motion.js` | El deck navega igual, sin cascadas |
| `compartidos/img/marcas/activa.webp` | Portada sin el logotipo de la casa |
| `compartidos/img/marcas/google-for-education-partner.webp` | Láminas sin la marca de esquina |

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | El deck completo: CSS, láminas y los dos scripts |
| `og.png` | Su vista previa de WhatsApp (generada) |
| `og-source.html` | El molde de esa vista previa |

## De dónde sale el contenido

Del documento del proyecto piloto, que es la fuente de verdad del **qué se
dice**: los seis pasos, qué pone cada quién y las condiciones. El vocabulario
visual y buena parte del copy vienen de las láminas 28–32 de
[`../upgrade-edu/`](../upgrade-edu/), donde el piloto cierra la presentación del
programa; aquí es la presentación entera.

**El deck no lleva ni una fecha, y es a propósito.** Allá las siete columnas del
calendario traían octubre y noviembre de 2026 quemados, y cada ciclo había que
rehacerlas. Aquí el proceso es genérico —semana previa, semanas 1 a 4, semana 5,
semana 6— y las fechas se acuerdan con cada colegio en la reunión inicial. Si
alguien pone un mes en una lámina, el deck deja de servir al ciclo siguiente.

### La cuenta de semanas

Siete de calendario: **una previa de preparación**, **cuatro de aula**
(semanas 1 a 4), **una de evaluación** (semana 5) y **una de cierre** (semana 6).
Las numeradas se cuentan desde el primer día de clase, no desde la preparación.
Si esa cuenta cambia, hay que tocar tres sitios: la lámina 3 (el mapa), la 7 (la
tira) y las láminas 8 y 9 en sus titulares.

## Las láminas

| # | Lámina | `data-bloque` | Movimiento |
| --- | --- | --- | --- |
| 1 | Portada | `apertura` | Subrayado a mano bajo «Piloto» · los círculos derivan con el cursor |
| 2 | La oferta · 4 · 1 · $0 | `oferta` | **Anillo de carga** de Google alrededor del `$0` · cascada de las tres tarjetas |
| 3 | Seis pasos, siete semanas | `proceso` | Cascada de los seis pasos (seis es el tope de la normativa) |
| 4 | Paso 1 · Registro | `registro` | Cascada de las tres decisiones |
| 5 | Paso 2 · Reunión inicial | `registro` | Cascada de los tres participantes |
| 6 | Paso 3 · Preparación | `preparacion` | Cascada de las dos tarjetas |
| 7 | Paso 4 · Ejecución | `ejecucion` | Cascada de las cuatro semanas · **el punto del coach** recorre la banda |
| 8 | Paso 5 · Evaluación | `evaluacion` | Cascada de los tres indicadores |
| 9 | Paso 6 · Cierre | `cierre-p` | Cascada de las tres tarjetas |
| 10 | El trato completo | `trato` | **Ninguno focal**: la columna de la izquierda tiene ocho renglones y escalonarlos mientras el director lee es ruido |
| 11 | Las condiciones | `trato` | Cascada de las seis condiciones, en una sola rejilla |
| 12 | Qué se llevan | `resultados` | Subrayado a mano bajo «datos propios» · cascada de las tres tarjetas |

`COLOR` y `NOMBRE`, al principio del script de navegación, mapean cada
`data-bloque` a su color y a su rótulo. **Si un `data-bloque` no está en `COLOR`,
su segmento de la barra sale blanco y nadie avisa.**

### La regla del estado base

Lo que tiene que llegar al PDF tiene estado base **terminado** y la animación va
de vacío a terminado: los subrayados nacen con el trazo completo, así que al
apagar el movimiento la marca sigue puesta.

Lo que solo existe en movimiento tiene estado base `opacity:0`: el anillo del
`$0` y el punto del coach. Al imprimir, en «reducir movimiento» y sin JS
desaparecen en vez de quedar clavados como una raya suelta.

Las tres guardas nombran `::before` y `::after` explícitamente. `animation:none`
sobre el elemento **no** alcanza a sus pseudoelementos, y ese hueco solo se
descubre con la hoja impresa en la mano.

## Atajos

- `←` `→` · `PageUp` `PageDown` · `Espacio` — navegar
- `Inicio` / `Fin` — primera y última lámina
- `F` — pantalla completa · `P` — imprimir
- Deslizar el dedo en táctil
- El hash es **posicional**: `…/piloto/#7` abre la séptima lámina. Si se
  reordenan las láminas, los enlaces que alguien haya guardado apuntan a otra.

## Cómo está armado

- **Escenario fijo de 1280 × 720** escalado con `transform:scale()`. Con el
  padding de `46 60 30` quedan **644 px útiles**, y cada lámina lleva su
  comentario con la cuenta de alturas. Si se agrega contenido, se rehace la
  cuenta: el desbordamiento se recorta en silencio.
- **Por debajo de 1024 px** el escalado se apaga y el deck se desplaza en
  vertical, a una columna. Se lee igual en el teléfono de un director.
- **Sin almacenamiento, sin red y sin librerías.** Los scripts son clásicos a
  propósito: los módulos ES no cargan desde `file://`.
- **Contar los cierres al editar a mano.** Un `</div>` de más saca las últimas
  láminas del escenario y no avisa:
  ```bash
  awk '{t+=gsub(/<div/,"&")-gsub(/<\/div>/,"&")}END{print t}' index.html   # → 0
  ```
- **Imprime a PDF en 16:9**: `@page{size:1280px 720px}` y una lámina por página,
  doce páginas exactas.

## Cómo se regenera la vista previa de WhatsApp

Desde la raíz del repositorio:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/piloto/og.png \
  paginas/piloto/og-source.html
```

`--force-device-scale-factor=1` evita que salga a 2400 × 1260. Las URL de las
etiquetas `og:` van **absolutas** y se editan a mano si la página se mueve. Y
WhatsApp cachea la vista previa por URL: tras regenerar la imagen hay que
compartir el enlace con `?v=2` para forzar el refresco.

## Deuda conocida

Las láminas 28–32 de [`../upgrade-edu/`](../upgrade-edu/) siguen contando el
piloto **con la estructura vieja**: hablan de un «diagnóstico antes y después»
que ya no existe, meten la evaluación dentro de la semana 4 y traen el
calendario de octubre–noviembre de 2026. Mientras no se corrijan, un director
que vea los dos decks encuentra la contradicción.

Reglas de movimiento: [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md).
Contenido de producto: [`../../docs/portafolio-activa.md`](../../docs/portafolio-activa.md).
