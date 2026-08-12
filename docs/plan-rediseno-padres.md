# Plan de rediseño · Presentación a padres de familia

> **Estado: en ejecución.** Aplicada la primera tanda — correcciones de hecho, vocabulario,
> notas del presentador y la **capa de animación completa** (§8). Pendiente el rediseño de
> contenido de la mayoría de las láminas, los logotipos y la fusión 11+12.
> Fuente de verdad del contenido: [`portafolio-activa.md`](portafolio-activa.md).
> Deck a intervenir: [`paginas/padres-de-familia/`](../paginas/padres-de-familia/).
> Cantera de contenido y de patrones visuales: [`paginas/upgrade-edu/`](../paginas/upgrade-edu/).

## Estado de ejecución

| Tarea | Estado |
|---|---|
| Correcciones de hecho (§3) | ✅ aplicado |
| Vocabulario: «alumno» fuera, «maestro» unificado (§2.1) | ✅ aplicado |
| Notas del presentador fuera de pantalla (§2.2) — láminas 3, 12, 16 | ✅ aplicado |
| Capa de animación, las 12 ideas repartidas (§8) | ✅ aplicado |
| Lámina 3 rehecha · lámina 9 ampliada | ✅ aplicado |
| Investigación ISTE / UNESCO (§5.1) | ⬜ pendiente — **bloquea la lámina 7** |
| Logotipos en base64 (§2.4) | ⬜ pendiente |
| Fusión 11+12 y Securly (§4) | ⬜ pendiente |
| Resto del rediseño de contenido (§4) | ⬜ pendiente |
| Láminas nuevas (§4 bis) | ⬜ pendiente |

---

## 1 · Cómo se hizo esta revisión

Se leyeron las 22 láminas, se renderizaron en Chrome a 1280×720 y se contrastó cada
afirmación contra el documento maestro. Las conclusiones de abajo salen de mirar las láminas
proyectadas, no solo el código: el problema de varias no es lo que dicen, es cuánta lámina
dejan vacía mientras lo dicen.

---

## 2 · Cinco problemas transversales

Estos atraviesan casi todo el deck. Conviene resolverlos como reglas, una sola vez, y no
lámina por lámina.

### 2.1 · El vocabulario no es el del público

El deck le habla a un padre pero usa el idioma del colegio. Hay **13 apariciones de
«alumno / alumnos»** contra **una sola de «estudiantes»**.

| Regla | Antes | Después |
|---|---|---|
| Nunca «alumno» | «Los datos del **alumno** son del colegio» | «Los datos de **su hijo** son del colegio» |
| Genérico donde no hay padre de por medio | «+200 M de **alumnos** y educadores» | «+200 M de **estudiantes** y educadores» |
| El título del deck | «Preparando a **nuestros alumnos**…» | «Preparando a **sus hijos**…» |

Criterio: **cuando el sujeto es el niño de quien está sentado en la sala, es «su hijo»**;
cuando es una población abstracta, «estudiantes». «Alumno» no aparece nunca.

Falta además unificar **maestro / profesor / docente**. Para un padre, la palabra es
**maestro**; «docente» es jerga institucional y «profesorado» todavía más. Hoy conviven las
tres (lámina 2 «profesores capacitados», lámina 9 «Formación continua… los maestros», lámina
9 «prepara al **profesorado**»).

### 2.2 · Hay notas del presentador proyectadas en pantalla

Es lo que hace que la lámina 3 se sienta mal: **el padre está leyendo instrucciones que no
son para él**.

- **Lámina 3** — «**Apoyo para quien presenta — si la sala se queda callada**» seguido de
  nueve píldoras con ejemplos, y una tarjeta «**Si alguien pregunta:** ¿los maestros van a
  dejar de existir?». Las dos cosas son guion, no contenido.
- **Lámina 12** — el epígrafe es «**Cuatro afirmaciones frontales**». Eso describe la
  retórica de la lámina; al padre no le dice nada.
- **Lámina 16** — «**Dos ejemplos ilustrativos** del tipo de trabajo que…». El hedge es para
  protegerse, y le resta fuerza al caso.

