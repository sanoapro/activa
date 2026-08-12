# Motion System

Landing que explica y **ejecuta en vivo** el plan de integración de animación, en cinco capas:
microinteracciones, animaciones de entrada, movimiento con scroll, interacción con el cursor y
media enriquecida (Lottie y Canvas).

Se publica en **https://sanoapro.github.io/activa/paginas/motion-system/**

Es la única página del repositorio que se compila: está escrita en F# y transpilada a módulos ES
nativos con Fable.

## Archivos

| Ruta | Qué es |
|---|---|
| `index.html` | Punto de montaje. Un `<div id="app">` y nada más: el documento se construye desde F#. |
| `src/` | Código fuente F# ← **aquí se edita** |
| `scripts/` | Salida de Fable ← **NO editar a mano**, pero sí se versiona |

Dentro de `src/`, en el orden en que compila (el orden importa, lo fija `Presentacion.fsproj`):

| Archivo | Qué es |
|---|---|
| `Dsl.fs` | DSL de construcción de DOM |
| `Data.fs` | **Todo el contenido de la página, como datos** |
| `Motion.fs` | Motor de animación (un solo bucle `requestAnimationFrame`) |
| `Particles.fs` | Campo de partículas 3D sobre Canvas |
| `Lottie.fs` | Carga diferida de Lottie con respaldo CSS |
| `Demos.fs` | Los cinco demos vivos |
| `App.fs` | Composición de la página |

## Compilar

Necesita el **SDK de .NET 8** una sola vez. No hace falta Node ni bundler. Se corre desde la raíz
del repositorio:

```bash
dotnet tool restore                    # instala Fable 4.24.0
dotnet fable paginas/motion-system/src --outDir paginas/motion-system/scripts --lang javascript
```

Durante desarrollo, recompilación automática al guardar:

```bash
dotnet fable watch paginas/motion-system/src --outDir paginas/motion-system/scripts --lang javascript
```

`scripts/` se versiona a propósito: así el repositorio se publica sin CI. **Si se cambia algo en
`src/`, hay que compilar en local y hacer commit de la salida.**

## Ver en local

Los módulos ES exigen `http://`, no `file://`. Desde la raíz del repositorio:

```bash
python -m http.server 8123
# abrir http://127.0.0.1:8123/paginas/motion-system/
```

## Cómo editar el contenido

Casi todo el texto vive en `src/Data.fs`, como datos. Para cambiar una categoría, un argumento de
venta o una objeción, se edita ese archivo y se recompila; el HTML se regenera solo. Agregar una
sexta categoría es agregar un registro a la lista `categorias`, no escribir marcado.

## Recursos compartidos

Esta página **no** guarda assets propios: los toma de `compartidos/`.

| Recurso | Ruta |
|---|---|
| Sistema de diseño | [`compartidos/css/main.css`](../../compartidos/css/main.css) |
| Animación Lottie | [`compartidos/lottie/pulse.json`](../../compartidos/lottie/) |

Los iconos son rutas SVG en línea dentro de `src/Data.fs`; no hay fuente de iconos ni imagen
rasterizada que pueda faltar.

## Degradaciones controladas

| Recurso | Origen | Si no hay red |
|---|---|---|
| Tipografías Sora / Inter Tight / IBM Plex Mono | Google Fonts | Cae a Segoe UI y a la pila del sistema. |
| Reproductor `lottie-web` | cdnjs | Cae a una animación CSS equivalente. |

Sin JavaScript hay un `<noscript>` que explica de qué va la página.
