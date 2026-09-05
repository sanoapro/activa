# Consola

Manual operativo para dejar **blindada la Google Admin Console** de un colegio: ruta por ruta,
del plantel a la casa. No es una presentación que se enseña en una junta —es el documento que
el equipo de TI abre con la consola al lado y va marcando mientras aplica.

Se publica en **<https://sanoapro.github.io/activa/paginas/consola/>**

La página lleva `<meta name="robots" content="noindex, nofollow">`: describe la postura de
seguridad de un colegio con nombre y dominio. Se manda por enlace, no se busca.

Todo vive en un solo archivo: markup, CSS, contenido y JS. **Sin red, sin librerías, sin
peticiones externas** —ni siquiera fuentes—. Abre igual desde `file://`, desde una USB o sin
internet, que es como se usa cuando se está configurando la red del colegio.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo: markup, CSS, contenido y JS en un solo archivo. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |

## Cómo está armado el contenido

**24 secciones** en la barra lateral: dos preliminares (cómo usar el documento, requisitos y
límites), **18 partes** numeradas de la 0 a la 17, y **cuatro anexos**.

| Bloque | Qué cubre |
|---|---|
| Preliminares | Cómo leer el manual, los tres niveles donde se aplica una política, licencias necesarias y lo que el manual **no** sustituye. |
| Partes 0–4 | Arquitectura de Unidades Organizativas, cuenta y directorio, seguridad e identidad, servicios de Workspace, dominios asociados. |
| Partes 5–10 | Políticas de ChromeOS por dispositivo y por usuario, apps y extensiones, redes y certificados, inventario y ciclo de vida, móviles y otros endpoints. |
| Partes 11–13 | La **matriz de evasión → contramedida**, el caso de los equipos que se van a casa, y el plan de implantación. |
| Partes 14–17 | Verificación, errores frecuentes, reversión y respuesta a incidentes, continuidad y egreso. |
| Anexos A–D | Referencia rápida de rutas, los 20 ajustes de mayor impacto, nota de vigencia y **lo que este manual no resuelve**. |

Dentro de las secciones hay **74 tarjetas** (`<article class="card">`), cada una con su ruta en
la consola, su explicación y su tabla de ajustes. En total **438 ajustes marcables**: 219 ajustes × 2 perfiles.

Los `id` de las secciones y de las tarjetas nombran el **contenido**, no la posición
(`parte-11-matriz-de-evasion-tecnica-contramedida`, no `parte-11`). Si se reordena o se renumera
una parte, el ancla sigue apuntando a lo mismo y los enlaces repartidos no mienten.

## Lo que hace la página

**Filtro por perfil** (`Ambos` / `Alumnos` / `Personal`). Al filtrar, las celdas que quedan
fuera no solo se atenúan: se les pone `inert` y `aria-hidden`. Una casilla atenuada que sigue
siendo pulsable con Tab es una casilla que alguien marca sin querer.

**Buscador** en la barra lateral, con `/` como atajo y `Esc` para limpiarlo. El índice se
construye la primera vez que se escribe —no al cargar— e incluye el título, las rutas y el
nombre de cada ajuste, no solo el sumario de la sección. Normaliza acentos: «verificacion»
encuentra «verificación».

**Solo pendientes** esconde lo ya aplicado para la segunda pasada.

**Avance persistente.** Las casillas y los datos del colegio se guardan en `localStorage` bajo
`gac-manual-ck-v1` y `gac-manual-meta-v1`. Si el navegador lo bloquea —modo privado, políticas
de la propia consola— cae a memoria: se pierde al cerrar, pero nada truena.

**Informe de configuración.** El botón «Generar informe» pide colegio, dominio, quién lo elabora
y para quién, ciclo y observaciones; abre en pestaña nueva un documento imprimible con el avance
y los ajustes aplicados. Desde el mismo panel: exportar e importar el avance en JSON —para pasar
el trabajo de una máquina a otra—, descargar CSV y reiniciar.

**Compartir** ofrece WhatsApp, copiar enlace y correo. El menú avisa de lo que el enlace no hace:
compartir la URL no da acceso a nadie; eso se hace desde el menú **Share** de la página publicada.

## Accesibilidad

Un solo `<h1>` —el del encabezado—. Las secciones son `<h2>`, los títulos de tarjeta `<h3>` y los
subtítulos dentro de una tarjeta `<h4>`. Antes había **26 `<h1>`** y el documento no tenía
esquema: para un lector de pantalla, 24 secciones y 74 tarjetas eran todas el mismo nivel.

Hay un **enlace de salto** al principio, invisible hasta que se enfoca. Sin él, llegar al
contenido con teclado cuesta atravesar la barra lateral entera.

> El observador que ilumina la sección activa en la barra lateral escucha `h3[id]` —los títulos
> de tarjeta—. Si esos títulos vuelven a cambiar de nivel, hay que mover también ese selector.

## Cómo se regenera la vista previa de WhatsApp

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/consola/og.png \
  paginas/consola/og-source.html
```

Las URLs de las etiquetas `og:` son absolutas: WhatsApp no lee rutas relativas ni `data:` URI.
WhatsApp cachea la vista previa por URL; si cambia la imagen y el enlace ya se compartió, se
fuerza el refresco añadiendo `?v=2` al enlace.

## Al tocar esta página

- **Los conteos de este README salen de contar.** La barra de avance y los cuatro contadores de
  la portada los cuentan en vivo: si agregas tarjetas o ajustes, lee ahí el número nuevo y
  actualízalo aquí, en los chips de `og-source.html` (y regenera `og.png`) y en la portada.
- **No metas peticiones externas.** El manual se usa mientras se reconfigura la red del colegio:
  tiene que abrir sin internet. Se quitó Google Fonts por eso; los stacks de fuente ya se
  sostienen con lo que hay en el sistema.
- **La nota de vigencia del anexo C tiene fecha.** La consola de Google cambia de nombre y de
  ruta cada temporada; si revisas el manual contra la consola, mueve esa fecha.
