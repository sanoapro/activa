# Archivo activa · las cotizaciones en Drive

Cada cotización que sale de los tres cotizadores termina hoy en la laptop de quien la hizo. Esta
carpeta contiene el diseño completo para que además termine **en Google Drive, en la carpeta de
ese vendedor**, sin que nadie tenga que acordarse de subirla a mano.

**El puente está desplegado y los tres cotizadores ya archivan** (21-ago-2026): arrendamiento,
compra y el cotizador llevan el mismo módulo compartido y la escritura real está verificada
contra las tres carpetas maestras.

## Los archivos

| Archivo | Qué es |
|---|---|
| [`estado.md`](estado.md) | Dónde va todo: qué está construido, qué está verificado y con qué método, qué falta y qué riesgos quedan abiertos. **Se lee primero.** |
| [`plan.md`](plan.md) | El diseño completo: mecanismo, árbol de carpetas, contrato, reglas, casos raros y lo que el sistema no hace. |
| [`prompt.md`](prompt.md) | El encargo de implementación, autocontenido. Se le pasa a una sesión de Claude Code para construirlo. |
| [`archivo-drive.gs`](archivo-drive.gs) | El puente. **No corre aquí**: se pega en `script.google.com`. Esta copia existe para tener historial de qué cambió y por qué. |

## Por qué hay un `.gs` dentro de `docs/`

[`estructura.md`](../estructura.md) dice que `docs/` es texto y no código, y que todo el
repositorio es HTML, CSS y JavaScript que el navegador lee tal cual. El puente no es ninguna de
las dos cosas: es código que corre **en los servidores de Google**, no aquí y no en el navegador.

Se queda junto a su plan porque separarlos garantiza que en seis meses nadie sepa dónde vive el
script de verdad ni qué se le cambió. Es texto inerte: no se ejecuta, no se enlaza desde ninguna
página, y no le hace nada a GitHub Pages.

## Lo que ya está decidido

| Decisión | Qué se eligió |
|---|---|
| Dónde vive la raíz | Carpeta **11. Cotizaciones 2026-2027**, hoy en Mi unidad de `martin@activa.la` |
| Carpetas maestras | **1. upgrade_edu** · **2. Arrendamiento** · **3. Compra** |
| Llave del vendedor | **El correo**, no el nombre — no admite variantes de escritura |
| Qué se sube | **PDF + JSON** del estado, para poder reabrir la cotización después |
| Nombre del archivo | `001._Colegio · fecha · folio` el PDF, `001.1_…` su JSON. El número es correlativo dentro de la carpeta de cada vendedor |
| Repetidos | **Versionar, nunca borrar** — no se pisa ni se manda nada a la papelera |
| Quién puede archivar | Solo correos **@activa.la** |
| Quién puede ver | **Todo el equipo comercial ve todo** |

## Lo que falta

Las tres páginas ya están enganchadas y la escritura real está verificada contra Drive
([`estado.md`](estado.md) lleva el detalle). Lo que queda es operación, no construcción:

1. **Bajar a los cuatro vendedores de Editor a Lector** en la carpeta de Drive. Pueden subir
   igual —quien escribe es la cuenta del despliegue, no la suya— y así nadie puede vaciar el
   archivo.
2. **Borrar las tres carpetas `prueba@activa.la`** que dejaron las verificaciones, una por
   carpeta maestra.
3. Dos decisiones abiertas, al final de [`plan.md`](plan.md): las cotizaciones viejas y si
   subir se vuelve obligatorio.
4. Considerar mover la raíz a una **unidad compartida**. Hoy el archivo pertenece a una persona;
   si esa cuenta se cierra, se va con ella. Conviene hacerlo antes de que haya mucho adentro.
