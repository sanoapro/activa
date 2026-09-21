# activa · páginas web

Repositorio de **todas las páginas web de activa**, Google for Education Partner. Se publica
completo en GitHub Pages: HTML, CSS y JavaScript tal cual, sin CI, sin bundler y sin ningún
paso de compilación.

**Portal:** <https://sanoapro.github.io/activa/>

| Página | URL | Qué es |
|---|---|---|
| **Kit comercial** | [/paginas/kit-comercial/](https://sanoapro.github.io/activa/paginas/kit-comercial/) | Una lámina con los accesos que el equipo comercial usa a diario. |
| **Cotizador 2026–2027** | [/paginas/cotizador/](https://sanoapro.github.io/activa/paginas/cotizador/) | Arma la propuesta del colegio: dispositivos, licenciamiento, capacitación y soporte. |
| **upgrade edu 2026–2027** | [/paginas/upgrade-edu/](https://sanoapro.github.io/activa/paginas/upgrade-edu/) | Deck de 28 diapositivas del programa comercial. Abre sin compilar nada. |
| **Padres de familia 2026–2027** | [/paginas/padres-de-familia/](https://sanoapro.github.io/activa/paginas/padres-de-familia/) | Deck de 22 diapositivas para las juntas con familias. Se lee igual en el proyector que en el teléfono de un padre. |
| **Arrendamiento** | [/paginas/arrendamiento/](https://sanoapro.github.io/activa/paginas/arrendamiento/) | Cotizador de Chromebooks en renta: mensualidad fija a 3 o 4 años. |
| **Compra directa** | [/paginas/compra/](https://sanoapro.github.io/activa/paginas/compra/) | Cotizador de catálogo abierto, por partida y con el IVA una sola vez, al final. |
| **G-Workspace** | [/paginas/g-workspace/](https://sanoapro.github.io/activa/paginas/g-workspace/) | Cotizador de licencias Google Workspace for Education: Education Plus o Teaching &amp; Learning, lado a lado. |
| **Precios 2026–2027** | [/paginas/precios/](https://sanoapro.github.io/activa/paginas/precios/) | Tres láminas: los paquetes, el precio por alumno y el desglose año por año. |
| **Consola de administración** | [/paginas/consola/](https://sanoapro.github.io/activa/paginas/consola/) | Manual de blindaje de la Google Admin Console: 18 partes y 438 ajustes con checklist. |
| **Proyecto Piloto** | [/paginas/piloto/](https://sanoapro.github.io/activa/paginas/piloto/) | Deck de 12 diapositivas: los seis pasos del piloto de cuatro semanas, qué pone cada quién y las condiciones. |

Documento maestro de producto —fuente única y vigente— en
[`docs/portafolio-activa.md`](docs/portafolio-activa.md).

---

## Cómo está organizado

Una carpeta por página en `paginas/`, y lo reutilizable en `compartidos/`:

```text
index.html        Portal (índice de páginas)
paginas/          Una carpeta por página, con TODO lo suyo dentro
compartidos/      css · js · img/marcas · img/fotos-vendedores · lottie
docs/             Documentos de producto y de referencia
```

La guía completa —qué va en `compartidos/`, cómo se agrega una página nueva, qué revisar al
cambiar una URL— está en **[`docs/estructura.md`](docs/estructura.md)**. Conviene leerla antes
de meter un proyecto nuevo.

---

## Ver el sitio en local

Todas las páginas abren con doble clic, incluso desde `file://`. Para probarlas como se publican:

```bash
python -m http.server 8123
# abrir http://127.0.0.1:8123/
```

---

## Nada que compilar

Ninguna página tiene paso de build. Se edita un archivo, se recarga el navegador y se ve el
cambio; lo que está en el repositorio es exactamente lo que se publica. Sin CI, sin bundler, sin
`node_modules`.

---

## Movimiento

Todas las páginas comparten un solo motor de animación, en
[`compartidos/js/motion.js`](compartidos/js/motion.js) y
[`compartidos/css/motion.css`](compartidos/css/motion.css): revelado al entrar en pantalla,
cascadas, parallax, efectos de cursor, Lottie diferido y campo de partículas.

**Antes de animar una página nueva hay que leer la
[normativa de movimiento](docs/normativa-motion.md).** Fija cuatro reglas —un solo bucle de
render, nada de leer geometría en eventos, respeto a «reducir movimiento», y que nada se oculte
hasta que el motor confirme que corrió—, el catálogo de técnicas con su fragmento de código, las
prohibiciones y la lista de revisión previa a publicar.

---

## Publicación

GitHub Pages sirve la rama `main` tal cual (*Settings → Pages → Source: Deploy from a branch →
main / (root)*). Cada push republica, sin GitHub Actions de por medio. El `.nojekyll` evita que
GitHub procese la carpeta con Jekyll.

---

## Dependencias externas

Todo funciona sin conexión, con dos degradaciones controladas:

| Recurso | Origen | Si no hay red |
|---|---|---|
| Tipografías Sora / Inter Tight / IBM Plex Mono | Google Fonts | Cae a Segoe UI y a la pila del sistema. El diseño se mantiene. |
| Reproductor `lottie-web` | cdnjs | Cae a una animación CSS equivalente y la sección sigue explicándose. |

Lo demás es local. Los iconos son rutas SVG en línea; no hay fuente de iconos que pueda faltar.
El deck y el kit llevan sus imágenes en base64 dentro del HTML, por eso abren desde `file://`.

---

## Nota sobre material anterior

La presentación `activa - upgrade edu presentación.pptx` (112 MB) **quedó sustituida** por
`docs/portafolio-activa.md` y por el deck HTML. No se incluye en el repositorio: supera el límite
de 100 MB por archivo de GitHub, y su contenido ya está consolidado y actualizado en el documento
maestro. Consérvela fuera del repositorio como respaldo histórico.
