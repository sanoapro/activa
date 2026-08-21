/* ============================================================
   activa · archivo de cotizaciones en Drive — módulo compartido
   ------------------------------------------------------------
   Una sola copia de la lógica para los tres cotizadores
   (arrendamiento, compra, cotizador). El diseño completo vive en
   docs/drive-PDF/plan.md; el puente que escribe en Drive es
   docs/drive-PDF/archivo-drive.gs, desplegado aparte en
   script.google.com.

   Contrato con cada página:

     const archivo = ArchivoDrive.montar({page, endpoint, token, contenedor, datos});
     archivo.capturar();            ← en preparePrint(), antes de window.print()
     archivo.mostrar();             ← en el manejador de afterprint
     archivo.revisarPendiente(id);  ← en cada render del documento — es barato:
                                       solo trabaja cuando cambia la cotización

   datos() se invoca AL IMPRIMIR (capturar()), nunca al subir: el JSON
   que se archiva es el del momento de imprimir, para que PDF y JSON
   siempre se correspondan aunque el vendedor edite en medio.

   El envío va SIN encabezados propios: con un cuerpo de cadena, fetch
   manda Content-Type: text/plain, que es justo lo que evita la petición
   de permiso previo (preflight CORS) que Apps Script no sabe contestar.
   Agregar un Content-Type: application/json ROMPE la subida.

   El módulo pone la estructura y el comportamiento; el color lo pone la
   página: todo el CSS lee los tokens del :root de cada cotizador
   (--acc, --line, --g-yel-t, …) con un valor de respaldo por si alguno
   faltara. El destino se muestra con la LLAVE del cotizador, no con el
   nombre de la carpeta de Drive: el puente traduce, y así renombrar una
   carpeta maestra no obliga a tocar las tres páginas.

   Si este archivo no carga, la página funciona igual que hoy: las tres
   llamadas van con ?. desde cada cotizador. El archivo es una capa
   encima, nunca un requisito.
   ============================================================ */
