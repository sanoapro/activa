import { Union } from "./fable_modules/fable-library-js.4.24.0/Types.js";
import { union_type, lambda_type, unit_type, class_type, string_type } from "./fable_modules/fable-library-js.4.24.0/Reflection.js";
import { empty, ofArray, iterate } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { map, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.24.0/Range.js";
import { min, max } from "./fable_modules/fable-library-js.4.24.0/Double.js";

export class Attr$ extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["Cls", "Id", "At", "Sty", "Txt", "Raw", "On"];
    }
}

export function Attr$_$reflection() {
    return union_type("Dsl.Attr", [], Attr$, () => [[["Item", string_type]], [["Item", string_type]], [["Item1", string_type], ["Item2", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item", string_type]], [["Item1", string_type], ["Item2", lambda_type(class_type("Browser.Types.Event", undefined), unit_type)]]]);
}

function apply(e, a_1) {
    switch (a_1.tag) {
        case 1: {
            e.id = a_1.fields[0];
            break;
        }
        case 2: {
            e.setAttribute(a_1.fields[0], a_1.fields[1]);
            break;
        }
        case 3: {
            e.setAttribute("style", a_1.fields[0]);
            break;
        }
        case 4: {
            e.textContent = a_1.fields[0];
            break;
        }
        case 5: {
            e.innerHTML = a_1.fields[0];
            break;
        }
        case 6: {
            e.addEventListener(a_1.fields[0], a_1.fields[1]);
            break;
        }
        default: {
            const c = a_1.fields[0];
            e.className = ((e.className === "") ? c : ((e.className + " ") + c));
        }
    }
}

/**
 * Crea un elemento con atributos e hijos.
 */
export function el(tag, attrs, children) {
    const e = document.createElement(tag);
    iterate((a_1) => {
        apply(e, a_1);
    }, attrs);
    iterate((c) => {
        e.appendChild(c);
    }, children);
    return e;
}

export function div(attrs, children) {
    return el("div", attrs, children);
}

export function section(attrs, children) {
    return el("section", attrs, children);
}

export function header(attrs, children) {
    return el("header", attrs, children);
}

export function footer(attrs, children) {
    return el("footer", attrs, children);
}

export function nav(attrs, children) {
    return el("nav", attrs, children);
}

export function article(attrs, children) {
    return el("article", attrs, children);
}

export function span(attrs, children) {
    return el("span", attrs, children);
}

export function p(attrs, children) {
    return el("p", attrs, children);
}

export function h1(attrs, children) {
    return el("h1", attrs, children);
}

export function h2(attrs, children) {
    return el("h2", attrs, children);
}

export function h3(attrs, children) {
    return el("h3", attrs, children);
}

export function h4(attrs, children) {
    return el("h4", attrs, children);
}

export function ul(attrs, children) {
    return el("ul", attrs, children);
}

export function li(attrs, children) {
    return el("li", attrs, children);
}

export function button(attrs, children) {
    return el("button", attrs, children);
}

export function canvas(attrs, children) {
    return el("canvas", attrs, children);
}

export function a(attrs, children) {
    return el("a", attrs, children);
}

/**
 * Nodo de solo texto con clase.
 */
export function t(cls, text) {
    return span(ofArray([new Attr$(0, [cls]), new Attr$(4, [text])]), empty());
}

/**
 * Párrafo simple.
 */
export function para(cls, text) {
    return p(ofArray([new Attr$(0, [cls]), new Attr$(4, [text])]), empty());
}

/**
 * Inserta SVG en línea. Los elementos SVG no son HTMLElement, así que se
 * montan por innerHTML dentro de un contenedor en lugar de createElementNS.
 */
export function svg(cls, markup) {
    return span(ofArray([new Attr$(0, [cls]), new Attr$(5, [markup])]), empty());
}

export function qs(sel) {
    const n = document.querySelector(sel);
    if (n == null) {
        return undefined;
    }
    else {
        return n;
    }
}

export function qsa(sel) {
    const nl = document.querySelectorAll(sel);
    return toList(delay(() => map((i) => nl.item(i), rangeDouble(0, 1, nl.length - 1))));
}

export function addCls(c, e) {
    e.classList.add(c);
}

export function removeCls(c, e) {
    e.classList.remove(c);
}

export function hasCls(c, e) {
    return e.classList.contains(c);
}

export function toggleCls(c, on, e) {
    if (on) {
        e.classList.add(c);
    }
    else {
        e.classList.remove(c);
    }
}

/**
 * Escribe una custom property CSS en un elemento.
 */
export function setVar(name, value, e) {
    e.style.setProperty(name, value);
}

/**
 * Escribe una propiedad CSS en línea.
 */
export function setStyle(prop, value, e) {
    e.style.setProperty(prop, value);
}

export function clamp(lo, hi, v) {
    return max(lo, min(hi, v));
}

/**
 * Interpolación lineal.
 */
export function lerp(a_1, b, k) {
    return a_1 + ((b - a_1) * k);
}

/**
 * Normaliza v dentro de [a,b] a [0,1], recortado.
 */
export function norm(a_1, b, v) {
    if ((b - a_1) === 0) {
        return 0;
    }
    else {
        return clamp(0, 1, (v - a_1) / (b - a_1));
    }
}

