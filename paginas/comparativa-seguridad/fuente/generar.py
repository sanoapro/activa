# -*- coding: utf-8 -*-
"""
Genera ../index.html a partir de plantilla.html + datos.py.

    python paginas/comparativa-seguridad/fuente/generar.py

Qué hace:
  1. Sustituye cada marcador <!--GEN:nombre--> de la plantilla por su tabla.
  2. Resuelve las citas [[f:clave]] en enlaces numerados [n], en el orden en
     que aparecen en la página, y arma la lista de fuentes con solo las citadas.
  3. Falla en voz alta si una cita apunta a una clave que no existe, o si
     queda un marcador sin resolver. Nada se silencia.

El resultado es HTML estático: la página se lee completa sin JavaScript.
"""
import html
import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
sys.dont_write_bytecode = True      # sin __pycache__: esta carpeta se publica tal cual
sys.path.insert(0, str(AQUI))
import datos as D  # noqa: E402

e = html.escape
ESC = [k for k, _, _ in D.ESCENARIOS]


def refs(claves):
    return "".join(f"[[f:{k}]]" for k in claves)


def thead(primera):
    cols = "".join(
        f'<th scope="col" class="h-{k}"><span class="pt pt-{k}" aria-hidden="true"></span>{e(n)}</th>'
        for k, n, _ in D.ESCENARIOS
    )
    return f'<thead><tr><th scope="col" class="h-k">{e(primera)}</th>{cols}</tr></thead>'


def celda(p, texto, extra=""):
    ico, lbl = D.ESCALA[p]
    why = f'<span class="why">{e(texto)}</span>' if texto else ""
    return (f'<td class="v v{p}" tabindex="0"><span class="vi" aria-hidden="true">{ico}</span>'
            f'<span class="vl">{lbl}</span>{extra}{why}</td>')


def nivel(n, texto):
    ico, lbl = D.NIVEL[n]
    return (f'<td class="v n-{n}" tabindex="0"><span class="vi" aria-hidden="true">{ico}</span>'
            f'<span class="vl">{lbl}</span><span class="why">{e(texto)}</span></td>')


def tabla(id_, cab, cuerpo, caption):
    return (f'<div class="tw" role="region" aria-labelledby="{id_}-cap" tabindex="0">'
            f'<table class="cmp" id="{id_}"><caption id="{id_}-cap" class="sr">{e(caption)}</caption>'
            f'{cab}<tbody>{cuerpo}</tbody></table></div>')


# ── Tabla 1 ──────────────────────────────────────────────────────────
def tabla1():
    filas = []
    for clave, nombre in D.AREAS:
        filas.append(f'<tr class="grupo" data-area="{clave}"><th colspan="5" scope="colgroup">{e(nombre)}</th></tr>')
        for area, aspecto, fs, vals in D.T1:
            if area != clave:
                continue
            tds = "".join(celda(*vals[k]) for k in ESC)
            filas.append(f'<tr data-area="{area}"><th scope="row">{e(aspecto)}<span class="refs">{refs(fs)}</span></th>{tds}</tr>')
    return tabla("t1", thead("Aspecto"), "".join(filas), "Tabla 1. Comparación general por aspecto y escenario")


def filtros_t1():
    b = ['<button type="button" class="chip-f" data-f="todo" aria-pressed="true">Todo</button>']
    b += [f'<button type="button" class="chip-f" data-f="{k}" aria-pressed="false">{e(n)}</button>' for k, n in D.AREAS]
    return '<div class="filtros" role="group" aria-label="Filtrar por dimensión">' + "".join(b) + "</div>"