(function (global) {
"use strict";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_PDF_BYTES = 20 * 1024 * 1024;  /* el mismo tope que valida el puente */
const MAX_PENDIENTES = 12;               /* instantáneas de unos KB; la lista no crece sin freno */

/* ---------- utilidades ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
/* El PDF viaja en base64: readAsDataURL y se recorta el prefijo data:…;base64, */
function base64DeArchivo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.onload = () => {
      const s = String(reader.result || "");
      const i = s.indexOf("base64,");
      if (i < 0) return reject(new Error("No se pudo leer el archivo."));
      resolve(s.slice(i + 7));
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- estilos: estructura del módulo, color de la página ---------- */
const CSS = `
.ad-box{margin-top:14px;border:1px solid var(--line,#dadce0);border-radius:14px;padding:15px 18px;background:#fff;box-shadow:var(--sh1,0 1px 2px rgba(60,64,67,.18));font-family:var(--body,Roboto,Arial,Helvetica,sans-serif);font-size:13px;color:var(--ink,#202124)}
.ad-box--ambar{background:var(--g-yel-t,#fef7e0);border-color:var(--g-yel-b,#f6d67a)}
.ad-box--verde{background:var(--g-grn-t,#e6f4ea);border-color:#a8dab5}
.ad-box--rojo{background:var(--g-red-t,#fce8e6);border-color:#f5b5b0}
.ad-box--azul{background:var(--g-blue-t,#e8f0fe);border-color:#c6dafc}
.ad-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.ad-head b{font-family:var(--disp,"Google Sans",Roboto,Arial,sans-serif);font-size:14px;font-weight:600}
.ad-ico{width:30px;height:30px;border-radius:8px;background:#fff;border:1px solid var(--line,#dadce0);display:grid;place-items:center;flex:none}
.ad-ico svg{width:16px;height:16px;fill:var(--acc-d,#174ea6)}
.ad-dest{margin-left:auto;font-family:var(--mono,ui-monospace,Menlo,monospace);font-size:11px;background:#fff;border:1px solid var(--line,#dadce0);border-radius:999px;padding:3px 10px;color:var(--ink2,#3c4043);white-space:nowrap}
.ad-msg{margin:8px 0 0;font-size:12.5px;line-height:1.55;color:var(--ink2,#3c4043)}
.ad-msg b{font-family:var(--mono,ui-monospace,Menlo,monospace);font-weight:600}
.ad-mono{font-family:var(--mono,ui-monospace,Menlo,monospace)}
.ad-box a{color:var(--acc-d,#174ea6)}
.ad-row{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:12px}
.ad-file{font-size:12px;color:var(--ink2,#3c4043);max-width:100%}
.ad-btn{font-family:var(--disp,"Google Sans",Roboto,Arial,sans-serif);font-size:13px;font-weight:500;border:1px solid var(--acc,#1a73e8);background:var(--acc,#1a73e8);color:#fff;padding:8px 14px;border-radius:8px;cursor:pointer;min-height:40px;white-space:nowrap}
.ad-btn:hover{background:var(--acc-d,#174ea6);border-color:var(--acc-d,#174ea6)}
.ad-btn:disabled{opacity:.45;cursor:not-allowed}
.ad-btn--soft{background:#fff;color:var(--ink2,#3c4043);border-color:var(--field-line,#767c85)}
.ad-btn--soft:hover{background:var(--bg,#f8f9fa)}
.ad-aviso{display:none;margin-top:10px;border-radius:9px;padding:9px 12px;font-size:12.5px;line-height:1.5}
.ad-aviso.on{display:block}
.ad-aviso--ambar{background:#fff;border:1px solid var(--g-yel-b,#f6d67a);color:#6b4500}
.ad-aviso--rojo{background:#fff;border:1px solid #f5b5b0;color:var(--g-red-d,#a50e0e)}
.ad-note{margin:10px 0 0;padding-top:8px;border-top:1px dashed var(--line,#dadce0);font-size:11.5px;color:var(--faint,#5f6368);line-height:1.5}
@media print{.ad-box{display:none!important}}
`;
function inyectarEstilos() {
  if (global.document.getElementById("archivoDriveCss")) return;
  const style = global.document.createElement("style");
  style.id = "archivoDriveCss";
  style.textContent = CSS;
  global.document.head.appendChild(style);
}

/* ---------- el controlador ---------- */
function montar(config) {
  const cfg = config || {};
  const page = String(cfg.page || "").trim();
  const endpoint = String(cfg.endpoint || "").trim();
  const token = String(cfg.token || "");
  const contenedor = cfg.contenedor || null;
  const datos = typeof cfg.datos === "function" ? cfg.datos : null;
  /* Mal configurado, el módulo se apaga sin tirar la página. */
  const inerte = { capturar() {}, mostrar() {}, revisarPendiente() {} };
  if (!page || !contenedor || !datos) {
    console.warn("ArchivoDrive.montar: falta page, contenedor o datos(); el archivo queda apagado.");
    return inerte;
  }
  inyectarEstilos();
  /* role=status: aria-live cortés en un nodo estable, para que aparecer o
     cambiar de estado se anuncie a lectores de pantalla. */
  contenedor.setAttribute("role", "status");

  const KEY = `activa.${page}.archivo-pendiente.v1`;
  const enLocal = () => global.location.protocol === "file:";

  /* La instantánea del momento de imprimir y el estado del bloque. */
  let captura = null;          /* lo que devolvió datos() al imprimir */
  let quoteActual = "";        /* a qué cotización pertenece lo que está en pantalla */
  let archivoElegido = null;   /* el File seleccionado; sobrevive a un reintento */
  let avisoNombreConfirmado = false;
  let subiendo = false;
  let respuesta = null;        /* la respuesta ok:true del puente */
  let mensajeError = "";
  let estado = null;           /* null · listo · pendiente · subiendo · guardada · error · local · sin-configurar */

  /* ---------- lo pendiente: activa.<page>.archivo-pendiente.v1 ----------
     Al imprimir se marca la cotización como no archivada, con su instantánea
     (metadatos + JSON, unos pocos KB). Al archivar con éxito, se quita. El
     PDF no cabe en localStorage: reintentar es volver a elegir el archivo,
     que el vendedor todavía tiene en su disco. */
  function leerPendientes() {
    try {
      const raw = global.localStorage.getItem(KEY);
      const map = raw ? JSON.parse(raw) : null;
      return map && typeof map === "object" && !Array.isArray(map) ? map : {};
    } catch (error) { return {}; }
  }
  function guardarPendientes(map) {
    try { global.localStorage.setItem(KEY, JSON.stringify(map)); }
    catch (error) { console.warn("ArchivoDrive: no se pudo guardar el pendiente", error); }
  }
  function marcarPendiente(c) {
    if (!c.quoteId) return;
    const map = leerPendientes();
    map[c.quoteId] = { marcadoEn: new Date().toISOString(), datos: c };
    const ids = Object.keys(map);
    if (ids.length > MAX_PENDIENTES) {
      ids.sort((a, b) => String(map[a].marcadoEn).localeCompare(String(map[b].marcadoEn)));
      while (ids.length > MAX_PENDIENTES) delete map[ids.shift()];
    }
    guardarPendientes(map);
  }
  function quitarPendiente(quoteId) {
    if (!quoteId) return;
    const map = leerPendientes();
    if (!(quoteId in map)) return;
    delete map[quoteId];
    guardarPendientes(map);
  }

  /* ---------- pintar ---------- */
  function pinta(tono, html) {
    contenedor.innerHTML = `<div class="ad-box ad-box--${tono}">${html}</div>`;
  }
  function cabeza(titulo, conDestino) {
    const destino = conDestino
      ? `<span class="ad-dest">${esc(page)} / ${esc((captura && captura.sellerEmail) || "sin correo")}</span>`
      : "";
    return `<div class="ad-head"><span class="ad-ico"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg></span><b>${esc(titulo)}</b>${destino}</div>`;
  }
  function aviso(clase, html, extra) {
    const box = contenedor.querySelector("[data-ad-aviso]");
    if (!box) return;
    box.className = `ad-aviso on ad-aviso--${clase}`;
    box.innerHTML = html + (extra || "");
    const continuar = box.querySelector("[data-ad-continuar]");
    if (continuar) continuar.addEventListener("click", () => { avisoNombreConfirmado = true; subir(); }, { once: true });
  }
  function ocultaAviso() {
    const box = contenedor.querySelector("[data-ad-aviso]");
    if (box) { box.className = "ad-aviso"; box.innerHTML = ""; }
  }
  function render() {
    if (!estado) { contenedor.innerHTML = ""; return; }
    if (estado === "sin-configurar") {
      pinta("azul", cabeza("El archivo en Drive todavía no está configurado", false) +
        `<p class="ad-msg">Falta la dirección del puente (<span class="ad-mono">ARCHIVO_ENDPOINT</span>): el Apps Script aún no se despliega. El PDF quedó en tu disco; cuando el archivo esté activo podrás subirlo.</p>`);
      return;
    }
    if (estado === "local") {
      pinta("ambar", cabeza("Desde un archivo local no se puede subir al archivo", false) +
        `<p class="ad-msg">Abriste la página con doble clic (<span class="ad-mono">file://</span>) y el navegador bloquea la subida desde ahí. El PDF quedó en tu disco; para archivarlo abre la herramienta desde su dirección publicada.</p>`);
      return;
    }
    if (estado === "subiendo") {
      pinta("azul", cabeza("Subiendo…", true) +
        `<p class="ad-msg">Guardando <b>${esc((captura && captura.nombreSugerido) || "la cotización")}</b> en el archivo. No cierres la página.</p>`);
      return;
    }
    if (estado === "guardada") {
      const numero = (respuesta && respuesta.numero) || "—";
      const carpeta = (respuesta && respuesta.folder && respuesta.folder.url) || "";
      const nombrePdf = (respuesta && respuesta.pdf && respuesta.pdf.name) || "";
      pinta("verde", cabeza("Guardada en el archivo", true) +
        `<p class="ad-msg">Quedó como la <b>${esc(numero)}</b> de tu carpeta${nombrePdf ? `: <b>${esc(nombrePdf)}</b>` : ""}${carpeta ? ` · <a href="${esc(carpeta)}" target="_blank" rel="noopener">abrir la carpeta en Drive</a>` : ""}.</p>` +
        `<p class="ad-note">Junto al PDF quedó su JSON con el estado del momento de imprimir: sirve para reabrir la cotización y recotizar después.</p>`);
      return;
    }
    /* listo · pendiente · error comparten la fila de subida */
    const titulo = estado === "error" ? "No se pudo archivar"
      : estado === "pendiente" ? "Esta cotización quedó pendiente de archivar"
      : "Guarda esta cotización en el archivo";
    const tono = estado === "error" ? "rojo" : "ambar";
    const mensaje = estado === "error"
      ? `<p class="ad-msg">${esc(mensajeError)}</p><p class="ad-msg">El PDF ya está en tu disco: no se perdió nada, solo falta subirlo.</p>`
      : estado === "pendiente"
      ? `<p class="ad-msg">El PDF de <b>${esc((captura && captura.nombreSugerido) || "esta cotización")}</b> se generó pero no llegó al archivo del equipo. Sigue en tu disco: vuelve a elegirlo y súbelo — no hace falta generar el PDF otra vez.</p>`
      : `<p class="ad-msg">Elige el PDF que acabas de guardar —nombre sugerido: <b>${esc((captura && captura.nombreSugerido) || "—")}</b>— y súbelo al archivo del equipo en Drive.</p>`;
    const botonTexto = estado === "error" && archivoElegido ? "Reintentar la subida" : "Guardar en el archivo";
    pinta(tono, cabeza(titulo, true) + mensaje +
      `<div class="ad-row"><input type="file" class="ad-file" accept="application/pdf,.pdf" aria-label="PDF de la cotización"><button type="button" class="ad-btn" data-ad-subir>${esc(botonTexto)}</button></div>` +
      `<div class="ad-aviso" data-ad-aviso></div>`);
    const input = contenedor.querySelector(".ad-file");
    input.addEventListener("change", () => {
      archivoElegido = (input.files && input.files[0]) || null;
      avisoNombreConfirmado = false;
      ocultaAviso();
    });
    contenedor.querySelector("[data-ad-subir]").addEventListener("click", subir);
  }

  /* ---------- la subida ---------- */
  function falla(idSubida, mensaje) {
    if (quoteActual !== idSubida) return;  /* cambió de cotización a media subida */
    mensajeError = mensaje;
    estado = "error";
    render();
  }
  async function subir() {
    if (subiendo) return;                  /* dos clics no producen dos archivos */
    const c = captura;
    if (!c) return;
    const file = archivoElegido;
    if (!file) { aviso("ambar", "Primero elige el PDF que guardaste en tu computadora."); return; }
    /* Tiene que ser un PDF, por tipo o por extensión. */
    if (!(file.type === "application/pdf" || /\.pdf$/i.test(file.name || ""))) {
      aviso("rojo", `El archivo elegido (<b>${esc(file.name)}</b>) no es un PDF. Se esperaba el PDF de la cotización, el que guardaste con <i>Guardar como PDF</i>.`);
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      aviso("rojo", `El PDF pesa ${Math.round(file.size / 1048576)} MB y el tope del archivo es ${Math.round(MAX_PDF_BYTES / 1048576)} MB.`);
      return;
    }
    /* El correo es la llave que decide la subcarpeta; el módulo no lo asume. */
    const correo = String(c.sellerEmail || "").trim().toLowerCase();
    if (!EMAIL_RE.test(correo)) {
      aviso("rojo", "Falta un correo de vendedor válido: es la llave que decide en qué carpeta cae la cotización. Captúralo y vuelve a generar el PDF.");
      return;
    }
    /* Cotejo del nombre contra el folio sugerido al imprimir. Es un aviso,
       no un bloqueo: no podemos leer el contenido del PDF. */
    if (c.nombreSugerido && !String(file.name || "").includes(c.nombreSugerido) && !avisoNombreConfirmado) {
      aviso("ambar",
        `El archivo se llama <b>${esc(file.name)}</b> y esta cotización se imprimió como <b>${esc(c.nombreSugerido)}</b>: puede ser el PDF equivocado. No podemos leer su contenido, así que revisa antes de continuar.`,
        `<div class="ad-row" style="margin-top:8px"><button type="button" class="ad-btn ad-btn--soft" data-ad-continuar>Es el correcto · subir de todos modos</button></div>`);
      return;
    }

    subiendo = true;
    const idSubida = c.quoteId;
    estado = "subiendo";
    render();

    let base64;
    try { base64 = await base64DeArchivo(file); }
    catch (error) {
      subiendo = false;
      falla(idSubida, "No se pudo leer el PDF elegido. Vuelve a seleccionarlo e inténtalo de nuevo.");
      return;
    }
    const payload = {
      token, page,
      sellerEmail: correo,
      institution: String(c.institution || ""),
      quoteDate: String(c.quoteDate || ""),
      folio: String(c.folio || ""),
      revision: String(c.revision || ""),
      pdf: base64,
      json: String(c.json || "")
    };
    let respHttp;
    /* Sin encabezados propios: el cuerpo de cadena viaja como text/plain. */
    try { respHttp = await fetch(endpoint, { method: "POST", body: JSON.stringify(payload) }); }
    catch (error) {
      subiendo = false;
      falla(idSubida, "No hubo conexión con el archivo — puede ser un corte de internet. El PDF sigue en tu disco y esta cotización quedó marcada como pendiente.");
      return;
    }
    let cuerpo = null;
    try { cuerpo = await respHttp.json(); } catch (error) { /* respuesta ilegible: se reporta abajo */ }
    subiendo = false;
    if (!cuerpo || cuerpo.ok !== true) {
      falla(idSubida, cuerpo && cuerpo.error
        ? String(cuerpo.error)
        : `El puente respondió algo ilegible (HTTP ${respHttp.status}). Vuelve a intentar; si sigue pasando, avisa a quien administra el archivo.`);
      return;
    }
    quitarPendiente(idSubida);
    if (quoteActual !== idSubida) return;
    respuesta = cuerpo;
    estado = "guardada";
    render();
  }

  /* ---------- los tres métodos del contrato ---------- */
  /* Congela datos() al momento de imprimir y marca la cotización como no
     archivada. Se llama desde preparePrint() y desde el camino de Ctrl+P. */
  function capturar() {
    let d = null;
    try { d = datos(); }
    catch (error) { console.warn("ArchivoDrive: datos() falló; no se capturó nada", error); return; }
    if (!d || typeof d !== "object") return;
    captura = {
      sellerEmail: String(d.sellerEmail || ""),
      institution: String(d.institution || ""),
      quoteDate: String(d.quoteDate || ""),
      folio: String(d.folio || ""),
      revision: String(d.revision || ""),
      quoteId: String(d.quoteId || ""),
      nombreSugerido: String(d.nombreSugerido || ""),
      json: String(d.json || "")
    };
    quoteActual = captura.quoteId || quoteActual;
    archivoElegido = null;
    avisoNombreConfirmado = false;
    respuesta = null;
    mensajeError = "";
    estado = null;  /* el bloque reaparece con mostrar(), tras el diálogo de impresión */
    /* Sin puente o desde file:// no hay nada que reintentar después: no se marca. */
    if (endpoint && !enLocal()) marcarPendiente(captura);
  }
  /* Revela el bloque después del diálogo de impresión. Antes de imprimir el
     bloque no existe: no hay nada que subir y solo estorbaría. */
  function mostrar() {
    if (!captura) return;
    estado = enLocal() ? "local" : !endpoint ? "sin-configurar" : "listo";
    render();
    try {
      const reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
      contenedor.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    } catch (error) { /* desplazarse es cortesía, no requisito */ }
  }
  /* Al cargar o cambiar de cotización: si quedó marcada como no archivada,
     revela el bloque en estado pendiente. Con la misma cotización en
     pantalla no hace nada, así que puede llamarse en cada render. */
  function revisarPendiente(quoteId) {
    const id = String(quoteId || "");
    if (!id || id === quoteActual) return;
    quoteActual = id;
    captura = null; archivoElegido = null; avisoNombreConfirmado = false;
    respuesta = null; mensajeError = ""; estado = null;
    if (endpoint && !enLocal()) {
      const pendiente = leerPendientes()[id];
      if (pendiente && pendiente.datos && typeof pendiente.datos === "object") {
        captura = pendiente.datos;
        estado = "pendiente";
      }
    }
    render();
  }

  return { capturar, mostrar, revisarPendiente };
}

global.ArchivoDrive = { montar };
})(typeof window !== "undefined" ? window : this);
