# Estructura del repositorio

Este repositorio guarda **todas las páginas web de activa**. Está armado con una sola regla:

> Cada página vive completa dentro de su propia carpeta. Lo que se comparte entre varias
> páginas —o se podría compartir con una futura— vive en `compartidos/`.

---

## El árbol

```text
Presentacion-activa/
├── index.html                    Portal: el índice que lleva a todas las páginas
│
├── paginas/                      ← UNA CARPETA POR PÁGINA
│   ├── kit-comercial/            Lámina de accesos del equipo comercial
│   │   ├── index.html            La página
│   │   ├── assets.js             Sus datos (generado, no editar a mano)
│   │   ├── og.png                Su vista previa de WhatsApp
│   │   ├── og-source.html        El molde de esa vista previa
│   │   └── README.md             Cómo se edita y cómo se regenera
│   ├── upgrade-edu/              Deck comercial de 34 diapositivas
│   │   ├── index.html
│   │   ├── og.png
│   │   └── README.md
│   ├── padres-de-familia/        Deck de 17 diapositivas para juntas con familias
│   │   ├── index.html
│   │   └── README.md
│   ├── cotizador/                Herramienta para armar la propuesta
│   │   ├── index.html
│   │   ├── og.png
│   │   └── README.md
│   ├── arrendamiento/            Cotizador de arrendamiento de equipo Chromebook
│   │   ├── index.html
│   │   ├── og.png                Su vista previa de WhatsApp (generada)
│   │   ├── og-source.html        El molde de esa vista previa
│   │   └── README.md
│   ├── compra/                   Cotizador de compra directa, de catálogo abierto
│   │   ├── index.html
│   │   ├── og.png                Su vista previa de WhatsApp (generada)
│   │   ├── og-source.html        El molde de esa vista previa
│   │   └── README.md
│   └── precios/                  Tres láminas: paquetes, precio por alumno y desglose
│       ├── index.html
│       ├── og.png                Su vista previa de WhatsApp (generada)
│       ├── og-source.html        El molde de esa vista previa
│       └── README.md
│
├── compartidos/                  ← LO QUE USA MÁS DE UNA PÁGINA
│   ├── css/motion.css            Clases mo-* de movimiento. Sin colores.
│   ├── js/archivo-drive.js       El archivo de cotizaciones en Drive: el bloque
│   │                             «Guardar en el archivo» de los TRES cotizadores.
│   │                             Diseño y puente en docs/drive-PDF/.
│   ├── js/motion.js              EL MOTOR de animación. Lo usan las 4 páginas.
│   ├── js/motion-lottie.js       Opcional: Lottie diferido. Hoy no lo carga nadie.
│   ├── js/motion-particles.js    Opcional: campo de partículas 3D
│   ├── js/precios-ciclo.js       LOS PRECIOS del ciclo y su aritmética. Los usan
│   │                             precios/ y la lámina 33 de upgrade-edu/.
│   ├── lottie/pulse.json         Animación Lottie
│   └── img/
│       ├── marcas/               18 logos de marca y de marcos curriculares (.webp)
│       └── fotos-vendedores/     Retratos originales del equipo
│
├── docs/                         ← TEXTO, NO CÓDIGO (una excepción; ver abajo)
│   ├── portafolio-activa.md      Documento maestro de producto (fuente de verdad)
│   ├── descripcion-de-productos/ Catálogo y guiones de video
│   ├── drive-PDF/                El archivo de cotizaciones en Drive: plan,
│   │                             encargo y la copia del puente (.gs)
│   ├── actualizacion-cotizador/  La cotización a la medida del cotizador
│   │                             Upgrade Edu: plan y encargo. Sin construir.
│   ├── matriz-precios/           Una sola fuente de verdad de precios en los
│   │                             tres cotizadores: plan y encargo. Implementada
│   │                             el 22-ago-2026.
│   ├── normativa-motion.md       Cómo se anima cualquier página. OBLIGATORIA.
│   └── estructura.md             Este archivo
│
└── .nojekyll                     Para que GitHub Pages no procese con Jekyll
```

**Nada de esto se compila.** Todo el repositorio es HTML, CSS y JavaScript que el navegador lee
tal cual: lo que está aquí es exactamente lo que se publica. No hay build, ni CI, ni
`node_modules`.

La única excepción a «todo corre en el navegador» es `docs/drive-PDF/archivo-drive.gs`: el
puente que escribe las cotizaciones en Google Drive corre **en los servidores de Google**
(pegado y desplegado en `script.google.com`), no aquí y no en el navegador. La copia del
repositorio es texto inerte —no se ejecuta ni se enlaza desde ninguna página— y existe solo
para tener historial de qué cambió y por qué. El [`README` de esa carpeta](drive-PDF/README.md)
lo explica completo.

