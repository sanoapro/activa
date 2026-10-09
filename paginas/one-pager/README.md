# One-pager upgrade edu

Página de **una sola pantalla larga para el colegio**: dirección, coordinación académica, TI,
docentes y familias. Presenta activa y upgrade edu y termina en contacto. Es pública: se manda por
WhatsApp o correo a un prospecto.

Se publica en <https://sanoapro.github.io/activa/paginas/one-pager/>.

## Capacitación IA (temporal)

Hasta arriba, antes del hero, va la sesión **Capacitación IA** del jueves 15 de octubre de 2026,
de 5:00 a 7:00 pm hora del centro, por Google Meet (`meet.google.com/pre-ohvo-faq`). Mientras
esté, el título de la página es «Capacitación IA · activa» y la vista previa de WhatsApp es la de
[`../capacitacion-ia/`](../capacitacion-ia/), la liga corta que se comparte.

- **Horario por región:** las cinco zonas de México con la hora ya convertida. Para esa fecha
  Estados Unidos sigue en horario de verano, así que Baja California y los municipios
  fronterizos de Coahuila, Nuevo León y Tamaulipas van una hora distinta a la de su zona en
  invierno. Abajo, un script muestra la hora en el dispositivo de quien abre la página.
- **Estado:** el chip junto a la fecha cuenta los días que faltan, dice «En vivo ahora» desde 15
  minutos antes y «La sesión ya terminó» al acabar.

**Para quitarla** (todo está marcado como «temporal» en el HTML):

1. Borrar la `<section id="capacitacion">`, su bloque de CSS y su script al final.
2. Quitar «Capacitación IA» del menú.
3. Regresar el titular del hero de `<h2 class="titular">` a `<h1>` (y su CSS de `.hero .titular`
   a `.hero h1`).
4. Regresar `<title>`, `description` y las etiquetas `og:`/`twitter:` a upgrade edu y a `og.png`.
5. Borrar la carpeta `paginas/capacitacion-ia/`.

## Orden de lectura

Patrón «confianza y autoridad + conversión» (skill `ui-ux-pro-max`):

1. **Hero:** «Transformamos tu colegio con Google», los cuatro ejes en un mosaico y dos llamados
   (conversación y piloto).
2. **Cifras:** +2 M docentes, +90 colegios, 16 Google Reference Schools, 6 países.
3. **El reto:** por qué la tecnología no transforma sola.
4. **Programa:** los cuatro ejes con sus marcas.
5. **Plataformas propias:** impulsa, eleva, motiva, beta e integra, con un dato cada una.
6. **Para tu equipo:** lo que gana cada rol.
7. **Chromebook:** seis datos y Securly.
8. **Ruta de madurez** y marcos de alineación (NEM, ISTE, UNESCO, MCER).
9. **Paquetes:** upgrade edu y PLUS, sin precio.
10. **Proyecto Piloto.**
11. **Contacto:** el equipo comercial, con WhatsApp, llamada y correo.

## Reglas de contenido

- **Es para el cliente:** sin nombres de competidores, sin precios y sin lo interno.
- **Ningún texto suelto.** Todo lo que no es título vive en una tarjeta y en viñetas
  (`ul.puntos`), sin párrafos. Debajo de cada título de sección va una tarjeta `.intro` con dos o
  tres viñetas; las notas al pie, los modelos de equipos y el pie de página también son tarjetas.
- Las cifras salen del deck `upgrade-edu` y del portafolio. Las de Chromebook citan su fuente al
  pie (Forrester TEI 2024, comisionado por Google; Futuresource).
- **integra:** WhatsApp sí; facturación CFDI y pagos en línea **no** se mencionan porque todavía no
  existen.
- **motiva** se presenta como programa educativo («acompaña», «desarrolla»), nunca como terapia.
- **beta:** Cambridge, IELTS y TOEFL como **ruta**, no como aval. Por eso no se usan sus logos.
- **Contacto:** Fernanda Padilla va primero y destacada, con su foto; el resto del equipo
  comercial sigue el orden del kit. **Juan de Luca no aparece**, a pedido. Los teléfonos salen del kit comercial: si
  cambian allá, cambian aquí.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Se edita a mano |
| `img/*.webp` | Fotos del equipo, 240 px, recortadas al rostro desde `compartidos/img/fotos-vendedores/` |
| `og.png` · `og-source.html` | Vista previa de WhatsApp y su molde |

## Movimiento

Capas 1 y 2 de [`../../docs/normativa-motion.md`](../../docs/normativa-motion.md): revelado al
bajar y cascada en cada rejilla, con `Motion.start()` como última línea. Sin el motor, la página
se ve completa y quieta. Respeta «reducir movimiento».

## Verificado

A 390 px no hay scroll horizontal · a 1440 px el hero cabe en una pantalla · con movimiento
reducido todo se ve desde el inicio · abre desde `file://`.

## Cómo se regenera la vista previa de WhatsApp

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/one-pager/og.png \
  paginas/one-pager/og-source.html
```
