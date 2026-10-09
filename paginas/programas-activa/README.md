# Los cinco programas de activa

Página **interna** del equipo comercial. Explica qué vende activa, a quién le habla y cómo presentar
impulsa, eleva, motiva, beta e integra: qué es cada uno, qué resuelve, a quién beneficia, cómo
funciona, en qué se distingue de la competencia, lo mínimo que hay que dominar, las preguntas del
director y lo que no se promete. Cierra con los ejes de dispositivos, licencias y acompañamiento, y
con los pendientes que producto tiene que confirmar.

Se publica en <https://sanoapro.github.io/activa/paginas/programas-activa/>.

## Interna, a propósito

- Nombra competidores y lo que no se promete: **no va en el portal ni en el kit comercial** y no se
  manda a colegios. Se comparte el enlace dentro del equipo.
- Lleva `noindex`, pero GitHub Pages es público: cualquiera con el enlace la abre.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Se edita a mano |
| `programas-activa-2026-2027.pdf` | La misma página impresa (generada). Se descarga desde la barra |
| `og.png` | Su vista previa de WhatsApp (generada) |
| `og-source.html` | El molde de esa vista previa |

## Cómo está armada

- **En pantalla** se ve como hojas tamaño Carta sobre fondo gris, con una barra fija de navegación.
  Por debajo de 880 px las hojas se vuelven página fluida (rejillas en una columna, tablas que se
  desplazan dentro de su caja).
- **Al imprimir** sale exactamente el PDF: 14 hojas. Cada programa ocupa dos; la segunda empieza en
  `.pag2`, que fuerza el salto. **Si agregas texto a una hoja, regenera el PDF y revisa que sigan
  siendo 14**: si un bloque no cabe, salta entero a la hoja siguiente y descuadra todo.
- Sin JavaScript. Las anclas de la barra son enlaces normales.

## Fuentes y reglas de contenido

- Producto: [`../../docs/portafolio-activa.md`](../../docs/portafolio-activa.md) y
  [`../../docs/descripcion-de-productos/`](../../docs/descripcion-de-productos/). Si un dato cambia
  allá, cambia aquí.
- Competencia: [`../comparativa-competidores/`](../comparativa-competidores/).
- **integra (9-oct-2026):** avisos por WhatsApp **sí** (probado con un colegio piloto); facturación
  CFDI y pagos en línea **todavía no**; becas no es parte de integra. Cualquier otra función se
  agrega solo cuando producto la confirme.
- Sin precios: viven solo en el cotizador.

## Cómo se regeneran el PDF y la vista previa

Desde la raíz del repositorio, con rutas de Windows:

```bash
msedge --headless=new --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=paginas/programas-activa/programas-activa-2026-2027.pdf \
  paginas/programas-activa/index.html

msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/programas-activa/og.png \
  paginas/programas-activa/og-source.html
```