---

## Qué va en `compartidos/` y qué no

| Va en `compartidos/` | Va dentro de la carpeta de la página |
|---|---|
| El motor de movimiento y sus clases `mo-*` | Su paleta y todo su CSS |
| Logos de marca y retratos originales | Su `og.png` y el molde que lo genera |
| Animaciones e iconos reutilizables | Sus datos embebidos (`assets.js`, base64) |
| Utilidades JS que valdrían para otra página | Su `README.md` |

Regla práctica: si al borrar una página el archivo dejaría de servirle a nadie, ese archivo
era de la página. Si le seguiría sirviendo a otra, es compartido.

**No hay hoja de estilos compartida.** Cada página trae su paleta en su propio `:root`. Hubo un
`compartidos/css/main.css`, pero era el sistema de diseño de la página motion-system y al
retirarla se quedó sin consumidores; se borró. Lo único compartido en presentación es
`motion.css`, que a propósito **no lleva un solo color** para no pelearse con ninguna paleta.

## Nada de esto se indexa

Las ocho páginas llevan `<meta name="robots" content="noindex">`. No es paranoia: el cotizador
y la página de precios tienen el precio por alumno y los descuentos —el cotizador, además, los
datos bancarios de la empresa—, los cotizadores de arrendamiento y de compra directa llevan su
catálogo de costos y la tasa dentro del código, y los decks llevan la propuesta completa de un
colegio concreto. Todo se abre desde el kit o se manda por enlace; nada se busca.

**No sirve poner un `robots.txt` en este repositorio.** El sitio se publica en
`sanoapro.github.io/activa/`, y el estándar solo lee ese archivo en la raíz del dominio
—`sanoapro.github.io/robots.txt`—, que pertenece a otro repositorio. Uno puesto aquí sería
ignorado y, peor, daría falsa tranquilidad. El bloqueo real lo hace la etiqueta de cada página.
Si algún día se quiere además cortar el rastreo, la regla hay que ponerla en el repositorio del
sitio de usuario.

**Ojo con las imágenes de `compartidos/img/`.** Hoy son *material de origen*: el deck y el kit
llevan las imágenes en base64 dentro del propio HTML, para abrir sin servidor. No se borran —
son la fuente de la que se regeneran esos base64.

---

## Cómo agregar una página nueva

1. Crear `paginas/<nombre-en-kebab-case>/` y poner ahí su `index.html`.
2. Todo lo propio de esa página, en esa carpeta. Lo que quiera reutilizar, apuntando a
   `../../compartidos/…`.
3. Escribir su `README.md`: qué es, cómo se edita, y cómo se regenera lo que sea generado.
   Y **leer [`normativa-motion.md`](normativa-motion.md) antes de animarla**: el motor es
   compartido y las reglas son obligatorias.
4. Dar de alta la tarjeta en el portal `index.html` de la raíz (se copia un `<a class="card">`).
5. Ponerle `<meta name="robots" content="noindex">`. Todas lo llevan; ver «Nada de esto se
   indexa», más arriba.
6. Si la página lleva vista previa de WhatsApp, sus etiquetas `og:` van con **URL absoluta** —
   WhatsApp no lee rutas relativas ni `data:` URI— y el `og.png` vive **en su propia carpeta**,
   no en `compartidos/`.
7. Si conviene, agregarla también al kit comercial (`paginas/kit-comercial/index.html`, listas
   `VENTA` e `INTERNA`).

---

## URLs publicadas

El sitio se sirve desde la rama `main` tal cual, así que **la ruta del repositorio es la URL**:

| Página | URL |
|---|---|
| Portal | <https://sanoapro.github.io/activa/> |
| Kit comercial | <https://sanoapro.github.io/activa/paginas/kit-comercial/> |
| upgrade edu | <https://sanoapro.github.io/activa/paginas/upgrade-edu/> |
| Padres de familia | <https://sanoapro.github.io/activa/paginas/padres-de-familia/> |
| Cotizador | <https://sanoapro.github.io/activa/paginas/cotizador/> |
| Arrendamiento | <https://sanoapro.github.io/activa/paginas/arrendamiento/> |
| Compra directa | <https://sanoapro.github.io/activa/paginas/compra/> |
| Precios | <https://sanoapro.github.io/activa/paginas/precios/> |

Al mover una página hay que revisar tres lugares: sus propias etiquetas `og:`, las tarjetas del
portal, y las listas del kit comercial.
