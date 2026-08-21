# El plan

Diseño completo del archivo de cotizaciones en Drive. Cerrado el 21 de agosto de 2026.

---

## El problema

Los tres cotizadores guardan su trabajo en `localStorage`: ese navegador, esa computadora, ese
perfil. Si el vendedor cambia de máquina, limpia el navegador o deja la empresa, la cotización
se fue. Y el PDF que recibió el colegio solo existe donde él lo haya guardado.

El resultado es que **no hay memoria de equipo**. Nadie puede ver qué se le cotizó al Instituto
Tal en marzo, ni con qué precio, ni quién lo atendió.

---

## Dónde vive cada cosa

Son tres lugares distintos y solo uno guarda cotizaciones.

| Qué | Dónde vive | Quién lo toca |
|---|---|---|
| El módulo y los cambios a las tres páginas | El repositorio → GitHub Pages | El repositorio. Los vendedores nunca lo ven |
| El puente que escribe en Drive | `script.google.com` | Se pega y se despliega una vez |
| Una copia del puente, como texto | `docs/drive-PDF/archivo-drive.gs` | Nadie. Solo deja historial |
| **Los PDF y los JSON** | **Google Drive, y nada más** | Los vendedores, al subir |

El camino que recorre un PDF es **navegador del vendedor → el puente en Google → Drive**. GitHub
no aparece en esa ruta ni una vez: el sitio es estático, no tiene servidor, y no existe manera de
que guarde un archivo aunque quisiéramos.

Los vendedores tampoco necesitan acceso al repositorio. Hoy no lo tienen y ya usan los tres
cotizadores: abren la página publicada y ya.

---

## Cómo funciona

| | Paso | Quién |
|---|---|---|
| 1 | Genera el PDF. El navegador lo fabrica. | Pasa solo |
| 2 | Elige *Guardar como PDF*. El archivo cae en su computadora. | **A mano** |
| 3 | La página muestra *Guardar en el archivo*. Un clic, selecciona ese PDF. | **A mano** |
| 4 | La página lo manda al puente, junto con el estado de la cotización. | Pasa solo |
| 5 | El puente lo escribe en Drive, en la carpeta del correo del vendedor. | Pasa solo |

### Por qué hay dos pasos manuales

Porque el PDF no lo hace el código, lo hace Chrome. Los tres cotizadores llaman a
`window.print()` y el navegador abre su propio diálogo. La página nunca recibe el archivo, no se
entera de si el vendedor guardó o canceló, ni con qué nombre. **No hay nada que interceptar.**

La alternativa sería regenerar el PDF en JavaScript con una librería. No conviene: se perdería
el CSS de impresión ya afinado —el pie repetido en todas las hojas, los saltos de página, los
milímetros— y el documento que recibe el colegio dejaría de ser el mismo. Un clic extra cuesta
menos que un PDF peor.

### Por qué un puente y no una cuenta de Google

El puente es un Apps Script publicado como aplicación web con **Ejecutar como: yo** y **Acceso:
cualquier persona**. Esa combinación es todo el truco: quien escribe en Drive es la cuenta del
despliegue, no la del vendedor. Por eso nadie tiene que firmar con nada, ni hace falta proyecto
en Google Cloud, ni client ID, ni pantalla de consentimiento, ni manejo de tokens.

Una carpeta «pública con liga, rol editor» no habría servido. Ese permiso sirve para que un
humano entre por la interfaz de Drive; **la API siempre exige credenciales**. No existe forma
anónima de escribir un archivo en Drive.

### La dirección y el permiso son cosas distintas

El ID de la carpeta **es** su liga — el pedazo final de la URL de Drive:

```text
https://drive.google.com/drive/folders/1sUoQ2kvv7Jk6qInvOZhSQM3OcUFVA4Zx
                                       └──────────── el ID ────────────┘
```

Esa es la **dirección**: no cambia aunque se le cambie el nombre a la carpeta o se mueva de
lugar. Con quién esté compartida es otra cosa —el **permiso**— y se configura aparte. Una
carpeta privada y una compartida con medio mundo tienen exactamente el mismo tipo de liga.

Por eso el puente no necesita que la carpeta esté compartida con nadie: **entra con las llaves de
la cuenta que lo desplegó**. Necesita la dirección, no la lista de quién más tiene copia.

---

## El árbol

Una sola carpeta raíz. Adentro, **tres carpetas maestras** —una por cotizador— y dentro de cada
una, **una subcarpeta por correo de vendedor**. Nadie las crea a mano: nacen la primera vez que
ese vendedor sube algo.

