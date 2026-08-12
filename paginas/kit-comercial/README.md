# Kit comercial

Una sola lámina de 1280×720 con los accesos que el equipo comercial usa a diario.
Se publica en **https://sanoapro.github.io/activa/paginas/kit-comercial/**

No hay scroll: la lámina se escala para caber entera en cualquier pantalla, igual
que el deck de [upgrade-edu](../upgrade-edu/).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | Todo el kit: markup, CSS y JS en un solo archivo. |
| `assets.js` | **Generado.** Retratos del equipo y logos, en base64. No editar a mano. |
| `og.png` | Vista previa de WhatsApp (1200×630). **Generado** desde `og-source.html`. |
| `og-source.html` | Molde de esa vista previa. No se abre en público. |

## Cómo se usa

- Clic en una tarjeta → abre el destino en pestaña nueva.
- Pasar el cursor y clic en **⧉** → copia el enlace al portapapeles (para mandarlo por WhatsApp).
- Teclas **1–7** → abren el acceso correspondiente. **F** → pantalla completa.

## Cómo agregar o cambiar un enlace

En `index.html`, al final, están las dos listas `VENTA` e `INTERNA`. Cada entrada es:

```js
{ id:'cotizador',          // llave del icono en el objeto ICO
  nombre:'Cotizador',
  color:'--blue',          // token de color (ver :root)
  color2:'#0d47a1',        // tono oscuro del degradado del icono
  tinte:'--blue-t',        // pastel del velo y del chip
  desc:'…',                // una línea, máximo dos renglones
  host:'sanoapro.github.io',
  url:'https://…' }
```

Si el acceso nuevo necesita otro pictograma, se agrega su `path` al objeto `ICO`
con la misma llave del `id`, en retícula 24×24 de Material.

La retícula está fijada a 4 tarjetas arriba y 3 abajo (`.g4` / `.g3`). Si crecen
las listas hay que ajustar esas dos reglas — la lámina no crece.

## Cómo se regenera `assets.js`

Los retratos y logos salen del objeto `BRAND` del deck, para no duplicar imágenes.
Se corre desde la raíz del repositorio:

```bash
python -c "
import json
l=open('paginas/upgrade-edu/index.html',encoding='utf-8').read().split('\n')[4077]
b=json.loads(l[l.index('{'):l.rindex('}')+1])
keep=['vJuan','vMartin','vJosue','vRoberto','vVicky','vZeni','activa','gfepartner','upgradeedu']
open('paginas/kit-comercial/assets.js','w',encoding='utf-8').write(
  'window.BRAND = '+json.dumps({k:b[k] for k in keep},ensure_ascii=False)+';\n')
"
```

(El `4077` es el índice de la línea donde vive `const BRAND` en el deck; si el
deck cambia, hay que buscarla de nuevo.)

## Cómo se regenera la vista previa de WhatsApp

`og-source.html` dibuja la tarjeta de 1200×630 con los mismos logos e iconos del
kit. Para volver a exportarla después de un cambio:

```bash
chrome --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/kit-comercial/og.png \
  paginas/kit-comercial/og-source.html
```

Las URLs de las etiquetas `og:` son absolutas: WhatsApp no lee rutas relativas ni
`data:` URI. Si el sitio cambia de dominio hay que actualizarlas a mano.

WhatsApp cachea la vista previa por URL. Si cambia la imagen y el enlace ya se
compartió, hay que forzar el refresco añadiendo `?v=2` al final del enlace.

## Notas

- La página lleva `<meta name="robots" content="noindex">`: es para el equipo, no
  para buscadores. Los destinos igual piden credenciales.
- El pasto animado es el mismo de la diapositiva 22 del deck: cada brizna crece
  desde el suelo una vez y luego se mece a perpetuidad.
- Todo respeta `prefers-reduced-motion`.
