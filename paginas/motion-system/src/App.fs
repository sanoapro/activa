module App

// ─────────────────────────────────────────────────────────────────────────────
//  Composición de la página. Todo el documento se deriva de Data.categorias:
//  agregar una sexta categoría es agregar un registro, no escribir HTML.
// ─────────────────────────────────────────────────────────────────────────────

open Browser
open Browser.Types
open Fable.Core
open Dsl

let private icono (path: string) (cls: string) =
    svg cls ("<svg viewBox='0 0 24 24' aria-hidden='true'><path d='" + path + "'/></svg>")

/// Desplazamiento suave. Se emite en JS para no depender de cómo tipa
/// Fable.Browser.Dom las opciones de scrollIntoView.
[<Emit("(function(s){var n=document.querySelector(s); if(n) n.scrollIntoView({behavior:'smooth',block:'start'});})($0)")>]
let private scrollA (sel: string) : unit = jsNative

// ── Cabecera fija ────────────────────────────────────────────────────────────

let private topbar () =
    let puntos =
        Data.categorias
        |> List.map (fun c ->
            let b =
                a [ Cls "dot"; At ("href", "#" + c.Id); At ("data-for", c.Id)
                    At ("aria-label", c.Titulo); At ("title", c.Numero + " · " + c.Titulo) ] []
            b)

    header [ Cls "topbar" ]
        [ div [ Cls "topbar-in" ]
            [ a [ Cls "brand"; At ("href", "#top") ]
                [ span [ Cls "brand-mark" ] []
                  span [ Cls "brand-txt"; Txt "activa" ] []
                  span [ Cls "brand-sep" ] []
                  span [ Cls "brand-sub"; Txt "Motion System" ] [] ]
              nav [ Cls "dots"; At ("aria-label", "Secciones") ] puntos ]
          div [ Cls "progress" ] [ div [ Cls "progress-fill" ] [] ] ]

// ── Portada ──────────────────────────────────────────────────────────────────

let private hero () =
    let titulo =
        let h = h1 [ Cls "hero-t" ] []
        // El titular se parte en dos líneas con distinto tratamiento.
        h.innerHTML <- "El movimiento<br><em>no decora.</em> <b>Vende.</b>"
        h

    let cta = span [ Cls "mag-inner mag-inner--cta"; Txt "Ver el plan completo" ] []
    let ctaWrap = div [ Cls "mag mag--cta" ] [ cta ]
    Motion.magnetic ctaWrap cta 150.0 0.34
    ctaWrap.addEventListener ("click", fun _ -> scrollA "#microinteracciones")

    let orbes =
        div [ Cls "orbs"; At ("aria-hidden", "true") ]
            [ div [ Cls "orb orb-a" ] []
              div [ Cls "orb orb-b" ] []
              div [ Cls "orb orb-c" ] [] ]

    let metricas =
        div [ Cls "metrics reveal" ]
            (Data.metricas
             |> List.map (fun m ->
                 div [ Cls "metric" ]
                     [ span [ Cls "metric-v"; Txt m.Valor ] []
                       span [ Cls "metric-l"; Txt m.Etiqueta ] [] ]))

    let s =
        section [ Cls "hero"; Id "top" ]
            [ orbes
              div [ Cls "hero-in" ]
                [ span [ Cls "kicker reveal"; Txt Data.heroKicker ] []
                  titulo
                  para "hero-b reveal" Data.heroBajada
                  div [ Cls "hero-cta reveal" ]
                    [ ctaWrap
                      span [ Cls "hero-hint"; Txt "· o simplemente empiece a bajar" ] [] ]
                  metricas
                  div [ Cls "seller-note reveal" ]
                    [ icono Data.Ico.target "sn-ico"
                      p [ Txt Data.heroNotaVendedor ] [] ] ] ]
    s

// ── Una categoría ────────────────────────────────────────────────────────────