```text
11. Cotizaciones 2026-2027/            ← 1sUoQ2kvv7Jk6qInvOZhSQM3OcUFVA4Zx
├── 1. upgrade_edu/                    ← el cotizador
│   └── josue@activa.la/
├── 2. Arrendamiento/
│   ├── martin@activa.la/
│   │   ├── 001._Colegio Cumbres · 2026-08-19 · MM-20260819-03-R01.pdf
│   │   ├── 001.1_Colegio Cumbres · 2026-08-19 · MM-20260819-03-R01.json
│   │   ├── 002._ITJ Querétaro · 2026-08-21 · MM-20260821-01-R02.pdf
│   │   └── 002.1_ITJ Querétaro · 2026-08-21 · MM-20260821-01-R02.json
│   └── zeni@activa.la/
│       └── 001._Colegio Vista Hermosa · 2026-08-20 · EZ-20260820-01-R01.pdf
└── 3. Compra/
    └── gabriel@activa.la/
```

La llave que manda la página (`cotizador`, `arrendamiento`, `compra`) y el nombre que se ve en
Drive son cosas distintas: el puente traduce de una a otra. **Cambiar un nombre maestro en el
puente no mueve lo ya archivado** — crearía una carpeta nueva y dejaría la vieja atrás. Si algún
día hay que renombrarlas, se renombran en Drive *y* en el puente, a la vez.

**La llave del vendedor es el correo, no el nombre.** «Martin», «Martín M.» y «MARTIN MALDONADO»
caerían en tres carpetas distintas. El correo ya es obligatorio para emitir el documento y ya se
valida con expresión regular en los tres cotizadores: la llave que hace falta ya existe y ya está
limpia.

### El número

Cada cotización se lleva un número correlativo **dentro de la carpeta de ese vendedor**: el PDF
es `001._`, su JSON es `001.1_`, la siguiente cotización es `002._`, y así. El vendedor ve el
orden en que hizo las cosas sin tener que leer fechas.

Tres detalles que hacen que eso funcione de verdad:

- **Van con ceros a la izquierda.** Drive ordena por texto, no por número. Sin los ceros, la 10
  se metería entre la 1 y la 2 y el número perdería justo el orden cronológico que existe para
  dar. Con tres dígitos aguanta hasta la 999 por vendedor y por cotizador.
- **El número que sigue es el mayor que ya existe, más uno** — no la cantidad de archivos. Cada
  cotización deja dos archivos, y si alguien borra uno a mano, contar reutilizaría un número ya
  usado.
- **Se calcula dentro del candado**, junto con la creación de la carpeta y la escritura. Las tres
  cosas dependen entre sí: dos vendedores subiendo al mismo tiempo, sin candado, se llevarían el
  mismo número.

### Lo que va después del número

**Colegio · fecha · folio**, y en ese orden por una razón: el número ya carga el orden
cronológico, así que la fecha no necesita ir al frente. Lo que un vendedor busca con los ojos al
abrir su carpeta es el nombre del colegio, no el día.

```text
001._Colegio Cumbres · 2026-08-19 · MM-20260819-03-R01.pdf
     └─── colegio ──┘   └─ fecha ─┘   └───── folio ─────┘
```

Lo arma el puente, no la página, para que todo el archivo se vea igual aunque mañana un cotizador
mande un campo distinto. El folio y la revisión vienen de `folioDisplay()`, que los tres
cotizadores ya llevan.

---

## Lo que se manda

Un solo `POST` con este cuerpo, en `Content-Type: text/plain` — a propósito: así el navegador no
dispara la petición de permiso previo que Apps Script no sabe contestar.

| Campo | De dónde sale | Para qué |
|---|---|---|
| `token` | Constante en la página | Candado mínimo contra rastreadores |
| `page` | Fija por cotizador | Elige una de las tres carpetas |
| `sellerEmail` | `APP_STATE.seller.email` | **La llave.** Decide la subcarpeta |
| `institution` | `APP_STATE.client.institution` | Nombre del archivo |
| `quoteDate` | `APP_STATE.validity.quoteDate` | Prefijo del nombre, para ordenar |
| `folio` | `APP_STATE.identity.folioRoot` | Distingue cotizaciones |
| `revision` | `APP_STATE.identity.revision` | Distingue versiones de la misma |
| `pdf` | El archivo que eligió el vendedor | El documento, en base64 |
| `json` | Estado **al momento de imprimir** | Permite reabrir y editar después |

La respuesta es JSON: `{ok:true, numero:"002", folder:{url}, pdf:{url,name}, json:{…}}` o
`{ok:false, error:"…"}`. El `numero` sirve para que la página pueda decir «quedó como la 002 de
tu carpeta» en vez de solo «guardada».

