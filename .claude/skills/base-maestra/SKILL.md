---
name: base-maestra
description: >-
  Operar la Base Maestra México Privados (colegios K-12 de México) y cualquier
  .xlsx de este directorio. Úsala al leer, filtrar, contar, cruzar, deduplicar,
  enriquecer, geocodificar o depurar filas de colegios; al decidir si una
  institución es lead; al escribir de vuelta al Excel; y al montar corridas OSINT
  de verificación web. Cubre el protocolo de respaldo y de hoja Eliminadas, las
  trampas de lectura de estos archivos, los criterios de negocio del cliente y
  las trampas de las APIs de Nominatim y Google Places.
---

# Base Maestra — operación

Reglas de trabajo sobre `0. Base Maestra México Privados.xlsx`. El contexto general
está en `CLAUDE.md`; esto es el procedimiento.

## Antes de cualquier cosa

Nunca abras el archivo con una ruta escrita a mano — el nombre lleva acento y varía.
Usa el helper:

```bash
python .claude/skills/base-maestra/scripts/base.py info
```

Devuelve la ruta real, las hojas, el conteo de filas y las columnas.

## Las tres reglas duras

**1. Respalda antes de escribir en masa.**
```bash
python .claude/skills/base-maestra/scripts/base.py respaldar <nombre-fase>
```
Crea `0. Base Maestra México Privados.pre-<fase>.xlsx`. Hazlo *antes* de la primera
escritura, no después. Los respaldos existentes (`.bak`, `.pre-places`, `.pre-nivel`)
son historia — no los toques.

**2. Mover a `Eliminadas`, nunca borrar.**
Toda fila que sale de `Colegios` va a `Eliminadas` con sus 66 columnas más
`Motivo de eliminación` y `Fecha`. Sin excepción. Es lo que hace auditable el archivo
y lo que permite revertir un criterio.

**3. Investigar y aplicar son pasos separados.**
Un script investiga y escribe un `.json` con el veredicto por fila. Otro script lee
ese JSON y escribe al Excel. Nunca los fusiones: el JSON intermedio es lo que permite
revisar antes de tocar el archivo, y es la evidencia de por qué cambió cada celda.

## Leer estos archivos sin romperlos

Usa `base.py cargar` o replica lo que hace. Las trampas que cubre:

- `False` es una celda **llena**. `if valor:` descarta datos legítimos — compara
  contra `None` y contra `""`.
- El encabezado **no siempre está en la fila 1**. Se localiza buscando una columna
  conocida (`ID`, `Colegio`).
- Hay **filas de una sola celda** (títulos, separadores) entre los datos.
- Las regex ASCII **parten correos y nombres con acento**. Usa `re.UNICODE` o clases
  que incluyan acentos y `ñ`.

## Decidir si una fila es lead

Los criterios completos están en `CLAUDE.md`. El resumen operativo:

- Se elimina lo **exclusivamente** superior. Terminar en secundaria no es serlo.
- Se elimina por **tipo de institución** aunque den media superior: conservatorios,
  seminarios, CECATI/ICATI, idiomas, computación/contabilidad, guarderías/CENDI,
  academias de oficios, escuelas militares/judiciales/forenses.
- Se conserva: educación especial, psicopedagógicos, y los K-12 llamados "Academia"
  o "Deportivo".
- Mismo campus con niveles distintos **no es duplicado**.

**Antes de aplicar cualquier regla por palabras clave, mide su error en las dos
direcciones.** El precedente: un barrido marcó 71 filas y 61 eran falsos positivos
("inglés" arrastró a todos los "Colegio Inglés"). Y en el otro sentido, la Escuela
Libre de Derecho es solo licenciatura y ninguna palabra clave la detecta. Reporta el
hueco medido junto con la propuesta.

## Datos en los que no se puede confiar

- **`Dominio web`**: en el archivo original muchos fueron inferidos del nombre por un
  generador y no resuelven; otros son de un homónimo de otro estado. No es llave de
  identidad ni prueba de existencia.
- **Coordenadas de fuentes externas**: algunas devuelven el centroide del municipio
  cuando no tienen el dato. Si `escuelasmex` da solo 4 decimales, sospecha centroide.

## Geocodificar

Toda coordenada nueva debe caer dentro de México **y** dentro del estado verificado de
la fila. Si no, se descarta y se prueba la siguiente formulación. Esta validación
existe porque el archivo llegó roto: el geocodificador leía el nombre de la calle como
municipio y mandaba colegios a Italia, India y Perú.

Cadena, de más preciso a menos: calle+número+CP+ciudad+estado → calle sin CP → nombre
del colegio → colonia → código postal → centroide del municipio. Registra con qué
escalón se resolvió cada fila.

## APIs — trampas que ya costaron

- **Nominatim**: HTTP 400 si mezclas la búsqueda libre `q` con parámetros
  estructurados (`country`, `city`, `postalcode`). Las libres van solas.
- **Google Places Text Search**: `locationRestriction` solo acepta `rectangle`. Con
  `circle` da 400 **y cobra la llamada**.
- **Places ordena por prominencia**: sin restricción geográfica devuelve el homónimo
  más famoso del país. Acota a un rectángulo alrededor de la coordenada verificada.
- **Guarda de identidad**: si el resultado tiene nombre distinto y cae a más de 1.5 km,
  no es el mismo colegio — no toques la fila, regístrala para revisión.
- **Nunca silencies un `except` de API.** Imprime el error. Las dos primeras trampas
  costaron 32 horas de corrida y 482 llamadas cobradas por estar escondidas.
- Devuelven 403 a fetch: `nte.mx`, `edunautica.mx`, `infoescuelas.com`.

## Corridas OSINT por lotes

El patrón probado, en `_verificacion_web/`: partir en lotes de ~25 filas
(`batches/b####.json`), un subagente por lote, veredicto por fila en `results*/`, y un
`aplicar_*.py` al final. Mantén `PENDIENTES.txt` con los lotes sin procesar para poder
retomar. Documenta cada fase en `RETOMAR.md` con sus números.

## Al terminar

Actualiza `RETOMAR.md` (qué se hizo, cuántas filas, qué reveló) y los conteos de
`CLAUDE.md` si cambiaron. Los números de esos documentos son la fuente de verdad para
la siguiente sesión.
