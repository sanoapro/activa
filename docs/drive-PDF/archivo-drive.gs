/**
 * Archivo de cotizaciones activa · puente entre las páginas y Google Drive
 * ------------------------------------------------------------------------
 * Este archivo NO corre en el repositorio ni se publica con el sitio. Vive en
 * script.google.com como "Aplicación web" desplegada con
 *
 *     Ejecutar como: YO      ·      Acceso: cualquier persona
 *
 * Esa combinación es todo el truco: los vendedores no firman con nada, porque
 * quien escribe en Drive es la cuenta que desplegó el script. La copia que
 * está en el repositorio existe solo para tener historial de qué cambió.
 *
 * Contrato con las páginas (arrendamiento, compra, cotizador):
 *   POST con Content-Type: text/plain  ← a propósito: evita el preflight CORS,
 *   cuerpo = JSON con los campos que valida readRequest_().
 *
 * Al cambiar este archivo hay que VOLVER A DESPLEGAR:
 *   Implementar › Gestionar implementaciones › lápiz › Versión: nueva.
 *   Guardar no basta. La URL /exec no cambia.
 */

const CONFIG = {
  /* Carpeta "11. Cotizaciones 2026-2027". El ID es el pedazo final de la URL
     de Drive; no cambia aunque se le cambie el nombre o se mueva de lugar. */
  rootFolderId: '1sUoQ2kvv7Jk6qInvOZhSQM3OcUFVA4Zx',

  /* Secreto compartido con las páginas. No es una cerradura —vive en el
     JavaScript de un sitio público y cualquiera puede leerlo— sino un candado:
     evita que un rastreador que tropiece con la URL escriba en la carpeta.
     El muro de verdad es allowedDomains. */
  token: 'rCgPsZv23PeC7XaIJ64buDStasFDDx0D',

  /* Solo estos dominios pueden crear subcarpeta. Un correo mal escrito
     (activa.1a, un gmail) se rechaza en lugar de generar una carpeta fantasma
     que nadie vuelve a mirar. */
  allowedDomains: ['activa.la'],

  /* Las tres carpetas maestras. La izquierda es la llave que manda la página;
     la derecha es el nombre que se ve en Drive. Cualquier otra llave se
     rechaza: así una página no puede inventar un árbol nuevo por un error de
     dedo. Cambiar un nombre de aquí NO mueve lo ya archivado: crearía una
     carpeta nueva y dejaría la vieja atrás. */
  pages: {
    cotizador:     '1. upgrade_edu',
    arrendamiento: '2. Arrendamiento',
    compra:        '3. Compra'
  },

  /* Ceros a la izquierda en el número de cada cotización. Drive ordena por
     texto, no por número: sin esto, la 10 se metería entre la 1 y la 2 y el
     vendedor perdería justo el orden cronológico que el número existe para
     dar. Con tres dígitos el orden aguanta hasta la 999 por vendedor. */
  numberDigits: 3,

  /* Tope por archivo ya decodificado. Una cotización ronda los cientos de KB;
     20 MB es holgura, no expectativa. */
  maxBytes: 20 * 1024 * 1024
};

/* ---------------------------------------------------------------- entradas */

function doPost(e) {
  try {
    const req = readRequest_(e);
    /* Decodificar y validar el tamaño ANTES de pedir el candado: no tiene
       sentido bloquear a los demás para descubrir que el PDF venía dañado. */
    const bytes = decode_(req.pdf, 'PDF');
    return json_(archivar_(req, bytes));
  } catch (error) {
    /* Una excepción sin capturar devuelve una página HTML de error que el
       navegador no sabe leer: la página se quedaría con un fallo mudo. */
    return json_({ ok: false, error: String((error && error.message) || error) });
  }
}

/**
 * Abrir la URL /exec en el navegador debe decir algo útil. Sin token responde
 * lo mínimo; con token confirma que el ID de la carpeta raíz es el correcto.
 */