El campo `page` manda la **llave** (`cotizador`, `arrendamiento`, `compra`), no el nombre de la
carpeta. El puente traduce. Así, renombrar una carpeta maestra no obliga a tocar las tres
páginas.

### Por qué el JSON vale tanto como el PDF

Pesa unos kilobytes y cambia la naturaleza del archivo: un PDF de hace seis meses solo se lee, un
JSON se vuelve a abrir, se edita y se recotiza. Es la diferencia entre guardar papeles y tener
memoria de trabajo.

---

## Lo que ve el vendedor

Un bloque que aparece **después** de generar el PDF, nunca antes —si aparece antes, no hay nada
que subir y solo estorba—. Cuatro estados, y cada uno dice exactamente qué pasó:

| Estado | Qué dice |
|---|---|
| **listo** | «Guarda esta cotización en el archivo», con el destino a la vista: *arrendamiento / <martin@activa.la>*. Sabe dónde va a caer antes de mandarlo. |
| **subiendo** | «Subiendo…», y el botón se bloquea. Dos clics no deben producir dos archivos. |
| **guardada** | «Guardada como la 002 de tu carpeta», con el enlace directo. Se verifica en el momento, y el número le dice al vendedor dónde va a encontrarla. |
| **error** | El motivo concreto y qué hacer. Nunca «ocurrió un error». El PDF ya está en su disco: no se perdió nada, solo falta subirlo. |

Y si algo falla, la página **recuerda que quedó pendiente**. La próxima vez que se abra esa
cotización, ofrece reintentar. Sin eso, un corte de internet significa que ese documento nunca
entra al archivo y nadie se entera.

---

## Las reglas duras

| Regla | Qué significa |
|---|---|
| **dominio** | Solo correos `@activa.la`. Un typo (`activa.1a`, un gmail) se rechaza en vez de generar una carpeta fantasma que nadie vuelve a mirar. |
| **versión** | Nunca se pisa ni se manda nada a la papelera, y no por disciplina sino por construcción: `createFile` siempre crea uno nuevo, y el número correlativo no puede repetirse. Archivar dos veces la misma cotización deja las dos, con números distintos. |
| **carpetas** | Solo esas tres llaves de primer nivel. Una página no puede inventar un árbol nuevo por un error de dedo. |
| **candado** | Dos vendedores subiendo al mismo tiempo no pueden crear dos carpetas con el mismo nombre. Drive lo permitiría, y el archivo quedaría partido en dos. |
| **tamaño** | Tope de 20 MB por archivo. Una cotización ronda los cientos de kilobytes; el tope es holgura, no expectativa. |

---

## Cuando algo sale mal

| Situación | Qué pasa |
|---|---|
| Abre la página con doble clic, desde `file://` | No sube. El navegador bloquea la petición desde un archivo local. La página lo detecta y lo dice, en vez de fallar en silencio. **El flujo real tiene que ser por la URL publicada.** |
| Se cae el internet | El PDF ya está en su disco. Queda marcado como pendiente y se reintenta al reabrir la cotización. |
| Selecciona el archivo equivocado | Se valida que sea un PDF y se compara el nombre contra el folio que la página sugirió al imprimir. Si no coincide, avisa antes de subir. *No podemos leer el contenido: es un aviso, no una garantía.* |
| Editó la cotización entre imprimir y subir | El JSON que se manda es el del momento de imprimir, no el de ahora — así el JSON siempre corresponde al PDF. **`cotizador` y `compra` ya tienen esa huella (`printSignature()`); `arrendamiento` no la tiene y hay que agregársela.** |
| Cambió su correo a media cotización | Manda el actual. La carpeta la decide el correo al momento de subir, no el de cuando se creó. |
| Sube dos veces la misma cotización | Quedan las dos, con números correlativos distintos. Nunca se pierde nada, pero la carpeta acumula: es el costo de haber elegido versionar. |
| Un vendedor pasa de 999 cotizaciones en un mismo cotizador | El número sigue creciendo —`1000._`— y el orden deja de ser perfecto a partir de ahí. Más vale un orden imperfecto que empezar a repetir números. |
| Alguien encuentra la URL del puente | Necesita además un correo `@activa.la` válido. Lo peor que puede hacer es ensuciar una carpeta, no leerla ni borrarla. |

---

## Lo que no hace

- **No es automático del todo.** Son dos pasos del vendedor: guardar y elegir. Se puede insistir
  en la interfaz, pero si alguien no lo hace, esa cotización no entra al archivo.
