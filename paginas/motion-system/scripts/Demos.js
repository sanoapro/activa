import { canvas, para, setVar, section, p as p_1, h4, toggleCls, button, div, Attr$, span, svg } from "./Dsl.js";
import { iterateIndexed, length, mapIndexed, cons, singleton, empty, ofArray } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { follow, pupila, magnetic, scrollProgress, replay as replay_1, stagger, after } from "./Motion.js";
import { Ico_check } from "./Data.js";
import { printf, toText } from "./fable_modules/fable-library-js.4.24.0/String.js";
import { int32ToString, round } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { min } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { mount } from "./Lottie.js";
import { mount as mount_1 } from "./Particles.js";

function icono(path, cls) {
    return svg(cls, ("<svg viewBox=\'0 0 24 24\' aria-hidden=\'true\'><path d=\'" + path) + "\'/></svg>");
}

function etiqueta(txt) {
    return span(ofArray([new Attr$(0, ["demo-label"]), new Attr$(4, [txt])]), empty());
}

function marco(titulo, hijos) {
    return div(singleton(new Attr$(0, ["demo"])), cons(etiqueta(titulo), hijos));
}

function botonEstado() {
    const b = button(ofArray([new Attr$(0, ["btn btn-state"]), new Attr$(2, ["type", "button"])]), empty());
    b.innerHTML = "<span>Enviar propuesta</span>";
    let ocupado = false;
    b.addEventListener("click", (_arg) => {
        if (!ocupado) {
            ocupado = true;
            b.className = "btn btn-state is-loading";
            b.innerHTML = "<i class=\'spinner\'></i><span>Enviando…</span>";
            after(1500, () => {
                b.className = "btn btn-state is-done";
                b.innerHTML = (("<svg class=\'tick\' viewBox=\'0 0 24 24\'><path d=\'" + Ico_check) + "\'/></svg><span>Propuesta enviada</span>");
                after(1900, () => {
                    b.className = "btn btn-state";
                    b.innerHTML = "<span>Enviar propuesta</span>";
                    ocupado = false;
                });
            });
        }
    });
    return b;
}

function interruptor() {
    const sw = button(ofArray([new Attr$(0, ["switch"]), new Attr$(2, ["type", "button"]), new Attr$(2, ["role", "switch"]), new Attr$(2, ["aria-checked", "true"]), new Attr$(2, ["aria-label", "Alternar tema claro y oscuro"])]), singleton(span(singleton(new Attr$(0, ["switch-knob"])), empty())));
    let oscuro = true;
    sw.addEventListener("click", (_arg) => {
        oscuro = !oscuro;
        toggleCls("is-off", !oscuro, sw);
        sw.setAttribute("aria-checked", oscuro ? "true" : "false");
        document.documentElement.setAttribute("data-theme", oscuro ? "dark" : "light");
    });
    return sw;
}

export function microinteracciones() {
    return marco("Pruébelo: pase el cursor y haga clic", ofArray([div(singleton(new Attr$(0, ["demo-row"])), ofArray([button(ofArray([new Attr$(0, ["btn btn-hover-color"]), new Attr$(2, ["type", "button"]), new Attr$(4, ["Cambia de color"])]), empty()), button(ofArray([new Attr$(0, ["btn btn-hover-grow"]), new Attr$(2, ["type", "button"]), new Attr$(4, ["Crece 5 %"])]), empty()), button(ofArray([new Attr$(0, ["btn btn-hover-lift"]), new Attr$(2, ["type", "button"]), new Attr$(4, ["Se eleva"])]), empty())])), div(singleton(new Attr$(0, ["demo-row demo-row--split"])), ofArray([botonEstado(), div(singleton(new Attr$(0, ["switch-wrap"])), ofArray([interruptor(), span(ofArray([new Attr$(0, ["switch-txt"]), new Attr$(4, ["Modo oscuro"])]), empty())]))]))]));
}

