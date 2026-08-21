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

El plan tenía cuatro fases. **Están las cuatro.**

| | Fase | Estado |
|---|---|---|
| 1 | **El puente** (Apps Script) desplegado y probado | ✅ **Hecho** — responde y ve la carpeta raíz |
| 2 | **Arrendamiento** enganchado de punta a punta | ✅ **Hecho** — en `main`, publicado |
| 3 | **La prueba real** con escritura en Drive | ✅ **Hecha el 21-ago-2026** — escritura real, rechazo de dominio y candado bajo concurrencia, todo contra el puente vivo. Queda una pasada manual de cortesía desde la URL publicada (abajo) |
| 4 | **Compra y cotizador** | ✅ **Hecho el 21-ago-2026** — el mismo módulo sin tocarle una línea; solo el contenedor, el `<script>`, `montar()` y las tres llamadas por página. Verificado con subida real a `3. Compra/…` y `1. upgrade_edu/…` (carpeta `prueba@activa.la`), suites 55/55 y 87/87 |

La replicación de la fase 4 era la prueba de fuego del módulo compartido: *si replicar duele, el
módulo quedó mal*. No dolió — el diff por página son el contenedor, la etiqueta `<script>`, el
bloque `montar()` con su sobre de exportación propio, y una llamada en cada uno de cuatro
lugares que ya existían.

> **La escritura real ya se ejercitó.** El 21-ago-2026 se subieron archivos de verdad a Drive a
> través del módulo corriendo en un navegador (fetch + CORS + la redirección de Apps Script,
> como en producción), contra la carpeta desechable `prueba@activa.la`. Ver «Lo que está
> verificado». Lo único que ningún humano ha hecho todavía es el flujo completo con las manos:
> abrir `https://sanoapro.github.io/activa/paginas/arrendamiento/`, generar un PDF real con
> *Guardar como PDF* y subirlo con el botón. Es una confirmación de experiencia, no de mecánica —
> la mecánica ya está probada.

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

### 3. El enganche en cada página — ya en las tres

[`arrendamiento`](../../paginas/arrendamiento/index.html) (21-ago-2026),
[`compra`](../../paginas/compra/index.html) y [`cotizador`](../../paginas/cotizador/index.html)
(mismo día, fase 4). El enganche por página son **cinco cosas**:

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
`fileType:"activa-lease-quote"` (y sus equivalentes en compra y el cotizador), así que lo
archivado en Drive se reabre tal cual por dos puertas que comparten el mismo camino de
validación (`importQuotePayload()`): **Cotizaciones → Importar JSON** con el archivo
descargado, o el botón **«Insertar JSON»** del encabezado (21-ago-2026) pegando el texto
copiado del visor de Drive. Ese botón sustituyó a «Compartir»: el enlace de escenario perdió
su botón dedicado, aunque el hash y el código del modal de Cotizaciones siguen funcionando.

---

## Lo que está verificado, y cómo

La lista de aceptación son 14 pruebas. **14 verificadas.**

Con cuatro métodos: la suite interna de la página corriendo automatizada en un navegador
sin cabeza (**41/41**), un arnés funcional con el puente simulado (un `fetch` falso que devuelve
lo mismo que el `.gs`, incluidos sus errores), la página real servida por `http://` — no abierta
con doble clic—, y el 21-ago-2026 **el puente vivo escribiendo en Drive de verdad**: el módulo
corriendo en un navegador subió a la carpeta desechable `prueba@activa.la` (fetch + CORS + la
redirección de Apps Script, la misma mecánica que en producción).

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

### Las 3 del puente, corridas el 21-ago-2026 contra Drive de verdad

| # | Prueba | Resultado |
|---|---|---|
| 4 | Que caiga en `2. Arrendamiento/‹correo›/` como `001._….pdf` + `001.1_….json` | ✅ El puente respondió `ok:true, numero:"001"`, `folder.path: "2. Arrendamiento/prueba@activa.la"`; en Drive quedaron `001._PRUEBA - borrar · 2026-08-21 · PRB-… r1.pdf` y su `001.1_….json` al lado. Subido **a través del módulo en un navegador**, no con un cliente a mano. |
| 8 | Rechazo de correo que no sea `@activa.la` | ✅ Un `POST` con un gmail devolvió textual `{"ok":false,"error":"El correo debe ser de activa.la."}` y no escribió nada. |
| 12 | Dos subidas → dos números correlativos, nada borrado | ✅ Segunda subida de la misma cotización → `002`, nombre e ID de Drive distintos, la primera intacta. Y **el candado bajo concurrencia real**: dos `POST` disparados al mismo tiempo salieron `003` y `004`, sin colisión — que es exactamente la carrera para la que existe el `LockService`. |

Detalle que salió a la luz y es **comportamiento escrito del `.gs`**, no un error: el nombre del
archivo termina en un espacio y `r1` aunque sea la primera revisión, porque `baseName_()` solo
omite la revisión cuando vale `'0'` y en las páginas la revisión arranca en 1. Si molesta, el
cambio es una línea del `.gs` (omitir también `'1'`) **más un redespliegue**; mientras, es
informativo.

El `GET` de diagnóstico sigue respondiendo:

```json
{"ok":true,"service":"archivo-activa",
 "root":"(11. Cotizaciones 2026- 2027)",
 "rootUrl":"https://drive.google.com/drive/folders/1sUoQ2kvv7Jk6qInvOZhSQM3OcUFVA4Zx"}
```

---

## Lo que NO está hecho

1. **La pasada manual desde la URL publicada.** La mecánica completa ya está probada contra
   Drive (ver arriba); falta que una persona haga el flujo con las manos una vez —abrir
   `https://sanoapro.github.io/activa/paginas/arrendamiento/`, cotizar algo real, *Guardar como
   PDF*, subirlo con el botón y abrir el enlace que devuelve—. Confirma la experiencia, no la
   mecánica. Cinco minutos.
2. **Borrar las tres carpetas `prueba@activa.la`** — una por carpeta maestra. La de
   `2. Arrendamiento/` la dejó `probar()` y las pruebas le dejaron **8 archivos** (`001` a `004`
   con sus `.json`); las de `3. Compra/` y `1. upgrade_edu/` las dejó la verificación de la
   fase 4, con **2 archivos** cada una. Todos dicen «PRUEBA - borrar» en el nombre. Borrar las
   carpetas enteras cuando ya no haga falta enseñarlas.
3. **Bajar a los cuatro vendedores de Editor a Lector** en la carpeta de Drive. Pueden subir igual
   —quien escribe es la cuenta del despliegue— y así nadie puede vaciar el archivo, ni por
   accidente ni al irse de la empresa.
4. **Decidir si la raíz se mueve a una unidad compartida.** Hoy el archivo **pertenece a una
   persona**: si esa cuenta se cierra, se va con ella. Conviene resolverlo antes de que haya mucho
   adentro. *(Riesgo real, no cosmético.)*
5. **Decidir qué pasa con las cotizaciones viejas.** Lo ya cotizado este año no entra solo.
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
