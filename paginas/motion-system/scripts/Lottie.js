import { reduced, onFrame } from "./Motion.js";

const CDN = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie_light.min.js";

function aseguraLibreria(ok) {
    if (typeof lottie !== 'undefined') {
        ok(true);
    }
    else {
        const existente = document.querySelector("script[data-lottie]");
        if (!(existente == null)) {
            existente.addEventListener("load", (_arg) => {
                ok(true);
            });
            existente.addEventListener("error", (_arg_1) => {
                ok(false);
            });
        }
        else {
            const s = document.createElement("script");
            s.setAttribute("src", CDN);
            s.setAttribute("data-lottie", "1");
            s.setAttribute("crossorigin", "anonymous");
            s.addEventListener("load", (_arg_2) => {
                ok(typeof lottie !== 'undefined');
            });
            s.addEventListener("error", (_arg_3) => {
                ok(false);
            });
            document.head.appendChild(s);
        }
    }
}

function respaldo(host) {
    host.innerHTML = "<div class=\'lottie-fallback\' role=\'img\' aria-label=\'Animación de pulso\'><span></span><span></span><span></span></div>";
}

/**
 * Monta la animación en `host` leyendo `path` (JSON de Lottie).
 * `estado` recibe una etiqueta legible de lo que ocurrió.
 */
export function mount(host, path, estado) {
    let montado = false;
    const intenta = () => {
        if (!montado) {
            montado = true;
            estado("cargando reproductor…");
            aseguraLibreria((disponible) => {
                if (disponible) {
                    try {
                        const anim = lottie.loadAnimation({ container: host, renderer: 'svg', loop: true, autoplay: true, path: path });
                        anim.setSpeed(1);
                        estado("lottie-web · SVG vectorial");
                    }
                    catch (matchValue) {
                        respaldo(host);
                        estado("respaldo CSS (JSON no válido)");
                    }
                }
                else {
                    respaldo(host);
                    estado("respaldo CSS (sin conexión al CDN)");
                }
            });
        }
    };
    onFrame((_arg) => {
        if (!montado) {
            const r = host.getBoundingClientRect();
            if ((r.top < (window.innerHeight * 1.2)) && (r.bottom > 0)) {
                intenta();
            }
        }
    });
    if (reduced) {
        intenta();
    }
}

