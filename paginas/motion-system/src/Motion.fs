module Motion

// ─────────────────────────────────────────────────────────────────────────────
//  Motor de animación.
//
//  Tres reglas de arquitectura:
//   1. Un solo bucle de requestAnimationFrame para TODO lo dirigido por scroll
//      o cursor. Varios listeners de scroll compitiendo es la causa número uno
//      de jank en este tipo de páginas.
//   2. El listener solo guarda coordenadas; el trabajo de layout ocurre dentro
//      del frame. Nunca leemos geometría dentro de un evento.
//   3. Si el sistema pide movimiento reducido, todo se monta en su estado
//      final y el bucle nunca arranca.
// ─────────────────────────────────────────────────────────────────────────────

open Browser
open Browser.Types
open Fable.Core
open Dsl

[<Emit("window.matchMedia($0).matches")>]
let private media (q: string) : bool = jsNative

/// El usuario pidió menos movimiento a nivel de sistema operativo.
let reduced = media "(prefers-reduced-motion: reduce)"

/// El dispositivo tiene un puntero fino (mouse/trackpad), no táctil.
let hasPointer = media "(hover: hover) and (pointer: fine)"


// ── IntersectionObserver (no está tipado en Fable.Browser.Dom) ───────────────

[<Emit("(function(cb,thr){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cb(e.target);io.unobserve(e.target);}});},{threshold:thr,rootMargin:'0px 0px -10% 0px'});return io;})($0,$1)")>]
let private newRevealObserver (cb: HTMLElement -> unit) (threshold: float) : obj = jsNative

// Se tipa como System.Action de dos argumentos, no como función currificada:
// una función F# currificada llega a JS como f(a)(b) y el callback la invoca
// como f(a,b). Action garantiza la aridad real.
[<Emit("(function(cb){return new IntersectionObserver(function(es){es.forEach(function(e){cb(e.target,e.isIntersecting);});},{threshold:0.35});})($0)")>]
let private newActiveObserver (cb: System.Action<HTMLElement, bool>) : obj = jsNative

[<Emit("$0.observe($1)")>]
let private observe (io: obj) (e: HTMLElement) : unit = jsNative

// ── Estado compartido del bucle ──────────────────────────────────────────────

/// Callbacks que corren en cada frame. Reciben el scrollY actual.
let private frameJobs = ResizeArray<float -> unit>()

let mutable private pointerX = 0.0
let mutable private pointerY = 0.0
let mutable private smoothX = 0.0
let mutable private smoothY = 0.0
let mutable private running = false

/// Registra trabajo por frame. Devuelve unit; el trabajo vive lo que vive la página.
let onFrame (job: float -> unit) = frameJobs.Add job

/// Posición suavizada del puntero, normalizada a [-1, 1] desde el centro.
let pointerNorm () =
    let w = window.innerWidth
    let h = window.innerHeight
    ((smoothX / w) * 2.0 - 1.0), ((smoothY / h) * 2.0 - 1.0)

let rec private tick (_: float) =
    // Inercia del puntero: nada salta, todo persigue.
    smoothX <- lerp smoothX pointerX 0.12
    smoothY <- lerp smoothY pointerY 0.12
    let y = window.scrollY
    for job in frameJobs do job y
    window.requestAnimationFrame tick |> ignore

let start () =
    if not running then
        running <- true
        pointerX <- window.innerWidth / 2.0
        pointerY <- window.innerHeight / 2.0
        smoothX <- pointerX
        smoothY <- pointerY
        window.addEventListener ("pointermove", fun ev ->
            let e = ev :?> MouseEvent
            pointerX <- e.clientX
            pointerY <- e.clientY)
        if not reduced then window.requestAnimationFrame tick |> ignore
        else
            // Sin movimiento: se corre una sola pasada para dejar todo colocado.
            for job in frameJobs do job window.scrollY

// ── 1 · Reveal on scroll + cascada ───────────────────────────────────────────

/// Marca `.is-in` cuando el elemento entra en pantalla. El retardo de cascada
/// se escribe como custom property para que el CSS decida la curva.
let revealAll (selector: string) =
    let nodes = qsa selector
    if reduced then
        nodes |> List.iter (addCls "is-in")
    else
        let io = newRevealObserver (fun e -> addCls "is-in" e) 0.15
        nodes |> List.iter (fun n -> observe io n)

/// Aplica retardos escalonados dentro de un contenedor.
let stagger (container: HTMLElement) (stepMs: int) =
    let kids = [ for i in 0 .. int container.children.length - 1 -> container.children.item i :?> HTMLElement ]
    kids |> List.iteri (fun i k -> setVar "--delay" (string (i * stepMs) + "ms") k)