**Regla:** en pantalla solo va lo que el padre debe leer. El guion del presentador necesita
otro canal — notas de orador imprimibles, o una versión `?notas=1` del deck. Es una decisión
a tomar antes de reescribir la 3.

### 2.3 · Varias láminas son una franja de contenido flotando en una lámina vacía

No es que falte texto: es que el contenido se agrupa en una banda central y deja bandas
muertas arriba y abajo. Verificado en el render:

| Lámina | Qué se ve proyectado |
|---|---|
| **8** | Cuatro tarjetas con **solo un título cada una**, y media lámina en blanco debajo |
| **7** | Tres columnas apelotonadas abajo, la tercera con 2 fichas contra 4 de las otras, y una franja muerta entre el título y las columnas |
| **9** | Tres tarjetas en una banda estrecha; arriba y abajo, nada |
| **12** | Cuatro tarjetas de una línea centradas, con dos bandas vacías |
| **2** | La tarjeta de «+2 M» es enorme y contiene una cifra y dos renglones |
| **6** | Diez siluetas y un titular; el resto es blanco |

### 2.4 · El deck no usa ni un logotipo, y los tiene todos disponibles

`compartidos/img/marcas/` guarda 18 logos listos, entre ellos **ISTE, UNESCO, SEP · Nueva
Escuela Mexicana, Securly, motiva, impulsa, eleva, beta, Everway, Canva, Wayground, Cambridge,
IELTS y TOEFL**. El deck de padres no carga ninguno: hoy dice «Referencia: estándares ISTE»
en 13 px al pie, y en la lámina 18 las certificaciones son **texto dentro de un recuadro**,
no logotipos.

Hay que separar dos cosas que el README mezcla:

- **La regla de universalidad es real y se respeta**: el deck no debe pedir el escudo del
  colegio ni fotos del plantel, porque se proyecta igual en cualquier escuela.
- **Los logos de terceros no son datos del colegio.** ISTE, UNESCO, Securly o Cambridge son
  idénticos en todos los planteles. Incluirlos **no rompe** la universalidad; al contrario,
  son el anclaje de credibilidad que hoy falta.

`upgrade-edu` ya resuelve el patrón técnico: base64 embebido, sin peticiones de red, se abre
con doble clic. **Recomendación: portar ese mecanismo.** Coste estimado: el deck pasa de
~0 KB de imagen a unos 150–250 KB, sigue viajando como un archivo.

### 2.5 · La mina de contenido está sin explotar

`portafolio-activa.md` tiene material directamente dirigido al padre que **el deck no
menciona en absoluto**. Los cuatro huecos más grandes:

| Ausente hoy | Por qué le importa al padre | Fuente |
|---|---|---|
| **Seguro contra daño y robo** | «¿Y si mi hijo lo rompe? ¿Me lo van a cobrar?» — es la primera pregunta económica de cualquier padre | §4.5 |
| **Everway** (Read&Write, Equatio, OrbitNote) | «Mi hijo tiene dislexia / TDAH» — el deck no ofrece nada a esas familias | §5.4 |
| **Escuela para Padres y Docentes** | Es un beneficio **para ellos**, de 1 a 4 talleres presenciales al año | §8.2 |
| **integra** · comunicación con familias | Avisos, boletas, calificaciones y colegiaturas en un solo lugar | §6.5 |

Y varios más sin usar: **stock de reemplazo** (2 % del parque en equipos nuevos → «su hijo no
pierde días de clase»), **mesa de ayuda con SLA menor a 24 h**, **certificación en años
terminales** (6º primaria, 3º secundaria, 6º bachillerato), la **ruta de madurez digital** de
cuatro etapas, y el **encendido en menos de 10 segundos sin antivirus**.

---

## 3 · Correcciones de hecho — obligatorias

Dos cifras del deck **contradicen el documento maestro**. Se corrigen antes que cualquier
mejora estética.

| Lámina | Dice hoy | Debe decir | Fuente |
|---|---|---|---|
| **2** | «**5** proyectos internacionales: México, Chile, Perú, El Salvador, Barbados» | «**6** proyectos internacionales» — falta **Colombia** | §1 |
| **20** | «**+200 M** de alumnos y educadores usan Google Workspace for Education» | **190 millones** (es la cifra del maestro y la que usa `upgrade-edu`) | §1 |

