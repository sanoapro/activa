# Estructura del repositorio

Este repositorio guarda **todas las páginas web de activa**. Está armado con una sola regla:

> Cada página vive completa dentro de su propia carpeta. Lo que se comparte entre varias
> páginas —o se podría compartir con una futura— vive en `compartidos/`.

---

## El árbol

```
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
│   ├── upgrade-edu/              Deck comercial de 28 diapositivas
│   │   ├── index.html
│   │   ├── og.png
│   │   └── README.md
│   └── motion-system/            Demostración de animación
│       ├── index.html            Punto de montaje
│       ├── js/                   Sus 7 módulos ES  ← aquí se edita
│       └── README.md
│
├── compartidos/                  ← LO QUE USA MÁS DE UNA PÁGINA
│   ├── css/main.css              Sistema de diseño: tokens, tema claro/oscuro, retícula
│   ├── js/                       Módulos JS reutilizables (todavía vacío)
│   ├── lottie/pulse.json         Animación Lottie
│   └── img/
│       ├── marcas/               18 logos de marca y de marcos curriculares (.webp)
│       └── fotos-vendedores/     Retratos originales del equipo
│
├── docs/                         ← TEXTO, NO CÓDIGO
│   ├── portafolio-activa.md      Documento maestro de producto (fuente de verdad)
│   ├── descripcion-de-productos/ Catálogo y guiones de video
│   └── estructura.md             Este archivo
│
└── .nojekyll                     Para que GitHub Pages no procese con Jekyll
```

**Nada de esto se compila.** Todo el repositorio es HTML, CSS y JavaScript que el navegador lee
tal cual: lo que está aquí es exactamente lo que se publica. No hay build, ni CI, ni
`node_modules`.

---

## Qué va en `compartidos/` y qué no

| Va en `compartidos/` | Va dentro de la carpeta de la página |
|---|---|
| Tokens de diseño, tipografías, temas | CSS que solo tiene sentido en esa página |
| Logos de marca y retratos originales | Su `og.png` y el molde que lo genera |
| Animaciones e iconos reutilizables | Sus datos embebidos (`assets.js`, base64) |
| Utilidades JS que valdrían para otra página | Su `README.md` |

Regla práctica: si al borrar una página el archivo dejaría de servirle a nadie, ese archivo
era de la página. Si le seguiría sirviendo a otra, es compartido.

**Ojo con las imágenes de `compartidos/img/`.** Hoy son *material de origen*: el deck y el kit
llevan las imágenes en base64 dentro del propio HTML, para abrir sin servidor. No se borran —
son la fuente de la que se regeneran esos base64.

---

## Cómo agregar una página nueva

1. Crear `paginas/<nombre-en-kebab-case>/` y poner ahí su `index.html`.
2. Todo lo propio de esa página, en esa carpeta. Lo que quiera reutilizar, apuntando a
   `../../compartidos/…`.
3. Escribir su `README.md`: qué es, cómo se edita, y cómo se regenera lo que sea generado.
4. Dar de alta la tarjeta en el portal `index.html` de la raíz (se copia un `<a class="card">`).
5. Si la página lleva vista previa de WhatsApp, sus etiquetas `og:` van con **URL absoluta** —
   WhatsApp no lee rutas relativas ni `data:` URI.
6. Si conviene, agregarla también al kit comercial (`paginas/kit-comercial/index.html`, listas
   `VENTA` e `INTERNA`).

---

## URLs publicadas

El sitio se sirve desde la rama `main` tal cual, así que **la ruta del repositorio es la URL**:

| Página | URL |
|---|---|
| Portal | https://sanoapro.github.io/activa/ |
| Kit comercial | https://sanoapro.github.io/activa/paginas/kit-comercial/ |
| upgrade edu | https://sanoapro.github.io/activa/paginas/upgrade-edu/ |
| Motion System | https://sanoapro.github.io/activa/paginas/motion-system/ |

Al mover una página hay que revisar tres lugares: sus propias etiquetas `og:`, las tarjetas del
portal, y las listas del kit comercial.
