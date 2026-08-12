# Normativa de movimiento

Cómo se anima **cualquier página HTML de activa**. Es obligatorio para páginas nuevas y es la
referencia al modificar las que ya existen.

El movimiento no decora: contesta preguntas que el usuario ya se hizo. ¿Se puede hacer clic?
¿Funcionó? ¿Está cargando? ¿Qué leo primero? Si una animación no contesta ninguna, sobra.

---

## Las cuatro reglas

**1 · Un solo bucle.** Todo lo que dependa del scroll o del cursor se registra con
`Motion.onFrame(job)`. Nunca se agrega un listener de `scroll` propio: varios listeners
compitiendo es la causa número uno de tirones en este tipo de páginas.

**2 · Los listeners solo guardan coordenadas.** La geometría —`getBoundingClientRect`,
`clientWidth`— se lee **dentro** del frame, nunca dentro de un evento. Leer layout en un evento
obliga al navegador a recalcular en el peor momento. El patrón correcto está resuelto abajo, en
«[Cursor local dentro de un elemento](#cursor-local-dentro-de-un-elemento)»: cópialo en lugar de
volver a escribirlo.

**3 · Se respeta «reducir movimiento».** Si el sistema operativo lo pide, todo se monta en su
estado final y el bucle no arranca. En pantalla táctil los efectos de cursor no se montan. El
motor ya lo hace solo: no hay que escribir nada, pero tampoco hay que estorbarle.

**4 · Nada se oculta hasta que el motor confirma que corrió.** El CSS solo esconde lo revelable
bajo `html.mo-ready`, y esa clase la pone `Motion.start()`. Si el script no carga —404, red
caída, error de sintaxis— la página se ve **completa y quieta** en lugar de quedarse en blanco.

> La regla 4 no es teórica. En agosto de 2026 el Motion System se publicó como página en blanco
> durante días: dependía de una librería que nunca se subió al repositorio, un `import` devolvió
> 404 y el grafo de módulos entero murió sin dejar rastro visible. Cero secciones, cero texto.
> Todo el diseño del motor sale de esa lección.

---

## Qué se carga

Dos archivos, en este orden, y siempre con ruta relativa:

```html
<link rel="stylesheet" href="../../compartidos/css/motion.css">
<script src="../../compartidos/js/motion.js"></script>
```

Y al final de la página, una vez:

```html
<script>
  Motion.revealAll('.mo-reveal');
  Motion.start();          // ← siempre lo último
</script>
```

Opcionales, solo si la página los usa:

```html
<script src="../../compartidos/js/motion-lottie.js"></script>
<script src="../../compartidos/js/motion-particles.js"></script>
```

**Son scripts clásicos, no módulos ES, a propósito.** Los módulos no cargan desde `file://` y el
deck y el kit se abren con doble clic. El único global que se define es `Motion`.

**El CSS no tiene ni un color.** Solo opacidad, transform y tiempos. Cada página tiene su paleta
—el deck es Google, el kit es pastel, el cotizador es sobrio— y el motor no debe pelearse con
ninguna. Si un efecto necesita color, ese color va en el CSS de la página.

---

## Las cinco capas, y dónde aplica cada una

| Capa | Para qué sirve | Dónde aplica |
|---|---|---|
| **1 · Microinteracciones** | Retroalimentación inmediata: el sistema responde antes de que el usuario dude | En todas, sin excepción |
| **2 · Entrada y cascada** | Coreografía al cargar: se decide qué se lee primero | En todas |
| **3 · Movimiento por scroll** | El scroll deja de ser navegación y se vuelve el hilo de la historia | Solo si la página se desplaza |
| **4 · Interacción con el cursor** | La interfaz reconoce al usuario antes de que toque nada | Solo con puntero fino, y nunca sobre formularios |
| **5 · Media enriquecida** | Lottie y Canvas: lo que no se consigue con una plantilla | Solo en portadas y cierres |

### 1 · Microinteracciones

Clases de CSS, sin JavaScript:

```html
<button class="mo-hover-eleva mo-hover-hunde">Se eleva al pasar, se hunde al presionar</button>
<button class="mo-hover-crece">Crece 5 %</button>
<div class="mo-brillo">Un brillo barre la superficie al pasar el cursor</div>
```

Botón que cuenta lo que está pasando:

```js
var avisar = Motion.botonEstado(btn, {
  trabajando: '<i class="mo-spinner"></i> Guardando…',
  hecho: '✓ Guardado'
});
btn.addEventListener('click', function () { avisar(); guardarDeVerdad(); });
```

### 2 · Entrada y cascada

```html
<div class="mo-reveal">Aparece al entrar en pantalla</div>
<div class="mo-reveal mo-desde-izq">Entra desde la izquierda</div>

<div class="mo-stagger" id="rejilla">
  <div>uno</div><div>dos</div><div>tres</div>
</div>
```

```js
Motion.revealAll('.mo-reveal');
Motion.stagger(document.getElementById('rejilla'), 90);  // 90 ms entre cada hijo
Motion.revealAll('#rejilla > *');
Motion.replay(rejilla);                                   // para volver a lanzarla
```

Variantes: `mo-desde-abajo` (la de omisión), `mo-desde-arriba`, `mo-desde-izq`, `mo-desde-der`,
`mo-escala`, `mo-solo-fade`.

El retardo codifica importancia: lo que entra primero es lo que el cliente debe recordar.
Más de 6 elementos en cascada se siente lento — con paso de 60–90 ms es suficiente.

### 3 · Movimiento por scroll

```js
Motion.parallax(document.querySelector('.mo-capa'), 0.24);   // 24 % de la velocidad
Motion.progressBar(document.querySelector('.mo-progress-fill'));
Motion.scrollProgress(bloque, function (avance) { /* 0 … 1 */ });
Motion.sectionSpy('section[id]', function (id) { marcarMenu(id); });
```

El parallax es **solo para decoración de fondo**. Nunca detrás de texto que haya que leer, y
nunca sobre cifras. El fondo va a un tercio de la velocidad del contenido o menos; más rápido,
marea.

### 4 · Interacción con el cursor

```js
Motion.magnetic(wrap, inner, 130, 0.38);   // el botón se acerca al cursor
Motion.follow(elemento, 10);               // se desplaza hacia el puntero
Motion.tilt(tarjeta, 6);                   // se inclina en 3D bajo el cursor
Motion.pupila(ojo, pupila, 13);            // la pupila persigue al cursor
```

Todo esto se desactiva solo en táctil y con movimiento reducido. **Prohibido sobre formularios:**
un campo que se mueve mientras alguien escribe es un error, no un detalle.

### Cursor local dentro de un elemento

Un caso que aparece seguido y que casi siempre se escribe mal: un velo, un brillo o un resplandor
que sigue al cursor **dentro** de una tarjeta, alimentado por dos custom properties.

La versión ingenua lee la geometría dentro del propio `pointermove`:

```js
// ✗ MAL: lee layout dentro del evento, contra la regla 2
el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();                 // ← fuerza recálculo
  el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
});
```

Funciona hasta que el elemento además se mueve por frame —imán, inclinación, parallax—: entonces
cada movimiento del cursor fuerza un cálculo de layout sincrónico justo mientras el bucle está
escribiendo `transform`, y aparecen los tirones. El patrón correcto separa guardar de pintar:

```js
// ✓ BIEN: el evento guarda, el frame lee y pinta
const velo = { activa: null, x: 0, y: 0 };

function veloPinta(el, cx, cy) {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', (cx - r.left) + 'px');
  el.style.setProperty('--my', (cy - r.top)  + 'px');
}

el.addEventListener('pointermove', e => {
  if (window.Motion) { velo.activa = el; velo.x = e.clientX; velo.y = e.clientY; return; }
  veloPinta(el, e.clientX, e.clientY);   // sin motor no hay bucle: se pinta directo (regla 4)
});
el.addEventListener('pointerleave', () => { if (velo.activa === el) velo.activa = null; });

// una sola vez, junto al resto del cableado:
Motion.onFrame(() => { if (velo.activa) veloPinta(velo.activa, velo.x, velo.y); });
```

Con esto hay **una lectura de geometría por frame** y solo mientras el cursor está sobre algo, sin
importar cuántos elementos existan. La rama `if (window.Motion)` no es adorno: mantiene el efecto
vivo cuando el motor no cargó.

Está implementado así en `paginas/kit-comercial/index.html` (busca `veloPinta`). Si un revisor
encuentra ese `getBoundingClientRect` dentro de `veloPinta`, es correcto: se llama desde el frame,
no desde el evento.

### 5 · Media enriquecida

```js
Motion.lottie.mount(host, '../../compartidos/lottie/pulse.json', function (estado) {
  chip.textContent = estado;
});
Motion.particles.mount(canvas, { n: 90, cerca: [34,211,199], lejos: [124,92,255] });

// Campo multicolor: con `paleta`, cada partícula toma un color fijo de la lista
// —y sus enlaces con él—, en vez de mezclar `cerca` y `lejos` por profundidad.
Motion.particles.mount(canvas, {
  n: 60,
  paleta: [[66,133,244], [234,67,53], [251,188,4], [52,168,83]]
});
```

Lottie se baja del CDN de forma diferida y solo cuando el contenedor entra en pantalla; si el CDN
no responde, cae a una animación CSS y la sección sigue explicándose. Las partículas usan una
semilla fija: la composición es igual en cada carga, que es lo que se quiere en una demo que se
repite frente a clientes.

Presupuesto: 60–90 partículas en escritorio, 40–60 en móvil. Un solo Lottie por página.

---

## Prohibiciones

**Nada que se revele puede quedar oculto al imprimir.** El deck imprime a PDF en 16:9 y el
cotizador imprime la cotización del cliente. Un elemento en `opacity: 0` sale como hoja en
blanco, y eso llega al cliente. `motion.css` ya anula todo en `@media print`; si una página
agrega animaciones propias, **tiene que anularlas ahí también**.

> Y si la animación vive en un `::before` o un `::after`, hay que nombrarlo: `animation: none`
> sobre el elemento **no alcanza a sus pseudoelementos**. Una guarda que dice
> `.mi-clase { animation: none !important }` deja al pseudo animándose en el PDF y en cualquier
> miniatura, y no se nota hasta ver la hoja impresa. La forma correcta es
> `.mi-clase, .mi-clase::before, .mi-clase::after { … }`.

- No hay movimiento sobre números, precios ni totales. La precisión no se decora.
- No hay efectos de cursor sobre campos de formulario.
- No hay parallax detrás de texto de lectura.
- No hay animación que dure más de 900 ms. La entrada completa de una pantalla, menos de 600 ms.
- No hay `animation: infinite` salvo indicadores de carga y decoración de fondo declarada.
- No se anima `width`, `height`, `top` ni `left`: solo `transform` y `opacity`. Lo demás obliga al
  navegador a recalcular layout en cada cuadro.

---

## Antes de publicar: la lista

1. **Sin JavaScript**, o con el script bloqueado, ¿se lee toda la página? Debe verse completa y
   quieta. Si algo desaparece, la regla 4 está mal aplicada.
2. **Imprimir** (`Ctrl+P`): ¿sale todo el contenido, sin hojas en blanco?
3. **«Reducir movimiento»** activado en el sistema: ¿la página funciona y no se mueve?
4. **Consola limpia**: cero errores, cero 404.
5. **Teclado**: los atajos y el `Tab` siguen funcionando; el foco se ve.
6. **Táctil**: en un celular real o emulado, ningún efecto de cursor queda a medias.
7. **`Motion.start()` es la última línea** que se ejecuta.

---

## Dónde vive todo

| Archivo | Qué es |
|---|---|
| [`compartidos/js/motion.js`](../compartidos/js/motion.js) | El motor. Bucle, revelado, cascada, scroll, cursor, botón de estado. |
| [`compartidos/css/motion.css`](../compartidos/css/motion.css) | Las clases `mo-*`. Sin colores. Guardias de impresión y de movimiento reducido. |
| [`compartidos/js/motion-lottie.js`](../compartidos/js/motion-lottie.js) | Opcional. Lottie diferido con respaldo CSS. |
| [`compartidos/js/motion-particles.js`](../compartidos/js/motion-particles.js) | Opcional. Campo de partículas 3D en Canvas. |

Todas las clases y todo el CSS llevan prefijo `mo-`, para no chocar nunca con los nombres que ya
usa cada página. Al agregar algo al motor, se mantiene el prefijo y se anota en este documento.