Tercera revisión, de nomenclatura: la lámina 13 llama a las etapas de *motiva*
«**Fortaleza y liderazgo**» y «**Propósito de vida**»; el maestro las llama «**Blindaje y
liderazgo**» y «**Future Skills**». Hay que decidir cuál manda — la del padre puede ser más
cálida, pero entonces se documenta que es una traducción deliberada, no un descuido.

---

## 4 · Plan lámina por lámina

Notación: **⬛ estructura** · **✍ texto** · **🎨 visual** · **📚 contenido nuevo (§ del maestro)**

### Bloque A · Apertura

**1 · Portada** — *funciona; solo el título*
✍ «nuestros alumnos» → «sus hijos». Evaluar el titular completo: «Preparando a sus hijos para
un mundo que aún no existe» es más directo y elimina la única palabra prohibida del deck.

**2 · El respaldo** — *pobre*
⬛ La tarjeta de «+2 M» ocupa media lámina para tres renglones. Redistribuir: cuatro cifras
con peso comparable, o «+2 M» grande con una banda de contexto debajo.
🎨 Aquí van los primeros logos: **Google for Education Partner** (badge) y **activa**.
📚 Añadir «**más de 10 años** en transformación educativa» (§1), que hoy no aparece y es
justo el argumento de respaldo.
✅ Corregir 5 → **6** proyectos, con Colombia.

### Bloque B · Disonancia y desarme

**3 · Actividad para conversar** — *mal: es guion, no lámina*
⬛ Rehacer entera. La pregunta («¿Qué trabajos existían cuando ustedes eran niños y hoy ya no
existen?») es buena y se queda **sola y grande**.
🎨 Sustituir las nueve píldoras de texto por una **retícula de iconos** de esos oficios
desaparecidos —conmutador, máquina de escribir, carrete de fotos, cabina de peaje, videoclub—
en trazo de una línea, apagados o tachados. Se ve la idea en dos segundos; hoy hay que leerla.
✍ La respuesta a «¿los maestros van a desaparecer?» sale de pantalla y pasa a notas del
presentador, **o** se convierte en la lámina 9 (que ya trata exactamente eso).

**4 · Miedo a la tecnología en la historia** — *pobre*
🎨 Las cuatro tarjetas son texto plano con una píldora de año. Convertirlas en una **línea de
tiempo real** —eje horizontal, hito por hito— y darle a cada una su icono de época (prensa de
imprenta, calculadora, módem, teléfono).
✍ El remate de abajo es la mejor frase del bloque; merece más aire.
📚 Considerar cerrar el arco con un quinto hito: **la IA, 2023–hoy**, que es el miedo que el
padre trae hoy y que el maestro sí documenta (§2: «la era de la IA ya llegó al aula»).

**5 · Siglo XX vs. Siglo XXI** — *pobre*
⬛ Dos listas de cuatro viñetas y una cita. Es la lámina más plana del deck.
🎨 Pasar a comparación visual: dos columnas con **imagen mental** (fila de escritorios
idénticos vs. trabajo en equipo alrededor de una mesa), o un diagrama de «ruta predecible»
contra «ruta ramificada».
📚 Enriquecer con el dato de mercado del maestro (§2): **78 % de las empresas ya usa IA y
92 % planea aumentar su inversión en tres años**. Eso convierte una opinión en un hecho.

**6 · La mayoría trabajará en profesiones que no existen** — *súper pobre, y hay un desajuste*
⚠️ **El dibujo y el titular no dicen lo mismo.** Hay 10 siluetas con 6 resaltadas —o sea
«6 de cada 10»— pero el texto dice «La mayoría». O el titular recupera la proporción, o el
dibujo deja de mostrar una.
🎨 Las siluetas son pictogramas adultos genéricos. Deben ser **niños**, y con la identidad del
sistema (los cuatro colores de Google), no un bloque rojo.
⬛ Media lámina en blanco. Cabe un segundo nivel: qué profesiones **sí** existen hoy y no
existían hace 15 años (community manager, científico de datos, especialista en IA, técnico en
energías renovables) — el espejo de la lámina 3, y cierra el arco.