# ── Gráfica: promedio por dimensión (SVG, sin librerías) ──────────────
def grafica():
    W, izq, der, alto_fila, top = 760, 230, 40, 38, 34
    ancho = W - izq - der
    n = len(D.AREAS)
    H = top + n * alto_fila + 16
    x = lambda v: izq + ancho * v / 5
    off = {"w": -9, "i": -3, "c": 3, "s": 9}
    out = [f'<svg class="dot" viewBox="0 0 {W} {H}" role="img" aria-labelledby="g-tit g-desc">',
           '<title id="g-tit">Promedio de valoraciones por dimensión</title>',
           '<desc id="g-desc">Promedio simple de la Tabla 1, de 0 a 5, para cada uno de los cuatro escenarios.</desc>']
    for v in range(6):
        out.append(f'<line class="gr" x1="{x(v)}" x2="{x(v)}" y1="{top - 10}" y2="{H - 12}"/>'
                   f'<text class="gx" x="{x(v)}" y="{top - 16}" text-anchor="middle">{v}</text>')
    desc_txt = []
    for idx, (clave, nombre) in enumerate(D.AREAS):
        y = top + idx * alto_fila + alto_fila / 2
        out.append(f'<text class="gl" x="{izq - 14}" y="{y + 4}" text-anchor="end">{e(nombre)}</text>')
        out.append(f'<line class="gf" x1="{izq}" x2="{izq + ancho}" y1="{y}" y2="{y}"/>')
        proms = {}
        for k in ESC:
            vals = [r[3][k][0] for r in D.T1 if r[0] == clave]
            proms[k] = sum(vals) / len(vals)
        for k in ESC:
            nom = dict((a, b) for a, b, _ in D.ESCENARIOS)[k]
            out.append(f'<circle class="gd gd-{k}" cx="{x(proms[k]):.1f}" cy="{y + off[k]:.1f}" r="7">'
                       f'<title>{e(nombre)} · {e(nom)}: {proms[k]:.1f}</title></circle>')
        desc_txt.append(nombre + ": " + ", ".join(f"{dict((a, b) for a, b, _ in D.ESCENARIOS)[k]} {proms[k]:.1f}" for k in ESC))
    out.append("</svg>")
    tabla_alt = "<ul class=\"sr\">" + "".join(f"<li>{e(t)}</li>" for t in desc_txt) + "</ul>"
    return "".join(out) + tabla_alt


# ── Tabla 2 · evasión ────────────────────────────────────────────────
def tabla2():
    filas = []
    for vector, que, porque, fs, vals in D.T2:
        tds = "".join(nivel(*vals[k]) for k in ESC)
        filas.append(f'<tr><th scope="row">{e(vector)}<span class="refs">{refs(fs)}</span></th>{tds}</tr>')
    return tabla("t2", thead("Vector"), "".join(filas), "Tabla 2. Posibilidad de evasión por vector y escenario")


def acordeon_evasion():
    nombres = dict((a, b) for a, b, _ in D.ESCENARIOS)
    out = []
    for vector, que, porque, fs, vals in D.T2:
        items = "".join(
            f'<li><b class="tx-{k}">{e(nombres[k])}</b> <span class="mini n-{vals[k][0]}">{D.NIVEL[vals[k][0]][0]} {D.NIVEL[vals[k][0]][1]}</span> {e(vals[k][1])}</li>'
            for k in ESC)
        out.append(f'<details class="acc"><summary><span>{e(vector)}</span><small>{e(que)}</small></summary>'
                   f'<div class="acc-b"><p><b>Por qué existe:</b> {e(porque)}</p><ul class="mit">{items}</ul></div></details>')
    return '<div class="accs">' + "".join(out) + "</div>"


# ── Tabla 3 · profesor ───────────────────────────────────────────────
def tabla3():
    filas = []
    for tarea, vals in D.T3:
        tds = []
        for k in ESC:
            p, quien, nota = vals[k]
            q = f'<span class="quien">{e(quien)}</span>' if quien != "—" else ""
            tds.append(celda(p, nota, q))
        filas.append(f'<tr><th scope="row">{e(tarea)}</th>{"".join(tds)}</tr>')
    return tabla("t3", thead("El profesor quiere…"), "".join(filas), "Tabla 3. Qué puede hacer un profesor durante la clase")


