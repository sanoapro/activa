# Compartidos

Lo que usa **más de una página**, o que podría usar una futura. Nada de esto pertenece a una
página en concreto: si algo solo le sirve a una, va dentro de su carpeta en `paginas/`.

| Carpeta | Qué hay |
|---|---|
| `css/main.css` | Sistema de diseño: tokens de color, tema claro/oscuro, tipografías, retícula. |
| `css/motion.css` | Las clases `mo-*` de movimiento. **Sin un solo color**: solo opacidad, transform y tiempos. |
| `js/motion.js` | **El motor de animación.** Lo cargan las cuatro páginas. Script clásico, expone el global `Motion`. |
| `js/motion-lottie.js` | Opcional. Lottie diferido con respaldo CSS si el CDN no responde. |
| `js/motion-particles.js` | Opcional. Campo de partículas 3D en Canvas, con colores configurables. |
| `lottie/` | Animaciones Lottie (`.json`). |
| `img/marcas/` | 18 logos de marca y de marcos curriculares, en `.webp`. |
| `img/fotos-vendedores/` | Retratos originales del equipo comercial. |

## Las imágenes son material de origen

Ojo con `img/`: hoy **ninguna página la carga en tiempo de ejecución**. El deck de upgrade edu y
el kit comercial llevan sus imágenes en base64 dentro del propio HTML, para poder abrirse sin
servidor y mandarse por correo.

Estos archivos son la **fuente** de esos base64. No se borran: sin ellos no hay de dónde
regenerar. Cada página documenta en su `README.md` cómo se regeneran los suyos.

## El movimiento es normativo

Antes de animar cualquier página hay que leer [`docs/normativa-motion.md`](../docs/normativa-motion.md).
Fija cuatro reglas, el catálogo de técnicas con su fragmento de código, las prohibiciones y la
lista de revisión previa a publicar. La cuarta regla es la que evita catástrofes: **nada se oculta
hasta que el motor confirma que corrió**, así que si `motion.js` no carga, la página se ve
completa y quieta en lugar de quedarse en blanco.

`motion.js` es un **script clásico y no un módulo ES** a propósito: los módulos no cargan desde
`file://` y el deck y el kit se abren con doble clic.

## Cómo se usa desde una página

Las páginas viven a dos niveles de profundidad, así que la ruta relativa es siempre la misma:

```html
<link rel="stylesheet" href="../../compartidos/css/main.css">
```

Si se agrega algo acá, conviene anotarlo en la tabla de arriba y en
[`docs/estructura.md`](../docs/estructura.md).