### Bloque C · Bisagra

**7 · Competencias para el futuro** — *amontonado y sin procedencia*
⬛ Las tres columnas quedan pegadas abajo con una franja muerta arriba, y la tercera solo
tiene 2 fichas contra 4 y 4. Rebalancear a 4/3/3 o rediseñar como retícula 2×5.
🎨 **Falta el icono del estudiante en el centro** — el usuario lo pidió explícitamente. Las
diez competencias deberían orbitar a un estudiante, no ser tres listas.
🎨 **Logos de ISTE y UNESCO** en lugar de «Referencia: estándares ISTE» en 13 px al pie.
⚠️ **Aquí hace falta investigación antes de tocar nada** — ver §5.1. Las 10 competencias
listadas **no son** los 7 estándares ISTE para estudiantes; la atribución actual es
imprecisa y poner el logo de ISTE encima la volvería más visible.

**8 · Ciudadanía digital** — *súper pobre*
⬛ Cuatro tarjetas con **un título cada una** y media lámina vacía. Es la lámina con menor
densidad del deck.
📚 Cada tarjeta necesita su desarrollo de una línea. Material disponible en §7.4
(certificación de estudiantes: «investigar de forma ética», «proteger sus datos y su
privacidad», «uso ético de inteligencia artificial»).
🎨 **La huella digital merece su propio bloque** — lo pidió el usuario y es el concepto que
más ancla la lámina: lo que se publica a los 12 sigue ahí a los 22. Se presta a un visual
fuerte (una línea de tiempo de rastros, o una huella compuesta de iconos de apps).
✍ El epígrafe «Ciudadanía digital» y el titular ya son buenos; el problema es todo lo demás.

### Bloque D · Tranquilidad *(el corazón del deck)*

**9 · El maestro no desaparece** — *muy pobre*
⬛ Tres tarjetas en una banda estrecha, con bandas muertas arriba y abajo.
📚 Es la lámina que más material tiene sin usar, en §7.2: **3 bootcamps al año**, **1 voucher
de examen oficial Google por maestro al año**, **webinars semanales**, **capacitación anual
con coach certificado**, y los tres pilares (materiales base → herramientas digitales →
pedagogías innovadoras). Hoy dice «se capacitan» sin decir cuánto.
✍ Aquí encaja la respuesta que hoy vive fuera de lugar en la lámina 3: *el maestro no
desaparece; el que no use tecnología será reemplazado por el que sí*.
🎨 Logo de **Google for Education** en la certificación.

**10 · Tiempo de pantalla y equilibrio** — *falta iconografía, tarjetas poco marcadas*
🎨 La tabla de cuatro niveles es correcta pero es una tabla. Darle **un icono por nivel** y
tratamiento de tarjeta, no de fila.
🎨 La lista «Sigue siendo analógico» (educación física, artes, lectura, escritura a mano,
trabajo en equipo) **pide iconos a gritos** — hoy son cinco viñetas de texto.
⚠️ La afirmación de cierre («su hijo probablemente pasa más horas frente a una pantalla sin
supervisión en casa…») no tiene fuente. O se sostiene con una (ver §5.4) o se reformula como
pregunta al padre, que retóricamente funciona igual y no afirma nada que no se pueda probar.

**11 + 12 · Protección y privacidad** — *fusionar, y explicar Securly* **(petición explícita)**
⬛ Las dos láminas tratan lo mismo y ninguna llena la lámina. Se fusionan en una sola, sólida.
📚 **Securly nunca se nombra**, y es exactamente lo que resuelve la inquietud (§4.6):
- **Securly Filter** — filtrado y monitoreo **dentro y fuera del plantel**
- **Securly Classroom** — el maestro **ve y guía las pantallas de su grupo en tiempo real**

