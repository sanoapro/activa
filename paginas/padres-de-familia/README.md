# Presentación a padres de familia · 2026–2027

Deck de 22 diapositivas para las juntas con familias del colegio.
Se publica en **https://sanoapro.github.io/activa/paginas/padres-de-familia/**

Markup, CSS y JS del deck viven dentro de `index.html`. Se abre con doble clic, sin servidor y
sin compilar nada.

**Ya no es un archivo suelto:** carga el motor de movimiento compartido de `compartidos/`, así
que viaja como carpeta o como zip, no como un `index.html` solo. Fue una decisión deliberada,
para tener un único lugar donde arreglar el movimiento de las cuatro páginas. Fuera de eso no
hay peticiones de red: ni fuentes por CDN, ni librerías de terceros, ni imágenes remotas.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | El deck completo. Sin imágenes: toda ilustración es SVG en línea dibujado con los tokens del sistema. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |

## Movimiento

Usa el motor compartido de `compartidos/`, con menos movimiento que el deck comercial, a
propósito: esta junta acompaña, no vende. Una sola cascada por lámina y solo donde el dato se
construye ante los ojos (las diez siluetas de «La mayoría», la escalera hasta el C1, la ruta
de implementación); el bloque D («tranquilidad») queda sin cascada, solo con la entrada serena
que ya tenía. Fondo ambiental únicamente en portada (partículas) y cierre (las olas y sus
círculos siguiendo al cursor).

Todo lo que el motor esconde vive bajo `html.mo-ready`: si `motion.js` no carga, el deck se ve
completo y quieto, y navega igual. Las reglas están en
[`docs/normativa-motion.md`](../../docs/normativa-motion.md) y son obligatorias.

## Cómo se regenera la vista previa de WhatsApp

`og-source.html` dibuja la tarjeta de 1200×630 con los tokens de esta página — sin escudo del
colegio, a propósito: la presentación es una plantilla que se reutiliza en varios colegios.
Para volver a exportarla después de un cambio:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/padres-de-familia/og.png \
  paginas/padres-de-familia/og-source.html
```

Las URLs de las etiquetas `og:` son absolutas: WhatsApp no lee rutas relativas ni `data:` URI.
Si el sitio cambia de dominio hay que actualizarlas a mano. WhatsApp cachea la vista previa por
URL: si cambia la imagen y el enlace ya se compartió, hay que forzar el refresco añadiendo
`?v=2` al final del enlace.

## Atajos

- `←` `→` navegar · barra espaciadora avanza
- `Inicio` / `Fin` primera y última
- `F` pantalla completa
- `P` imprimir a PDF en 16:9
- En el teléfono: deslizar con el dedo

Se puede enlazar a una diapositiva concreta con el número en el hash: `…/padres-de-familia/#7`.

## Cómo está armado

- **Sistema de diseño heredado de [`../upgrade-edu/`](../upgrade-edu/README.md).** Los tokens,
  la tipografía, las tarjetas, las píldoras, la tabla, los medallones y la escalera son los de
  ese deck. Si allá cambia un token, aquí hay que reflejarlo a mano: no comparten hoja.
- **Escenario de 1280×720**, escalado con `transform:scale()` como el deck comercial.
- **Responsive de verdad, que el deck comercial no tiene.** Por debajo de 1024 px se apaga el
  escalado uniforme y la lámina pasa a flujo vertical con tipografía en `clamp()`, a una sola
  columna. Un padre que abra el enlace en su teléfono lee texto de tamaño normal, no un 16:9
  encogido.
- **Sin almacenamiento del navegador.** Todo el estado en variables en memoria.
- **Impresión:** `Ctrl+P` saca una diapositiva por página en horizontal (22 páginas de
  1280×720).

## La narrativa: no se reordena

Las 22 láminas son un embudo de gestión del cambio:
credibilidad → disonancia → desarme → tranquilidad → solución → prueba social → acción.
Cada `<section class="slide">` lleva un `data-bloque` con su fase, y el indicador de progreso se
colorea a partir de él. **Mover una diapositiva rompe el argumento**, y el bloque D
(«tranquilidad», láminas 9–13) es el corazón: es donde el padre baja la guardia.

| Bloque | Láminas | `data-bloque` |
|---|---|---|
| A · Apertura | 1–2 | `apertura` |
| B · Disonancia y desarme | 3–6 | `disonancia` |
| C · Bisagra | 7–8 | `bisagra` |
| D · Tranquilidad | 9–13 | `tranquilidad` |
| E · Solución | 14–18 | `solucion` |
| F · Resultado y prueba social | 19–20 | `resultado` |
| G · Cierre | 21–22 | `cierre` |

## Se proyecta tal cual: no hay nada que completar

El deck es **universal por requisito explícito**: cualquier colegio lo proyecta sin rellenar
datos, sin conseguir fotos ni logotipos y sin actualizar nada nunca. No quedan marcadores de
ningún tipo. Donde antes iba una foto o un logotipo hay SVG en línea o tratamiento
tipográfico del propio sistema; donde antes iba una cifra del colegio, el punto está dicho en
cualidad, no en cantidad, para que sea verdad en cualquier plantel. La única cifra proyectiva
(«La mayoría de estos niños trabajará en profesiones que todavía no existen», lámina 6) se
enuncia como proyección, no como medición, con su línea de honestidad al pie.
