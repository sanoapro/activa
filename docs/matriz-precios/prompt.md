# El encargo

Prompt autocontenido para construir la matriz de precios de los tres cotizadores. Se le pasa
completo a una sesión de Claude Code parada en la raíz del repositorio.

**Antes de ejecutarlo, [`plan.md`](plan.md) tiene que estar leído.** Este documento dice *qué
hacer*; el plan dice *por qué así*, y sin eso las decisiones de aquí parecen arbitrarias.

---

## Contexto

Este repositorio publica las páginas de activa en GitHub Pages. **No hay build, ni CI, ni
bundler, ni `node_modules`**: lo que está aquí es exactamente lo que sirve el navegador. Cada
página es un `index.html` autocontenido con su markup, su CSS, su motor de cálculo, su
persistencia, su impresión y sus pruebas internas adentro.

Tres de esas páginas son cotizadores:

| Archivo | Líneas | Pruebas |
|---|---|---|
| `paginas/arrendamiento/index.html` | 3 521 | 41 |
| `paginas/compra/index.html` | 4 179 | 55 |
| `paginas/cotizador/index.html` | 5 185 | 99 |

Las tres corren su suite con `?test=1` y pintan el resultado en `#testReport`.

---

## El objetivo

En cada una, **un único objeto `PRECIOS` congelado del que salga cada importe y cada porcentaje
del archivo.** Cambiar un precio debe ser editar ahí y nada más.

> **Ningún precio se mueve.** Esto es reorganización, no una actualización de tarifas. Si al
> terminar hace falta editar el valor esperado de una prueba existente, algo se rompió: **para y
> averigua qué** antes de tocar el número.

---

## La forma, idéntica en las tres

Después de los ayudantes de redondeo y **antes de cualquier otra constante de negocio**:

```js
/* ┌──────────────────────────────────────────────────────────────┐
   │  MATRIZ DE PRECIOS · fuente única de verdad                  │
   │  ⚠  TODOS LOS IMPORTES VAN <CON|SIN> IVA                     │
   │  Cambiar un precio es editar ESTE objeto, y nada más.        │
   │  Aquí no se escriben cifras en prosa: el número vive abajo.  │
   └──────────────────────────────────────────────────────────────┘ */
const PRECIOS = deepFreeze({ … });
```

**Regla dura: la cabecera no lleva ni una cifra.** Solo la convención de IVA, la fecha y la
instrucción. El patrón «escribo el número también en prosa» ya falló cuatro veces en el cotizador
—hay comentarios citando $17,000, $2,169.20, $26,600 y $627,776, todos muertos— y este encargo
existe en parte para arreglar eso. No lo repitas.

---

## Antes de tocar nada · cómo trabajar en este repositorio

### Los números de línea son del 22-ago-2026, y se mueven

Este documento y [`plan.md`](plan.md) citan líneas exactas, pero **en cuanto hagas la primera
edición de un archivo, todas las de abajo se recorren**. Úsalas para orientarte y después
**busca por contenido**, no por número. Ejemplo: en vez de «línea 2657», busca `[0,20,30,40]`.

### Dónde va la matriz en cada archivo

Justo **antes del primer objeto de negocio**, que es distinto en cada página:

| Página | Insertar inmediatamente antes de |
|---|---|
| arrendamiento | `const CATALOG = deepFreeze({` |
| compra | `const APP_CONFIG = deepFreeze({` |
| cotizador | `const APP_CONFIG = deepFreeze({` |

En las tres, `deepFreeze` y los redondeos (`roundFinancial`, `roundCurrency`, `money`) ya están
declarados más arriba, así que la matriz puede usarlos.

### Cómo correr las pruebas sin abrir el navegador a mano

```sh
# Un servidor, una vez. La ruta del repo lleva espacios: cita siempre.
python -m http.server 8123 &

# Y por cada página (cambia el nombre de la página y del volcado):
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --virtual-time-budget=25000 --dump-dom "http://127.0.0.1:8123/paginas/cotizador/?test=1" > /tmp/t.html
```

El reporte queda dentro del HTML volcado. Para leerlo, guarda este archivo como `leer.py` y
córrelo con `PYTHONIOENCODING=utf-8 python leer.py /tmp/t.html`:

```python
import re, sys
s = open(sys.argv[1], encoding="utf-8", errors="replace").read()
m = re.search(r"(\d+ de \d+ aprobadas)", s)
print(m.group(1) if m else "SIN REPORTE")
i = s.find("testReport")
txt = re.sub(r"<[^>]+>", "\n", s[i:i + 30000])
for l in (x.strip() for x in txt.split("\n")):
    if l.startswith("✕"):
        print("FALLA:", l)
```

`PYTHONIOENCODING=utf-8` no es opcional: el reporte lleva ✓ y ✕, y sin eso Python revienta al
imprimir en Windows.

### Comprobar la sintaxis

