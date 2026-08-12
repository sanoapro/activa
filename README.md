# activa · páginas web

Repositorio de **todas las páginas web de activa**, Google for Education Partner. Se publica
completo en GitHub Pages, sin CI y sin bundler.

**Portal:** https://sanoapro.github.io/activa/

| Página | URL | Qué es |
|---|---|---|
| **Kit comercial** | [/paginas/kit-comercial/](https://sanoapro.github.io/activa/paginas/kit-comercial/) | Una lámina con los accesos que el equipo comercial usa a diario. |
| **Cotizador 2026–2027** | [/paginas/cotizador/](https://sanoapro.github.io/activa/paginas/cotizador/) | Arma la propuesta del colegio: dispositivos, licenciamiento, capacitación y soporte. |
| **upgrade edu 2026–2027** | [/paginas/upgrade-edu/](https://sanoapro.github.io/activa/paginas/upgrade-edu/) | Deck de 28 diapositivas del programa comercial. Abre sin compilar nada. |
| **Motion System** | [/paginas/motion-system/](https://sanoapro.github.io/activa/paginas/motion-system/) | Landing que explica y **ejecuta en vivo** el plan de animación. F# + Fable. |

Documento maestro de producto —fuente única y vigente— en
[`docs/portafolio-activa.md`](docs/portafolio-activa.md).

---

## Cómo está organizado

Una carpeta por página en `paginas/`, y lo reutilizable en `compartidos/`:

```
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

La mayoría de las páginas abren con doble clic. El Motion System usa módulos ES, que exigen
`http://`:

```bash
python -m http.server 8123
# abrir http://127.0.0.1:8123/
```

---

## Compilar el Motion System

Es la única página que se compila. Necesita el **SDK de .NET 8** una sola vez; no hace falta Node
ni bundler, Fable emite módulos ES nativos.

```bash
dotnet tool restore                    # instala Fable 4.24.0
dotnet fable paginas/motion-system/src --outDir paginas/motion-system/scripts --lang javascript
```

Recompilación automática al guardar: el mismo comando con `fable watch`.

La salida `paginas/motion-system/scripts/` **se versiona a propósito**: así el repositorio se
publica sin que nadie tenga que compilar. Si se cambia algo en `src/`, hay que compilar en local
y hacer commit de la salida.

Casi todo el texto de esa página vive en `src/Data.fs`, como datos: agregar una categoría es
agregar un registro a una lista, no escribir marcado.

---

## Publicación

GitHub Pages sirve la rama `main` tal cual (*Settings → Pages → Source: Deploy from a branch →
main / (root)*). Cada push republica. El `.nojekyll` evita que GitHub procese la carpeta con
Jekyll.

El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) **no publica**: solo
comprueba que el F# siga compilando.

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