Esa segunda función es la más tranquilizadora del deck entero y hoy no está.
🎨 Logo de **Securly**. Y sustituir el panel gris abstracto de la derecha —hoy son barras
grises sin significado— por una escena legible: la vista del maestro con las pantallas del
grupo.
✍ Corregir «alumno» → «su hijo» en las cuatro afirmaciones de privacidad, y cambiar el
epígrafe «Cuatro afirmaciones frontales» por lenguaje de padre.
➕ La fusión **libera una lámina**. Ver §4 bis.

**13 · motiva** — *pobre para todo lo que hay detrás*
📚 Usa tres etapas y una línea; el maestro (§6.3) tiene mucho más:
- **Método en cuatro tiempos**: comprensión → aplicación → reflexión → repetición, *hasta
  volverlo hábito*
- **Proceso**: diagnóstico → intervención → práctica → acompañamiento → **resultados medibles**
- **Psicólogos educativos certificados** diseñan y guían el programa de principio a fin

La lámina 17 de `upgrade-edu` ya tiene resuelto el diseño de ese contenido: **se puede portar
casi tal cual**, adaptando el tono.
🎨 Logo de **motiva**; un icono por etapa; y revisar los nombres contra el maestro (§3).

### Bloque E · Solución

**14 · El equipo** — *correcta, ampliable*
📚 Añadir de §4.1 lo que hoy falta y el padre agradece: **cámara con obturador de privacidad**
(muy tranquilizador), **sin necesidad de antivirus**, **pantalla táctil**.
📚 Y sobre todo §4.5: **seguro contra daño y robo durante todo el contrato** y **stock de
reemplazo** — hoy ausentes, y son la respuesta a «¿y si se rompe?».
🎨 El icono de laptop genérico se puede sustituir por la **ilustración de Chromebook** que ya
existe, dibujada con precisión, en la lámina 6 de `upgrade-edu`.

**15 · Cómo aprenden distinto** — *bien resuelta*
📚 Solo enriquecer con §6.1: los proyectos vienen de **impulsa**, con **+1,000 recursos**
creados por expertos. Da respaldo a las cuatro metodologías.
🎨 Logo de **impulsa**.

**16 · Un caso real** — *bien, pero se disculpa*
✍ Quitar el hedge «Dos ejemplos ilustrativos del tipo de trabajo que…». Si son ilustrativos,
se dice una vez al pie y en pequeño, no en el subtítulo.
🎨 Cada caso pide una miniatura de su proyecto (la campaña de agua, el mapa de cruces).

**17 · Herramientas que enganchan** — *correcta*
📚 Nombrar las herramientas: **Wayground** (evaluación gamificada con diagnóstico en vivo,
§5.3) y **Canva para Educación** (implementación oficial en el dominio, §5.2). Hoy las
describe sin nombrarlas.
🎨 Logos de **Wayground** y **Canva**.

**18 · beta · inglés** — *la más completa; poco que tocar*
🎨 Los recuadros «Cambridge / IELTS / TOEFL» son texto: hay **logos reales** de IELTS y TOEFL
disponibles.
📚 Añadir de §6.4 la metodología **CLIL & SEL** y los proyectos PBL por fase.

### Bloque F · Resultado

**19 · Lo que su hijo se lleva** — *sólida*
📚 Precisar de §7.4 que la certificación se aplica en **años terminales: 6º de primaria, 3º de
secundaria y 6º de bachillerato**. Ese detalle vuelve concreta la promesa.

**20 · El mundo ya lo hace** — *corregir cifra*
✅ **+200 M → 190 millones** (§1).
🎨 Los ocho recuadros de universidades son texto en caja. Sin sus logos —que no tenemos y que
son marcas de terceros— conviene **cambiar el recurso**: un mapa, o las banderas de los 12
países que ya están listados como píldoras.
⚠️ Verificar que la lista de universidades sea sostenible (ver §5.5).

### Bloque G · Cierre

**21 · Lo que sigue** — *correcta*
📚 La ruta de 4 pasos se puede alinear con la **ruta de madurez digital** del maestro (§9):
Integración → Adopción → Innovación → Transformación, con la **Google Reference School** como
horizonte. Le da destino a la lámina.
📚 En «Qué necesitamos de ustedes» encaja la **Escuela para Padres y Docentes** (§8.2): es el
lugar natural para decirle al padre que él también recibe acompañamiento.

