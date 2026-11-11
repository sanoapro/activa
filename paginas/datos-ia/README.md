# activa y la IA · alianzas

Deck de 10 diapositivas para una **reunión 1:1 con una empresa de IA**. Presenta a activa, propone
una alianza para construir IA educativa y muestra lo que conocemos del aula, con la privacidad
primero. La carpeta se llama `datos-ia` por historia; el deck ya no se presenta así.

Se publica en <https://sanoapro.github.io/activa/paginas/datos-ia/>. **Solo liga directa:** no
está en el portal ni en el kit comercial.

## Las reglas de contenido

0. **Es una alianza, no una venta de datos.** El deck abre con la portada «A la vanguardia de la
   tecnología educativa» y la propuesta; los datos aparecen después como «lo que conocemos del
   aula». Nada de «datos para tu IA», «Qué tenemos» ni «Cómo se entrega».
1. **La información de la empresa vive en UNA lámina** (la 2, «Quiénes somos»): ecosistema,
   trayectoria y la red de hoy. La portada no lleva datos de la empresa ni rótulos de reunión.
2. **Ningún dato de contacto.** Es una reunión 1:1: el contacto lo pone quien presenta.
3. **Ningún nombre de colegio.** Lo que se agrupa por colegio va con un código.
4. **La privacidad se dice en positivo.** El deck puede llegar a otras manos (un padre, un
   colegio), y una lista de «lo que nunca compartimos» se lee como «esto es lo que tenemos». Cada
   punto dice cómo se protege el dato y dónde se queda.
5. **No se inventan campos.** Lo de la Consola de Google sale del manual de
   [`../consola/`](../consola/) (bloques 5.4 y 6.8). La Consola no guarda historial de navegación
   en la edición de los colegios: las páginas web salen del filtro de contenido (Securly y Mobile
   Guardian). Las ilustraciones de barras y anillos **no llevan cifras**: son dibujo, no datos.

Cifras del dueño, noviembre de 2026 (también en `docs/portafolio-activa.md`): +100 colegios,
+25,000 estudiantes, +5,000 profesores, +20,000 dispositivos activos; región «México,
Centroamérica y el Caribe». El +2 M de docentes capacitados va solo en «Quiénes somos», como
trayectoria.

## Las láminas

| # | Lámina | `data-bloque` | Movimiento |
| --- | --- | --- | --- |
| 1 | Portada · «A la vanguardia de la tecnología educativa» | `apertura` | Red de partículas Google a la derecha (desvanecida hacia el texto), círculos que siguen al cursor, subrayado trazado |
| 2 | Quiénes somos · un solo aliado, ecosistema propio, trayectoria, la red de hoy | `quienes` | Cascada de las tres columnas; aro de carga alrededor de «16»; pulso de radar en la región |
| 3 | La propuesta · «Una alianza para una IA que entienda el aula» | `propuesta` | Ciclo aula → activa → aliado de IA → mejores herramientas: nodos que entran en orden, puntos que recorren el aro, centro que respira |
| 4 | Privacidad · «Lo que sí compartimos» y «Cómo cuidamos la privacidad» | `privacidad` | Banda de anonimización: personas → escudo con barrido de luz → barras de grupo que crecen; flechas que fluyen |
| 5 | Siete ventanas al aula | `fuentes` | Diagrama radial: las siete ventanas entran en orden y las líneas al centro fluyen |
| 6 | Equipos y soporte · Consola de Google y mesa de ayuda | `equipos` | Chromebook: la batería se llena, la señal late, el ticket pasa de «Abierto» a «Resuelto» |
| 7 | Uso digital · Workspace, páginas web y aplicaciones | `uso` | Barras de uso que crecen, chips de categoría que entran, apps que aparecen y un reloj que late |
| 8 | Aprendizaje y vida escolar · plataformas y gestión escolar | `aprendizaje` | Anillos de avance que se trazan y eventos que aparecen en la línea del ciclo escolar |
| 9 | Lo que viene en 2027 | `futuro` | Línea de tendencia que se dibuja; hitos en cascada |
| 10 | Cierre · «Gracias · Construyamos juntos una IA que entienda la educación» | `cierre` | Círculos que siguen al cursor (sin partículas: al centro se leían como manchón) |

Las láminas 6 a 8 terminan con la franja **«Cómo se comparte»**, y cada campo lleva título, qué es
y chips de cómo se agrupa.

## Movimiento: las reglas que sigue

Todo cumple [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md):

- **No hay GIF.** Cada «animación» es SVG/CSS dentro de la página: sin red, sin librerías, sin peso.
- **Estado base = dibujo terminado.** La batería llena, las barras crecidas, «Resuelto», el trazo
  completo. La animación va de vacío a terminado, así que el PDF y «reducir movimiento» lo
  muestran completo. Lo que solo existe en movimiento (aro del «16», radar, barrido del escudo,
  «Abierto», halo del centro) tiene base `opacity:0` y desaparece.
- **Entradas de menos de 900 ms**; los bucles (puntos del aro, flujo de líneas, radar, señal, reloj)
  son **decoración declarada** y solo animan `transform`, `opacity` o el trazo.
- **Nada se mueve sobre una cifra.** El aro gira por fuera del «16» sin tocarlo.
- Guardas de impresión y de «reducir movimiento» con `[class*="mv-"]` y sus `::before`/`::after`
  nombrados, más `.slide.on` y `.mv-anillo > i`. Toda clase animada empieza por `mv-`.
- Partículas: `compartidos/js/motion-particles.js`, paleta Google, solo en la portada; al imprimir
  el canvas no sale.

## Cómo está armado

Motor de navegación del deck del [Piloto](../piloto/): escenario de 1280 × 720 escalado, flechas,
Espacio, Inicio/Fin, F (pantalla completa), P (imprimir), deslizar en táctil y hash posicional
(`#6` abre la sexta lámina). Por debajo de 1024 px se lee en vertical: el ciclo y el diagrama
radial se vuelven listas. Imprime a PDF en 16:9, una lámina por página.

`COLOR` y `NOMBRE`, al principio del script de navegación, mapean cada `data-bloque` a su color y
rótulo. **Si un `data-bloque` no está en `COLOR`, su segmento de la barra sale blanco.**

Contar los cierres al editar a mano:

```bash
awk '{t+=gsub(/<div/,"&")-gsub(/<\/div>/,"&")}END{print t}' index.html   # → 0
```

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | El deck completo |
| `og.png` · `og-source.html` | Vista previa de WhatsApp y su molde. Todo el texto cabe en el recorte cuadrado del centro |

## Cómo se regenera la vista previa de WhatsApp

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/datos-ia/og.png \
  paginas/datos-ia/og-source.html
```
