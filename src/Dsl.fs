module Dsl

// ─────────────────────────────────────────────────────────────────────────────
//  DSL mínimo de construcción de DOM.
//  No usamos React ni un virtual DOM: para una landing de una sola pasada,
//  construir el DOM real desde F# es más rápido, no necesita bundler y la
//  salida de Fable son ES modules que GitHub Pages sirve tal cual.
// ─────────────────────────────────────────────────────────────────────────────

open Browser
open Browser.Types
open Fable.Core

// Fable.Browser.Dom no expone `.style` sobre HTMLElement en esta versión, así
// que el acceso a estilos en línea se emite directo. Es una sola puerta y todo
// el resto del código pasa por aquí.
[<Emit("$0.style.setProperty($1, $2)")>]
let private styleSet (e: HTMLElement) (prop: string) (value: string) : unit = jsNative

[<Emit("$0.style.transform = $1")>]
let setTransform (e: HTMLElement) (v: string) : unit = jsNative

/// Atributo declarativo aplicable a un nodo.
type Attr =
    | Cls of string
    | Id of string
    | At of string * string
    | Sty of string
    | Txt of string
    | Raw of string
    | On of string * (Event -> unit)

let private apply (e: HTMLElement) (a: Attr) =
    match a with
    | Cls c -> e.className <- (if e.className = "" then c else e.className + " " + c)
    | Id i -> e.id <- i
    | At (k, v) -> e.setAttribute (k, v)
    | Sty s -> e.setAttribute ("style", s)
    | Txt t -> e.textContent <- t
    | Raw h -> e.innerHTML <- h
    | On (evt, h) -> e.addEventListener (evt, h)

/// Crea un elemento con atributos e hijos.
let el (tag: string) (attrs: Attr list) (children: HTMLElement list) : HTMLElement =
    let e = document.createElement tag
    attrs |> List.iter (apply e)
    children |> List.iter (fun c -> e.appendChild c |> ignore)
    e

// Atajos para los tags que más usamos.
let div attrs children = el "div" attrs children
let section attrs children = el "section" attrs children
let header attrs children = el "header" attrs children
let footer attrs children = el "footer" attrs children
let nav attrs children = el "nav" attrs children
let article attrs children = el "article" attrs children
let span attrs children = el "span" attrs children
let p attrs children = el "p" attrs children
let h1 attrs children = el "h1" attrs children
let h2 attrs children = el "h2" attrs children
let h3 attrs children = el "h3" attrs children
let h4 attrs children = el "h4" attrs children
let ul attrs children = el "ul" attrs children
let li attrs children = el "li" attrs children
let button attrs children = el "button" attrs children
let canvas attrs children = el "canvas" attrs children
let a attrs children = el "a" attrs children

/// Nodo de solo texto con clase.
let t (cls: string) (text: string) = span [ Cls cls; Txt text ] []

/// Párrafo simple.
let para (cls: string) (text: string) = p [ Cls cls; Txt text ] []

/// Inserta SVG en línea. Los elementos SVG no son HTMLElement, así que se
/// montan por innerHTML dentro de un contenedor en lugar de createElementNS.
let svg (cls: string) (markup: string) = span [ Cls cls; Raw markup ] []

// ── Utilidades de consulta y clases ──────────────────────────────────────────

let qs (sel: string) : HTMLElement option =
    let n = document.querySelector sel
    if isNull (box n) then None else Some (n :?> HTMLElement)

let qsa (sel: string) : HTMLElement list =
    document.querySelectorAll sel
    |> fun nl -> [ for i in 0 .. nl.length - 1 -> nl.item i :?> HTMLElement ]

let addCls (c: string) (e: HTMLElement) = e.classList.add c
let removeCls (c: string) (e: HTMLElement) = e.classList.remove c
let hasCls (c: string) (e: HTMLElement) = e.classList.contains c

let toggleCls (c: string) (on: bool) (e: HTMLElement) =
    if on then e.classList.add c else e.classList.remove c

/// Escribe una custom property CSS en un elemento.
let setVar (name: string) (value: string) (e: HTMLElement) = styleSet e name value

/// Escribe una propiedad CSS en línea.
let setStyle (prop: string) (value: string) (e: HTMLElement) = styleSet e prop value

// ── Numéricas ────────────────────────────────────────────────────────────────

let clamp (lo: float) (hi: float) (v: float) = max lo (min hi v)

/// Interpolación lineal.
let lerp (a: float) (b: float) (k: float) = a + (b - a) * k

/// Normaliza v dentro de [a,b] a [0,1], recortado.
let norm (a: float) (b: float) (v: float) =
    if b - a = 0.0 then 0.0 else clamp 0.0 1.0 ((v - a) / (b - a))