Los tres archivos son HTML con el JavaScript adentro, así que `node --check` necesita que
extraigas el `<script>` primero:

```sh
python -c "
import re
s=open('paginas/cotizador/index.html',encoding='utf-8').read()
b=re.findall(r'<script(?![^>]*src=)[^>]*>(.*?)</script>',s,re.S)
open('/tmp/c.js','w',encoding='utf-8').write(b[0])
" && node --check /tmp/c.js
```

### Dos fricciones de este entorno

- **La ruta del repositorio lleva espacios y acentos.** Cita todas las rutas.
- **Los heredoc de Bash se atragantan** con archivos largos en esta ruta. Para escribir bloques
  grandes usa la herramienta de escritura de archivos, o un script de Python; para ediciones
  puntuales, la de edición.

---

## Fase 1 · arrendamiento

El más pequeño y el más concentrado. **Fija el formato que usarán los otros dos.**

1. **Crear `PRECIOS`** con: `iva` 0.16, `tasaAnual` 0.24, `equipos` (estudiante 7740 con
   `ceu:false` porque la trae integrada, docente 9450 con `ceu:true`), `ceu` 750, `porPlazo`
   (3 años: 36 meses, securly 1050, seguro 1390 · 4 años: 48 meses, securly 1400, seguro 1870),
   `carritos` (20: 24374.70, 30: 26600.70, 40: 31720.50), `limites`, `vigenciaDias` 31.
   **Conserva las anotaciones de celda del Excel** (`/* Q4 */`, `/* Q10 */`…): son la
   trazabilidad de dónde salió cada número.
   La convención declarada: **SIN IVA**, como el Excel (Q2).
2. `CATALOG` y `LIMITS` pasan a derivar de `PRECIOS`.
3. **Jalar los cabos sueltos**: fallback de plazo (1418) → `PLAZOS[0]`; umbral de `CART_EXCESS`
   (1493) → capacidad mínima de `CART_CAPS`; `validateIntegerInput` (2013) → `LIMITS.qty.max`;
   los botones de plazo (843-844) y el texto de capacidades (900) → derivados.
4. **Derivar `FORBIDDEN` (2963) y la expresión regular de fuga (3256) desde `PRECIOS`.** Es el
   punto más valioso de esta fase: hoy están escritas a mano y dejan de proteger en silencio en
   cuanto cambia un precio. Retira `"$490"`, que es el seguro de 1 año de **compra**, colado por
   copiar-pegar y que no corresponde a ningún valor de este catálogo.
5. **La matriz no puede filtrarse al cliente**: vive en el `<script>`, se pinta solo en
   `renderInternalPanel()` (2298-2346), y nunca en `buildProposal()`, `buildPrintDocument()` ni
   `buildMailModel()` (2351-2580).

## Fase 2 · compra

1. **Crear `PRECIOS`** con `iva` 0.16, `vigenciaDias` 31, `entrega`, `limites`, y **`partidas`:
   las 37 claves con su precio neto**, una por renglón, agrupadas por familia con la familia como
   comentario separador. La convención declarada: **NETOS, sin IVA**.
2. Las 37 entradas de `CATALOG` conservan todo lo suyo —`k`, `part`, `fam`, `n`, `d`, `unit`,
   `annual`, `minQty`, `note`— y **reciben el precio por su clave, sin escribirla dos veces**:

   ```js
   const CATALOG = deepFreeze(CATALOGO_BASE.map(e => ({...e, price: PRECIOS.partidas[e.k]})));
   ```

   Escribir `price: PRECIOS.partidas["cb-rugged"]` dentro de la entrada `{k:"cb-rugged", …}`
   repite la clave, y una clave mal tecleada daría `undefined` —es decir, un renglón sin precio—
   sin que nada avise. Inyectarla desde `e.k` lo hace imposible.
   La prueba de la fase 4 debe además comprobar que **el juego de claves de `PRECIOS.partidas`
   y el de `CATALOG` es exactamente el mismo**: así no puede quedar ni un precio huérfano ni una
   partida sin precio.
3. `APP_CONFIG.vat`, `validityDays`, `limits` y `delivery` pasan a derivar.
4. **Agregar a `syncStaticCopy()`** el texto de entrega (1060) y la etiqueta `IVA 16 %` de
   `#barIva` (955): hoy no se sincronizan y pueden divergir en silencio.
5. Derivar los dos `note` que repiten importes a mano: securly (1592, «350 × 3 = 1,050 y
   350 × 4 = 1,400») y profe3 (1712, «$4,999.99»).
6. Retirar `percent()` (1424), que es código muerto.

## Fase 3 · cotizador

El más repartido: su matriz actual es un comentario, enumera 16 importes y deja fuera unos 90
números comerciales más.

1. **Crear `PRECIOS`** con todo lo listado en `plan.md`, sección «Qué entra en cada matriz».
   La convención declarada: **CON IVA, de principio a fin**.
