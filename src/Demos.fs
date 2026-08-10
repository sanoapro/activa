module Demos

// ─────────────────────────────────────────────────────────────────────────────
//  Los demos vivos. Cada función devuelve el nodo ya cableado: la explicación
//  y el ejemplo son el mismo objeto, que es justo lo que hace útil este deck
//  frente a un cliente.
// ─────────────────────────────────────────────────────────────────────────────

open Browser
open Browser.Types
open Dsl

let private icono (path: string) (cls: string) =
    svg cls ("<svg viewBox='0 0 24 24' aria-hidden='true'><path d='" + path + "'/></svg>")

let private etiqueta (txt: string) = span [ Cls "demo-label"; Txt txt ] []

let private marco (titulo: string) (hijos: HTMLElement list) =
    div [ Cls "demo" ] (etiqueta titulo :: hijos)

// ── 01 · Microinteracciones ──────────────────────────────────────────────────

let private botonEstado () =
    let b = button [ Cls "btn btn-state"; At ("type", "button") ] []
    b.innerHTML <- "<span>Enviar propuesta</span>"
    let mutable ocupado = false
    b.addEventListener ("click", fun _ ->
        if not ocupado then
            ocupado <- true
            b.className <- "btn btn-state is-loading"
            b.innerHTML <- "<i class='spinner'></i><span>Enviando…</span>"
            Motion.after 1500 (fun () ->
                b.className <- "btn btn-state is-done"
                b.innerHTML <-
                    "<svg class='tick' viewBox='0 0 24 24'><path d='" + Data.Ico.check + "'/></svg><span>Propuesta enviada</span>"
                Motion.after 1900 (fun () ->
                    b.className <- "btn btn-state"
                    b.innerHTML <- "<span>Enviar propuesta</span>"
                    ocupado <- false)))
    b

let private interruptor () =
    let knob = span [ Cls "switch-knob" ] []
    let sw = button [ Cls "switch"; At ("type", "button"); At ("role", "switch"); At ("aria-checked", "true"); At ("aria-label", "Alternar tema claro y oscuro") ] [ knob ]
    let mutable oscuro = true
    sw.addEventListener ("click", fun _ ->
        oscuro <- not oscuro
        toggleCls "is-off" (not oscuro) sw
        sw.setAttribute ("aria-checked", (if oscuro then "true" else "false"))
        document.documentElement.setAttribute ("data-theme", (if oscuro then "dark" else "light")))
    sw

let microinteracciones () =
    marco "Pruébelo: pase el cursor y haga clic"
        [ div [ Cls "demo-row" ]
            [ button [ Cls "btn btn-hover-color"; At ("type", "button"); Txt "Cambia de color" ] []
              button [ Cls "btn btn-hover-grow"; At ("type", "button"); Txt "Crece 5 %" ] []
              button [ Cls "btn btn-hover-lift"; At ("type", "button"); Txt "Se eleva" ] [] ]
          div [ Cls "demo-row demo-row--split" ]
            [ botonEstado ()
              div [ Cls "switch-wrap" ]
                [ interruptor ()
                  span [ Cls "switch-txt"; Txt "Modo oscuro" ] [] ] ] ]

// ── 02 · Animaciones de entrada ──────────────────────────────────────────────

let entrada () =
    let tarjetas =
        [ "Diagnóstico", "Auditamos la interfaz actual"
          "Guion", "Definimos qué se revela y cuándo"
          "Prototipo", "Movimiento real, no maqueta"
          "Implementación", "Código listo para producción"
          "Medición", "Antes y después del comportamiento"
          "Iteración", "Se ajusta la curva, no el color" ]

    let grid =
        div [ Cls "stagger-grid" ]
            (tarjetas
             |> List.mapi (fun i (t, d) ->
                 div [ Cls "sc" ]
                     [ span [ Cls "sc-n"; Txt (sprintf "%02d" (i + 1)) ] []
                       h4 [ Txt t ] []
                       p [ Cls "sc-d"; Txt d ] [] ]))

    Motion.stagger grid 90

    let replay =
        button [ Cls "btn btn-ghost"; At ("type", "button"); Txt "Reproducir de nuevo" ] []
    replay.addEventListener ("click", fun _ -> Motion.replay grid "is-in")

    marco "Cascada de 6 tarjetas · 90 ms entre cada una"
        [ grid
          div [ Cls "demo-row" ] [ replay ] ]

// ── 03 · Scroll ──────────────────────────────────────────────────────────────

