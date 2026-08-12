/* ═══════════════════════════════════════════════════════════════════════════
   activa · Campo de partículas 3D (opcional)
   ───────────────────────────────────────────────────────────────────────────
   Se carga DESPUÉS de motion.js y solo en las páginas que lo usen:

       <script src="../../compartidos/js/motion.js"></script>
       <script src="../../compartidos/js/motion-particles.js"></script>
       ...
       Motion.particles.mount(canvas, { n: 90 });

   Perspectiva de verdad (x' = x · f / (f + z)): las partículas lejanas son
   más chicas, más tenues y se mueven menos. Canvas 2D en lugar de WebGL a
   propósito: a esta densidad el resultado es idéntico, no hay shaders que
   compilar ni contexto que se pierda, y funciona en cualquier equipo que el
   vendedor lleve a la junta.
   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  if (!global.Motion) {
    if (global.console) console.error('motion-particles.js requiere motion.js antes.');
    return;
  }

  var TAU = Math.PI * 2;

  /**
   * Generador con semilla fija (mulberry32). El campo se ve igual en cada
   * carga, que es lo que se quiere en una demo que se repite frente a
   * clientes: Math.random daría una composición distinta cada vez.
   */
  function generador(semilla) {
    var s = semilla >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Monta el campo sobre un <canvas>.
   *
   * @param {HTMLCanvasElement} cv
   * @param {object} [opts]
   *        n        cuántas partículas (90 por omisión; 60 en móvil está bien)
   *        cerca    color RGB de las cercanas   [34, 211, 199]
   *        lejos    color RGB de las lejanas    [124, 92, 255]
   *        paleta   array de RGB; si va, cada partícula toma UN color fijo de
   *                 la lista y `cerca`/`lejos` dejan de mezclarse. Es lo que
   *                 permite un campo multicolor —los cuatro de Google, por
   *                 ejemplo— en vez de un degradado entre dos tonos.
   *        enlaces  true para dibujar las líneas entre vecinas
   *        semilla  entero; misma semilla, misma composición
   */
  function mount(cv, opts) {
    if (!cv || !cv.getContext) return;
    var o = opts || {};
    var n = o.n === undefined ? 90 : o.n;
    var cerca = o.cerca || [34, 211, 199];
    var lejos = o.lejos || [124, 92, 255];
    var paleta = (o.paleta && o.paleta.length) ? o.paleta : null;
    var enlaces = o.enlaces !== false;
    var focal = o.focal === undefined ? 420 : o.focal;

    var ctx = cv.getContext('2d');
    var rnd = generador(o.semilla === undefined ? 20260810 : o.semilla);
    var w = 0, h = 0;
    var i;

    var ps = [];
    for (i = 0; i < n; i++) {
      ps.push({
        x: (rnd() - 0.5) * 1200,
        y: (rnd() - 0.5) * 700,
        z: rnd() * 700,
        vx: (rnd() - 0.5) * 0.22,
        vy: (rnd() - 0.5) * 0.22,
        // Por índice y no por rnd(): así el reparto de colores es parejo y,
        // sobre todo, no consume números del generador. Sin eso, agregar una
        // paleta correría la secuencia y cambiaría la composición de los
        // campos que ya existen.
        col: paleta ? paleta[i % paleta.length] : null
      });
    }

    // Proyección de cada partícula en el frame actual. Se reserva una vez y
    // se reescribe en el sitio: el bucle de enlaces es O(n²) y proyectar ahí
    // dentro repetiría el mismo cálculo miles de veces por frame.
    var proy = [];
    for (i = 0; i < n; i++) proy.push({ sx: 0, sy: 0, k: 0 });

    function ajusta() {
      var dpr = Math.min(2, global.devicePixelRatio || 1);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // El lienzo puede no estar todavía en el documento cuando se monta, y ahí
    // mide 0×0. Se ajusta en el primer frame, ya con layout, y cada vez que
    // cambie de tamaño. Medir dentro del frame en lugar de dentro del evento
    // «resize» es la regla 2 del motor.
    var sucio = true;
    global.addEventListener('resize', function () { sucio = true; });

    function ajustaSiHaceFalta() {
      if (sucio || cv.clientWidth !== w || cv.clientHeight !== h) {
        ajusta();
        sucio = false;
      }
    }

    function dibuja() {
      if (w <= 0) return;

      ctx.clearRect(0, 0, w, h);

      var pn = global.Motion.pointerNorm();
      // La cámara deriva con el cursor: el campo entero parece inclinarse.
      var camX = pn.x * 55;
      var camY = pn.y * 35;
      // Cursor en coordenadas del canvas, para la repulsión.
      var cursorX = w / 2 + pn.x * (w / 2);
      var cursorY = h / 2 + pn.y * (h / 2);
      var p, k, q, j, a, b, dx, dy, d2, alpha;

      // Avance y reciclado.
      for (i = 0; i < n; i++) {
        p = ps[i];
        p.x += p.vx;
        p.y += p.vy;
        p.z -= 0.35;
        if (p.z < -380) {
          p.z = 700;
          p.x = (rnd() - 0.5) * 1200;
          p.y = (rnd() - 0.5) * 700;
        }
        if (Math.abs(p.x) > 700) p.vx = -p.vx;
        if (Math.abs(p.y) > 420) p.vy = -p.vy;
      }

      // Proyección en perspectiva, ya con la deriva de cámara.
      for (i = 0; i < n; i++) {
        p = ps[i];
        k = focal / (focal + p.z);
        q = proy[i];
        q.k = k;
        q.sx = w / 2 + p.x * k + camX * k;
        q.sy = h / 2 + p.y * k + camY * k;
      }

      // Enlaces: solo entre partículas cercanas entre sí.
      if (enlaces) {
        ctx.lineWidth = 1;
        for (i = 0; i < n; i++) {
          a = proy[i];
          // Con paleta, la línea toma el color de la partícula de la que sale:
          // la red se ve tejida con los cuatro colores en vez de teñida de uno.
          var cl = ps[i].col || cerca;
          for (j = i + 1; j < n; j++) {
            b = proy[j];
            dx = a.sx - b.sx;
            dy = a.sy - b.sy;
            d2 = dx * dx + dy * dy;
            if (d2 >= 12100) continue; // 110 px de radio
            alpha = (1 - Math.sqrt(d2) / 110) * 0.28 * a.k;
            ctx.strokeStyle = 'rgba(' + cl[0] + ',' + cl[1] + ',' + cl[2] + ',' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // Partículas.
      for (i = 0; i < n; i++) {
        q = proy[i];
        // Repulsión: el cursor empuja lo que tiene cerca.
        dx = q.sx - cursorX;
        dy = q.sy - cursorY;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var push = (dist < 150 && dist > 0.1) ? ((150 - dist) / 150) * 34 : 0;
        var seguro = Math.max(dist, 0.1);
        var fx = q.sx + (dx / seguro) * push;
        var fy = q.sy + (dy / seguro) * push;

        var radio = Math.max(0.4, 2.3 * q.k);
        alpha = global.Motion.clamp(0.05, 0.9, q.k * 0.95);

        // Con paleta, el color es fijo y la profundidad la cuenta el alpha.
        // Sin paleta, el color viaja de «lejos» a «cerca» según la profundidad.
        var rr, gg, bb, pc = ps[i].col;
        if (pc) {
          rr = pc[0]; gg = pc[1]; bb = pc[2];
        } else {
          var m = global.Motion.clamp(0, 1, q.k);
          rr = Math.trunc(global.Motion.lerp(lejos[0], cerca[0], m));
          gg = Math.trunc(global.Motion.lerp(lejos[1], cerca[1], m));
          bb = Math.trunc(global.Motion.lerp(lejos[2], cerca[2], m));
        }

        ctx.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',' + alpha.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(fx, fy, radio, 0, TAU);
        ctx.fill();
      }
    }

    if (global.Motion.reduced) {
      // Sin movimiento: una sola composición estática, que sigue siendo
      // bonita. Se espera un frame para que el lienzo ya esté medido.
      global.requestAnimationFrame(function () {
        ajustaSiHaceFalta();
        dibuja();
      });
    } else {
      global.Motion.onFrame(function () {
        ajustaSiHaceFalta();
        // No gastamos frames si el lienzo no está en pantalla.
        var rect = cv.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < global.innerHeight) dibuja();
      });
    }
  }

  global.Motion.particles = { mount: mount };
})(window);
