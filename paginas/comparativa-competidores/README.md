# Comparativa de competidores

Página de lectura **interna** del equipo comercial. Compara upgrade edu con Knotion, Santillana
(UNOi y Compartir), AMCO, Luca, Grupo SM, inglés y certificación (Richmond, Pearson, Cambridge,
Oxford), EXA (Apple) y otros partners de Google, y dice cómo ganarle a cada uno. También trae dos
comparativas por producto: integra frente a sistemas de gestión escolar y motiva frente a
programas socioemocionales.

Se publica en <https://sanoapro.github.io/activa/paginas/comparativa-competidores/>.

## Interna, a propósito

- **No se enlaza desde el portal** (`index.html` de la raíz) **ni desde el kit comercial**, que
  tiene quince accesos fijos. Se comparte el enlace directo dentro del equipo.
- **No se manda a colegios.** Trae quejas, calificaciones y precios de terceros: sirven para
  preparar la reunión, no para pegarlos en una propuesta. La página lo dice en la portada.
- Lleva `noindex`, pero GitHub Pages es público: cualquiera con el enlace la abre. Si eso deja de
  ser aceptable, hay que sacarla del repositorio, no esconderla mejor.
- **Trae listas de colegios que usan a cada competidor, con su ID de la Base Maestra.** Es
  información de prospección: que un competidor la vea le dice a quién vamos a buscar. Es la
  razón más fuerte para no publicarla en un sitio público.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Se edita a mano |
| `og.png` | Su vista previa de WhatsApp (generada) |
| `og-source.html` | El molde de esa vista previa |

El texto largo, con más contexto por competidor, vive en
[`../../docs/competencia/comparativa-competidores.md`](../../docs/competencia/comparativa-competidores.md).
**Si un dato cambia, cambia en los dos.**

## Cómo se edita

- **Tabla maestra:** cada celda con estado lleva clase `si`, `par` o `no`, una marca visual
  (`✓ ◐ ✕`, con `aria-hidden`) y su equivalente en texto oculto (`.sr`). Las tres cosas van
  juntas: el estado no depende solo del color.
- **Orden de lectura:** cómo usar la página (tres pasos) → resumen de un minuto (semáforo de
  ocho frentes + una tarjeta por competidor) → patrón → novedades → tabla completa → fichas →
  prospectos → objeción y costo → marco legal → por producto → integra → motiva → riesgos.
- **Semáforo del resumen:** se edita a mano en el HTML, con las mismas clases `si`, `par`, `no`
  que la tabla completa. Debe coincidir con ella: si cambias una, cambia la otra.
- **Fichas:** frase clave («Tu frase», `.clave`), tres columnas —dónde es fuerte, dónde falla,
  cómo ganarle— y las preguntas para el director, con sus fuentes al pie. `--k` en el `style` de
  la ficha es su color de acento.
- **Prospectos:** una sola tabla de colegios, agrupada por estado, con el sistema que usan y su ID
  en la Base Maestra. Cada ficha enlaza a ella; las listas ya no viven dentro de las fichas.
- **Hecho e inferencia:** `<span class="tag h">H</span>` y `<span class="tag i">I</span>`. No se
  agrega un dato de competidor sin fuente; si es inferencia nuestra, se marca.

## Reglas de contenido

- Investigación del **8 de octubre de 2026**. Ningún competidor publica precio de lista: los
  precios salen de circulares de colegios y llevan su ciclo. El de UNO es de 2019.
- Lo que la investigación no encontró se dice «no encontrado», no «no tiene».
- Lo que producto no ha confirmado de activa (CFDI y WhatsApp en integra, evidencia de beta) se
  marca como pendiente en la tabla y en la sección 08. **No se promete.**
- El argumento de Profeco va como contexto y validado con legal, nunca como acusación.

## Movimiento

Ninguno. Es una página estática sin JavaScript: se lee completa sin scripts, abre desde
`file://` y no necesita `Motion.start()`.

## Verificado

A 390 px no hay scroll horizontal (las tablas se desplazan en su caja) · al imprimir sale en
horizontal, con la tabla completa y una ficha por bloque · abre desde `file://`.

## Cómo se regenera la vista previa de WhatsApp

Desde la raíz del repositorio, con rutas de Windows:

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/comparativa-competidores/og.png \
  paginas/comparativa-competidores/og-source.html
```
