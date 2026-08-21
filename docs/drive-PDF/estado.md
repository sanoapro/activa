# El archivo de cotizaciones en Drive · estado al 21-ago-2026

Documento de traspaso. Resume **qué quedó construido, qué está verificado, qué no está hecho
y qué conviene cuestionar**. Repositorio: `sanoapro/activa`, rama `main`.

Contexto de diseño completo: [`plan.md`](plan.md) · encargo original: [`prompt.md`](prompt.md)

---

## El problema que se resolvió

Cada cotización que sale de los cotizadores terminaba **solo en la laptop de quien la hizo**.
Ahora, además, puede quedar archivada en Google Drive, en la carpeta de ese vendedor, sin que
nadie tenga que acordarse de subirla a mano.

---

## Estado por fases

El plan tenía cuatro fases. Van dos y media.

| | Fase | Estado |
|---|---|---|
| 1 | **El puente** (Apps Script) desplegado y probado | ✅ **Hecho** — responde y ve la carpeta raíz |
| 2 | **Arrendamiento** enganchado de punta a punta | ✅ **Hecho** — en `main`, publicado |
| 3 | **La prueba real** con una cotización de verdad en Drive | ⏳ **Pendiente** — ya es posible, aún no se ha corrido |
| 4 | **Compra y cotizador** | ❌ **No empezado** |

> **Lo más importante para quien revise:** la fase 3 **no está hecha**. Nadie ha subido todavía un
> archivo real a Drive desde la página publicada. El puente contesta a un `GET` de diagnóstico,
> pero la escritura real (`POST` con PDF + JSON) no se ha ejercitado ni una sola vez fuera de un
> simulador. Ver «Lo que está verificado» abajo.

---

## Cómo funciona (las tres piezas)

### 1. El puente — [`archivo-drive.gs`](archivo-drive.gs)

Un Google Apps Script desplegado en `script.google.com` como **aplicación web**, con
*Ejecutar como: yo (`martin@activa.la`)* · *Acceso: cualquier persona*.

Esa combinación es el truco entero: **los vendedores no firman con nada**, porque quien escribe
en Drive es la cuenta que desplegó el script, no la suya.

- Recibe un `POST` con `Content-Type: text/plain` — a propósito, para evitar el preflight de CORS.
- Escribe en `‹raíz›/‹carpeta maestra›/‹correo del vendedor›/`, creando carpetas si no existen.
- Nombra los archivos `001._Colegio · fecha · folio.pdf` y `001.1_….json`. El número es
  correlativo **dentro de la carpeta de cada vendedor**, con tres dígitos para que Drive —que
  ordena por texto— no meta la 10 entre la 1 y la 2.
- Todo pasa dentro de un `LockService` porque resolver la carpeta, contar y escribir dependen
  entre sí: dos vendedores simultáneos sin candado se llevarían el mismo número.
- **Versiona, nunca borra.** Nada se pisa ni se manda a la papelera.
- Solo acepta correos `@activa.la`.

La copia en el repositorio es **texto inerte**: no se ejecuta ni se enlaza desde ninguna página.
Existe para tener historial. **Al cambiarla hay que volver a desplegar a mano**
(Implementar › Gestionar implementaciones › lápiz › Versión: nueva). Guardar no basta.

### 2. El módulo compartido — [`compartidos/js/archivo-drive.js`](../../compartidos/js/archivo-drive.js) (382 líneas)

Una sola copia de la lógica para los tres cotizadores. Expone `ArchivoDrive.montar({...})` que
devuelve tres métodos: `capturar()`, `mostrar()`, `revisarPendiente(quoteId)`.

Dibuja el bloque «Guardar en el archivo» con sus estados (oculto, listo, subiendo, error,
pendiente en ámbar), valida el archivo elegido, hace el `POST` y administra la marca de
pendientes en `localStorage`.

### 3. El enganche en la página — [`paginas/arrendamiento/index.html`](../../paginas/arrendamiento/index.html)

Todo lo que otra página necesita replicar son **cinco cosas**:

