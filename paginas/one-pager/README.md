# One-pager upgrade edu

Página de **una sola pantalla larga para el colegio**: dirección, coordinación académica, TI,
docentes y familias. Presenta activa y upgrade edu y termina en contacto. Es pública: se manda por
WhatsApp o correo a un prospecto.

Se publica en <https://sanoapro.github.io/activa/paginas/one-pager/>.

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
- Las cifras salen del deck `upgrade-edu` y del portafolio. Las de Chromebook citan su fuente al
  pie (Forrester TEI 2024, comisionado por Google; Futuresource).
- **integra:** WhatsApp sí; facturación CFDI y pagos en línea **no** se mencionan porque todavía no
  existen.
- **motiva** se presenta como programa educativo («acompaña», «desarrolla»), nunca como terapia.
- **beta:** Cambridge, IELTS y TOEFL como **ruta**, no como aval. Por eso no se usan sus logos.
- **Contacto:** Fernanda Padilla va primero y destacada; el resto del equipo comercial sigue el
  orden del kit. **Juan de Luca no aparece**, a pedido. Los teléfonos salen del kit comercial: si
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