let private categoria (c: Data.Categoria) =
    let tecnicas =
        div [ Cls "tecnicas" ]
            (c.Tecnicas
             |> List.map (fun t ->
                 div [ Cls "tecnica" ]
                     [ div [ Cls "tecnica-ico" ] [ icono t.Icono "" ]
                       div []
                         [ h4 [ Txt t.Nombre ] []
                           para "tecnica-d" t.Detalle ] ]))

    Motion.stagger tecnicas 70

    let ventas =
        div [ Cls "ventas" ]
            [ div [ Cls "venta venta--pitch" ]
                [ span [ Cls "venta-k"; Txt "Cómo se dice en la junta" ] []
                  p [ Txt c.Pitch ] [] ]
              div [ Cls "venta venta--obj" ]
                [ span [ Cls "venta-k"; Txt "Si el cliente objeta" ] []
                  p [ Cls "obj"; Txt c.Objecion ] []
                  p [ Cls "resp"; Txt c.Respuesta ] [] ] ]

    section [ Cls ("cat cat--" + c.Acento); Id c.Id ]
        [ div [ Cls "cat-in" ]
            [ div [ Cls "cat-head reveal" ]
                [ span [ Cls "cat-n"; Txt c.Numero ] []
                  div []
                    [ h2 [ Cls "cat-t"; Txt c.Titulo ] []
                      span [ Cls "cat-s"; Txt c.Subtitulo ] [] ]
                  p [ Cls "cat-p"; Txt c.Proposito ] [] ]
              div [ Cls "cat-body" ]
                [ div [ Cls "cat-left reveal" ] [ tecnicas; ventas ]
                  div [ Cls "cat-right reveal" ] [ Demos.render c.Demo ] ] ] ]

// ── Cierre ───────────────────────────────────────────────────────────────────

let private cierre () =
    section [ Cls "cierre"; Id "cierre" ]
        [ div [ Cls "cierre-in reveal" ]
            [ span [ Cls "kicker"; Txt "Siguiente paso" ] []
              h2 [ Cls "cierre-t"; Txt "Esta página es la propuesta." ] []
              para "cierre-b"
                  "No entregamos un PDF que describe el movimiento: entregamos el movimiento \
                   funcionando, en el navegador del cliente, el mismo día de la junta."
              div [ Cls "cierre-grid" ]
                [ div [ Cls "cg" ] [ h4 [ Txt "Sin dependencias en el núcleo" ] []
                                     para "sc-d" "El motor de animación es propio. Lottie se carga solo si se usa." ]
                  div [ Cls "cg" ] [ h4 [ Txt "60 fps como presupuesto" ] []
                                     para "sc-d" "Un solo bucle de render y trabajo pausado fuera de pantalla." ]
                  div [ Cls "cg" ] [ h4 [ Txt "Accesible por defecto" ] []
                                     para "sc-d" "Respeta «reducir movimiento» y degrada en pantallas táctiles." ] ]
              footer [ Cls "pie" ]
                [ span [ Txt "activa · Motion System" ] []
                  span [ Cls "pie-sep"; Txt "—" ] []
                  span [ Txt "Construido con F# + Fable" ] [] ] ] ]

// ── Arranque ─────────────────────────────────────────────────────────────────

let private montar () =
    let root =
        match qs "#app" with
        | Some r -> r
        | None ->
            let r = div [ Id "app" ] []
            document.body.appendChild r |> ignore
            r

    root.innerHTML <- ""
    root.appendChild (topbar ()) |> ignore

    let main = el "main" [ Cls "main" ] []
    main.appendChild (hero ()) |> ignore

    Data.categorias
    |> List.iter (fun c ->
        main.appendChild (categoria c) |> ignore
        // El scrollytelling vive justo después de su categoría.
        if c.Demo = Data.DemoScroll then
            main.appendChild (Demos.scrollytelling ()) |> ignore)

    main.appendChild (cierre ()) |> ignore
    root.appendChild main |> ignore

    // ── Cableado global ──
    Motion.revealAll ".reveal, .sc, .tecnica, .cg, .metric"

    match qs ".progress-fill" with
    | Some b -> Motion.progressBar b
    | None -> ()

    // Parallax: orbes de la portada y las capas del demo de scroll.
    // Cada capa a distinta velocidad es lo que produce la profundidad.
    [ ".orb-a", 0.24; ".orb-b", 0.14; ".orb-c", 0.34
      ".px-back", 0.10; ".px-mid", 0.22 ]
    |> List.iter (fun (sel, v) ->
        match qs sel with
        | Some e -> Motion.parallax e v
        | None -> ())

    // Puntos de navegación activos según la sección visible.
    Motion.sectionSpy "section[id]" (fun id ->
        qsa ".dot" |> List.iter (fun d ->
            toggleCls "is-on" (d.getAttribute "data-for" = id) d))

    document.body.classList.add "is-ready"
    Motion.start ()

// El script se carga como módulo con defer implícito: el DOM ya existe.
montar ()
