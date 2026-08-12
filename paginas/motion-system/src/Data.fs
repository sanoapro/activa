module Data

// ─────────────────────────────────────────────────────────────────────────────
//  El contenido del deck es DATO, no marcado. Toda la presentación se deriva
//  de estas estructuras: así el vendedor edita una lista y la página se
//  reconstruye sola, sin tocar HTML.
// ─────────────────────────────────────────────────────────────────────────────

/// Qué demo vivo se monta en cada categoría.
type Demo =
    | DemoMicro
    | DemoEntrada
    | DemoScroll
    | DemoCursor
    | DemoMedia

/// Una técnica concreta dentro de una categoría.
type Tecnica =
    { Nombre: string
      Detalle: string
      /// Ruta SVG de 24×24 que ilustra la técnica.
      Icono: string }

/// Una de las cinco categorías del plan.
type Categoria =
    { Id: string
      Numero: string
      Titulo: string
      Subtitulo: string
      Proposito: string
      /// El argumento que el vendedor dice en voz alta.
      Pitch: string
      /// Objeción típica del cliente y su respuesta.
      Objecion: string
      Respuesta: string
      Tecnicas: Tecnica list
      Demo: Demo
      Acento: string }

// ── Rutas de iconos (Material Symbols, 24×24) ────────────────────────────────

module Ico =
    let touch = "M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4 4 0 1 0-8 0c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6a1.5 1.5 0 0 0-3 0v10.74l-3.44-.72a1 1 0 0 0-.97 1.66l3.9 4.24c.38.41.91.64 1.47.64h6.7c1 0 1.81-.74 1.94-1.73l.63-4.51c.13-.9-.33-1.78-1.14-2.19z"
    let bolt = "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"
    let toggle = "M17 7H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
    let fade = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18V4a8 8 0 0 1 0 16z"
    let stagger = "M3 5h6v6H3V5zm8 0h6v6h-6V5zm-8 8h6v6H3v-6zm8 0h6v6h-6v-6z"
    let layers = "M12 2 2 8l10 6 10-6-10-6zm0 10.5L4.2 8 12 4.4 19.8 8 12 12.5zM2 12l10 6 10-6-1.9-1.2L12 15.6 3.9 10.8 2 12zm0 4 10 6 10-6-1.9-1.2L12 19.6 3.9 14.8 2 16z"
    let scroll = "M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5zm3 15a3 3 0 0 1-6 0V7a3 3 0 0 1 6 0v10zm-3-9a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1z"
    let story = "M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2zm12 0 5-3v6l-5-3z"
    let magnet = "M20 9V4h-5v5a3 3 0 1 1-6 0V4H4v5a9 9 0 1 0 18 0h-2zm-8 11a7 7 0 0 1-7-7V6h1v3a5 5 0 0 0 10 0V6h1v7a7 7 0 0 1-5 6.7V20z"
    let eye = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
    let feather = "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM6.5 17.5v-6.38l6.66-6.66a4.5 4.5 0 0 1 6.36 6.36L12.88 17.5H6.5z"
    let cube = "M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3zM5 9.6l6 3.3v6.8l-6-3.3V9.6zm8 10.1v-6.8l6-3.3v6.8l-6 3.3z"
    let check = "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
    let target = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-13a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"

// ── Las cinco categorías ─────────────────────────────────────────────────────