function doGet(e) {
  const params = (e && e.parameter) || {};
  if (params.token !== CONFIG.token) {
    return json_({ ok: true, service: 'archivo-activa' });
  }
  try {
    const root = DriveApp.getFolderById(CONFIG.rootFolderId);
    return json_({ ok: true, service: 'archivo-activa', root: root.getName(), rootUrl: root.getUrl() });
  } catch (error) {
    return json_({ ok: false, error: 'No pude abrir la carpeta raíz: ' + String((error && error.message) || error) });
  }
}

/* ---------------------------------------------------------------- archivar */

/**
 * ‹raíz›/‹carpeta maestra›/‹correo›/‹NNN›._‹nombre›.pdf
 *
 * Todo pasa dentro de un solo candado —resolver la carpeta, contar, escribir—
 * porque las tres cosas dependen entre sí. Dos vendedores subiendo al mismo
 * tiempo, sin candado, se llevarían el mismo número y crearían dos carpetas
 * con el mismo nombre; Drive permite ambas cosas y el archivo quedaría
 * partido en dos.
 */
function archivar_(req, bytes) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const root = DriveApp.getFolderById(CONFIG.rootFolderId);
    const folder = childFolder_(childFolder_(root, CONFIG.pages[req.page]), req.sellerEmail);

    const numero = prefijo_(siguienteNumero_(folder));
    const base = baseName_(req);

    /* createFile SIEMPRE crea uno nuevo: nunca sobrescribe ni manda nada a la
       papelera. Y como el número es el mayor que había más uno, tampoco puede
       repetirse aunque se archive dos veces la misma cotización. */
    const pdf = folder.createFile(
      Utilities.newBlob(bytes, 'application/pdf', numero + '._' + base + '.pdf')
    );

    let json = null;
    if (req.json) {
      json = folder.createFile(
        Utilities.newBlob(req.json, 'application/json', numero + '.1_' + base + '.json')
      );
    }

    return {
      ok: true,
      numero: numero,
      folder: { id: folder.getId(), url: folder.getUrl(), path: CONFIG.pages[req.page] + '/' + req.sellerEmail },
      pdf: { id: pdf.getId(), url: pdf.getUrl(), name: pdf.getName() },
      json: json ? { id: json.getId(), url: json.getUrl(), name: json.getName() } : null
    };
  } finally {
    lock.releaseLock();
  }
}

/**
 * El número que sigue en esa carpeta: el mayor que ya existe, más uno.
 *
 * Se toma el MÁXIMO y no la cantidad de archivos, por dos razones: cada
 * cotización deja dos archivos (el PDF y su JSON), y si alguien borra uno a
 * mano, contar reutilizaría un número que ya se usó.
 */
function siguienteNumero_(folder) {
  const files = folder.getFiles();
  let max = 0;
  while (files.hasNext()) {
    const match = /^(\d+)[._]/.exec(files.next().getName());
    if (!match) continue;
    const n = parseInt(match[1], 10);
    if (n > max) max = n;
  }
  return max + 1;
}

function prefijo_(n) {
  const s = String(n);
  /* Pasada la 999 el número simplemente crece: más vale un orden imperfecto
     que empezar a repetir números. */
  return s.length >= CONFIG.numberDigits ? s : ('0'.repeat(CONFIG.numberDigits - s.length) + s);
}

function childFolder_(parent, name) {
  const found = parent.getFoldersByName(name);
  return found.hasNext() ? found.next() : parent.createFolder(name);
}

/* ------------------------------------------------------------ validaciones */

