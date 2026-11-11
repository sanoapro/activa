# Datos para IA

Deck de 14 diapositivas para una **reunión 1:1 con una empresa** que quiere mejorar su IA con datos
educativos reales. Dice qué datos tiene activa, cómo se cuida la privacidad y cómo se entrega cada
dato.

Se publica en <https://sanoapro.github.io/activa/paginas/datos-ia/>. **Solo liga directa:** no
está en el portal ni en el kit comercial.

## Las cuatro reglas de contenido

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
   Guardian), y así lo dice la lámina 8.

Cifras del dueño, noviembre de 2026 (también en `docs/portafolio-activa.md`): +100 colegios,
+25,000 estudiantes, +5,000 profesores, +20,000 dispositivos activos. Región: solo «México,
Centroamérica y el Caribe». El +2 M de docentes capacitados **no** va aquí: es capacitación, y este
deck habla de los datos de uso de los +5,000 profesores.

## Las láminas

| # | Lámina | `data-bloque` |
| --- | --- | --- |
| 1 | Portada · «Datos educativos para tu IA» | `apertura` |
| 2 | Qué ofrecemos · uso de tecnología, aprendizaje, operación escolar | `oferta` |
| 3 | Alcance · las cuatro cifras y la región | `alcance` |
| 4 | Privacidad · «Lo que sí compartimos» y «Cómo cuidamos la privacidad» | `privacidad` |
| 5 | Las fuentes · siete vistas de los datos | `fuentes` |
| 6 | Consola de Google · equipos | `consola` |
| 7 | Consola de Google · Workspace | `consola` |
| 8 | Páginas web (Securly y Mobile Guardian) | `navegacion` |
| 9 | Aplicaciones en Chromebooks y tablets | `apps` |
| 10 | Dispositivos y soporte | `soporte` |
| 11 | Plataformas educativas (impulsa, motiva, beta) | `aprendizaje` |
| 12 | Gestión escolar (integra) | `gestion` |
| 13 | Lo que viene en 2027 | `futuro` |
| 14 | Cierre · «Gracias» | `cierre` |

Las láminas 6 a 12 repiten un patrón: a la izquierda **«Qué tenemos»** (seis mosaicos, uno por
campo) y a la derecha **«Cómo se entrega»** (nivel de agrupación) y **«De dónde sale»** (logos). En
el pie, el hilo de las siete fuentes dice en cuál vamos.

`COLOR` y `NOMBRE`, al principio del script de navegación, mapean cada `data-bloque` a su color y
rótulo. **Si un `data-bloque` no está en `COLOR`, su segmento de la barra sale blanco.**

## Cómo está armado

Motor copiado del deck del [Piloto](../piloto/): escenario de 1280 × 720 escalado con
`transform:scale()`, navegación con flechas, Espacio, Inicio/Fin, F (pantalla completa) y P
(imprimir), deslizar en táctil y hash posicional (`#8` abre la octava lámina). Por debajo de
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