**22 · Cierre** — *funciona*
Sin cambios de contenido.

---

## 4 bis · Láminas nuevas propuestas

La fusión de 11+12 libera un espacio, y hay material para más de uno. Por prioridad:

1. **«Si se rompe, está cubierto»** — seguro contra daño y robo, stock de reemplazo, mesa de
   ayuda con SLA menor a 24 h (§4.5, §7.3). *Responde la pregunta económica que todo padre
   trae y hoy nadie contesta.* **Alta prioridad.**
2. **«Y si mi hijo aprende distinto»** — Everway: Read&Write, Equatio, OrbitNote; dislexia,
   TDAH, discalculia, baja visión (§5.4). *Hoy esas familias salen de la junta sin respuesta.*
   ⚠️ Es exclusivo de **PLUS**: hay que decidir si el deck universal puede prometerlo, o si
   se enuncia como disponible según el paquete del colegio.
3. **«Ustedes también entran al programa»** — Escuela para Padres y Docentes + comunicación
   con familias vía *integra* (§8.2, §6.5). *Convierte al padre de espectador en participante.*

---

## 5 · Investigación pendiente

Nada de lo de abajo se puede resolver leyendo el repositorio: hace falta ir a la fuente.

### 5.1 · Las «10 competencias» de la lámina 7 — **el más urgente**

Los **ISTE Standards for Students** son **7 roles** (Empowered Learner, Digital Citizen,
Knowledge Constructor, Innovative Designer, Computational Thinker, Creative Communicator,
Global Collaborator). Las 10 competencias de la lámina **no son esas**: parecen una mezcla de
ISTE, del *Future of Jobs* del Foro Económico Mundial y de marcos de habilidades del siglo XXI.

Decir «Referencia: estándares ISTE» al pie ya es impreciso; **poner el logo de ISTE encima lo
haría afirmativo**. Hay que resolverlo antes de rediseñar:
- ¿de qué marco salen realmente esas 10?
- ¿se sustituyen por los 7 de ISTE (y el titular pasa a «7 competencias»)?
- ¿o se mantienen 10 y se atribuyen correctamente a sus dos o tres fuentes?

También hay que verificar **qué marco de UNESCO aplica**: el *ICT Competency Framework 3.0*
(2018) que cita el maestro es **para docentes**, no para estudiantes. Para competencias del
estudiante, UNESCO publicó en 2024 marcos de competencias en IA para estudiantes. Poner el
logo correcto en el lugar correcto.

### 5.2 · La cifra de Google Workspace for Education

El maestro dice **190 millones**; el deck dice **+200 M**. Conseguir la cifra oficial vigente
y su fecha, y alinear los tres decks.

### 5.3 · El dato de IA en el aula

§2 del maestro afirma «**86 %** de los estudiantes usa IA y **24 %** a diario» y «**78 %** de
las empresas ya la usa». **El documento no cita fuente.** Si estos números entran a la
presentación de padres —y la lámina 5 los pide— necesitan procedencia y año.

### 5.4 · Tiempo de pantalla en casa

La afirmación de la lámina 10 necesita respaldo de un organismo reconocible (OMS, AAP,
INEGI/ENDUTIH para México) o se reformula como pregunta.

### 5.5 · «Profesiones que todavía no existen» y las universidades

- La proyección de la lámina 6 se suele atribuir a Cathy Davidson y está discutida. El deck ya
  la enuncia con honestidad; conviene decidir si se cita o se reformula.
- La lista de universidades de la lámina 20 (Tec, UNAM, Ibero, Anáhuac, Stanford, Brown,
  Toronto, Los Andes) **no tiene respaldo en el maestro**. Hay que confirmar de dónde salió y
  si es defendible frente a un padre que pregunte.

### 5.6 · Everway y el paquete

Confirmar si el deck universal puede prometer Everway siendo exclusivo de PLUS, o cómo se
enuncia sin comprometer al colegio que contrató el paquete base.

---

## 6 · Plan de subagentes con Claude Fable