let categorias : Categoria list =
    [
      { Id = "microinteracciones"
        Numero = "01"
        Titulo = "Microinteracciones"
        Subtitulo = "El movimiento funcional"
        Proposito = "Retroalimentación inmediata. El sistema responde antes de que el usuario dude."
        Pitch = "Aquí no estamos decorando: cada animación contesta una pregunta que el usuario ya se hizo. ¿Se puede hacer clic? ¿Funcionó? ¿Está cargando? Sin esa respuesta, la gente hace clic dos veces y pierde la confianza."
        Objecion = "«¿No es esto un adorno que encarece el proyecto?»"
        Respuesta = "Es lo contrario: la microinteracción reduce llamadas a soporte y abandonos de formulario, porque el usuario nunca queda sin saber qué pasó."
        Tecnicas =
          [ { Nombre = "Hover states"
              Detalle = "El botón cambia de color, crece un 5 % o se eleva. Le dice al usuario «soy interactivo» antes del clic."
              Icono = Ico.touch }
            { Nombre = "Botones de estado"
              Detalle = "Un solo botón recorre reposo → cargando → confirmado. El usuario nunca se pregunta si su envío se registró."
              Icono = Ico.bolt }
            { Nombre = "Interruptores"
              Detalle = "Toggles con transición suave, tipo switch de modo oscuro. El cambio se siente físico, no abrupto."
              Icono = Ico.toggle } ]
        Demo = DemoMicro
        Acento = "brand" }

      { Id = "entrada"
        Numero = "02"
        Titulo = "Animaciones de entrada"
        Subtitulo = "Reveal on load"
        Proposito = "Coreografía al cargar. La página se presenta en un orden decidido, no de golpe."
        Pitch = "Cuando todo aparece al mismo tiempo, el ojo no sabe dónde mirar. Con una entrada coreografiada usted decide qué lee primero el cliente: primero el titular, después la promesa, al final el precio."
        Objecion = "«¿No hace que la página se sienta más lenta?»"
        Respuesta = "No, porque la percepción de velocidad depende del primer píxel útil. La entrada escalonada arranca en cuanto hay contenido y ocupa 400 ms; sin ella, la página se siente estática y más pesada."
        Tecnicas =
          [ { Nombre = "Fade-in / Slide-up"
              Detalle = "Textos e imágenes entran con opacidad y un desplazamiento corto hacia arriba. Movimiento breve, nunca rebote."
              Icono = Ico.fade }
            { Nombre = "Efecto cascada (staggering)"
              Detalle = "Una cuadrícula de 6 tarjetas aparece con milisegundos de diferencia entre cada una. El ojo las recorre en orden."
              Icono = Ico.stagger }
            { Nombre = "Jerarquía temporal"
              Detalle = "El retardo codifica importancia: lo que entra primero es lo que el cliente debe recordar."
              Icono = Ico.layers } ]
        Demo = DemoEntrada
        Acento = "violet" }

      { Id = "scroll"
        Numero = "03"
        Titulo = "Movimiento basado en scroll"
        Subtitulo = "Profundidad y narrativa"
        Proposito = "El scroll deja de ser navegación y se convierte en el hilo de la historia."
        Pitch = "El cliente controla el ritmo con su propio dedo. Cada vez que baja, revelamos exactamente el siguiente argumento. Es la diferencia entre un folleto y una demostración."
        Objecion = "«Ya vi sitios así y marean.»"
        Respuesta = "Marean cuando el movimiento compite con la lectura. Aquí el fondo se mueve a un tercio de la velocidad del texto y todo se desactiva solo si el sistema pide movimiento reducido."
        Tecnicas =
          [ { Nombre = "Parallax"
              Detalle = "El fondo avanza más lento que el contenido y genera profundidad real, sin robar protagonismo al texto."
              Icono = Ico.layers }
            { Nombre = "Scroll reveal"
              Detalle = "Cada bloque aparece solo cuando entra en pantalla. Nada se revela antes de tiempo."
              Icono = Ico.scroll }
            { Nombre = "Scrollytelling"
              Detalle = "Un panel fijo se transforma según el porcentaje exacto de avance: una escena que el cliente dirige."
              Icono = Ico.story } ]
        Demo = DemoScroll
        Acento = "amber" }

      { Id = "cursor"
        Numero = "04"
        Titulo = "Interacción con el cursor"
        Subtitulo = "Mouse tracking"
        Proposito = "Reacción fluida. La interfaz reconoce al usuario antes de que toque nada."
        Pitch = "Esto es lo que hace que una demo se sienta viva en la sala. El cliente mueve el mouse y la página responde: no está viendo una imagen, está tocando un producto."
        Objecion = "«¿Y en celular, donde no hay cursor?»"
        Respuesta = "Se degrada con elegancia: en táctil el efecto no se monta y en su lugar entra la microinteracción de toque. Ningún usuario ve algo roto."
        Tecnicas =
          [ { Nombre = "Botones magnéticos"
              Detalle = "El botón se desplaza hacia el cursor cuando entra en su radio de atracción y regresa con inercia al salir."
              Icono = Ico.magnet }
            { Nombre = "Seguimiento de mirada"
              Detalle = "Elementos ilustrados giran sutilmente hacia el puntero. Da sensación de atención, no de truco."
              Icono = Ico.eye }
            { Nombre = "Suavizado por inercia"
              Detalle = "Nada salta: la posición se interpola cuadro a cuadro para que el movimiento se sienta físico."
              Icono = Ico.feather } ]
        Demo = DemoCursor
        Acento = "brand" }

      { Id = "media"
        Numero = "05"
        Titulo = "Media enriquecida"
        Subtitulo = "Animaciones complejas"
        Proposito = "Innovación visual de alto nivel, sin castigar el peso de la página."
        Pitch = "Este es el cierre de la demo. Es lo que el cliente no puede conseguir con una plantilla, y es exactamente el tipo de detalle que justifica un presupuesto de agencia."
        Objecion = "«Eso debe pesar muchísimo.»"
        Respuesta = "Al revés. Lottie es JSON vectorial: pesa una fracción de un GIF equivalente, escala a cualquier tamaño sin pixelarse y se puede recolorear desde código."
        Tecnicas =
          [ { Nombre = "Lottie"
              Detalle = "Animación vectorial en JSON, exportada desde After Effects. Nítida en cualquier pantalla y controlable por código."
              Icono = Ico.feather }
            { Nombre = "Canvas / WebGL"
              Detalle = "Campo de partículas con proyección en perspectiva y repulsión al cursor, dibujado cuadro a cuadro."
              Icono = Ico.cube }
            { Nombre = "Presupuesto de rendimiento"
              Detalle = "Todo se pausa fuera de pantalla y respeta «reducir movimiento». La animación nunca compite con el contenido."
              Icono = Ico.target } ]
        Demo = DemoMedia
        Acento = "violet" } ]

// ── Copy de las secciones fijas ──────────────────────────────────────────────

let heroKicker = "Plan profesional de integración de animación"
let heroTitulo = "El movimiento no decora.\nVende."
let heroBajada =
    "Cinco capas de interacción que convierten una página estática en una demostración. \
     Cada sección de este documento es, a la vez, la explicación y el ejemplo funcionando."

let heroNotaVendedor =
    "Todo lo que ve en esta página está vivo. Invite al cliente a mover el mouse, \
     hacer clic y bajar: la presentación se demuestra sola."

type Metrica = { Valor: string; Etiqueta: string }

let metricas =
    [ { Valor = "5"; Etiqueta = "capas de interacción" }
      { Valor = "0"; Etiqueta = "dependencias de terceros en el núcleo" }
      { Valor = "60"; Etiqueta = "cuadros por segundo objetivo" }
      { Valor = "A11y"; Etiqueta = "respeta «reducir movimiento»" } ]
