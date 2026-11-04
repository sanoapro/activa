# Quiénes somos

Presentación de activa **para colegios particulares**: quién es activa y lo que ofrece. Se manda
por WhatsApp o correo a un prospecto del sector privado. No incluye sesiones ni eventos: es la
versión permanente del [one-pager](../one-pager/), que hoy abre con la Capacitación Canva.

Se publica en <https://sanoapro.github.io/activa/paginas/quienes-somos/>.

## Orden de lectura

1. **Hero:** «Transformamos tu colegio con Google» y los cuatro ejes.
2. **Quiénes somos:** qué es activa, qué hace y cómo trabaja (portafolio, secciones 1 y 11).
3. **Cifras:** +10 años, +2 M docentes, +90 colegios, 16 Google Reference Schools y 6 países.
4. Del **reto** al **contacto**, igual que el one-pager.

## Reglas de contenido

Son las del [README del one-pager](../one-pager/README.md#reglas-de-contenido): sin competidores,
sin precios, sin nada interno y ningún texto suelto. Además:

- **Solo sector privado.** Para el sector público está
  [`../sector-publico-jalisco/`](../sector-publico-jalisco/); aquí no se menciona.
- **Canva se queda como licencia** del eje 02, porque es parte de la oferta. Lo que no lleva es la
  sesión, ni su paleta, ni el sello de reseller.
- Las cifras y la descripción de activa salen de `docs/portafolio-activa.md`.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Se edita a mano |
| `img/*.webp` | Fotos del equipo, 240 px, copiadas de `../one-pager/img/` |
| `og.png` · `og-source.html` | Vista previa de WhatsApp y su molde |

Esta página nació como copia del one-pager y desde entonces son independientes: **un cambio en
programa, plataformas, paquetes, piloto o teléfonos hay que hacerlo en las dos.**

## Movimiento

Capas 1 y 2 de [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md): revelado al
bajar y cascada en cada rejilla, con `Motion.start()` como última línea. Sin el motor, la página
se ve completa y quieta.

## Cómo se regenera la vista previa de WhatsApp

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/quienes-somos/og.png \
  paginas/quienes-somos/og-source.html
```
