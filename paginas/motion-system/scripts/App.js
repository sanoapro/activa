import { qsa, toggleCls, el, qs, footer, h2, h4, p, para, section, h1, nav, span, div, header, Attr$, a, svg } from "./Dsl.js";
import { iterate, singleton, empty, ofArray, map } from "./fable_modules/fable-library-js.4.24.0/List.js";
import { Demo, heroNotaVendedor, Ico_target, heroBajada, heroKicker, metricas as metricas_1, categorias } from "./Data.js";
import { start, sectionSpy, parallax, progressBar, revealAll, stagger, magnetic } from "./Motion.js";
import { scrollytelling, render } from "./Demos.js";
import { equals } from "./fable_modules/fable-library-js.4.24.0/Util.js";

function icono(path, cls) {
    return svg(cls, ("<svg viewBox=\'0 0 24 24\' aria-hidden=\'true\'><path d=\'" + path) + "\'/></svg>");
}

function topbar() {
    const puntos = map((c) => a(ofArray([new Attr$(0, ["dot"]), new Attr$(2, ["href", "#" + c.Id]), new Attr$(2, ["data-for", c.Id]), new Attr$(2, ["aria-label", c.Titulo]), new Attr$(2, ["title", (c.Numero + " · ") + c.Titulo])]), empty()), categorias);
    return header(singleton(new Attr$(0, ["topbar"])), ofArray([div(singleton(new Attr$(0, ["topbar-in"])), ofArray([a(ofArray([new Attr$(0, ["brand"]), new Attr$(2, ["href", "#top"])]), ofArray([span(singleton(new Attr$(0, ["brand-mark"])), empty()), span(ofArray([new Attr$(0, ["brand-txt"]), new Attr$(4, ["activa"])]), empty()), span(singleton(new Attr$(0, ["brand-sep"])), empty()), span(ofArray([new Attr$(0, ["brand-sub"]), new Attr$(4, ["Motion System"])]), empty())])), nav(ofArray([new Attr$(0, ["dots"]), new Attr$(2, ["aria-label", "Secciones"])]), puntos)])), div(singleton(new Attr$(0, ["progress"])), singleton(div(singleton(new Attr$(0, ["progress-fill"])), empty())))]));
}

function hero() {
    let titulo;
    const h = h1(singleton(new Attr$(0, ["hero-t"])), empty());
    h.innerHTML = "El movimiento<br><em>no decora.</em> <b>Vende.</b>";
    titulo = h;
    const cta = span(ofArray([new Attr$(0, ["mag-inner mag-inner--cta"]), new Attr$(4, ["Ver el plan completo"])]), empty());
    const ctaWrap = div(singleton(new Attr$(0, ["mag mag--cta"])), singleton(cta));
    magnetic(ctaWrap, cta, 150, 0.34);
    ctaWrap.addEventListener("click", (_arg) => {
        (function(s){var n=document.querySelector(s); if(n) n.scrollIntoView({behavior:'smooth',block:'start'});})("#microinteracciones");
    });
    const orbes = div(ofArray([new Attr$(0, ["orbs"]), new Attr$(2, ["aria-hidden", "true"])]), ofArray([div(singleton(new Attr$(0, ["orb orb-a"])), empty()), div(singleton(new Attr$(0, ["orb orb-b"])), empty()), div(singleton(new Attr$(0, ["orb orb-c"])), empty())]));
    const metricas = div(singleton(new Attr$(0, ["metrics reveal"])), map((m) => div(singleton(new Attr$(0, ["metric"])), ofArray([span(ofArray([new Attr$(0, ["metric-v"]), new Attr$(4, [m.Valor])]), empty()), span(ofArray([new Attr$(0, ["metric-l"]), new Attr$(4, [m.Etiqueta])]), empty())])), metricas_1));
    return section(ofArray([new Attr$(0, ["hero"]), new Attr$(1, ["top"])]), ofArray([orbes, div(singleton(new Attr$(0, ["hero-in"])), ofArray([span(ofArray([new Attr$(0, ["kicker reveal"]), new Attr$(4, [heroKicker])]), empty()), titulo, para("hero-b reveal", heroBajada), div(singleton(new Attr$(0, ["hero-cta reveal"])), ofArray([ctaWrap, span(ofArray([new Attr$(0, ["hero-hint"]), new Attr$(4, ["· o simplemente empiece a bajar"])]), empty())])), metricas, div(singleton(new Attr$(0, ["seller-note reveal"])), ofArray([icono(Ico_target, "sn-ico"), p(singleton(new Attr$(4, [heroNotaVendedor])), empty())]))]))]));
}