2. **Sustituir el comentario-matriz (2010-2043) por el objeto.** Hacer derivar `APP_CONFIG`
   (`pricing`, `discounts`, `annualFactors`, `equipment`, `limits`, `cycle.validityDays`),
   `DEVICES`, `CART_PRICES`, `TERMS` (`stockPct`, `years`, `docentes[].ratio`), `PAYS`, `LICS`,
   `VOLUME` y `CAP`.
3. **Jalar los cabos sueltos**:
   - `999999` → `limites` en **7 puntos del HTML** (1220, 1256, 1269, 1271, 1289, 1312, 1314) y
     **7 del JS** (2571, 2801, 3114, 3345, 3347, 3352, 3365). **No toques 2263**: es el
     centinela de la última banda de `CAP`, donde el número es la intención;
   - `[0,20,30,40]` (2657) → `CART_CAPS`;
   - el `/55` de la gráfica de volumen (3801) → máximo derivado de `VOLUME`;
   - **el texto de la partida de stock (2141), que se imprime en el PDF** → derivar los
     porcentajes, porque hoy el documento promete 2% y 20% aunque `stockPct` cambie;
   - agregar a `syncStaticCopy()` los rótulos que hoy no repone: «1 por cada 20/10 alumnos»
     (1302, 1305), «50% en agosto» (1494, 1495, 3842), «Carrito de N equipos» (1323-1325).
4. **Retirar código muerto**: `validatePriceInput()` (3133-3146), sin un solo consumidor desde
   que se quitó el campo de precio de carrito, y con él `limits.price`; `cycle.currency` y
   `cycle.locale` (1936-1937), que `money()` ignora porque tiene `"es-MX"`/`"MXN"` clavados.
5. **Corregir los cuatro comentarios desincronizados**: 1851, 4449-4456, 4750-4751 y 4838-4841.
   Los importes que citan ya no existen.
6. La matriz lleva el **aviso recíproco** de que `compartidos/js/precios-ciclo.js` es una copia
   manual de `pricing`, usada por `paginas/precios/` y la lámina 33 del deck: quien cambie un
   precio aquí tiene que actualizarla allá.

## Fase 4 · la prueba, en las tres

Una prueba nueva por página, **«La matriz es la única fuente»**:

1. `Object.isFrozen(PRECIOS)`;
2. **cada constante derivada coincide con su entrada en la matriz** — es lo que detecta que
   alguien vuelva a escribir un importe suelto;
3. los importes de cabecera fijados **con el número escrito a mano**, para que un dedazo dentro de
   la propia matriz también falle.

**No toques** las pruebas que hoy repiten la tabla completa —el objeto `esperado` de compra
(3636) y las composiciones de arrendamiento (3041-3059)—: sus números van a mano a propósito. Si
leyeran de la matriz dejarían de probar nada.

---

## Reglas de la casa

1. **No cambies la lógica para reorganizar.** Si mover un número exige tocar un cálculo, para y
   pregunta.
2. **Los objetos de negocio van congelados** con `deepFreeze`.
3. **Nada de dependencias nuevas.** ES2020 plano, en el estilo compacto de cada archivo.
4. **Las tres páginas siguen cotizando sin red y sin `localStorage`.**
5. **Una página a la vez**, con su suite en verde antes de empezar la siguiente.
6. **Las tres convenciones de IVA se respetan.** No se toca `ivaParts()`, ni `computeQuote`, ni la
   aritmética del cotizador.

---

## Cómo se verifica

```sh
python -m http.server 8123
#   http://127.0.0.1:8123/paginas/arrendamiento/?test=1     (41 pruebas)
#   http://127.0.0.1:8123/paginas/compra/?test=1            (55)
#   http://127.0.0.1:8123/paginas/cotizador/?test=1         (99)
```

| # | Qué se comprueba | Cómo |
|---|---|---|
| 1 | **Ningún precio se movió** | Las tres suites en verde **sin editar el valor esperado de ninguna prueba existente** |
| 2 | La matriz es la fuente | La prueba nueva de cada página |
| 3 | El documento del cliente es idéntico | Un PDF de cada herramienta antes y después, comparados |
| 4 | Arrendamiento no filtra precios | `FORBIDDEN` derivado atrapa los mismos casos; las pruebas del modo interno pasan |
| 5 | Los textos ya no mienten | Cambiar un valor en la matriz y ver que el markup y el PDF lo siguen — en particular los `stockPct` del cotizador, que hoy se imprimen a mano |
| 6 | Sin red y sin `localStorage` | Las tres siguen cotizando |
| 7 | Sintaxis | `node --check` sobre el `<script>` extraído de cada archivo |

---

## Al terminar

Actualizar la sección «Dónde se cambian los precios y las reglas» de los tres `README.md` para
que apunten a la matriz y digan la convención de IVA de esa página.