1. Un contenedor vacío: `<div id="archivoDrive"></div>`.
2. El `<script src="../../compartidos/js/archivo-drive.js">`.
3. La llamada a `ArchivoDrive.montar({page, endpoint, token, contenedor, datos})`.
4. Tres invocaciones: `capturar()` al preparar la impresión **y también en la ruta de `Ctrl+P`**,
   `mostrar()` en `afterprint`, `revisarPendiente()` en el render del documento.
5. La **huella de impresión** (`printSignature()` / `PRINT_READY_SIGNATURE`), invalidada por
   `markChanged()`.

---

## Las decisiones de diseño que conviene revisar

Estas son deliberadas. Si algo se va a discutir, que sea esto:

**La instantánea se congela al IMPRIMIR, no al subir.**
`datos()` se invoca dentro de `capturar()`. Si el vendedor edita la cotización entre imprimir y
subir, el JSON archivado sigue correspondiendo al PDF que salió. La huella de impresión existe
justamente para garantizar esa correspondencia. Es la propiedad más importante del diseño.

**El bloque aparece aunque el vendedor haya cancelado la impresión.**
El navegador **no le dice a la página** si guardaste el PDF o cancelaste el diálogo — `afterprint`
se dispara igual en ambos casos. No es un defecto: es que la información no existe. Se eligió
pecar de insistente.

**Subir es opcional pero insistente.**
La cotización se marca como pendiente al imprimir; si no se sube, el bloque reaparece en ámbar al
reabrirla y se vuelve a elegir el PDF sin reimprimir. No bloquea el envío del correo al colegio —
obligarlo sería un estorbo justo en una junta.

**El token es visible a propósito.**
`ARCHIVO_TOKEN` vive en el JavaScript de un sitio público y cualquiera puede leerlo. Es un candado
contra rastreadores que tropiecen con la URL, **no una cerradura**. El muro real es que el puente
solo acepta correos `@activa.la`. Está ahora también en un repositorio público de GitHub. Rotarlo
exige cambiarlo en los dos lados a la vez.

**El archivo es una capa encima, nunca un requisito.**
Si el módulo no cargara, `ArchivoDrive` no existe, `ARCHIVO` queda en `null` y **todas** las
llamadas van con `?.`. La página cotiza igual que antes. Si `ARCHIVO_ENDPOINT` estuviera vacío, el
bloque lo dice y nada se rompe.

**El JSON archivado es el mismo sobre que «Exportar».**
`fileType:"activa-lease-quote"`, así que lo archivado en Drive se reabre tal cual con
Cotizaciones → Importar JSON.

---

## Lo que está verificado, y cómo

La lista de aceptación son 14 pruebas. **11 verificadas, 3 sin correr.**

Verificadas con tres métodos: la suite interna de la página corriendo automatizada en un navegador
sin cabeza (**41/41**), un arnés funcional con el puente simulado (un `fetch` falso que devuelve
lo mismo que el `.gs`, incluidos sus errores), y la página real servida por `http://` — no abierta
con doble clic.

| # | Prueba | Estado |
|---|---|---|
| 1 | Desde `file://` explica que hay que usar la URL publicada | ✅ |
| 2 | Cargar sin imprimir → el bloque no existe | ✅ |
| 3 | Generar y cancelar → el bloque aparece igual | ✅ (por construcción, ver arriba) |
| 5 | Doble clic → una sola llamada, botón bloqueado en «Subiendo…» | ✅ |
| 6 | PDF de otro folio → avisa y deja continuar | ✅ |
| 7 | No-PDF → rechazado diciendo qué se esperaba | ✅ |
| 9 | Editar entre imprimir y subir → el payload lleva el JSON congelado | ✅ |
| 10 | Corte de red → error concreto, pendiente marcado, el PDF sigue en disco | ✅ |
| 11 | Reabrir → estado pendiente, reelegir archivo sin reimprimir | ✅ |
| 13 | El PDF salió idéntico al de antes del cambio | ✅ |
| 14 | Suite interna | ✅ 41/41 |

### Las 3 que faltan correr

Estas tres son **lógica del puente**, no de la página. Hasta hace unas horas eran imposibles de
probar porque el Apps Script no estaba desplegado. **Ya se puede: nadie las ha corrido todavía.**

