# Comparativa de seguridad por plataforma

Página de lectura —no es un deck— que compara cuatro arquitecturas para el equipo del alumno:
Windows, iPad, Chromebook + Securly e iPad + Securly. Responde qué puede controlar realmente un
colegio en cada una: seguridad del sistema, administración, control del profesor, filtrado,
resistencia a evasión, protección fuera del colegio, identidad y privacidad. Va dirigida a
directores, coordinadores de tecnología y responsables de sistemas.

Se publica en <https://sanoapro.github.io/activa/paginas/comparativa-seguridad/>. Depende de
`../../compartidos/` para el motor de movimiento y los logotipos (activa, Google for Education
Partner y Securly).

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. **Es generada: no se edita a mano** |
| `fuente/plantilla.html` | La prosa, el CSS y el script, con marcadores `<!--GEN:…-->` y citas `[[f:clave]]` |
| `fuente/datos.py` | Las seis tablas, las valoraciones con su justificación y el registro de fuentes |
| `fuente/generar.py` | Une plantilla y datos y escribe `index.html` |
| `og.png` | Su vista previa de WhatsApp (generada) |
| `og-source.html` | El molde de esa vista previa |

## Cómo se edita

1. **Una valoración o una fila de tabla:** en `fuente/datos.py`. Cada celda es
   `(puntos, justificación)`: no se cambia el puntaje sin cambiar la justificación, ni al revés.
2. **Prosa, estilo o interacción:** en `fuente/plantilla.html`.
3. **Una cita nueva:** se registra la fuente en el diccionario `F` de `datos.py` y se escribe
   `[[f:clave]]` donde haga falta. La numeración se asigna sola en el orden de aparición, y en la
   lista final solo entran las fuentes citadas.
4. Se regenera desde la raíz del repositorio:

```bash
python paginas/comparativa-seguridad/fuente/generar.py
```

El generador **falla en voz alta** si una cita apunta a una clave inexistente o si queda un
marcador sin resolver. También avisa qué fuentes registradas quedaron sin citar.

## De dónde sale el contenido y qué NO dice

Seis líneas de investigación independientes (Microsoft, Apple, Google, Securly, evasión y
privacidad), consultadas el **2 de octubre de 2026** sobre todo en documentación oficial. Hay
decisiones que no hay que deshacer:

- **Transparencia visible.** La página dice que activa es partner de Google y distribuye Securly,
  reconoce fortalezas de Windows y del iPad y señala los límites de Chromebook y de Securly. Si se
  endurece el tono a favor de una plataforma, el estudio pierde lo que lo hace creíble frente a un
  coordinador de TI.
- **Securly no es igual en todos los equipos.** En iPad filtra por SmartPAC (proxy más
  certificado, solo con iPad supervisado), pierde funciones que solo da la extensión y **Securly
  Classroom no existe para iPad**. Esto contradice la frase de la lámina 7 de `upgrade-edu` («las
  mismas reglas en cualquier dispositivo»), que conviene matizar. Las cifras de esa lámina (12,000+
  escuelas, 55,000+ docentes) tampoco aparecen hoy en fuentes oficiales: securly.com dice 27,000+
  escuelas.
- **Evasión, solo en clave defensiva.** Cada vector dice por qué existe, si se puede bloquear y
  con qué ajuste. **Nunca** se agregan instrucciones para evadir controles.
- **Sin sección de costos.** Se retiró a pedido: la página no compara precios. Si algún día
  vuelve, solo con precios públicos verificables y «Requiere cotización» en lo demás.
- **La conclusión no orienta a conservar Windows o iPad.** activa no administra esas flotas; el
  cierre dice solo dónde se llega más lejos con menos piezas.
- **El escenario de 30 alumnos favorece a Chromebook por diseño de las preguntas**, y la página
  lo dice. No se quita esa advertencia.
- **Fuentes de comunidad** (Jamf Nation, Microsoft Q&A) van marcadas como evidencia anecdótica.

### Qué revisar cuando cambien los productos

- **iPadOS 27 y la navegación guiada de Classroom:** está anunciada en la WWDC26, pero no se
  encontró todavía la página de soporte. Cuando exista, revisar las Tablas 3 y 6.
- **Class Tools de Google** (disponibilidad en México y en español) y **Googlebook OS**, que
  tendrá licencia nueva; la administración llega en el segundo semestre de 2027.
- **Securly:** si publica Classroom para iPad o guardas de IA por SmartPAC.
- Que **M365 A3** incluya el filtrado por categorías: Defender for Endpoint P1 viene en A3 y lo
  incluye, pero la página de requisitos no nombra A3.
- El **acuerdo de la SEP** en el DOF y el reglamento nuevo de la **LFPDPPP**.

## Cómo está armada

Portada con nota de transparencia · resumen (cinco hallazgos en formato *hallazgo, evidencia e
implicación*) · capas y arquitectura A/B/C · Tabla 1 con filtro por dimensión y gráfica de
promedios · Tabla 4 (TI) · Tabla 3 (profesor) · filtrado y Tabla 5 · Tabla 2 (evasión) con
acordeón de mitigaciones · dentro y fuera del colegio · identidad · privacidad (EE. UU., Europa y
México, proveedores y checklist LFPDPPP) · Tabla 6 (30 alumnos) interactiva · México · fortalezas y limitaciones · conclusiones · fuentes.

### Componentes propios

- **`td.v` con `.why`:** cada valoración lleva su justificación. Sin JS y al imprimir se ve en
  línea. Con JS se esconde a la vista (no a los lectores de pantalla) y aparece en un globo al
  pasar el cursor, o en línea con «Mostrar justificaciones». El globo se coloca dentro de
  `Motion.onFrame`: el evento solo anota la celda (regla 2 de la normativa).
- **Tablas anchas:** se desplazan dentro de su caja `.tw` con la primera columna fija. La página
  nunca hace scroll horizontal.
- **`.hall`:** hallazgo, evidencia e implicación. **`.tesis`:** postura propia, sin comillas.

## Movimiento

Capas 1 a 3 de [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md): revelado al
bajar, cascadas, barra de lectura y chip activo del índice (mismo criterio que
`uso-responsable`). Las cifras no se animan. Los filtros y botones no se muestran sin JS.

## Verificado

Sin JS (quitando `mo-ready`) no queda nada en `opacity:0` · a 390 px no hay scroll horizontal
(las tablas se desplazan en su caja) · al imprimir, justificaciones en línea y acordeones abiertos
· abre desde `file://` · consola sin errores · `node --check` de los dos scripts.

## Cómo se regenera la vista previa de WhatsApp

Desde la raíz del repositorio, con rutas de Windows:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/comparativa-seguridad/og.png \
  paginas/comparativa-seguridad/og-source.html
```