function readRequest_(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Petición sin cuerpo.');

  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (error) {
    throw new Error('El cuerpo no es JSON válido.');
  }

  if (body.token !== CONFIG.token) throw new Error('Token inválido.');

  const page = String(body.page || '').trim();
  if (!CONFIG.pages[page]) throw new Error('Cotizador desconocido: ' + page);

  const sellerEmail = String(body.sellerEmail || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellerEmail)) {
    throw new Error('El correo del vendedor no es válido.');
  }
  const domain = sellerEmail.split('@')[1];
  if (CONFIG.allowedDomains.indexOf(domain) === -1) {
    throw new Error('El correo debe ser de ' + CONFIG.allowedDomains.join(' o ') + '.');
  }

  if (!body.pdf) throw new Error('No llegó el PDF.');

  return {
    page: page,
    sellerEmail: sellerEmail,
    institution: String(body.institution || '').trim(),
    folio: String(body.folio || '').trim(),
    revision: String(body.revision || '').trim(),
    quoteDate: String(body.quoteDate || '').trim(),
    pdf: String(body.pdf),
    json: body.json ? String(body.json) : ''
  };
}

function decode_(base64, label) {
  let bytes;
  try {
    bytes = Utilities.base64Decode(base64);
  } catch (error) {
    throw new Error('El ' + label + ' llegó dañado.');
  }
  if (!bytes.length) throw new Error('El ' + label + ' llegó vacío.');
  if (bytes.length > CONFIG.maxBytes) {
    throw new Error('El ' + label + ' pesa ' + Math.round(bytes.length / 1048576) +
                    ' MB y el tope es ' + Math.round(CONFIG.maxBytes / 1048576) + ' MB.');
  }
  return bytes;
}

/* ----------------------------------------------------------------- nombres */

/**
 * Lo que va después del número. Lo arma el puente, no la página, para que todo
 * el archivo se vea igual aunque mañana un cotizador mande el campo de otra
 * forma.
 *
 * El orden es COLEGIO · FECHA · FOLIO, y en ese orden por una razón: el número
 * ya carga el orden cronológico, así que la fecha no necesita ir al frente. Lo
 * que un vendedor busca con los ojos al abrir su carpeta es el nombre del
 * colegio, no el día.
 *
 *   004._ITJ Querétaro · 2026-08-21 · MM-20260821-01-R02.pdf
 *   004.1_ITJ Querétaro · 2026-08-21 · MM-20260821-01-R02.json
 */
function baseName_(req) {
  const parts = [];
  parts.push(req.institution || 'sin institución');
  parts.push(/^\d{4}-\d{2}-\d{2}$/.test(req.quoteDate) ? req.quoteDate : today_());

  const tail = [];
  if (req.folio) tail.push(req.folio);
  if (req.revision && req.revision !== '0') tail.push('r' + req.revision);
  if (tail.length) parts.push(tail.join(' '));

  return safeName_(parts.join(' · '));
}

function today_() {
  return Utilities.formatDate(new Date(), 'America/Mexico_City', 'yyyy-MM-dd');
}

/**
 * Drive acepta casi cualquier nombre, pero estos archivos terminan bajados a
 * una computadora: los caracteres que Windows prohíbe se limpian aquí.
 */
function safeName_(name) {
  return String(name)
    .replace(/[\\\/:*?"<>|]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^[\s.]+|[\s.]+$/g, '')
    .slice(0, 120) || 'cotización';
}

/* -------------------------------------------------------------- respuestas */

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ prueba */

/**
 * Ejecutar esta función UNA VEZ desde el editor, antes de desplegar: dispara
 * la pantalla de permisos de Drive y confirma que el ID de la raíz sirve.
 * Deja una carpeta de prueba que se puede borrar a mano después.
 */
function probar() {
  const root = DriveApp.getFolderById(CONFIG.rootFolderId);
  Logger.log('Carpeta raíz: %s', root.getName());
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const folder = childFolder_(childFolder_(root, CONFIG.pages.arrendamiento), 'prueba@activa.la');
    Logger.log('Carpeta de prueba: %s', folder.getUrl());
    Logger.log('Siguiente número ahí: %s', prefijo_(siguienteNumero_(folder)));
  } finally {
    lock.releaseLock();
  }
}