/// Reinicia la coreografía de un contenedor: quita las clases, fuerza un
/// reflow y las vuelve a poner. Sin el reflow el navegador agrupa ambos
/// cambios en un solo estilo y la animación no se vuelve a disparar.
let replay (container: HTMLElement) (cls: string) =
    let kids = [ for i in 0 .. int container.children.length - 1 -> container.children.item i :?> HTMLElement ]
    kids |> List.iter (removeCls cls)
    container.offsetHeight |> ignore
    kids |> List.iter (addCls cls)

// ── 2 · Parallax ─────────────────────────────────────────────────────────────

/// Desplaza el elemento a una fracción de la velocidad del scroll.
/// speed 0.3 = se mueve al 30 % de lo que se mueve la página.
let parallax (e: HTMLElement) (speed: float) =
    if not reduced then
        onFrame (fun y ->
            let r = e.getBoundingClientRect ()
            let centro = r.top + r.height / 2.0 - window.innerHeight / 2.0
            let d = -centro * speed
            setTransform e <|"translate3d(0," + string (System.Math.Round(d, 2)) + "px,0)")

// ── 3 · Scrollytelling ───────────────────────────────────────────────────────

/// Llama a `cb` con el avance [0,1] del elemento a través del viewport.
let scrollProgress (e: HTMLElement) (cb: float -> unit) =
    onFrame (fun _ ->
        let r = e.getBoundingClientRect ()
        let total = r.height - window.innerHeight
        let p = if total <= 0.0 then 0.0 else norm 0.0 total (-r.top)
        cb p)

/// Barra de avance global de lectura.
let progressBar (bar: HTMLElement) =
    onFrame (fun y ->
        let alto = float document.body.scrollHeight - window.innerHeight
        let p = if alto <= 0.0 then 0.0 else clamp 0.0 1.0 (y / alto)
        setTransform bar <|"scaleX(" + string (System.Math.Round(p, 4)) + ")")

/// Marca el punto de navegación de la sección visible.
let sectionSpy (secciones: string) (onActive: string -> unit) =
    let io = newActiveObserver (System.Action<HTMLElement, bool>(fun target visible ->
        if visible then onActive target.id))
    qsa secciones |> List.iter (fun s -> observe io s)

// ── 4 · Cursor ───────────────────────────────────────────────────────────────

/// Botón magnético: se desplaza hacia el cursor dentro de su radio.
/// `fuerza` es la fracción de la distancia que recorre (0.35 = 35 %).
let magnetic (wrap: HTMLElement) (inner: HTMLElement) (radio: float) (fuerza: float) =
    if hasPointer && not reduced then
        let mutable dx = 0.0
        let mutable dy = 0.0
        let mutable tx = 0.0
        let mutable ty = 0.0
        wrap.addEventListener ("pointermove", fun ev ->
            let e = ev :?> MouseEvent
            let r = wrap.getBoundingClientRect ()
            let cx = r.left + r.width / 2.0
            let cy = r.top + r.height / 2.0
            let ax = e.clientX - cx
            let ay = e.clientY - cy
            let dist = sqrt (ax * ax + ay * ay)
            if dist < radio then
                tx <- ax * fuerza
                ty <- ay * fuerza
            else
                tx <- 0.0
                ty <- 0.0)
        wrap.addEventListener ("pointerleave", fun _ ->
            tx <- 0.0
            ty <- 0.0)
        onFrame (fun _ ->
            dx <- lerp dx tx 0.18
            dy <- lerp dy ty 0.18
            setTransform inner <|"translate3d(" + string (System.Math.Round(dx, 2)) + "px,"
                               + string (System.Math.Round(dy, 2)) + "px,0)")

/// Gira/desplaza un elemento hacia el puntero. `amp` en píxeles.
let follow (e: HTMLElement) (amp: float) =
    if hasPointer && not reduced then
        onFrame (fun _ ->
            let nx, ny = pointerNorm ()
            setTransform e <|"translate3d(" + string (System.Math.Round(nx * amp, 2)) + "px,"
                               + string (System.Math.Round(ny * amp, 2)) + "px,0)")

/// Pupila que persigue al cursor dentro de un ojo circular.
let pupila (ojo: HTMLElement) (pupila: HTMLElement) (radio: float) =
    if hasPointer && not reduced then
        onFrame (fun _ ->
            let r = ojo.getBoundingClientRect ()
            let cx = r.left + r.width / 2.0
            let cy = r.top + r.height / 2.0
            let ax = smoothX - cx
            let ay = smoothY - cy
            let dist = max 1.0 (sqrt (ax * ax + ay * ay))
            let k = min radio dist / dist
            setTransform pupila <|"translate3d(" + string (System.Math.Round(ax * k, 2)) + "px,"
                               + string (System.Math.Round(ay * k, 2)) + "px,0)")

// ── Utilidad ─────────────────────────────────────────────────────────────────

/// Ejecuta después de n milisegundos.
let after (ms: int) (f: unit -> unit) = window.setTimeout (f, ms) |> ignore