export function entrada() {
    const grid = div(singleton(new Attr$(0, ["stagger-grid"])), mapIndexed((i, tupledArg) => {
        let arg;
        return div(singleton(new Attr$(0, ["sc"])), ofArray([span(ofArray([new Attr$(0, ["sc-n"]), new Attr$(4, [(arg = ((i + 1) | 0), toText(printf("%02d"))(arg))])]), empty()), h4(singleton(new Attr$(4, [tupledArg[0]])), empty()), p_1(ofArray([new Attr$(0, ["sc-d"]), new Attr$(4, [tupledArg[1]])]), empty())]));
    }, ofArray([["Diagnóstico", "Auditamos la interfaz actual"], ["Guion", "Definimos qué se revela y cuándo"], ["Prototipo", "Movimiento real, no maqueta"], ["Implementación", "Código listo para producción"], ["Medición", "Antes y después del comportamiento"], ["Iteración", "Se ajusta la curva, no el color"]])));
    stagger(grid, 90);
    const replay = button(ofArray([new Attr$(0, ["btn btn-ghost"]), new Attr$(2, ["type", "button"]), new Attr$(4, ["Reproducir de nuevo"])]), empty());
    replay.addEventListener("click", (_arg) => {
        replay_1(grid, "is-in");
    });
    return marco("Cascada de 6 tarjetas · 90 ms entre cada una", ofArray([grid, div(singleton(new Attr$(0, ["demo-row"])), singleton(replay))]));
}

/**
 * Bloque alto con panel fijo: la escena cambia según el % de avance.
 */
export function scrollytelling() {
    const dial = div(singleton(new Attr$(0, ["scrolly-dial"])), empty());
    const pct = span(ofArray([new Attr$(0, ["scrolly-pct"]), new Attr$(4, ["0 %"])]), empty());
    const barra = div(singleton(new Attr$(0, ["scrolly-bar"])), singleton(div(singleton(new Attr$(0, ["scrolly-bar-fill"])), empty())));
    const nodos = mapIndexed((i, tupledArg) => {
        let arg;
        return div(singleton(new Attr$(0, [(i === 0) ? "scene is-on" : "scene"])), ofArray([span(ofArray([new Attr$(0, ["scene-n"]), new Attr$(4, [(arg = ((i + 1) | 0), toText(printf("0%d"))(arg))])]), empty()), h4(singleton(new Attr$(4, [tupledArg[0]])), empty()), p_1(ofArray([new Attr$(0, ["scene-d"]), new Attr$(4, [tupledArg[1]])]), empty())]));
    }, ofArray([["El cliente llega", "La página está quieta. Todavía no pasa nada."], ["El cliente baja", "Cada bloque aparece justo cuando toca leerlo."], ["El cliente entiende", "El movimiento ordenó la información por usted."], ["El cliente decide", "La demo terminó y el producto se explicó solo."]]));
    const bloque = section(ofArray([new Attr$(0, ["scrolly"]), new Attr$(1, ["scrollytelling"])]), singleton(div(singleton(new Attr$(0, ["scrolly-sticky"])), singleton(div(singleton(new Attr$(0, ["scrolly-panel"])), ofArray([div(singleton(new Attr$(0, ["scrolly-visual"])), ofArray([dial, pct])), div(singleton(new Attr$(0, ["scrolly-text"])), nodos), barra]))))));
    const fill = barra.querySelector(".scrolly-bar-fill");
    scrollProgress(bloque, (p) => {
        const porcentaje = ~~round(p * 100) | 0;
        pct.textContent = (int32ToString(porcentaje) + " %");
        const v = ("scaleX(" + round(p, 4).toString()) + ")";
        fill.style.transform = v;
        const v_1 = ((("rotate(" + round(p * 320, 2).toString()) + "deg) scale(") + (0.72 + (p * 0.34)).toString()) + ")";
        dial.style.transform = v_1;
        setVar("--p", round(p, 4).toString(), dial);
        const activa = min(length(nodos) - 1, ~~(p * length(nodos))) | 0;
        iterateIndexed((i_1, n) => {
            toggleCls("is-on", i_1 === activa, n);
        }, nodos);
    });
    return bloque;
}

export function scroll() {
    return marco("Baje despacio: el fondo va a un tercio de su velocidad", ofArray([div(singleton(new Attr$(0, ["parallax-demo"])), ofArray([div(singleton(new Attr$(0, ["px-layer px-back"])), empty()), div(singleton(new Attr$(0, ["px-layer px-mid"])), empty()), div(singleton(new Attr$(0, ["px-copy"])), ofArray([h4(singleton(new Attr$(4, ["Profundidad real"])), empty()), p_1(ofArray([new Attr$(0, ["sc-d"]), new Attr$(4, ["Tres capas a distinta velocidad. El texto siempre se lee."])]), empty())]))])), para("demo-note", "El scrollytelling completo está justo debajo de esta sección.")]));
}

function botonMagnetico() {
    const inner = span(ofArray([new Attr$(0, ["mag-inner"]), new Attr$(4, ["Acérquese"])]), empty());
    const wrap = div(singleton(new Attr$(0, ["mag"])), singleton(inner));
    magnetic(wrap, inner, 130, 0.38);
    return wrap;
}

