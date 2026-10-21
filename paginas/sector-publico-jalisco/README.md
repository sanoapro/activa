# Ficha técnica · Sector público Jalisco

Ficha de una página para **dependencias y escuelas públicas del estado de Jalisco**: cómo se
acomoda la oferta de activa al sector público. Se manda por WhatsApp o correo, o se imprime.

Se publica en <https://sanoapro.github.io/activa/paginas/sector-publico-jalisco/>.

## Cómo se lee

A propósito, **corta a primera vista y expandible después**:

1. **Portada:** los tres pilares (partner especializado, adopción integral, gestión segura), las
   credenciales y cuatro cifras.
2. **Seis servicios**, cada uno con una frase y tres viñetas: Google Workspace for Education,
   Chromebooks, formación y certificación docente, IA centrada en el ser humano, Canva para
   gobierno y educación, y habilidades digitales para estudiantes.
3. **Cuatro fases** (diagnóstico, despliegue, capacitación, evolución) y lo que va durante todo el
   proyecto.
4. **Caso:** el curso de Canva avalado por la Secretaría de Educación del Estado de México.
5. **Por qué activa** y el equipo. Contacto al final.

El detalle va en botones **«Ver más»** (`<details>`): no necesita JavaScript y, al imprimir, sale
solo la ficha corta.

## De dónde sale el contenido

De la presentación ejecutiva «activa – Google for Education» (22 páginas), contrastada con
[`docs/portafolio-activa.md`](../../docs/portafolio-activa.md), que manda cuando no coinciden:

- **Cifras del portafolio**, no las del deck: +2 M docentes (el deck dice +1 M) y 6 países.
- **inicia no aparece:** el portafolio la marca como retirada y no se ofrece.
- **No se usan:** el testimonio sin autor ni la mención a USICAM del caso de Canva, que la propia
  presentación deja sin confirmar.
- El equipo (+30 coaches, 9 Innovadores de Google, 12 Gemini Educators, 15 especialistas TI) y el
  reconocimiento Google Cloud Partner of the Year 2021 salen del deck.
- No lleva precios ni logotipos del gobierno de Jalisco.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `index.html` | La página. Se edita a mano. Sin JavaScript |
| `img/*.webp` | Fotos del contacto, copiadas del one-pager |
| `og.png` · `og-source.html` | Vista previa de WhatsApp y su molde |

El logo de Canva Certified Reseller Partner vive en
`compartidos/img/marcas/canva-reseller-partner.webp` (versión web del original que se subió).

## Cómo se regenera la vista previa

```bash
msedge --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --virtual-time-budget=4000 \
  --window-size=1200,630 --screenshot=paginas/sector-publico-jalisco/og.png \
  paginas/sector-publico-jalisco/og-source.html
```