function categoria(c) {
    const tecnicas = div(singleton(new Attr$(0, ["tecnicas"])), map((t) => div(singleton(new Attr$(0, ["tecnica"])), ofArray([div(singleton(new Attr$(0, ["tecnica-ico"])), singleton(icono(t.Icono, ""))), div(empty(), ofArray([h4(singleton(new Attr$(4, [t.Nombre])), empty()), para("tecnica-d", t.Detalle)]))])), c.Tecnicas));
    stagger(tecnicas, 70);
    const ventas = div(singleton(new Attr$(0, ["ventas"])), ofArray([div(singleton(new Attr$(0, ["venta venta--pitch"])), ofArray([span(ofArray([new Attr$(0, ["venta-k"]), new Attr$(4, ["Cómo se dice en la junta"])]), empty()), p(singleton(new Attr$(4, [c.Pitch])), empty())])), div(singleton(new Attr$(0, ["venta venta--obj"])), ofArray([span(ofArray([new Attr$(0, ["venta-k"]), new Attr$(4, ["Si el cliente objeta"])]), empty()), p(ofArray([new Attr$(0, ["obj"]), new Attr$(4, [c.Objecion])]), empty()), p(ofArray([new Attr$(0, ["resp"]), new Attr$(4, [c.Respuesta])]), empty())]))]));
    return section(ofArray([new Attr$(0, ["cat cat--" + c.Acento]), new Attr$(1, [c.Id])]), singleton(div(singleton(new Attr$(0, ["cat-in"])), ofArray([div(singleton(new Attr$(0, ["cat-head reveal"])), ofArray([span(ofArray([new Attr$(0, ["cat-n"]), new Attr$(4, [c.Numero])]), empty()), div(empty(), ofArray([h2(ofArray([new Attr$(0, ["cat-t"]), new Attr$(4, [c.Titulo])]), empty()), span(ofArray([new Attr$(0, ["cat-s"]), new Attr$(4, [c.Subtitulo])]), empty())])), p(ofArray([new Attr$(0, ["cat-p"]), new Attr$(4, [c.Proposito])]), empty())])), div(singleton(new Attr$(0, ["cat-body"])), ofArray([div(singleton(new Attr$(0, ["cat-left reveal"])), ofArray([tecnicas, ventas])), div(singleton(new Attr$(0, ["cat-right reveal"])), singleton(render(c.Demo)))]))]))));
}

function cierre() {
    return section(ofArray([new Attr$(0, ["cierre"]), new Attr$(1, ["cierre"])]), singleton(div(singleton(new Attr$(0, ["cierre-in reveal"])), ofArray([span(ofArray([new Attr$(0, ["kicker"]), new Attr$(4, ["Siguiente paso"])]), empty()), h2(ofArray([new Attr$(0, ["cierre-t"]), new Attr$(4, ["Esta página es la propuesta."])]), empty()), para("cierre-b", "No entregamos un PDF que describe el movimiento: entregamos el movimiento funcionando, en el navegador del cliente, el mismo día de la junta."), div(singleton(new Attr$(0, ["cierre-grid"])), ofArray([div(singleton(new Attr$(0, ["cg"])), ofArray([h4(singleton(new Attr$(4, ["Sin dependencias en el núcleo"])), empty()), para("sc-d", "El motor de animación es propio. Lottie se carga solo si se usa.")])), div(singleton(new Attr$(0, ["cg"])), ofArray([h4(singleton(new Attr$(4, ["60 fps como presupuesto"])), empty()), para("sc-d", "Un solo bucle de render y trabajo pausado fuera de pantalla.")])), div(singleton(new Attr$(0, ["cg"])), ofArray([h4(singleton(new Attr$(4, ["Accesible por defecto"])), empty()), para("sc-d", "Respeta «reducir movimiento» y degrada en pantallas táctiles.")]))])), footer(singleton(new Attr$(0, ["pie"])), ofArray([span(singleton(new Attr$(4, ["activa · Motion System"])), empty()), span(ofArray([new Attr$(0, ["pie-sep"]), new Attr$(4, ["—"])]), empty()), span(singleton(new Attr$(4, ["Construido con F# + Fable"])), empty())]))]))));
}

function montar() {
    let root;
    const matchValue = qs("#app");
    if (matchValue == null) {
        const r_1 = div(singleton(new Attr$(1, ["app"])), empty());
        document.body.appendChild(r_1);
        root = r_1;
    }
    else {
        root = matchValue;
    }
    root.innerHTML = "";
    root.appendChild(topbar());
    const main = el("main", singleton(new Attr$(0, ["main"])), empty());
    main.appendChild(hero());
    iterate((c) => {
        main.appendChild(categoria(c));
        if (equals(c.Demo, new Demo(2, []))) {
            main.appendChild(scrollytelling());
        }
    }, categorias);
    main.appendChild(cierre());
    root.appendChild(main);
    revealAll(".reveal, .sc, .tecnica, .cg, .metric");
    const matchValue_1 = qs(".progress-fill");
    if (matchValue_1 == null) {
    }
    else {
        progressBar(matchValue_1);
    }
    iterate((tupledArg) => {
        const matchValue_2 = qs(tupledArg[0]);
        if (matchValue_2 == null) {
        }
        else {
            parallax(matchValue_2, tupledArg[1]);
        }
    }, ofArray([[".orb-a", 0.24], [".orb-b", 0.14], [".orb-c", 0.34], [".px-back", 0.1], [".px-mid", 0.22]]));
    sectionSpy("section[id]", (id) => {
        iterate((d) => {
            toggleCls("is-on", d.getAttribute("data-for") === id, d);
        }, qsa(".dot"));
    });
    document.body.classList.add("is-ready");
    start();
}

montar();

