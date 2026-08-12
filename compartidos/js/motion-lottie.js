/* ═══════════════════════════════════════════════════════════════════════════
   activa · Lottie (opcional)
   ───────────────────────────────────────────────────────────────────────────
   Se carga DESPUÉS de motion.js y solo en las páginas que lo usen:

       <script src="../../compartidos/js/motion.js"></script>
       <script src="../../compartidos/js/motion-lottie.js"></script>
       ...
       Motion.lottie.mount(host, '../../compartidos/lottie/pulse.json');

   El reproductor (lottie-web, ~250 KB) se baja de forma diferida y SOLO
   cuando el contenedor entra en pantalla. Si el CDN no responde —red del
   cliente, firewall corporativo, junta sin internet— el hueco cae a una
   animación CSS equivalente. Una demo de ventas nunca debe mostrar un vacío.
   ═══════════════════════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  if (!global.Motion) {
    // Falla ruidosa en consola, silenciosa en pantalla: la página sigue.
    if (global.console) console.error('motion-lottie.js requiere motion.js antes.');
    return;
  }

  var CDN = 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie_light.min.js';
  var doc = global.document;

  function listo() {
    return typeof global.lottie !== 'undefined';
  }

  /** Carga el script una sola vez. `ok` recibe true si quedó disponible. */
  function aseguraLibreria(ok) {
    if (listo()) return ok(true);

    var existente = doc.querySelector('script[data-lottie]');
    if (existente) {
      existente.addEventListener('load', function () { ok(true); });
      existente.addEventListener('error', function () { ok(false); });
      return;
    }

    var s = doc.createElement('script');
    s.src = CDN;
    s.setAttribute('data-lottie', '1');
    s.crossOrigin = 'anonymous';
    s.addEventListener('load', function () { ok(listo()); });
    s.addEventListener('error', function () { ok(false); });
    doc.head.appendChild(s);
  }

  /** Respaldo puramente CSS: tres anillos que laten, en el mismo hueco. */
  function respaldo(host) {
    host.innerHTML =
      '<div class="mo-lottie-fallback" role="img" aria-label="Animación">' +
      '<span></span><span></span><span></span></div>';
  }

  /**
   * Monta la animación en `host` leyendo `path` (JSON de Lottie).
   * @param {function} [estado] recibe una etiqueta legible de lo que pasó.
   */
  function mount(host, path, estado) {
    if (!host) return;
    var avisa = estado || function () {};
    var montado = false;

    function intenta() {
      if (montado) return;
      montado = true;
      avisa('cargando reproductor…');

      aseguraLibreria(function (disponible) {
        if (!disponible) {
          respaldo(host);
          avisa('respaldo CSS (sin conexión al CDN)');
          return;
        }
        try {
          var anim = global.lottie.loadAnimation({
            container: host,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: path
          });
          anim.setSpeed(1);
          avisa('lottie-web · SVG vectorial');
        } catch (e) {
          respaldo(host);
          avisa('respaldo CSS (JSON no válido)');
        }
      });
    }

    // Solo cuando se ve, y con un margen para que no llegue tarde.
    global.Motion.onFrame(function () {
      if (montado) return;
      var rect = host.getBoundingClientRect();
      if (rect.top < global.innerHeight * 1.2 && rect.bottom > 0) intenta();
    });

    // Si el movimiento está reducido el bucle no corre: se monta de una vez.
    if (global.Motion.reduced) intenta();
  }

  /**
   * Pide el JSON y reporta su tamaño real en bytes. Es el dato que convence:
   * no se dice «Lottie pesa poco», se muestra cuánto pesa este archivo.
   * Reporta 0 si no se pudo medir.
   */
  function pesaJson(path, cb) {
    if (!global.fetch) return cb(0);
    global.fetch(path)
      .then(function (res) { return res.text(); })
      .then(function (texto) { cb(new Blob([texto]).size); })
      .catch(function () { cb(0); });
  }

  global.Motion.lottie = { mount: mount, pesaJson: pesaJson };
})(window);