El trabajo se presta a paralelizar: **22 láminas independientes**, cinco lentes de auditoría
que no se estorban, y una verificación que conviene hacer adversarial. La propuesta es un
`Workflow` de cinco fases; el modelo por fase va indicado.

### Fase 0 · Congelar la verdad — *1 agente · Opus*
Extrae de `portafolio-activa.md` **toda** afirmación relevante para un padre y la deja en una
hoja de hechos estructurada: enunciado, sección de origen, y si tiene fuente externa o no.
Todo lo demás se apoya en este artefacto, así que no se paraleliza: se hace bien una vez.

**Salida:** `hechos.json` — `[{claim, seccion, tieneFuente, aplicaAPadres}]`

### Fase 1 · Auditoría por lentes — *5 agentes en paralelo · Fable*
Cada uno recorre las 22 láminas con **una sola pregunta**. Son ciegos entre sí a propósito:
la diversidad de lente es lo que hace que aparezca lo que un revisor único se salta.

| Lente | Qué busca |
|---|---|
| **Lenguaje** | «alumno», jerga institucional, registro inadecuado, nivel de lectura |
| **Guion filtrado** | todo texto en pantalla dirigido al presentador y no al padre |
| **Hechos** | cada cifra y afirmación contra `hechos.json`; marca lo no respaldado |
| **Densidad visual** | bandas muertas, tarjetas de una línea, iconos y logos faltantes |
| **Cobertura** | qué de `hechos.json` es relevante para padres y **no está** en el deck |

Fable encaja aquí: son barridos amplios, mecánicos y bien acotados.

### Fase 2 · Investigación externa — *4 agentes en paralelo · Opus + WebSearch*
Una por pregunta abierta de §5: marcos ISTE/UNESCO, cifra de Workspace, datos de IA en el
aula, tiempo de pantalla. Opus y no Fable: hay que **juzgar la calidad de la fuente**, no solo
encontrarla. Cada agente devuelve la afirmación defendible, su fuente y su fecha —
o **«no hay fuente sólida, hay que reformular»**, que es un resultado igual de válido.

### Fase 3 · Propuesta por lámina — *pipeline de 22 · Fable*
Cada agente recibe una lámina, los hallazgos de las cinco lentes que le tocan, la hoja de
hechos y los resultados de investigación. Devuelve una **especificación de rediseño**:
titular, bloques, textos, iconos, logos, contenido nuevo con su sección de origen, y qué se
elimina.

Es un *pipeline* y no un *parallel*: cada lámina puede pasar a verificarse en cuanto termina,
sin esperar a las otras 21.

### Fase 4 · Verificación adversarial — *3 por lámina · Opus*
Tres lentes distintas intentando **refutar** cada propuesta:
1. **Hechos** — ¿toda cifra está en `hechos.json` o en la investigación?
2. **Universalidad** — ¿pide algún dato, foto o logo del colegio? ¿promete algo exclusivo de
   PLUS sin decirlo?
3. **Cabida** — ¿entra en 1280×720 con la retícula existente, sin desbordar?

Sobrevive lo que pasa 2 de 3.

### Fase 5 · Síntesis — *1 agente · Opus*
Consolida en un solo documento de implementación, ordenado por lámina, con las correcciones de
hecho primero y las mejoras visuales después.

### Sobre el tamaño

El plan completo son **~40 agentes**, por encima del límite de esta sesión (*medium*, 15).
Dos caminos:

- **Subir el tamaño** en `/config` → «Dynamic workflow size», y correrlo de una vez.
- **Correrlo por bloques narrativos** (A, B, C, D, E, F+G): siete tandas de 5–8 agentes que
  caben sin tocar la configuración, y permiten revisar entre una y otra. **Es lo que
  recomiendo**: el bloque D es el corazón del deck y conviene mirarlo con calma antes de
  seguir.

En cualquier caso hace falta que lo pidas explícitamente —«usa un workflow»— porque un
`Workflow` levanta decenas de agentes y eso no se infiere.

---

## 8 · La capa de animación — **aplicada**