def tabla_simple(id_, datos, primera, caption):
    filas = []
    for fila in datos:
        if len(fila) == 3:
            nombre, fs, vals = fila
        else:
            nombre, vals = fila
            fs = []
        tds = "".join(celda(*vals[k]) for k in ESC)
        r = f'<span class="refs">{refs(fs)}</span>' if fs else ""
        filas.append(f'<tr><th scope="row">{e(nombre)}{r}</th>{tds}</tr>')
    return tabla(id_, thead(primera), "".join(filas), caption)


def tabla6():
    filas = []
    for i, (tarea, vals) in enumerate(D.T6, 1):
        tds = "".join(celda(*vals[k]) for k in ESC)
        filas.append(f'<tr id="tarea-{i}"><th scope="row"><span class="num">{i}</span>{e(tarea)}</th>{tds}</tr>')
    return tabla("t6", thead("El profesor quiere…"), "".join(filas), "Tabla 6. Escenario real: 30 alumnos de secundaria")


def chips_t6():
    b = [f'<button type="button" class="chip-t" data-t="{i}" aria-pressed="false">{i}</button>' for i in range(1, len(D.T6) + 1)]
    return '<div class="filtros tareas" role="group" aria-label="Resaltar una tarea">' + "".join(b) + "</div>"


def puntaje_t6():
    tot = {k: sum(v[k][0] for _, v in D.T6) for k in ESC}
    maxi = 5 * len(D.T6)
    out = []
    for k, n, _ in D.ESCENARIOS:
        pct = round(100 * tot[k] / maxi)
        out.append(f'<div class="barra"><span class="bn tx-{k}">{e(n)}</span>'
                   f'<span class="bt"><span class="bf bf-{k}" style="width:{pct}%"></span></span>'
                   f'<span class="bv">{tot[k]} / {maxi}</span></div>')
    return '<div class="barras" role="img" aria-label="Suma de valoraciones de la Tabla 6 por escenario">' + "".join(out) + "</div>"


# ── Costos públicos por tamaño ───────────────────────────────────────
def costos():
    tam = [100, 500, 1000]
    usd = lambda v: f"USD {v:,.0f}"
    lineas = [
        ("w", "Licencias Microsoft 365 Education (A1, A3 o A5) y herramienta de aula de terceros", None, "ms-licencias", "Requiere cotización"),
        ("i", "MDM Mosyle Premium a precio de lista (USD 5.50 por equipo al año)", 5.50, "mosyle", "al año"),
        ("i", "Apple School Manager, Apple Classroom y Schoolwork", 0, "ap-asm", "sin costo"),
        ("c", "Chrome Education Upgrade a precio de lista (MSRP USD 38, pago único por equipo)", 38, "g-ceu", "pago único"),
        ("c", "Google Workspace for Education Fundamentals", 0, "g-ediciones", "sin costo"),
        ("c", "Securly Filter y Classroom", None, "s-inicio", "Requiere cotización"),
        ("s", "MDM (Mosyle Premium a precio de lista) y Securly Filter", None, "mosyle", "MDM USD 5.50 por equipo al año · Securly: requiere cotización"),
    ]
    nombres = dict((a, b) for a, b, _ in D.ESCENARIOS)
    cab = '<thead><tr><th scope="col">Escenario · concepto</th>' + "".join(
        f'<th scope="col" class="tam" data-n="{n}">{n:,} alumnos</th>' for n in tam) + "</tr></thead>"
    filas = []
    for k, concepto, precio, f, nota in lineas:
        if precio is None:
            celdas = "".join(f'<td class="tam" data-n="{n}"><span class="cot">{e(nota)}</span></td>' for n in tam)
        elif precio == 0:
            celdas = "".join(f'<td class="tam" data-n="{n}">Sin costo</td>' for n in tam)
        else:
            celdas = "".join(f'<td class="tam" data-n="{n}"><b>{usd(precio * n)}</b> <small>{e(nota)}</small></td>' for n in tam)
        filas.append(f'<tr><th scope="row"><b class="tx-{k}">{e(nombres[k])}</b> · {e(concepto)}[[f:{f}]]</th>{celdas}</tr>')
    return (f'<div class="tw" role="region" aria-label="Costos públicos por tamaño" tabindex="0">'
            f'<table class="cmp costos">{cab}<tbody>{"".join(filas)}</tbody></table></div>')


