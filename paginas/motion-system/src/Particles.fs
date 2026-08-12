module Particles

// ─────────────────────────────────────────────────────────────────────────────
//  Campo de partículas en 3D dibujado sobre Canvas 2D.
//
//  Se proyecta en perspectiva de verdad (x' = x · f / (f + z)), así que hay
//  profundidad real: las partículas lejanas son más chicas, más tenues y se
//  mueven menos. Se eligió Canvas 2D sobre WebGL a propósito: a esta densidad
//  el resultado visual es idéntico, no hay shaders que compilar ni contexto que
//  se pierda, y funciona en cualquier equipo que el vendedor lleve a la junta.
// ─────────────────────────────────────────────────────────────────────────────

open Browser
open Browser.Types
open Fable.Core
open Dsl

type private P =
    { mutable X: float
      mutable Y: float
      mutable Z: float
      mutable Vx: float
      mutable Vy: float }

/// Monta el campo. `n` = número de partículas.
let mount (host: HTMLElement) (n: int) =
    let cv = host :?> HTMLCanvasElement
    let ctx = cv.getContext_2d ()

    let mutable w = 0.0
    let mutable h = 0.0
    let mutable dpr = 1.0
    let focal = 420.0

    // Un solo generador con semilla fija: el campo se ve igual en cada carga,
    // que es lo que se quiere en una demo que se repite frente a clientes.
    let gen = System.Random 20260810
    let r01 () = gen.NextDouble()

    let ps =
        [| for _ in 1 .. n ->
             { X = (r01 () - 0.5) * 1200.0
               Y = (r01 () - 0.5) * 700.0
               Z = r01 () * 700.0
               Vx = (r01 () - 0.5) * 0.22
               Vy = (r01 () - 0.5) * 0.22 } |]

    let resize () =
        dpr <- min 2.0 window.devicePixelRatio
        w <- float cv.clientWidth
        h <- float cv.clientHeight
        cv.width <- int (w * dpr)
        cv.height <- int (h * dpr)
        ctx.setTransform (dpr, 0.0, 0.0, dpr, 0.0, 0.0)

    resize ()
    window.addEventListener ("resize", fun _ -> resize ())

    /// Proyecta una partícula a coordenadas de pantalla.
    /// Devuelve (sx, sy, escala).
    let proyecta (p: P) =
        let k = focal / (focal + p.Z)
        (w / 2.0 + p.X * k, h / 2.0 + p.Y * k, k)

    let dibuja () =
        if w > 0.0 then
            ctx.clearRect (0.0, 0.0, w, h)
            let px, py = Motion.pointerNorm ()
            // La cámara deriva con el cursor: el campo entero parece inclinarse.
            let camX = px * 55.0
            let camY = py * 35.0
            // Cursor en coordenadas del canvas, para la repulsión.
            let cursorX = (w / 2.0) + px * (w / 2.0)
            let cursorY = (h / 2.0) + py * (h / 2.0)

            for p in ps do
                p.X <- p.X + p.Vx
                p.Y <- p.Y + p.Vy
                p.Z <- p.Z - 0.35
                if p.Z < -380.0 then
                    p.Z <- 700.0
                    p.X <- (r01 () - 0.5) * 1200.0
                    p.Y <- (r01 () - 0.5) * 700.0
                if abs p.X > 700.0 then p.Vx <- -p.Vx
                if abs p.Y > 420.0 then p.Vy <- -p.Vy

            // Enlaces: solo entre partículas cercanas y de profundidad parecida.
            ctx.lineWidth <- 1.0
            for i in 0 .. ps.Length - 1 do
                let ax, ay, ak = proyecta ps.[i]
                let ax = ax + camX * ak
                let ay = ay + camY * ak
                for j in i + 1 .. ps.Length - 1 do
                    let bx, by, bk = proyecta ps.[j]
                    let bx = bx + camX * bk
                    let by = by + camY * bk
                    let dx = ax - bx
                    let dy = ay - by
                    let d2 = dx * dx + dy * dy
                    if d2 < 12100.0 then
                        let alpha = (1.0 - sqrt d2 / 110.0) * 0.28 * ak
                        ctx.strokeStyle <- U3.Case1 ("rgba(34,211,199," + string (System.Math.Round(alpha, 3)) + ")")
                        ctx.beginPath ()
                        ctx.moveTo (ax, ay)
                        ctx.lineTo (bx, by)
                        ctx.stroke ()

            for p in ps do
                let sx, sy, k = proyecta p
                let sx = sx + camX * k
                let sy = sy + camY * k
                // Repulsión: el cursor empuja lo que tiene cerca.
                let dx = sx - cursorX
                let dy = sy - cursorY
                let dist = sqrt (dx * dx + dy * dy)
                let push = if dist < 150.0 && dist > 0.1 then (150.0 - dist) / 150.0 * 34.0 else 0.0
                let fx = sx + (dx / (max dist 0.1)) * push
                let fy = sy + (dy / (max dist 0.1)) * push
                let radio = max 0.4 (2.3 * k)
                let alpha = clamp 0.05 0.9 (k * 0.95)
                // El color viaja de violeta (lejos) a turquesa (cerca).
                let mezcla = clamp 0.0 1.0 k
                let rr = int (lerp 124.0 34.0 mezcla)
                let gg = int (lerp 92.0 211.0 mezcla)
                let bb = int (lerp 255.0 199.0 mezcla)
                ctx.fillStyle <-
                    U3.Case1 ("rgba(" + string rr + "," + string gg + "," + string bb + ","
                              + string (System.Math.Round(alpha, 3)) + ")")
                ctx.beginPath ()
                ctx.arc (fx, fy, radio, 0.0, 6.283185307179586)
                ctx.fill ()

    if Motion.reduced then
        // Sin movimiento: una sola composición estática, que sigue siendo bonita.
        dibuja ()
    else
        Motion.onFrame (fun _ ->
            // No gastamos frames si el lienzo no está en pantalla.
            let r = cv.getBoundingClientRect ()
            if r.bottom > 0.0 && r.top < window.innerHeight then dibuja ())