El problema de partida: el movimiento ambiental existía **solo en la lámina 1 y en la 22**.
Las veinte de en medio se proyectaban completamente quietas. Ahora las doce ideas están
repartidas por todo el embudo, y cada una cae donde significa algo.

| # | Idea | Dónde quedó | Por qué ahí |
|---|---|---|---|
| **1** | Ondas de Assistant | **3**, **13**, **21** | Las tres láminas donde alguien escucha: la sala que contesta, el diagnóstico socioemocional y el canal de dudas |
| **2** | Pulsaciones Material | **global**, en cada avance | Desde el punto del clic; con teclado, desde el canto hacia el que se avanza |
| **3** | Partículas conectadas | **1**, **7**, **20** | Portada, competencias —donde la red *es* el argumento— y presencia internacional |
| **4** | Barrido de colores | **al cambiar de bloque** | Seis barridos en 22 láminas: puntúa la estructura del argumento, no cada avance |
| **5** | Spinner evolutivo | **2** (el `16`) | La cifra más «de Google» y la única lo bastante estrecha para que un aro la rodee sin cruzarla |
| **6** | Geometría flotante con paralaje | **6**, **8** | Las dos láminas con más aire; las formas van por los márgenes, nunca tras el texto |
| **7 · 9** | Trazos de pizarra y subrayado mágico | **9**, y el sistema listo para el resto | SVG con `pathLength`, se redibuja en cada visita sin una línea de JS |
| **8** | Flechas dinámicas | **5**, **18** | Ya existían y se conservan. La de la 3 se retiró: apuntaba a una tarjeta que se mudó |
| **10** | Círculo de foco | **20** (el `190 M`) | La cifra es muy ancha para un aro; la elipse trazada sí se estira con ella |
| **11** | Barra de progreso multicolor | **global** | El hilo de los cuatro colores corre bajo los segmentos por bloque que ya existían |
| **12** | Píldoras de autocompletado | **3** | Los oficios desaparecidos entran uno a uno, y van tachados |

Y en todas las láminas de contenido, los **28 círculos de fondo derivan** muy despacio
(`.mv-flota`, 16 s por ciclo, retardos desincronizados). Es el cambio que más se nota, porque
ocurre justo donde no había nada.

### Cómo se sostiene

- **La paleta obligatoria** vive en cuatro tokens — `--g-azul #4285F4`, `--g-rojo #EA4335`,
  `--g-amar #FBBC05`, `--g-verd #34A853` — y de ahí sale todo.
- **La regla del estado base.** Lo que debe llegar al PDF (subrayados, círculos, píldoras)
  tiene como base su forma **terminada** y se anima desde el estado vacío: apagar la animación
  deja la marca puesta. Lo que solo existe en movimiento (barrido, ondas, spinner) tiene como
  base **invisible**: apagarlo lo borra, en vez de dejar una barra de color cruzando la hoja.
- **Las cifras no se animan nunca.** El spinner y el círculo de foco entran y salen *alrededor*
  del número; no le tocan tamaño, opacidad ni posición.
- **Verificado**: 22 láminas sin desbordes ni recortes, cero errores de consola, impresión con
  las 22 páginas y ninguna transparente, «reducir movimiento» con todo quieto y visible, y las
  ondas se retiran solas del DOM.

---

## 7 · Orden de ejecución sugerido

1. **Correcciones de hecho** (§3) — son errores, no mejoras. Van solas y primero.
2. **Barrido de vocabulario** (§2.1) — mecánico, de bajo riesgo, y toca casi todas las láminas.
3. **Decisión sobre las notas del presentador** (§2.2) — bloquea el rediseño de la 3.
4. **Decisión sobre logotipos** (§2.4) — bloquea las láminas 2, 7, 11+12, 13, 17, 18.
5. **Investigación** (§5) — bloquea la 7, y conviene lanzarla en paralelo a lo anterior.
6. **Fusión 11+12** y láminas nuevas (§4 bis).
7. **Rediseño lámina por lámina**, por bloques narrativos.

Los puntos 3 y 4 son **decisiones tuyas**, no hallazgos: conviene cerrarlas antes de empezar
el próximo chat, porque de ellas depende buena parte del rediseño.
