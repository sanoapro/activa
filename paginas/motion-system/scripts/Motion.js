import { clamp, norm, removeCls, setVar, addCls, qsa, lerp } from "./Dsl.js";
import { round, int32ToString, disposeSafe, getEnumerator } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { iterateIndexed, iterate } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { map, delay, toList } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { some } from "./fable_modules/fable-library-js.4.24.0/Option.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.24.0/Range.js";
import { min, max } from "./fable_modules/fable-library-js.4.24.0/Double.js";

export const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const frameJobs = [];

let pointerX = 0;

let pointerY = 0;

let smoothX = 0;

let smoothY = 0;

let running = false;

/**
 * Registra trabajo por frame. Devuelve unit; el trabajo vive lo que vive la página.
 */
export function onFrame(job) {
    void (frameJobs.push(job));
}

/**
 * Posición suavizada del puntero, normalizada a [-1, 1] desde el centro.
 */
export function pointerNorm() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    return [((smoothX / w) * 2) - 1, ((smoothY / h) * 2) - 1];
}

function tick(_arg) {
    smoothX = lerp(smoothX, pointerX, 0.12);
    smoothY = lerp(smoothY, pointerY, 0.12);
    const y = window.scrollY;
    let enumerator = getEnumerator(frameJobs);
    try {
        while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
            enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]()(y);
        }
    }
    finally {
        disposeSafe(enumerator);
    }
    window.requestAnimationFrame((arg00$0040) => {
        tick(arg00$0040);
    });
}

export function start() {
    if (!running) {
        running = true;
        pointerX = (window.innerWidth / 2);
        pointerY = (window.innerHeight / 2);
        smoothX = pointerX;
        smoothY = pointerY;
        window.addEventListener("pointermove", (ev) => {
            const e = ev;
            pointerX = e.clientX;
            pointerY = e.clientY;
        });
        if (!reduced) {
            window.requestAnimationFrame((arg00$0040) => {
                tick(arg00$0040);
            });
        }
        else {
            let enumerator = getEnumerator(frameJobs);
            try {
                while (enumerator["System.Collections.IEnumerator.MoveNext"]()) {
                    enumerator["System.Collections.Generic.IEnumerator`1.get_Current"]()(window.scrollY);
                }
            }
            finally {
                disposeSafe(enumerator);
            }
        }
    }
}

/**
 * Marca `.is-in` cuando el elemento entra en pantalla. El retardo de cascada
 * se escribe como custom property para que el CSS decida la curva.
 */
export function revealAll(selector) {
    const nodes = qsa(selector);
    if (reduced) {
        iterate((e) => {
            addCls("is-in", e);
        }, nodes);
    }
    else {
        const io = (function(cb,thr){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cb(e.target);io.unobserve(e.target);}});},{threshold:thr,rootMargin:'0px 0px -10% 0px'});return io;})(((e_1) => {
            addCls("is-in", e_1);
        }),0.15);
        iterate((n) => {
            io.observe(n);
        }, nodes);
    }
}

/**
 * Aplica retardos escalonados dentro de un contenedor.
 */
export function stagger(container, stepMs) {
    iterateIndexed((i_1, k) => {
        setVar("--delay", int32ToString(i_1 * stepMs) + "ms", k);
    }, toList(delay(() => map((i) => container.children.item(some(i)), rangeDouble(0, 1, container.children.length - 1)))));
}

/**
 * Reinicia la coreografía de un contenedor: quita las clases, fuerza un
 * reflow y las vuelve a poner. Sin el reflow el navegador agrupa ambos
 * cambios en un solo estilo y la animación no se vuelve a disparar.
 */
export function replay(container, cls) {
    const kids = toList(delay(() => map((i) => container.children.item(some(i)), rangeDouble(0, 1, container.children.length - 1))));
    iterate((e) => {
        removeCls(cls, e);
    }, kids);
    container.offsetHeight;
    iterate((e_1) => {
        addCls(cls, e_1);
    }, kids);
}

/**
 * Desplaza el elemento a una fracción de la velocidad del scroll.
 * speed 0.3 = se mueve al 30 % de lo que se mueve la página.
 */