- **No verifica que el PDF sea el correcto.** Puede avisar por el nombre; no puede leer el
  contenido.
- **No funciona fuera de línea**, ni abriendo el HTML localmente.
- **El token es visible.** Vive en el JavaScript de un sitio público. Es un candado, no una
  cerradura; el muro de verdad es el dominio del correo.
- **No hay buscador.** Por ahora la búsqueda es la de Drive. Un índice en Sheets sería un paso
  posterior, y con el JSON ya subido es fácil.

### Privacidad · esto sí importa

Estas cotizaciones llevan RFC, domicilio fiscal, banco, número de cuenta, CLABE y los correos de
los contactos del colegio. El acceso a la carpeta va **por cuenta nombrada**, nunca por liga —
hoy está en *Restringido*, que es lo correcto.

Quedó decidido que todo el equipo ve todo: la carpeta por vendedor **organiza, no aísla**. Cada
quien puede ver los precios y descuentos que dieron los demás. Es una decisión de negocio
razonable —se cubren entre sí, alguien puede retomar una cuenta— pero conviene que el equipo lo
sepa, no que lo descubra.

---

## Quién hace qué

### Del lado de Drive, una sola vez

1. La carpeta raíz ya existe: **11. Cotizaciones 2026-2027**, ID
   `1sUoQ2kvv7Jk6qInvOZhSQM3OcUFVA4Zx`.
2. Pegar [`archivo-drive.gs`](archivo-drive.gs) en `script.google.com`.
3. Ejecutar la función `probar()` desde el editor: dispara la pantalla de permisos y confirma que
   el ID sirve, antes de desplegar nada.
4. Desplegar como aplicación web: **Ejecutar como: yo** · **Acceso: cualquier persona**.
5. Guardar la URL que termina en `/exec`. Es lo que necesita la página.
6. **Bajar a los cuatro vendedores de Editor a Lector.**

### Lectores, no colaboradores

Parece contradictorio —¿cómo suben si solo pueden leer?— y es justo el regalo de haber puesto un
puente en medio: **quien escribe en Drive es la cuenta del despliegue, no la del vendedor**. Así
que pueden ser Lectores y archivar igual.

Lo que se gana: todo el equipo ve todo, como quedó decidido, y **nadie puede borrar nada** — ni
por accidente, ni al irse de la empresa. Un archivo que cualquiera puede vaciar no es un archivo.

### Del lado del repositorio

1. `compartidos/js/archivo-drive.js`: una sola copia de la lógica para las tres páginas.
2. El bloque de interfaz y sus cuatro estados, en cada cotizador.
3. La huella de impresión que le falta a `arrendamiento`.
4. Actualizar [`estructura.md`](../estructura.md), que hoy no contempla código que no corre en el
   navegador.

El encargo completo está en [`prompt.md`](prompt.md).

---

## El orden

| | Fase | Por qué así |
|---|---|---|
| 1 | **El puente, solo** | Desplegado y probado desde el editor de Apps Script, antes de tocar una sola página. Si el árbol de carpetas no se crea bien, se arregla ahí y no en tres lugares. |
| 2 | **Arrendamiento** | La más pequeña de las tres. De punta a punta: generar, guardar, subir, verificar en Drive. Aquí se descubre lo que no vimos. |
| 3 | **La prueba real** | Con una cotización de verdad, desde la URL publicada. Nada se replica hasta que esto funcione. |
| 4 | **Compra y cotizador** | Mismo módulo, mismo bloque, tres líneas de configuración distintas. Debería ser mecánico — y si no lo es, es que el módulo quedó mal. |

> **Antes de empezar:** los tres `index.html` y sus `README.md` tienen cambios sin confirmar (se
> están quitando los bloques de firma y fiscales). Conviene cerrar ese trabajo antes de entrar a
> los mismos archivos, o coordinar el orden.

---

## Lo que falta decidir

**¿Subir es obligatorio u opcional?**
Propuesta: opcional pero insistente —el bloque se queda visible y en ámbar hasta que suba, sin
bloquear nada—. Obligarlo significaría bloquear el envío del correo al colegio, y eso puede
volverse un estorbo justo en una junta.

**¿Y las cotizaciones viejas?**
Lo que ya se cotizó este año no entra solo. Se puede subir a mano, o dejar que el archivo empiece
de cero desde el día uno. Propuesta: que empiece de cero.

**¿Se mueve la raíz a una unidad compartida?**
Hoy el archivo pertenece a una persona. Si esa cuenta se cierra, se va con ella. Conviene
decidirlo antes de que haya mucho adentro.
