# Compartidos

Lo que usa **más de una página**, o que podría usar una futura. Nada de esto pertenece a una
página en concreto: si algo solo le sirve a una, va dentro de su carpeta en `paginas/`.

| Carpeta | Qué hay |
|---|---|
| `css/main.css` | Sistema de diseño: tokens de color, tema claro/oscuro, tipografías, retícula. |
| `js/` | Módulos JavaScript reutilizables. Todavía vacío. |
| `lottie/` | Animaciones Lottie (`.json`). |
| `img/marcas/` | 18 logos de marca y de marcos curriculares, en `.webp`. |
| `img/fotos-vendedores/` | Retratos originales del equipo comercial. |

## Las imágenes son material de origen

Ojo con `img/`: hoy **ninguna página la carga en tiempo de ejecución**. El deck de upgrade edu y
el kit comercial llevan sus imágenes en base64 dentro del propio HTML, para poder abrirse sin
servidor y mandarse por correo.

Estos archivos son la **fuente** de esos base64. No se borran: sin ellos no hay de dónde
regenerar. Cada página documenta en su `README.md` cómo se regeneran los suyos.

## Cómo se usa desde una página

Las páginas viven a dos niveles de profundidad, así que la ruta relativa es siempre la misma:

```html
<link rel="stylesheet" href="../../compartidos/css/main.css">
```

Si se agrega algo acá, conviene anotarlo en la tabla de arriba y en
[`docs/estructura.md`](../docs/estructura.md).
