/* ═══════════════════════════════════════════════════════════════════════════
   activa · Motor de movimiento compartido
   ───────────────────────────────────────────────────────────────────────────
   Se usa en TODAS las páginas del sitio. Va en pareja con
   compartidos/css/motion.css; sin ese CSS, el revelado no se ve.

       <link rel="stylesheet" href="../../compartidos/css/motion.css">
       <script src="../../compartidos/js/motion.js"></script>
       ...
       <script>
         Motion.revealAll('.mo-reveal');
         Motion.start();
       </script>

   SCRIPT CLÁSICO A PROPÓSITO, no un módulo ES. Los módulos no cargan desde
   file:// y el deck y el kit se abren con doble clic. Expone un solo global:
   `Motion`.

   Tres reglas de arquitectura. Al agregar un efecto, respetarlas:

    1. Un solo bucle de requestAnimationFrame para todo lo dirigido por scroll
       o cursor. Los efectos se registran con Motion.onFrame(job). Varios
       listeners de scroll compitiendo es la causa número uno de tirones.
    2. Los listeners solo guardan coordenadas. La geometría se lee dentro del
       frame, nunca dentro de un evento.
    3. Si el sistema pide «reducir movimiento», todo se monta en su estado
       final y el bucle nunca arranca. En pantalla táctil los efectos de
       cursor no se montan.

   Y una regla de seguridad, que vale más que las tres anteriores:

    4. NADA se oculta hasta que este archivo confirma que corrió. El CSS solo
       esconde lo revelable bajo `html.mo-ready`, y esa clase la pone
       Motion.start(). Si el script no carga —404, red caída, error de
       sintaxis— la página se ve completa y sin movimiento, en lugar de
       quedarse en blanco.
   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  var doc = global.document;
  var html = doc.documentElement;

  function media(q) {
    return global.matchMedia ? global.matchMedia(q).matches : false;
  }

  /* El usuario pidió menos movimiento a nivel de sistema operativo. */
  var reduced = media('(prefers-reduced-motion: reduce)');

  /* Puntero fino (mouse o trackpad), no táctil. */
  var hasPointer = media('(hover: hover) and (pointer: fine)');

  // ── Estado del bucle ──────────────────────────────────────────────────────

  var frameJobs = [];
  var pointerX = 0, pointerY = 0;
  var smoothX = 0, smoothY = 0;
  var running = false;

  function onFrame(job) {
    frameJobs.push(job);
  }

  function runJobs() {
    var y = global.scrollY;
    for (var i = 0; i < frameJobs.length; i++) frameJobs[i](y);
  }

  function tick() {
    // Inercia del puntero: nada salta, todo persigue.
    smoothX += (pointerX - smoothX) * 0.12;
    smoothY += (pointerY - smoothY) * 0.12;
    runJobs();
    global.requestAnimationFrame(tick);
  }

  /**
   * Arranca el motor. Hay que llamarlo UNA vez, al final de la página.
   * Marca <html class="mo-ready">, que es lo que autoriza al CSS a ocultar
   * los elementos revelables.
   */
  function start() {
    if (running) return;
    running = true;

    html.classList.add('mo-ready');
    if (reduced) html.classList.add('mo-reduced');
    if (hasPointer) html.classList.add('mo-pointer');

    pointerX = smoothX = global.innerWidth / 2;
    pointerY = smoothY = global.innerHeight / 2;

    global.addEventListener('pointermove', function (e) {
      pointerX = e.clientX;
      pointerY = e.clientY;
    }, { passive: true });

    if (reduced) {
      // Sin movimiento: una sola pasada para dejar todo colocado.
      runJobs();
    } else {
      global.requestAnimationFrame(tick);
    }
  }

  /** Posición suavizada del puntero, normalizada a [-1, 1] desde el centro. */
  function pointerNorm() {
    return {
      x: (smoothX / global.innerWidth) * 2 - 1,
      y: (smoothY / global.innerHeight) * 2 - 1
    };
  }

  /** Posición suavizada del puntero, en píxeles de viewport. */
  function pointerSmooth() {
    return { x: smoothX, y: smoothY };
  }

  // ── Utilidades ────────────────────────────────────────────────────────────

  function qsa(sel, raiz) {
    return Array.prototype.slice.call((raiz || doc).querySelectorAll(sel));
  }

  function clamp(lo, hi, v) {
    return Math.max(lo, Math.min(hi, v));
  }

  function lerp(a, b, k) {
    return a + (b - a) * k;
  }

  /** Redondea a n decimales y devuelve texto, sin ceros de relleno. */
  function r(v, n) {
    return String(Number(v.toFixed(n === undefined ? 2 : n)));
  }

  function setTransform(e, v) {
    e.style.transform = v;
  }

  function after(ms, f) {
    return global.setTimeout(f, ms);
  }

  // ── 1 · Revelado al entrar en pantalla ────────────────────────────────────

  /**
   * Marca `.mo-in` cuando el elemento entra en pantalla, una sola vez.
   * El CSS decide la curva; aquí solo se pone la clase.
   *
   * @param {string} selector  qué revelar. Por convención, `.mo-reveal`.
   * @param {object} [opts]    { threshold, rootMargin, once }
   */
  function revealAll(selector, opts) {
    var o = opts || {};
    var nodes = typeof selector === 'string' ? qsa(selector) : selector;
    var i;

    // Sin observador o sin movimiento: todo revelado de una vez.
    if (reduced || !global.IntersectionObserver) {
      for (i = 0; i < nodes.length; i++) nodes[i].classList.add('mo-in');
      return;
    }

    var io = new IntersectionObserver(function (entradas) {
      for (var j = 0; j < entradas.length; j++) {
        var e = entradas[j];
        if (!e.isIntersecting) continue;
        e.target.classList.add('mo-in');
        if (o.once !== false) io.unobserve(e.target);
      }
    }, {
      threshold: o.threshold === undefined ? 0.15 : o.threshold,
      rootMargin: o.rootMargin === undefined ? '0px 0px -10% 0px' : o.rootMargin
    });

    for (i = 0; i < nodes.length; i++) io.observe(nodes[i]);
  }

  /**
   * Retardos escalonados a los hijos de un contenedor: la cascada.
   * Escribe la custom property --mo-delay, que lee el CSS.
   */
  function stagger(container, stepMs, desde) {
    if (!container) return;
    var kids = container.children;
    var paso = stepMs === undefined ? 80 : stepMs;
    var base = desde === undefined ? 0 : desde;
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.setProperty('--mo-delay', (base + i * paso) + 'ms');
    }
  }

  /**
   * Reinicia la coreografía: quita la clase, fuerza un reflow y la repone.
   * Sin el reflow el navegador agrupa ambos cambios y la animación no se
   * vuelve a disparar.
   */
  function replay(container, cls) {
    if (!container) return;
    var clase = cls || 'mo-in';
    var kids = Array.prototype.slice.call(container.children);
    var i;
    for (i = 0; i < kids.length; i++) kids[i].classList.remove(clase);
    void container.offsetHeight; // ← el reflow, a propósito
    for (i = 0; i < kids.length; i++) kids[i].classList.add(clase);
  }

  // ── 2 · Movimiento por scroll ─────────────────────────────────────────────

  /**
   * Desplaza el elemento a una fracción de la velocidad del scroll.
   * speed 0.3 = se mueve al 30 % de lo que se mueve la página.
   * Solo para decoración de fondo: nunca sobre texto que haya que leer.
   */
  function parallax(e, speed) {
    if (!e || reduced) return;
    onFrame(function () {
      var rect = e.getBoundingClientRect();
      var centro = rect.top + rect.height / 2 - global.innerHeight / 2;
      setTransform(e, 'translate3d(0,' + r(-centro * speed) + 'px,0)');
    });
  }

  /** Llama a cb con el avance [0,1] del elemento a través del viewport. */
  function scrollProgress(e, cb) {
    if (!e) return;
    onFrame(function () {
      var rect = e.getBoundingClientRect();
      var total = rect.height - global.innerHeight;
      cb(total <= 0 ? 0 : clamp(0, 1, -rect.top / total));
    });
  }

  /** Barra de avance de lectura. Escala el elemento en X, de 0 a 1. */
  function progressBar(bar) {
    if (!bar) return;
    onFrame(function (y) {
      var alto = doc.documentElement.scrollHeight - global.innerHeight;
      var p = alto <= 0 ? 0 : clamp(0, 1, y / alto);
      setTransform(bar, 'scaleX(' + r(p, 4) + ')');
    });
  }

  /** Avisa qué sección está visible. Útil para marcar el menú. */
  function sectionSpy(selector, onActive, threshold) {
    if (!global.IntersectionObserver) return;
    var io = new IntersectionObserver(function (entradas) {
      for (var i = 0; i < entradas.length; i++) {
        if (entradas[i].isIntersecting) onActive(entradas[i].target.id, entradas[i].target);
      }
    }, { threshold: threshold === undefined ? 0.35 : threshold });
    var nodes = qsa(selector);
    for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);
  }

  // ── 3 · Cursor ────────────────────────────────────────────────────────────

  /**
   * Botón magnético: `inner` se desplaza hacia el cursor mientras este está
   * dentro del radio de `wrap`, y regresa con inercia al salir.
   * `fuerza` es la fracción de la distancia que recorre (0.35 = 35 %).
   */
  function magnetic(wrap, inner, radio, fuerza) {
    if (!wrap || !inner || !hasPointer || reduced) return;

    var dx = 0, dy = 0, tx = 0, ty = 0;
    var rad = radio === undefined ? 130 : radio;
    var f = fuerza === undefined ? 0.35 : fuerza;

    wrap.addEventListener('pointermove', function (e) {
      var rect = wrap.getBoundingClientRect();
      var ax = e.clientX - (rect.left + rect.width / 2);
      var ay = e.clientY - (rect.top + rect.height / 2);
      var dentro = Math.sqrt(ax * ax + ay * ay) < rad;
      tx = dentro ? ax * f : 0;
      ty = dentro ? ay * f : 0;
    }, { passive: true });

    wrap.addEventListener('pointerleave', function () { tx = 0; ty = 0; });

    onFrame(function () {
      dx = lerp(dx, tx, 0.18);
      dy = lerp(dy, ty, 0.18);
      setTransform(inner, 'translate3d(' + r(dx) + 'px,' + r(dy) + 'px,0)');
    });
  }

  /** Desplaza un elemento hacia el puntero. `amp` en píxeles. */
  function follow(e, amp) {
    if (!e || !hasPointer || reduced) return;
    var a = amp === undefined ? 10 : amp;
    onFrame(function () {
      var n = pointerNorm();
      setTransform(e, 'translate3d(' + r(n.x * a) + 'px,' + r(n.y * a) + 'px,0)');
    });
  }

  /** Pupila que persigue al cursor dentro de un ojo circular. */
  function pupila(ojo, pup, radio) {
    if (!ojo || !pup || !hasPointer || reduced) return;
    var rad = radio === undefined ? 12 : radio;
    onFrame(function () {
      var rect = ojo.getBoundingClientRect();
      var ax = smoothX - (rect.left + rect.width / 2);
      var ay = smoothY - (rect.top + rect.height / 2);
      var dist = Math.max(1, Math.sqrt(ax * ax + ay * ay));
      var k = Math.min(rad, dist) / dist;
      setTransform(pup, 'translate3d(' + r(ax * k) + 'px,' + r(ay * k) + 'px,0)');
    });
  }

  /**
   * Inclinación 3D según la posición del cursor sobre el propio elemento.
   * `grados` es la inclinación máxima en cada eje.
   */
  function tilt(e, grados) {
    if (!e || !hasPointer || reduced) return;
    var g = grados === undefined ? 6 : grados;
    var tx = 0, ty = 0, cx = 0, cy = 0;

    e.addEventListener('pointermove', function (ev) {
      var rect = e.getBoundingClientRect();
      tx = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      ty = ((ev.clientY - rect.top) / rect.height) * 2 - 1;
    }, { passive: true });

    e.addEventListener('pointerleave', function () { tx = 0; ty = 0; });

    onFrame(function () {
      cx = lerp(cx, tx, 0.14);
      cy = lerp(cy, ty, 0.14);
      setTransform(e, 'perspective(900px) rotateY(' + r(cx * g) + 'deg) rotateX(' + r(-cy * g) + 'deg)');
    });
  }

  // ── 4 · Microinteracción de estado ────────────────────────────────────────

  /**
   * Un botón que recorre reposo → trabajando → hecho → reposo.
   * Devuelve una función para disparar el ciclo; el trabajo real lo hace
   * quien llama, esto solo cuenta la historia.
   *
   *   var avisar = Motion.botonEstado(btn, {
   *     trabajando: 'Guardando…', hecho: '✓ Guardado' });
   *   btn.addEventListener('click', avisar);
   */
  function botonEstado(btn, textos) {
    if (!btn) return function () {};
    var t = textos || {};
    var reposo = btn.innerHTML;
    var ocupado = false;

    return function () {
      if (ocupado) return;
      ocupado = true;

      btn.classList.add('mo-working');
      if (t.trabajando) btn.innerHTML = t.trabajando;

      after(t.msTrabajo === undefined ? 900 : t.msTrabajo, function () {
        btn.classList.remove('mo-working');
        btn.classList.add('mo-done');
        if (t.hecho) btn.innerHTML = t.hecho;

        after(t.msHecho === undefined ? 1600 : t.msHecho, function () {
          btn.classList.remove('mo-done');
          btn.innerHTML = reposo;
          ocupado = false;
        });
      });
    };
  }

  // ── API ───────────────────────────────────────────────────────────────────

  global.Motion = {
    // banderas
    reduced: reduced,
    hasPointer: hasPointer,
    // bucle
    onFrame: onFrame,
    start: start,
    pointerNorm: pointerNorm,
    pointerSmooth: pointerSmooth,
    // entrada
    revealAll: revealAll,
    stagger: stagger,
    replay: replay,
    // scroll
    parallax: parallax,
    scrollProgress: scrollProgress,
    progressBar: progressBar,
    sectionSpy: sectionSpy,
    // cursor
    magnetic: magnetic,
    follow: follow,
    pupila: pupila,
    tilt: tilt,
    // microinteracción
    botonEstado: botonEstado,
    // auxiliares, por si una página los necesita
    qsa: qsa,
    clamp: clamp,
    lerp: lerp,
    after: after
  };
})(window);