GEN = {
    "filtros-t1": filtros_t1,
    "tabla1": tabla1,
    "grafica": grafica,
    "tabla2": tabla2,
    "acordeon-evasion": acordeon_evasion,
    "tabla3": tabla3,
    "tabla4": lambda: tabla_simple("t4", D.T4, "Capacidad", "Tabla 4. Control del administrador TI"),
    "tabla5": lambda: tabla_simple("t5", D.T5, "Riesgo", "Tabla 5. Protección del alumno") + f'<p class="refs-l">Fuentes: {refs(D.T5_FUENTES)}</p>',
    "chips-t6": chips_t6,
    "tabla6": lambda: tabla6() + f'<p class="refs-l">Fuentes: {refs(D.T6_FUENTES)}</p>',
    "puntaje-t6": puntaje_t6,
    "costos": costos,
    "fecha": lambda: e(D.FECHA_CONSULTA),
}

TIPO = {"primaria": "Fuente primaria", "comunidad": "Comunidad · evidencia anecdótica",
        "prensa": "Prensa", "academica": "Estudio o evaluación independiente", "revendedor": "Revendedor · referencia de precio"}


def main():
    plantilla = (AQUI / "plantilla.html").read_text(encoding="utf-8")

    def sustituye(m):
        nombre = m.group(1)
        if nombre == "fuentes":
            return m.group(0)          # se resuelve al final, con la numeración
        if nombre not in GEN:
            sys.exit(f"ERROR: marcador sin generador: {nombre}")
        return GEN[nombre]()
    doc = re.sub(r"<!--GEN:([a-z0-9-]+)-->", sustituye, plantilla)

    orden = []

    def num(m):
        k = m.group(1)
        if k not in D.F:
            sys.exit(f"ERROR: cita a una fuente inexistente: {k}")
        if k not in orden:
            orden.append(k)
        n = orden.index(k) + 1
        return f'<a class="ref" href="#f-{n}" aria-label="Fuente {n}">{n}</a>'
    doc = re.sub(r"\[\[f:([a-z0-9-]+)\]\]", num, doc)

    items = []
    for n, k in enumerate(orden, 1):
        tit, emisor, url, tipo = D.F[k]
        clase = " anec" if tipo == "comunidad" else ""
        items.append(f'<li id="f-{n}" class="fu{clase}"><span class="fn">{n}</span><div><a href="{e(url)}" target="_blank" rel="noopener">{e(tit)}</a>'
                     f'<small>{e(emisor)} · {TIPO[tipo]}</small></div></li>')
    doc = doc.replace("<!--GEN:fuentes-->", '<ol class="lista-f">' + "".join(items) + "</ol>")

    sobra = re.findall(r"<!--GEN:[^>]*-->|\[\[f:[^\]]*\]\]", doc)
    if sobra:
        sys.exit(f"ERROR: quedaron marcadores sin resolver: {sobra[:5]}")

    destino = AQUI.parent / "index.html"
    destino.write_text(doc, encoding="utf-8", newline="\n")
    sin_citar = sorted(set(D.F) - set(orden))
    print(f"OK · {destino.name} · {len(orden)} fuentes citadas · {len(doc):,} bytes")
    if sin_citar:
        print(f"Aviso: {len(sin_citar)} fuentes registradas sin citar (no se publican): {', '.join(sin_citar)}")


if __name__ == "__main__":
    main()