| # | Prueba | Qué falta |
|---|---|---|
| 4 | Que caiga en `2. Arrendamiento/‹correo›/` como `001._….pdf` + `001.1_….json` | El *sobre* que manda la página ya se cotejó campo por campo contra lo que valida `readRequest_()`. Falta ver la escritura real en Drive. |
| 8 | Rechazo de correo que no sea `@activa.la` | Media prueba hecha (el error textual del `.gs` simulado). Falta contra el puente vivo. |
| 12 | Dos subidas → dos números correlativos, nada borrado | Es el candado `LockService` del puente. Nunca se ha ejercitado. |

**Lo único que sí se probó contra el puente real** es un `GET` de diagnóstico, que respondió:

```json
{"ok":true,"service":"archivo-activa",
 "root":"(11. Cotizaciones 2026- 2027)",
 "rootUrl":"https://drive.google.com/drive/folders/1sUoQ2kvv7Jk6qInvOZhSQM3OcUFVA4Zx"}
```

Eso confirma que el despliegue está vivo y que el ID de la carpeta raíz sirve. **No confirma que
escribir funcione.**

---

## Lo que NO está hecho

1. **La prueba real (fase 3).** Las tres pruebas de arriba, con una cotización de verdad desde
   `https://sanoapro.github.io/activa/paginas/arrendamiento/`. Es el siguiente paso y bloquea al
   que sigue: *nada se replica hasta que esto funcione*.
2. **Compra y el cotizador (fase 4).** El módulo compartido ya existe; falta el contenedor, el
   `<script>`, el `montar()` con sus tres líneas de configuración, las tres llamadas y —en las que
   no la tengan— la huella de impresión. Debería ser mecánico; si no lo es, el módulo quedó mal.
3. **Borrar la carpeta `prueba@activa.la`** que dejó la función `probar()` del `.gs` al pedir
   permisos.
4. **Bajar a los cuatro vendedores de Editor a Lector** en la carpeta de Drive. Pueden subir igual
   —quien escribe es la cuenta del despliegue— y así nadie puede vaciar el archivo, ni por
   accidente ni al irse de la empresa.
5. **Decidir si la raíz se mueve a una unidad compartida.** Hoy el archivo **pertenece a una
   persona**: si esa cuenta se cierra, se va con ella. Conviene resolverlo antes de que haya mucho
   adentro. *(Riesgo real, no cosmético.)*
6. **Decidir qué pasa con las cotizaciones viejas.** Lo ya cotizado este año no entra solo.
   Propuesta en [`plan.md`](plan.md): que el archivo empiece de cero.

---

## Riesgos conocidos

- **El archivo depende de una cuenta personal.** Punto 5 de arriba. Es el riesgo más serio.
- **Cambiar el `.gs` no basta con guardarlo**: hay que volver a desplegar como versión nueva, o el
  código viejo sigue corriendo. Fácil de olvidar.
- **Cambiar un nombre en `CONFIG.pages` no mueve lo ya archivado**: crearía una carpeta nueva y
  dejaría la vieja atrás.
- **El token quedó en un repositorio público.** Consciente y documentado, pero conviene que quien
  revise lo confirme como aceptable en vez de descubrirlo.
- **`ARCHIVO` se declara con `const` después de las funciones que lo usan.** Se verificó que no hay
  problema de orden: el arranque de la página ocurre después de esa línea. Vale la pena que un
  segundo par de ojos lo confirme.

---

## Los commits

| Commit | Qué trae |
|---|---|
| `7f89c1f` | El diseño completo en `docs/drive-PDF/` (plan, encargo, la copia del `.gs`) |
| `41f6c42` | El módulo compartido + el enganche en arrendamiento + docs. También corrigió el README, que contaba 37 pruebas cuando ya eran 41 |
| `e9345c2` | `ARCHIVO_ENDPOINT` deja de estar vacío: el puente desplegado, y los README dejan de decir «falta desplegar» |

Todo en `main` y publicado. No hay build, ni CI, ni `node_modules`: lo que está en el repositorio
es exactamente lo que se publica.
