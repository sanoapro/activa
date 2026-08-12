import { Record } from "./fable_modules/fable-library-js.4.24.0/Types.js";
import { record_type, float64_type } from "./fable_modules/fable-library-js.4.24.0/Reflection.js";
import { seeded } from "./fable_modules/fable-library-js.4.24.0/Random.js";
import { singleton, collect, delay, toArray } from "./fable_modules/fable-library-js.4.24.0/Seq.js";
import { rangeDouble } from "./fable_modules/fable-library-js.4.24.0/Range.js";
import { max, min } from "./fable_modules/fable-library-js.4.24.0/Double.js";
import { onFrame, reduced, pointerNorm } from "./Motion.js";
import { item } from "./fable_modules/fable-library-js.4.24.0/Array.js";
import { int32ToString, round } from "./fable_modules/fable-library-js.4.24.0/Util.js";
import { lerp, clamp } from "./Dsl.js";

class P extends Record {
    constructor(X, Y, Z, Vx, Vy) {
        super();
        this.X = X;
        this.Y = Y;
        this.Z = Z;
        this.Vx = Vx;
        this.Vy = Vy;
    }
}

function P_$reflection() {
    return record_type("Particles.P", [], P, () => [["X", float64_type], ["Y", float64_type], ["Z", float64_type], ["Vx", float64_type], ["Vy", float64_type]]);
}

/**
 * Monta el campo. `n` = número de partículas.
 */
export function mount(host, n) {
    const cv = host;
    const ctx = cv.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = 1;
    const gen = seeded(20260810);
    const r01 = () => gen.NextDouble();
    const ps = toArray(delay(() => collect((matchValue) => singleton(new P((r01() - 0.5) * 1200, (r01() - 0.5) * 700, r01() * 700, (r01() - 0.5) * 0.22, (r01() - 0.5) * 0.22)), rangeDouble(1, 1, n))));
    const resize = () => {
        dpr = min(2, window.devicePixelRatio);
        w = cv.clientWidth;
        h = cv.clientHeight;
        cv.width = ~~(w * dpr);
        cv.height = ~~(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", (_arg) => {
        resize();
    });
    const proyecta = (p) => {
        const k = 420 / (420 + p.Z);
        return [(w / 2) + (p.X * k), (h / 2) + (p.Y * k), k];
    };
    const dibuja = () => {
        if (w > 0) {
            ctx.clearRect(0, 0, w, h);
            const patternInput = pointerNorm();
            const py = patternInput[1];
            const px = patternInput[0];
            const camX = px * 55;
            const camY = py * 35;
            const cursorX = (w / 2) + (px * (w / 2));
            const cursorY = (h / 2) + (py * (h / 2));
            for (let idx = 0; idx <= (ps.length - 1); idx++) {
                const p_1 = item(idx, ps);
                p_1.X = (p_1.X + p_1.Vx);
                p_1.Y = (p_1.Y + p_1.Vy);
                p_1.Z = (p_1.Z - 0.35);
                if (p_1.Z < -380) {
                    p_1.Z = 700;
                    p_1.X = ((r01() - 0.5) * 1200);
                    p_1.Y = ((r01() - 0.5) * 700);
                }
                if (Math.abs(p_1.X) > 700) {
                    p_1.Vx = -p_1.Vx;
                }
                if (Math.abs(p_1.Y) > 420) {
                    p_1.Vy = -p_1.Vy;
                }
            }
            ctx.lineWidth = 1;
            for (let i = 0; i <= (ps.length - 1); i++) {
                const patternInput_1 = proyecta(item(i, ps));
                const ak = patternInput_1[2];
                const ax_1 = patternInput_1[0] + (camX * ak);
                const ay_1 = patternInput_1[1] + (camY * ak);
                for (let j = i + 1; j <= (ps.length - 1); j++) {
                    const patternInput_2 = proyecta(item(j, ps));
                    const bk = patternInput_2[2];
                    const bx_1 = patternInput_2[0] + (camX * bk);
                    const by_1 = patternInput_2[1] + (camY * bk);
                    const dx = ax_1 - bx_1;
                    const dy = ay_1 - by_1;
                    const d2 = (dx * dx) + (dy * dy);
                    if (d2 < 12100) {
                        const alpha = ((1 - (Math.sqrt(d2) / 110)) * 0.28) * ak;
                        ctx.strokeStyle = (("rgba(34,211,199," + round(alpha, 3).toString()) + ")");
                        ctx.beginPath();
                        ctx.moveTo(ax_1, ay_1);
                        ctx.lineTo(bx_1, by_1);
                        ctx.stroke();
                    }
                }
            }
            for (let idx_1 = 0; idx_1 <= (ps.length - 1); idx_1++) {
                const patternInput_3 = proyecta(item(idx_1, ps));
                const k_1 = patternInput_3[2];
                const sx_1 = patternInput_3[0] + (camX * k_1);
                const sy_1 = patternInput_3[1] + (camY * k_1);
                const dx_1 = sx_1 - cursorX;
                const dy_1 = sy_1 - cursorY;
                const dist = Math.sqrt((dx_1 * dx_1) + (dy_1 * dy_1));
                const push = ((dist < 150) && (dist > 0.1)) ? (((150 - dist) / 150) * 34) : 0;
                const fx = sx_1 + ((dx_1 / max(dist, 0.1)) * push);
                const fy = sy_1 + ((dy_1 / max(dist, 0.1)) * push);
                const radio = max(0.4, 2.3 * k_1);
                const alpha_1 = clamp(0.05, 0.9, k_1 * 0.95);
                const mezcla = clamp(0, 1, k_1);
                const rr = ~~lerp(124, 34, mezcla) | 0;
                const gg = ~~lerp(92, 211, mezcla) | 0;
                const bb = ~~lerp(255, 199, mezcla) | 0;
                ctx.fillStyle = (((((((("rgba(" + int32ToString(rr)) + ",") + int32ToString(gg)) + ",") + int32ToString(bb)) + ",") + round(alpha_1, 3).toString()) + ")");
                ctx.beginPath();
                ctx.arc(fx, fy, radio, 0, 6.283185307179586);
                ctx.fill();
            }
        }
    };
    if (reduced) {
        dibuja();
    }
    else {
        onFrame((_arg_1) => {
            const r = cv.getBoundingClientRect();
            if ((r.bottom > 0) && (r.top < window.innerHeight)) {
                dibuja();
            }
        });
    }
}

