# activa y la IA · alianzas

Deck de 15 diapositivas para una **reunión 1:1 con una empresa de IA**. Presenta a activa, propone
una alianza para construir IA educativa y muestra lo que conocemos del aula, con la privacidad
primero. La carpeta se llama `datos-ia` por historia; el deck ya no se presenta así.

Se publica en <https://sanoapro.github.io/activa/paginas/datos-ia/>. **Solo liga directa:** no
está en el portal ni en el kit comercial.

## Las cinco reglas de contenido

0. **Es una alianza, no una venta de datos.** El deck abre con quiénes somos («A la vanguardia de la
   tecnología educativa») y con la propuesta; los datos aparecen después como «lo que conocemos del
   aula». Los rótulos de las láminas de datos son «Lo que conocemos» y «Cómo se comparte», nunca
   «Qué tenemos» ni «Cómo se entrega». Nada de «datos para tu IA» en títulos ni en la vista previa.
1. **Ningún dato de contacto.** Es una reunión 1:1: el contacto lo pone quien presenta. Sin
   nombres, teléfonos, correos ni ligas de WhatsApp.
2. **Ningún nombre de colegio.** Cuando un dato se agrupa por colegio, el colegio va con un código.
   Ni siquiera como ejemplo.
3. **La privacidad se dice en positivo.** El deck puede llegar a otras manos (un padre de familia,
   un colegio), y una lista de «lo que nunca compartimos» se lee como «esto es lo que tenemos».
   Cada punto dice cómo se protege el dato y dónde se queda. Nada de «nunca», «sin datos
   sensibles» ni tachas rojas, tampoco en la vista previa de WhatsApp. La regla de fondo es la del
   dueño: nada de datos sensibles, todo agregado y anonimizado, con la autorización de cada
   colegio.
4. **No se inventan campos.** Lo de la Consola de Google sale del manual de
   [`../consola/`](../consola/) (bloques 5.4 «Informes de dispositivo y telemetría» y 6.8
   «Actualizaciones e informes del navegador»). La Consola **no** guarda historial de navegación
   en la edición de los colegios: las páginas web salen del filtro de contenido (Securly y Mobile
   Guardian), y así lo dice la lámina 9.

Cifras del dueño, noviembre de 2026 (también en `docs/portafolio-activa.md`): +100 colegios,
+25,000 estudiantes, +5,000 profesores, +20,000 dispositivos activos. Región: solo «México,
Centroamérica y el Caribe». El +2 M de docentes capacitados va solo en «Quiénes somos», como
trayectoria; las láminas de datos hablan de los +5,000 profesores de los +100 colegios.

## Las láminas

| # | Lámina | `data-bloque` |
| --- | --- | --- |
| 1 | Portada · «A la vanguardia de la tecnología educativa» | `apertura` |
| 2 | Quiénes somos · un solo aliado, ecosistema propio, trayectoria | `quienes` |
| 3 | La propuesta · una alianza para una IA que entienda el aula | `propuesta` |
| 4 | Alcance · la red que acompañamos hoy | `alcance` |
| 5 | Privacidad · «Lo que sí compartimos» y «Cómo cuidamos la privacidad» | `privacidad` |
| 6 | Lo que conocemos del aula · siete ventanas | `fuentes` |
| 7 | Consola de Google · equipos | `consola` |
| 8 | Consola de Google · Workspace | `consola` |
| 9 | Páginas web (Securly y Mobile Guardian) | `navegacion` |
| 10 | Aplicaciones en Chromebooks y tablets | `apps` |
| 11 | Dispositivos y soporte | `soporte` |
| 12 | Plataformas educativas (impulsa, motiva, beta) | `aprendizaje` |
| 13 | Gestión escolar (integra) | `gestion` |
| 14 | Lo que viene en 2027 | `futuro` |
| 15 | Cierre · «Gracias · Construyamos juntos una IA que entienda la educación» | `cierre` |

Las láminas 7 a 13 repiten un patrón: a la izquierda **«Lo que conocemos»** (seis mosaicos, uno
por campo) y a la derecha **«Cómo se comparte»** (nivel de agrupación) y **«De dónde sale»** (logos). En
el pie, el hilo de las siete fuentes dice en cuál vamos.

`COLOR` y `NOMBRE`, al principio del script de navegación, mapean cada `data-bloque` a su color y
rótulo. **Si un `data-bloque` no está en `COLOR`, su segmento de la barra sale blanco.**

## Cómo está armado

Motor copiado del deck del [Piloto](../piloto/): escenario de 1280 × 720 escalado con
`transform:scale()`, navegación con flechas, Espacio, Inicio/Fin, F (pantalla completa) y P
(imprimir), deslizar en táctil y hash posicional (`#9` abre la novena lámina). Por debajo de
1024 px no escala: se lee en vertical. Imprime a PDF en 16:9, una lámina por página.

- Iconos Material de relleno, definidos una vez como `<symbol>` y usados con `<use>`.
- Logos desde `compartidos/img/marcas/` (Mobile Guardian: `mobile-guardian.webp`).
- Sin almacenamiento, sin red y sin librerías. Scripts clásicos: abre desde `file://`.
- Contar los cierres al editar a mano:

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

Movimiento: [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md).
