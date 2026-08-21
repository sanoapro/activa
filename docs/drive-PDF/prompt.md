# El encargo

Prompt autocontenido para implementar el archivo de cotizaciones en Drive. Se le pasa completo a
una sesión de Claude Code parada en la raíz del repositorio.

**Antes de ejecutarlo, [`plan.md`](plan.md) tiene que estar leído.** Este documento dice *qué
construir*; el plan dice *por qué así*, y sin eso las decisiones de aquí parecen arbitrarias.

---

## Contexto

Este repositorio publica todas las páginas web de activa en GitHub Pages. **No hay build, ni CI,
ni bundler, ni `node_modules`**: lo que está aquí es exactamente lo que sirve el navegador. Cada
página es un `index.html` autocontenido de entre 2,400 y 3,500 líneas, con su markup, su CSS, su
motor de cálculo, su persistencia, su impresión y sus pruebas internas adentro. Lo único
compartido vive en `compartidos/`.

Tres de esas páginas son cotizadores y las tres generan un PDF de la misma manera:

```js
window.doPrint = async () => { if (await preparePrint()) window.print(); };
```

Es el diálogo de impresión del navegador. **El PDF lo fabrica Chrome, no el código**: la página
nunca recibe los bytes ni se entera de si el vendedor guardó o canceló.

El encargo es que cada cotización, además de bajar al disco del vendedor, quede archivada en
Google Drive, en una carpeta por cotizador y una subcarpeta por correo de vendedor. El puente que
escribe en Drive ya está escrito ([`archivo-drive.gs`](archivo-drive.gs)) y se despliega aparte,
en `script.google.com`. **Este encargo es solo del lado del repositorio.**

---

## Lo que hay que construir

### 1 · `compartidos/js/archivo-drive.js`

Una sola copia de la lógica para las tres páginas. Sin dependencias. ES2020 plano, en el estilo
compacto del resto del repositorio.

```js
const archivo = ArchivoDrive.montar({
  page:       "arrendamiento",            // una de las tres carpetas del puente
  endpoint:   ARCHIVO_ENDPOINT,           // la URL /exec del Apps Script
  token:      ARCHIVO_TOKEN,              // el secreto compartido
  contenedor: document.querySelector("#archivoDrive"),
  datos: () => ({                         // se invoca AL IMPRIMIR, no al subir
    sellerEmail:    APP_STATE.seller.email,
    institution:    APP_STATE.client.institution,
    quoteDate:      APP_STATE.validity.quoteDate,
    folio:          APP_STATE.identity.folioRoot,
    revision:       APP_STATE.identity.revision,
    quoteId:        APP_STATE.identity.quoteId,
    nombreSugerido: folioDisplay(),       // para cotejar el archivo que elija
    json:           /* el estado serializado, como cadena */
  })
});
```

El controlador expone tres métodos:

| Método | Cuándo se llama | Qué hace |
|---|---|---|
| `capturar()` | Dentro de `preparePrint()`, antes de `window.print()` | Congela el resultado de `datos()`. **Este es el corazón del asunto**: el JSON que se archiva es el del momento de imprimir, no el de cuando el vendedor decida subir. Si edita algo en medio, el PDF y el JSON seguirían correspondiéndose. |
| `mostrar()` | En el manejador de `afterprint` | Revela el bloque en estado **listo**. Antes de imprimir el bloque no existe: no hay nada que subir y solo estorbaría. |
| `revisarPendiente(quoteId)` | Al cargar o cambiar de cotización | Si esa cotización quedó marcada como no archivada, revela el bloque en estado **pendiente**. |

#### Los cuatro estados

| Estado | Qué se ve |
|---|---|
| **listo** | «Guarda esta cotización en el archivo», el destino a la vista —`2. Arrendamiento / martin@activa.la`— y un selector de archivo. Sabe dónde va a caer antes de mandarlo. |
| **subiendo** | «Subiendo…». El botón y el selector se bloquean: dos clics no pueden producir dos archivos. |
| **guardada** | «Guardada como la 002 de tu carpeta», con el enlace directo a Drive. El número viene en la respuesta del puente; sirve para que el vendedor sepa dónde encontrarla. |
| **error** | El mensaje que devolvió el puente, **textual**. Nunca «ocurrió un error». Más una línea que recuerde que el PDF ya está en su disco: no se perdió nada, solo falta subirlo. |

#### El envío

```js
fetch(endpoint, { method: "POST", body: JSON.stringify(payload) })
```

Sin encabezados propios: con un cuerpo de tipo cadena, `fetch` manda
`Content-Type: text/plain;charset=UTF-8`, que es justo lo que evita la petición de permiso previo
que Apps Script no sabe contestar. **Agregar un `Content-Type: application/json` rompe la
subida.**

El PDF viaja en base64 — `FileReader.readAsDataURL` y se le quita el prefijo `data:…;base64,`.
La respuesta es JSON: `{ok:true, numero:"002", folder:{url}, pdf:{url,name}}` o
`{ok:false, error:"…"}`.

El campo `page` manda la **llave** (`cotizador`, `arrendamiento`, `compra`), nunca el nombre de la
carpeta de Drive — `1. upgrade_edu`, `2. Arrendamiento`, `3. Compra`—. El puente traduce de una a
otra, y así renombrar una carpeta maestra no obliga a tocar las tres páginas. El nombre completo
del archivo, incluido el número correlativo, **lo arma el puente**: la página no lo calcula ni lo
propone.

#### Validaciones antes de mandar

1. `location.protocol === "file:"` → no ofrecer la subida. Explicar que hay que usar la URL
   publicada. **Fallar en silencio aquí es lo peor que puede pasar**, porque las páginas abren
   con doble clic a propósito y alguien va a intentarlo.
