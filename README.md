# Presentacion-activa

Paquete web autocontenido para el equipo comercial de **activa**, listo para GitHub Pages.

Contiene dos piezas y un documento maestro:

| Pieza | Ruta | Qué es |
|---|---|---|
| **Motion System** | `index.html` | Landing interactiva que explica y **ejecuta en vivo** el plan de integración de animación. Construida con F# + Fable. |
| **upgrade edu 2026–2027** | `upgrade-edu/index.html` | Deck de 28 diapositivas del programa comercial, estilo Google for Education. Autocontenido, no requiere compilar nada. Publicado en **/activa/upgrade-edu/**. |
| **Portafolio de servicios** | `docs/portafolio-activa.md` | Documento maestro de referencia. **Fuente única y vigente** de la información de producto. |

---

## Estructura

```
Presentacion-activa/
├── index.html                      Punto de montaje del Motion System
├── upgrade-edu/index.html          Deck comercial (abre directo, sin build)
├── styles/main.css                 Sistema de diseño: tokens, tema claro/oscuro, retícula
├── scripts/                        Salida JavaScript que genera Fable  ← NO editar a mano
├── src/                            Código fuente F#  ← aquí se edita
│   ├── Dsl.fs                      DSL de construcción de DOM
│   ├── Data.fs                     TODO el contenido del deck, como datos
│   ├── Motion.fs                   Motor de animación (un solo bucle rAF)
│   ├── Particles.fs                Campo de partículas 3D sobre Canvas
│   ├── Lottie.fs                   Carga diferida de Lottie con respaldo CSS
│   ├── Demos.fs                    Los cinco demos vivos
│   └── App.fs                      Composición de la página
├── assets/
│   ├── img/                        18 logos de marca y de marcos curriculares (.webp)
│   └── lottie/pulse.json           Animación Lottie de ejemplo
├── docs/portafolio-activa.md       Documento maestro de producto
└── .github/workflows/deploy.yml    Compila y publica en GitHub Pages
```

---

## Requisitos y compilación

Se necesita el **SDK de .NET 8** una sola vez. No hace falta Node ni ningún bundler: Fable emite
módulos ES nativos que el navegador carga tal cual.

```bash
cd Presentacion-activa
dotnet tool restore                              # instala Fable 4.24.0
dotnet fable src --outDir scripts --lang javascript
```

Para ver el sitio en local (los módulos ES exigen `http://`, no `file://`):

```bash
python -m http.server 8123
# abrir http://127.0.0.1:8123/
```

Durante desarrollo, recompilación automática al guardar:

```bash
dotnet fable watch src --outDir scripts --lang javascript
```

---

## Publicar en GitHub Pages

**Opción A — automática (recomendada).** El workflow `.github/workflows/deploy.yml` instala el SDK,
compila Fable y publica. En el repositorio: *Settings → Pages → Source: GitHub Actions*. Cada push a
`main` republica.

**Opción B — sin CI.** La carpeta `scripts/` ya viene compilada y versionada, así que basta con
publicar la rama: *Settings → Pages → Source: Deploy from a branch → main / (root)*.

El archivo `.nojekyll` está incluido para que GitHub no procese la carpeta con Jekyll.

---

## Dependencias externas

El paquete funciona **sin conexión**, con dos degradaciones controladas:

| Recurso | Origen | Si no hay red |
|---|---|---|
| Tipografías Sora / Inter Tight / IBM Plex Mono | Google Fonts | Cae a Segoe UI y a la pila del sistema. El diseño se mantiene. |
| Reproductor `lottie-web` | cdnjs | El contenedor cae a una animación CSS equivalente y la sección sigue explicándose. |

Todo lo demás —iconos, logos, la animación Lottie, el motor de animación y el campo de partículas—
es local. Los iconos son rutas SVG en línea dentro de `src/Data.fs`; no hay ningún archivo de fuente
de iconos ni imagen rasterizada que pueda faltar.

Si se necesita independencia total de la red, hay que autoalojar las tipografías y `lottie-web`.

---

## Cómo editar el contenido

Casi todo el texto del Motion System vive en `src/Data.fs`, como datos. Para cambiar una categoría,
un argumento de venta o una objeción, se edita ese archivo y se recompila; el HTML se regenera solo.

Agregar una sexta categoría es agregar un registro a la lista `categorias`, no escribir marcado.

---

## Atajos de la presentación comercial

`upgrade-edu/index.html` se abre con doble clic, sin servidor:

- `←` `→` navegar · `O` vista panorámica · `F` pantalla completa · `P` imprimir a PDF en 16:9

---

## Nota sobre material anterior

La presentación `activa - upgrade edu presentación.pptx` (112 MB) **quedó sustituida** por
`docs/portafolio-activa.md` y por el deck HTML. No se incluye en este repositorio por dos razones:
supera el límite de 100 MB por archivo de GitHub, y su contenido ya está consolidado y actualizado
en el documento maestro. Consérvela fuera del repositorio como respaldo histórico.
