# Capacitación IA (temporal)

Liga corta para compartir la **Capacitación IA** del jueves 15 de octubre de 2026 por WhatsApp:
<https://sanoapro.github.io/activa/paginas/capacitacion-ia/>

No es una página de contenido. Manda de inmediato a la sección `#capacitacion` del
[one-pager](../one-pager/), que es donde vive la sesión (botón a Meet, temas, horario por
región).

## Por qué existe

WhatsApp guarda la vista previa **por liga**. La del one-pager ya se había compartido con la
tarjeta de upgrade edu, así que cambiar su `og:image` no cambia lo que ve quien la recibe. Una
liga nueva obliga a WhatsApp a leer la vista previa desde cero.

Si alguna vez hay que cambiar esta tarjeta después de compartir la liga, pasa lo mismo: hay que
usar otra liga (por ejemplo, agregando `?v=2` al final).

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | Redirección al one-pager con sus propias etiquetas `og:`. Sin JS redirige igual (meta refresh) |
| `og.png` | Vista previa de WhatsApp, 1200 × 630, generada |
| `og-source.html` | Su molde. Texto grande y lo esencial al centro, para que se lea en miniatura |

## Cómo se regenera la vista previa

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/capacitacion-ia/og.png \
  paginas/capacitacion-ia/og-source.html
```

## Para quitarla

Borrar esta carpeta junto con la sección de la capacitación del one-pager (los pasos están en su
README) y su fila en el `README.md` de la raíz y en `docs/estructura.md`.
