# Compartidos

Lo que usa **más de una página**, o que podría usar una futura. Nada de esto pertenece a una
página en concreto: si algo solo le sirve a una, va dentro de su carpeta en `paginas/`.

| Carpeta | Qué hay |
|---|---|
| `css/motion.css` | Las clases `mo-*` de movimiento. **Sin un solo color**: solo opacidad, transform y tiempos. |
| `js/motion.js` | **El motor de animación.** Script clásico, expone el global `Motion`. |
| `js/motion-lottie.js` | Opcional. Lottie diferido con respaldo CSS si el CDN no responde. **Hoy no lo carga nadie**: es capacidad lista para la próxima página que quiera una animación vectorial. |
| `js/motion-particles.js` | Opcional. Campo de partículas 3D en Canvas, con colores configurables: dos tonos que se mezclan por profundidad, o una `paleta` de colores fijos —así es como el deck pinta su red en los cuatro de Google—. |
| `js/precios-ciclo.js` | **Los precios del ciclo y su aritmética.** Expone el global `PreciosCiclo`. Lo cargan [`paginas/precios/`](../paginas/precios/) y la lámina del desglose del [deck de upgrade edu](../paginas/upgrade-edu/). **No es opcional**: quien lo pierda se queda sin números. |
| `lottie/` | Animaciones Lottie (`.json`). |
| `img/marcas/` | 18 logos de marca y de marcos curriculares, en `.webp`. |
| `img/fotos-vendedores/` | Retratos originales del equipo comercial. |
| `img/fotos-generales/` | Seis fotografías genéricas —dos salones, una niña estudiando, una huella digital, un maestro, un cuaderno— en `.webp` y en `.avif`. Las carga [el deck de padres de familia](../paginas/padres-de-familia/) por ruta relativa. |

## Las imágenes: material de origen, y desde agosto de 2026 también material servido

Conviven dos formas de consumir `img/`, y la diferencia no es descuido:

- **En base64, dentro del HTML.** Así lo hacen el deck de upgrade edu, el kit comercial y los
  cotizadores, porque son documentos que se mandan **por correo como un archivo suelto** y
  tienen que abrir en la máquina de quien los reciba. Para ellos, estos archivos son la
  **fuente** de esos base64.
- **Por ruta relativa, en tiempo de ejecución.** Así lo hace [el deck de padres de
  familia](../paginas/padres-de-familia/) con seis fotografías y nueve logotipos. Puede
  permitírselo porque ese deck **ya viaja como carpeta**: depende de `css/motion.css` y de
  `js/motion.js` por ruta relativa desde antes. Embeber 750 KB para proteger una portabilidad
  que esa página ya no ofrecía habría sido el peor de los dos tratos, y además deja los
  `diff` de git ilegibles.

La regla, entonces: **si la página se manda como archivo, base64; si viaja como carpeta, ruta
relativa.**

Estos archivos no se borran nunca: sin ellos no hay de dónde regenerar los base64, y ahora
además hay una página que los sirve directamente. Cada página documenta en su `README.md`
cómo se regeneran los suyos.

**Los nombres son ASCII en kebab-case, sin espacios ni acentos**, y conviene que siga así:
en cuanto un archivo se sirve por URL, un `salón antiguo.png` obliga a percent-encoding
(`sal%C3%B3n%20antiguo.png`) que se rompe con solo mirarlo.

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
<link rel="stylesheet" href="../../compartidos/css/motion.css">
<script src="../../compartidos/js/motion.js"></script>
```

Si se agrega algo acá, conviene anotarlo en la tabla de arriba y en
[`docs/estructura.md`](../docs/estructura.md).

## No hay hoja de estilos compartida, y es a propósito

Aquí vivía `css/main.css`: tokens de color, tema claro/oscuro, retícula y los estilos de los
cinco demos del Motion System. Era el sistema de diseño de esa página, y al retirarla se quedó
sin un solo consumidor. Se borró.

Cada página nace con su propia paleta en su `:root` —el deck es Google, el kit es pastel, el
cotizador es sobrio, la de padres hereda la del deck— y eso **no es deuda**: es lo que permite
que cada una se abra sin servidor y viaje sola. Lo único que se comparte es el movimiento, que
justamente no lleva color para no pelearse con ninguna paleta.

Si algún día dos páginas necesitan de verdad los mismos tokens, se crea entonces, con solo lo
que ambas usen.
