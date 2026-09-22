# Uso seguro y responsable de la tecnología

Página de lectura —no deck— que explica el acuerdo nacional que restringe los celulares en las
escuelas a partir del **3 de noviembre de 2026**, y por qué un modelo con equipos institucionales
administrados está alineado con sus objetivos. Va dirigida a madres, padres **y** directivos, y
está firmada por *activa*, sin nombre de colegio: se comparte tal cual con cualquier institución.

Se publica en <https://sanoapro.github.io/activa/paginas/uso-responsable/>. Depende de
`../../compartidos/` para el motor de movimiento y los tres logotipos (activa, Google for
Education Partner y Securly).

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página completa: CSS, contenido y el script de movimiento |
| `og.png` | Su vista previa de WhatsApp (generada) |
| `og-source.html` | El molde de esa vista previa |

## De dónde sale el contenido — y qué NO dice

Nació de una carta a padres de familia. Se reescribió y se amplió para directivos, y cada dato se
comprobó contra la cobertura del anuncio del 21-sep-2026 (las fuentes están enlazadas al pie de la
página). Tres decisiones que no hay que deshacer:

- **Tono prudente, a propósito.** El acuerdo habla de «celulares y pantallas», y el secretario
  de Educación dijo «celulares y tabletas». El texto oficial en el DOF todavía no se publica, así
  que **nadie puede afirmar hoy que un equipo escolar «cumple estrictamente la ley»**. La página
  dice que el modelo está *alineado con los objetivos* del acuerdo y lleva una nota visible de
  vigencia. Si alguien endurece esa frase, la página queda expuesta en público con el logo de la
  casa.
- **Solo citas verificadas, con su fuente.** Van dos: la de la presidenta («recuperar la
  creatividad…») y la del secretario («…celulares y tabletas…»). La carta original traía una
  tercera —«lo pueden tener guardado en la mochila, pero ni en las clases ni en el recreo…»— que
  no aparece literal en ninguna fuente consultada: aquí va como paráfrasis, **sin comillas**.
- **Fuera los marcadores `[cite: …]` y `[Nombre del Colegio]`** del texto de origen.

**Cuando el acuerdo salga en el DOF**, hay que revisar la nota de vigencia, la pregunta frecuente
«¿Qué pasa con la Chromebook?» y la fecha de «Actualizado el…» del hero.

## Cómo está armada

| Sección | Qué lleva |
| --- | --- |
| Hero | Titular con subrayado a mano, tres datos del acuerdo en tarjetas |
| 1 · El acuerdo | Las dos citas, qué cambia en cada nivel, excepciones, calendario, la consulta docente |
| 2 · Nuestra postura | Prosa corta y una **tesis** |
| 3 · La diferencia | Comparación celular personal vs. Chromebook institucional, seis filas |
| 4 · Garantías | Las cuatro garantías del modelo, con el logo de Securly |
| 5 · Directivos | Seis controles que da la consola + cuatro pasos para la asamblea informativa |
| 6 · Familias | Seis preguntas frecuentes, en tarjetas (no desplegables: tienen que imprimirse) |
| Conclusión · Fuentes | Banda final, nota de vigencia y las seis fuentes enlazadas |

### Tres componentes que solo existen aquí

- **`.cita`** — lo que dijo una autoridad. Es lo único de la página con comillas grandes,
  cursiva y el filete de los cuatro colores de Google; debajo, nombre, cargo, fecha y enlace a la
  fuente. Semánticamente es `<figure><blockquote>…</blockquote><figcaption>`.
- **`.tesis`** — lo que decimos *nosotros*. Grande, pero **sin comillas ni cursiva**: una barra
  sólida del color de la sección. Si una tesis se viera como cita, el lector atribuiría a la SEP
  lo que es una postura de la casa.
- **`mark.hl`** — la palabra resaltada: un marcatextos translúcido por debajo de la línea, en el
  color de la sección. No cambia el color del texto, así que se lee igual impreso en blanco y negro.

## Movimiento

Capas 1 a 3 de [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md): revelado al
bajar (`.mo-reveal`), cascada en las rejillas (≤ 6 hijos), barra de avance de lectura y el
subrayado a mano del titular. **Las cifras no se animan.**

El chip activo del índice **no usa `Motion.sectionSpy`**: con un umbral de visibilidad marcaba la
sección *siguiente* en cuanto asomaba, y la tabla comparativa se leía con «Garantías» encendido.
Se calcula en `Motion.onFrame` —la última sección cuyo inicio cruzó el 30 % de la pantalla— y
solo toca el DOM cuando cambia.

Los círculos de fondo del hero se asoman por la derecha: `.hero` lleva `overflow:hidden` porque
el `overflow-x` de `<body>` **no** evita el scroll horizontal del documento.

## Verificado

Sin JS (quitando `mo-ready`) no queda nada en `opacity:0` · a 390 px no hay scroll horizontal y
la comparación se apila fila por fila · al imprimir se ocultan cabecera e índice y las tarjetas no
se parten · consola sin errores ni 404.

## Cómo se regenera la vista previa de WhatsApp

Desde la raíz del repositorio, con rutas de Windows (Edge headless no resuelve las de Git Bash):

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/uso-responsable/og.png \
  paginas/uso-responsable/og-source.html
```

WhatsApp cachea la vista previa por URL: tras regenerarla, compartir el enlace con `?v=2`.