/// Bloque alto con panel fijo: la escena cambia según el % de avance.
let scrollytelling () =
    let dial = div [ Cls "scrolly-dial" ] []
    let pct = span [ Cls "scrolly-pct"; Txt "0 %" ] []
    let barra = div [ Cls "scrolly-bar" ] [ div [ Cls "scrolly-bar-fill" ] [] ]

    let escenas =
        [ "El cliente llega", "La página está quieta. Todavía no pasa nada."
          "El cliente baja", "Cada bloque aparece justo cuando toca leerlo."
          "El cliente entiende", "El movimiento ordenó la información por usted."
          "El cliente decide", "La demo terminó y el producto se explicó solo." ]

    let nodos =
        escenas
        |> List.mapi (fun i (t, d) ->
            div [ Cls (if i = 0 then "scene is-on" else "scene") ]
                [ span [ Cls "scene-n"; Txt (sprintf "0%d" (i + 1)) ] []
                  h4 [ Txt t ] []
                  p [ Cls "scene-d"; Txt d ] [] ])

    let panel =
        div [ Cls "scrolly-panel" ]
            [ div [ Cls "scrolly-visual" ] [ dial; pct ]
              div [ Cls "scrolly-text" ] nodos
              barra ]

    let sticky = div [ Cls "scrolly-sticky" ] [ panel ]
    let bloque = section [ Cls "scrolly"; Id "scrollytelling" ] [ sticky ]

    let fill = barra.querySelector ".scrolly-bar-fill" :?> HTMLElement

    Motion.scrollProgress bloque (fun p ->
        let porcentaje = int (System.Math.Round(p * 100.0))
        pct.textContent <- string porcentaje + " %"
        setTransform fill <| "scaleX(" + string (System.Math.Round(p, 4)) + ")"
        // El disco gira y cambia de tono con el avance.
        setTransform dial <| "rotate(" + string (System.Math.Round(p * 320.0, 2)) + "deg) scale(" + string (0.72 + p * 0.34) + ")"
        setVar "--p" (string (System.Math.Round(p, 4))) dial
        let activa = min (nodos.Length - 1) (int (p * float nodos.Length))
        nodos |> List.iteri (fun i n -> toggleCls "is-on" (i = activa) n))

    bloque

let scroll () =
    marco "Baje despacio: el fondo va a un tercio de su velocidad"
        [ div [ Cls "parallax-demo" ]
            [ div [ Cls "px-layer px-back" ] []
              div [ Cls "px-layer px-mid" ] []
              div [ Cls "px-copy" ]
                [ h4 [ Txt "Profundidad real" ] []
                  p [ Cls "sc-d"; Txt "Tres capas a distinta velocidad. El texto siempre se lee." ] [] ] ]
          para "demo-note" "El scrollytelling completo está justo debajo de esta sección." ]

// ── 04 · Cursor ──────────────────────────────────────────────────────────────

let private botonMagnetico () =
    let inner = span [ Cls "mag-inner"; Txt "Acérquese" ] []
    let wrap = div [ Cls "mag" ] [ inner ]
    Motion.magnetic wrap inner 130.0 0.38
    wrap

let private cara () =
    let hacerOjo () =
        let pup = span [ Cls "pupila" ] []
        let ojo = div [ Cls "ojo" ] [ pup ]
        ojo, pup

    let o1, p1 = hacerOjo ()
    let o2, p2 = hacerOjo ()
    let c = div [ Cls "cara" ] [ o1; o2 ]
    Motion.pupila o1 p1 13.0
    Motion.pupila o2 p2 13.0
    Motion.follow c 10.0
    c

let cursor () =
    marco "Mueva el mouse por esta tarjeta"
        [ div [ Cls "demo-row demo-row--split cursor-row" ]
            [ botonMagnetico ()
              cara () ]
          para "demo-note" "En pantalla táctil el efecto no se monta: entra la microinteracción de toque." ]

// ── 05 · Media enriquecida ───────────────────────────────────────────────────

let media () =
    let host = div [ Cls "lottie-host"; At ("aria-live", "polite") ] []
    let estado = span [ Cls "chip chip-live"; Txt "en espera" ] []
    let peso = span [ Cls "chip"; Txt "midiendo…" ] []

    Lottie.mount host "./assets/lottie/pulse.json" (fun s -> estado.textContent <- s)
    Lottie.pesaJson "./assets/lottie/pulse.json" (fun bytes ->
        if bytes = 0 then peso.textContent <- "peso no disponible"
        else
            let kb = float bytes / 1024.0
            peso.textContent <- "JSON real: " + string (System.Math.Round(kb, 1)) + " KB")

    let comparativa =
        div [ Cls "vs" ]
            [ div [ Cls "vs-row" ]
                [ span [ Cls "vs-k"; Txt "Lottie (JSON vectorial)" ] []
                  div [ Cls "vs-bar" ] [ div [ Cls "vs-fill vs-a"; Sty "width:4%" ] [] ]
                  span [ Cls "vs-v"; Txt "≈ 4 KB" ] [] ]
              div [ Cls "vs-row" ]
                [ span [ Cls "vs-k"; Txt "GIF equivalente 600×600" ] []
                  div [ Cls "vs-bar" ] [ div [ Cls "vs-fill vs-b"; Sty "width:100%" ] [] ]
                  span [ Cls "vs-v"; Txt "≈ 450 KB" ] [] ]
              para "demo-note"
                  "Además el GIF se pixela al escalar y no se puede recolorear. El Lottie es vectorial, \
                   se reproduce a cualquier tamaño y su color se cambia desde código." ]

    let lienzo = canvas [ Cls "particles"; At ("aria-hidden", "true") ] []
    Particles.mount lienzo 90

    marco "Dos técnicas de alto nivel, funcionando"
        [ div [ Cls "media-grid" ]
            [ div [ Cls "media-card" ]
                [ host
                  div [ Cls "chips" ] [ estado; peso ]
                  comparativa ]
              div [ Cls "media-card media-card--canvas" ]
                [ lienzo
                  div [ Cls "canvas-cap" ]
                    [ h4 [ Txt "Campo de partículas 3D" ] []
                      para "sc-d"
                          "Proyección en perspectiva sobre Canvas. El cursor inclina la cámara y \
                           empuja las partículas cercanas." ] ] ] ]

// ── Selector ─────────────────────────────────────────────────────────────────

let render (d: Data.Demo) =
    match d with
    | Data.DemoMicro -> microinteracciones ()
    | Data.DemoEntrada -> entrada ()
    | Data.DemoScroll -> scroll ()
    | Data.DemoCursor -> cursor ()
    | Data.DemoMedia -> media ()
