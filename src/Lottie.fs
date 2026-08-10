module Lottie

// ─────────────────────────────────────────────────────────────────────────────
//  Integración de Lottie.
//
//  La librería (lottie-web) se carga de forma diferida y SOLO cuando el
//  contenedor entra en pantalla: no queremos 250 KB de reproductor en el
//  arranque de una página cuya promesa es la ligereza.
//
//  Si el CDN no responde —red del cliente, firewall corporativo, demo sin
//  internet— el contenedor cae a una animación CSS equivalente y la sección
//  sigue explicándose sola. Una demo de ventas nunca debe mostrar un hueco.
// ─────────────────────────────────────────────────────────────────────────────

open Browser
open Browser.Types
open Fable.Core
open Dsl

let private CDN = "https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie_light.min.js"

[<Emit("typeof lottie !== 'undefined'")>]
let private lottieListo () : bool = jsNative

[<Emit("lottie.loadAnimation({ container: $0, renderer: 'svg', loop: true, autoplay: true, path: $1 })")>]
let private cargaAnim (host: HTMLElement) (path: string) : obj = jsNative

[<Emit("$0.setSpeed($1)")>]
let private setSpeed (anim: obj) (v: float) : unit = jsNative

/// Carga el script una sola vez. `ok` recibe true si quedó disponible.
let private aseguraLibreria (ok: bool -> unit) =
    if lottieListo () then ok true
    else
        let existente = document.querySelector ("script[data-lottie]")
        if not (isNull (box existente)) then
            existente.addEventListener ("load", fun _ -> ok true)
            existente.addEventListener ("error", fun _ -> ok false)
        else
            let s = document.createElement "script"
            s.setAttribute ("src", CDN)
            s.setAttribute ("data-lottie", "1")
            s.setAttribute ("crossorigin", "anonymous")
            s.addEventListener ("load", fun _ -> ok (lottieListo ()))
            s.addEventListener ("error", fun _ -> ok false)
            document.head.appendChild s |> ignore

/// Respaldo puramente CSS: tres anillos que laten. Vive en el mismo hueco.
let private respaldo (host: HTMLElement) =
    host.innerHTML <-
        "<div class='lottie-fallback' role='img' aria-label='Animación de pulso'>"
        + "<span></span><span></span><span></span></div>"

/// Monta la animación en `host` leyendo `path` (JSON de Lottie).
/// `estado` recibe una etiqueta legible de lo que ocurrió.
let mount (host: HTMLElement) (path: string) (estado: string -> unit) =
    let mutable montado = false
    let intenta () =
        if not montado then
            montado <- true
            estado "cargando reproductor…"
            aseguraLibreria (fun disponible ->
                if disponible then
                    try
                        let anim = cargaAnim host path
                        setSpeed anim 1.0
                        estado "lottie-web · SVG vectorial"
                    with _ ->
                        respaldo host
                        estado "respaldo CSS (JSON no válido)"
                else
                    respaldo host
                    estado "respaldo CSS (sin conexión al CDN)")
    // Solo cuando se ve.
    Motion.onFrame (fun _ ->
        if not montado then
            let r = host.getBoundingClientRect ()
            if r.top < window.innerHeight * 1.2 && r.bottom > 0.0 then intenta ())
    // Si el movimiento está reducido el bucle no corre: se monta de una vez.
    if Motion.reduced then intenta ()

/// Pide el JSON y reporta su tamaño real en bytes. Es el dato que convence:
/// el vendedor no dice «Lottie pesa poco», muestra cuánto pesa este archivo.
/// Se emite en JS directo para no arrastrar Fable.Fetch ni Fable.Promise.
[<Emit("fetch($0).then(function(r){return r.text();}).then(function(t){$1(new Blob([t]).size);}).catch(function(){$1(0);})")>]
let pesaJson (path: string) (cb: int -> unit) : unit = jsNative