2. El archivo tiene que ser PDF (`type` o extensión).
3. Si el nombre del archivo no contiene el `nombreSugerido`, avisar antes de subir — puede haber
   elegido el PDF equivocado. Es un aviso, no un bloqueo: **no podemos leer el contenido, así que
   no podemos garantizar nada.**
4. Correo del vendedor presente. Ya es obligatorio para emitir el documento, pero el módulo no
   debe asumirlo.

#### Lo pendiente

Al imprimir, marcar la cotización como no archivada bajo
`activa.<page>.archivo-pendiente.v1`, guardando la instantánea (metadatos + JSON, unos pocos KB).
Al archivar con éxito, quitarla.

**No se puede guardar el PDF ahí** —pesa de más para `localStorage`— así que reintentar significa
volver a elegir el archivo, que el vendedor todavía tiene en su disco. No hace falta reimprimir.
Que el texto del estado pendiente lo diga así, sin prometer un reintento automático que no existe.

### 2 · El bloque en cada cotizador

Un contenedor y su llamado a `ArchivoDrive.montar(...)`, más tres enganches: `capturar()` en
`preparePrint()`, `mostrar()` en `afterprint`, `revisarPendiente()` al cargar una cotización.

Cada página tiene su propia paleta en su `:root` y el bloque debe verse como parte de ella, no
como un injerto. El módulo pone la estructura y el comportamiento; **el color lo pone la página.**

### 3 · La huella que le falta a arrendamiento

`cotizador` y `compra` ya tienen `printSignature()` / `PRINT_READY_SIGNATURE`, que detecta si el
estado cambió después de preparar la impresión. **`arrendamiento` no la tiene.** Hay que
agregársela, calcada de las otras dos, o el estado archivado puede no corresponder al PDF.

### 4 · La documentación

- `docs/estructura.md`: agregar `compartidos/js/archivo-drive.js` al árbol y mencionar
  `docs/drive-PDF/`. Hoy el documento afirma que todo el repositorio corre en el navegador, y el
  `.gs` es la primera excepción.
- El `README.md` de cada cotizador: una sección corta sobre el archivo.

---

## Lo que no se toca

- **El CSS de impresión.** Ni `@page`, ni `.pp-body`, ni el pie repetido, ni los saltos de
  página. El documento que recibe el colegio no cambia en nada. Todo el diseño se apoya en que el
  PDF siga siendo exactamente el mismo.
- **`buildPrintDocument()` y lo que produce.**
- **El motor de cálculo, la persistencia y el folio.** El módulo lee; no escribe nada del estado.
- **Las pruebas internas de cada página.** Tienen que seguir pasando.
- Si el módulo no carga, la página tiene que funcionar igual que hoy. El archivo es una capa
  encima, nunca un requisito.

---

## El orden

1. **Solo `arrendamiento`.** Es la más pequeña de las tres. De punta a punta.
2. **Parar ahí.** Se prueba con una cotización real desde la URL publicada antes de replicar
   nada. Si el módulo quedó bien, las otras dos son tres líneas de configuración; si replicar
   duele, es que el módulo quedó mal y hay que arreglarlo antes, no después.
3. **`compra` y `cotizador`.**

> Los tres `index.html` y sus `README.md` pueden tener cambios sin confirmar de otro trabajo en
> curso. Revisar `git status` antes de empezar y no pisar nada.

---

## Cómo se sabe que quedó bien

| # | Prueba | Resultado esperado |
|---|---|---|
| 1 | Abrir la página con doble clic, desde `file://` | El bloque explica que hay que usar la URL publicada. No ofrece subir, y no falla en silencio |
| 2 | Cargar la página y no imprimir | El bloque no aparece por ningún lado |
| 3 | Generar el PDF y cancelar el diálogo | El bloque aparece igual: el vendedor pudo haber guardado |
| 4 | Subir una cotización | Cae en `‹carpeta maestra›/‹correo›/` como `001._Colegio · fecha · folio.pdf`, con su `001.1_…json` al lado |
| 5 | Doble clic rápido en subir | Un solo archivo en Drive |
| 6 | Elegir un PDF de otro folio | Avisa antes de subir, pero deja continuar |
| 7 | Elegir un archivo que no es PDF | Lo rechaza con un mensaje que dice qué se esperaba |
| 8 | Mandar con un correo que no sea `@activa.la` | El puente lo rechaza y la página muestra ese mensaje textual |
| 9 | Editar la cotización entre imprimir y subir | El JSON archivado es el de antes de editar, y corresponde al PDF |
| 10 | Cortar la red y subir | Estado de error, marca de pendiente, y el aviso de que el PDF sigue en su disco |
| 11 | Reabrir esa cotización | Aparece el estado pendiente y deja volver a elegir el archivo, sin reimprimir |
| 12 | Subir la misma cotización dos veces | Quedan las dos, con números correlativos distintos. Nada se sobrescribió ni se fue a la papelera |
| 13 | Comparar el PDF con uno de antes del cambio | Idénticos |
| 14 | Correr las pruebas internas de la página | Pasan todas |

---

## Configuración pendiente

`ARCHIVO_ENDPOINT` no existe todavía: sale de desplegar [`archivo-drive.gs`](archivo-drive.gs) y
termina en `/exec`. Hasta que exista, dejarlo como constante vacía y que el módulo muestre que el
archivo no está configurado — sin romper la página.

```js
const ARCHIVO_ENDPOINT = "";                                  // ← la URL /exec
const ARCHIVO_TOKEN    = "rCgPsZv23PeC7XaIJ64buDStasFDDx0D";
```

El token es deliberadamente visible: vive en el JavaScript de un sitio público y cualquiera puede
leerlo. Es un candado contra rastreadores, no una cerradura. **El muro de verdad es que el puente
solo acepta correos `@activa.la`.**