function cara() {
    const hacerOjo = () => {
        const pup = span(singleton(new Attr$(0, ["pupila"])), empty());
        return [div(singleton(new Attr$(0, ["ojo"])), singleton(pup)), pup];
    };
    const patternInput = hacerOjo();
    const o1 = patternInput[0];
    const patternInput_1 = hacerOjo();
    const o2 = patternInput_1[0];
    const c = div(singleton(new Attr$(0, ["cara"])), ofArray([o1, o2]));
    pupila(o1, patternInput[1], 13);
    pupila(o2, patternInput_1[1], 13);
    follow(c, 10);
    return c;
}

export function cursor() {
    return marco("Mueva el mouse por esta tarjeta", ofArray([div(singleton(new Attr$(0, ["demo-row demo-row--split cursor-row"])), ofArray([botonMagnetico(), cara()])), para("demo-note", "En pantalla táctil el efecto no se monta: entra la microinteracción de toque.")]));
}

export function media() {
    const host = div(ofArray([new Attr$(0, ["lottie-host"]), new Attr$(2, ["aria-live", "polite"])]), empty());
    const estado = span(ofArray([new Attr$(0, ["chip chip-live"]), new Attr$(4, ["en espera"])]), empty());
    const peso = span(ofArray([new Attr$(0, ["chip"]), new Attr$(4, ["midiendo…"])]), empty());
    mount(host, "../../compartidos/lottie/pulse.json", (s) => {
        estado.textContent = s;
    });
    fetch("../../compartidos/lottie/pulse.json").then(function(r){return r.text();}).then(function(t){((bytes) => {
        if (bytes === 0) {
            peso.textContent = "peso no disponible";
        }
        else {
            const kb = bytes / 1024;
            peso.textContent = (("JSON real: " + round(kb, 1).toString()) + " KB");
        }
    })(new Blob([t]).size);}).catch(function(){((bytes) => {
        if (bytes === 0) {
            peso.textContent = "peso no disponible";
        }
        else {
            const kb = bytes / 1024;
            peso.textContent = (("JSON real: " + round(kb, 1).toString()) + " KB");
        }
    })(0);});
    const comparativa = div(singleton(new Attr$(0, ["vs"])), ofArray([div(singleton(new Attr$(0, ["vs-row"])), ofArray([span(ofArray([new Attr$(0, ["vs-k"]), new Attr$(4, ["Lottie (JSON vectorial)"])]), empty()), div(singleton(new Attr$(0, ["vs-bar"])), singleton(div(ofArray([new Attr$(0, ["vs-fill vs-a"]), new Attr$(3, ["width:4%"])]), empty()))), span(ofArray([new Attr$(0, ["vs-v"]), new Attr$(4, ["≈ 4 KB"])]), empty())])), div(singleton(new Attr$(0, ["vs-row"])), ofArray([span(ofArray([new Attr$(0, ["vs-k"]), new Attr$(4, ["GIF equivalente 600×600"])]), empty()), div(singleton(new Attr$(0, ["vs-bar"])), singleton(div(ofArray([new Attr$(0, ["vs-fill vs-b"]), new Attr$(3, ["width:100%"])]), empty()))), span(ofArray([new Attr$(0, ["vs-v"]), new Attr$(4, ["≈ 450 KB"])]), empty())])), para("demo-note", "Además el GIF se pixela al escalar y no se puede recolorear. El Lottie es vectorial, se reproduce a cualquier tamaño y su color se cambia desde código.")]));
    const lienzo = canvas(ofArray([new Attr$(0, ["particles"]), new Attr$(2, ["aria-hidden", "true"])]), empty());
    mount_1(lienzo, 90);
    return marco("Dos técnicas de alto nivel, funcionando", singleton(div(singleton(new Attr$(0, ["media-grid"])), ofArray([div(singleton(new Attr$(0, ["media-card"])), ofArray([host, div(singleton(new Attr$(0, ["chips"])), ofArray([estado, peso])), comparativa])), div(singleton(new Attr$(0, ["media-card media-card--canvas"])), ofArray([lienzo, div(singleton(new Attr$(0, ["canvas-cap"])), ofArray([h4(singleton(new Attr$(4, ["Campo de partículas 3D"])), empty()), para("sc-d", "Proyección en perspectiva sobre Canvas. El cursor inclina la cámara y empuja las partículas cercanas.")]))]))]))));
}

export function render(d) {
    switch (d.tag) {
        case 1:
            return entrada();
        case 2:
            return scroll();
        case 3:
            return cursor();
        case 4:
            return media();
        default:
            return microinteracciones();
    }
}