export function parallax(e, speed) {
    if (!reduced) {
        onFrame((y) => {
            const r = e.getBoundingClientRect();
            const d = -((r.top + (r.height / 2)) - (window.innerHeight / 2)) * speed;
            const v = ("translate3d(0," + round(d, 2).toString()) + "px,0)";
            e.style.transform = v;
        });
    }
}

/**
 * Llama a `cb` con el avance [0,1] del elemento a través del viewport.
 */
export function scrollProgress(e, cb) {
    onFrame((_arg) => {
        const r = e.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        cb((total <= 0) ? 0 : norm(0, total, -r.top));
    });
}

/**
 * Barra de avance global de lectura.
 */
export function progressBar(bar) {
    onFrame((y) => {
        const alto = document.body.scrollHeight - window.innerHeight;
        const p = (alto <= 0) ? 0 : clamp(0, 1, y / alto);
        const v = ("scaleX(" + round(p, 4).toString()) + ")";
        bar.style.transform = v;
    });
}

/**
 * Marca el punto de navegación de la sección visible.
 */
export function sectionSpy(secciones, onActive) {
    const io = (function(cb){return new IntersectionObserver(function(es){es.forEach(function(e){cb(e.target,e.isIntersecting);});},{threshold:0.35});})((target, visible) => {
        if (visible) {
            onActive(target.id);
        }
    });
    iterate((s) => {
        io.observe(s);
    }, qsa(secciones));
}

/**
 * Botón magnético: se desplaza hacia el cursor dentro de su radio.
 * `fuerza` es la fracción de la distancia que recorre (0.35 = 35 %).
 */
export function magnetic(wrap, inner, radio, fuerza) {
    if (hasPointer && !reduced) {
        let dx = 0;
        let dy = 0;
        let tx = 0;
        let ty = 0;
        wrap.addEventListener("pointermove", (ev) => {
            const e = ev;
            const r = wrap.getBoundingClientRect();
            const cx = r.left + (r.width / 2);
            const cy = r.top + (r.height / 2);
            const ax = e.clientX - cx;
            const ay = e.clientY - cy;
            if (Math.sqrt((ax * ax) + (ay * ay)) < radio) {
                tx = (ax * fuerza);
                ty = (ay * fuerza);
            }
            else {
                tx = 0;
                ty = 0;
            }
        });
        wrap.addEventListener("pointerleave", (_arg) => {
            tx = 0;
            ty = 0;
        });
        onFrame((_arg_1) => {
            dx = lerp(dx, tx, 0.18);
            dy = lerp(dy, ty, 0.18);
            const v = ((("translate3d(" + round(dx, 2).toString()) + "px,") + round(dy, 2).toString()) + "px,0)";
            inner.style.transform = v;
        });
    }
}

/**
 * Gira/desplaza un elemento hacia el puntero. `amp` en píxeles.
 */
export function follow(e, amp) {
    if (hasPointer && !reduced) {
        onFrame((_arg) => {
            const patternInput = pointerNorm();
            const v = ((("translate3d(" + round(patternInput[0] * amp, 2).toString()) + "px,") + round(patternInput[1] * amp, 2).toString()) + "px,0)";
            e.style.transform = v;
        });
    }
}

/**
 * Pupila que persigue al cursor dentro de un ojo circular.
 */
export function pupila(ojo, pupila_1, radio) {
    if (hasPointer && !reduced) {
        onFrame((_arg) => {
            const r = ojo.getBoundingClientRect();
            const cx = r.left + (r.width / 2);
            const cy = r.top + (r.height / 2);
            const ax = smoothX - cx;
            const ay = smoothY - cy;
            const dist = max(1, Math.sqrt((ax * ax) + (ay * ay)));
            const k = min(radio, dist) / dist;
            const v = ((("translate3d(" + round(ax * k, 2).toString()) + "px,") + round(ay * k, 2).toString()) + "px,0)";
            pupila_1.style.transform = v;
        });
    }
}

/**
 * Ejecuta después de n milisegundos.
 */
export function after(ms, f) {
    window.setTimeout(f, ms);
}

