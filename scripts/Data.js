import { Record, Union } from "./fable_modules/fable-library-js.4.24.0/Types.js";
import { list_type, record_type, string_type, union_type } from "./fable_modules/fable-library-js.4.24.0/Reflection.js";
import { ofArray } from "./fable_modules/fable-library-js.4.24.0/List.js";

export class Demo extends Union {
    constructor(tag, fields) {
        super();
        this.tag = tag;
        this.fields = fields;
    }
    cases() {
        return ["DemoMicro", "DemoEntrada", "DemoScroll", "DemoCursor", "DemoMedia"];
    }
}

export function Demo_$reflection() {
    return union_type("Data.Demo", [], Demo, () => [[], [], [], [], []]);
}

export class Tecnica extends Record {
    constructor(Nombre, Detalle, Icono) {
        super();
        this.Nombre = Nombre;
        this.Detalle = Detalle;
        this.Icono = Icono;
    }
}

export function Tecnica_$reflection() {
    return record_type("Data.Tecnica", [], Tecnica, () => [["Nombre", string_type], ["Detalle", string_type], ["Icono", string_type]]);
}

export class Categoria extends Record {
    constructor(Id, Numero, Titulo, Subtitulo, Proposito, Pitch, Objecion, Respuesta, Tecnicas, Demo, Acento) {
        super();
        this.Id = Id;
        this.Numero = Numero;
        this.Titulo = Titulo;
        this.Subtitulo = Subtitulo;
        this.Proposito = Proposito;
        this.Pitch = Pitch;
        this.Objecion = Objecion;
        this.Respuesta = Respuesta;
        this.Tecnicas = Tecnicas;
        this.Demo = Demo;
        this.Acento = Acento;
    }
}

export function Categoria_$reflection() {
    return record_type("Data.Categoria", [], Categoria, () => [["Id", string_type], ["Numero", string_type], ["Titulo", string_type], ["Subtitulo", string_type], ["Proposito", string_type], ["Pitch", string_type], ["Objecion", string_type], ["Respuesta", string_type], ["Tecnicas", list_type(Tecnica_$reflection())], ["Demo", Demo_$reflection()], ["Acento", string_type]]);
}

export const Ico_touch = "M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74c1.21-.81 2-2.18 2-3.74a4 4 0 1 0-8 0c0 1.56.79 2.93 2 3.74zm9.84 4.63-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6a1.5 1.5 0 0 0-3 0v10.74l-3.44-.72a1 1 0 0 0-.97 1.66l3.9 4.24c.38.41.91.64 1.47.64h6.7c1 0 1.81-.74 1.94-1.73l.63-4.51c.13-.9-.33-1.78-1.14-2.19z";

export const Ico_bolt = "M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z";

export const Ico_toggle = "M17 7H7a5 5 0 0 0 0 10h10a5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z";

export const Ico_fade = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18V4a8 8 0 0 1 0 16z";

export const Ico_stagger = "M3 5h6v6H3V5zm8 0h6v6h-6V5zm-8 8h6v6H3v-6zm8 0h6v6h-6v-6z";

export const Ico_layers = "M12 2 2 8l10 6 10-6-10-6zm0 10.5L4.2 8 12 4.4 19.8 8 12 12.5zM2 12l10 6 10-6-1.9-1.2L12 15.6 3.9 10.8 2 12zm0 4 10 6 10-6-1.9-1.2L12 19.6 3.9 14.8 2 16z";

export const Ico_scroll = "M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5zm3 15a3 3 0 0 1-6 0V7a3 3 0 0 1 6 0v10zm-3-9a1 1 0 0 0-1 1v2a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1z";

export const Ico_story = "M4 4h16v2H4V4zm0 4h10v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2zm12 0 5-3v6l-5-3z";

export const Ico_magnet = "M20 9V4h-5v5a3 3 0 1 1-6 0V4H4v5a9 9 0 1 0 18 0h-2zm-8 11a7 7 0 0 1-7-7V6h1v3a5 5 0 0 0 10 0V6h1v7a7 7 0 0 1-5 6.7V20z";

export const Ico_eye = "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z";

export const Ico_feather = "M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76zM6.5 17.5v-6.38l6.66-6.66a4.5 4.5 0 0 1 6.36 6.36L12.88 17.5H6.5z";

export const Ico_cube = "M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.3 6.5 3.6L12 11.5 5.5 7.9 12 4.3zM5 9.6l6 3.3v6.8l-6-3.3V9.6zm8 10.1v-6.8l6-3.3v6.8l-6 3.3z";

export const Ico_check = "M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z";

export const Ico_target = "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-13a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z";

export const categorias = ofArray([new Categoria("microinteracciones", "01", "Microinteracciones", "El movimiento funcional", "Retroalimentación inmediata. El sistema responde antes de que el usuario dude.", "Aquí no estamos decorando: cada animación contesta una pregunta que el usuario ya se hizo. ¿Se puede hacer clic? ¿Funcionó? ¿Está cargando? Sin esa respuesta, la gente hace clic dos veces y pierde la confianza.", "«¿No es esto un adorno que encarece el proyecto?»", "Es lo contrario: la microinteracción reduce llamadas a soporte y abandonos de formulario, porque el usuario nunca queda sin saber qué pasó.", ofArray([new Tecnica("Hover states", "El botón cambia de color, crece un 5 % o se eleva. Le dice al usuario «soy interactivo» antes del clic.", Ico_touch), new Tecnica("Botones de estado", "Un solo botón recorre reposo → cargando → confirmado. El usuario nunca se pregunta si su envío se registró.", Ico_bolt), new Tecnica("Interruptores", "Toggles con transición suave, tipo switch de modo oscuro. El cambio se siente físico, no abrupto.", Ico_toggle)]), new Demo(0, []), "brand"), new Categoria("entrada", "02", "Animaciones de entrada", "Reveal on load", "Coreografía al cargar. La página se presenta en un orden decidido, no de golpe.", "Cuando todo aparece al mismo tiempo, el ojo no sabe dónde mirar. Con una entrada coreografiada usted decide qué lee primero el cliente: primero el titular, después la promesa, al final el precio.", "«¿No hace que la página se sienta más lenta?»", "No, porque la percepción de velocidad depende del primer píxel útil. La entrada escalonada arranca en cuanto hay contenido y ocupa 400 ms; sin ella, la página se siente estática y más pesada.", ofArray([new Tecnica("Fade-in / Slide-up", "Textos e imágenes entran con opacidad y un desplazamiento corto hacia arriba. Movimiento breve, nunca rebote.", Ico_fade), new Tecnica("Efecto cascada (staggering)", "Una cuadrícula de 6 tarjetas aparece con milisegundos de diferencia entre cada una. El ojo las recorre en orden.", Ico_stagger), new Tecnica("Jerarquía temporal", "El retardo codifica importancia: lo que entra primero es lo que el cliente debe recordar.", Ico_layers)]), new Demo(1, []), "violet"), new Categoria("scroll", "03", "Movimiento basado en scroll", "Profundidad y narrativa", "El scroll deja de ser navegación y se convierte en el hilo de la historia.", "El cliente controla el ritmo con su propio dedo. Cada vez que baja, revelamos exactamente el siguiente argumento. Es la diferencia entre un folleto y una demostración.", "«Ya vi sitios así y marean.»", "Marean cuando el movimiento compite con la lectura. Aquí el fondo se mueve a un tercio de la velocidad del texto y todo se desactiva solo si el sistema pide movimiento reducido.", ofArray([new Tecnica("Parallax", "El fondo avanza más lento que el contenido y genera profundidad real, sin robar protagonismo al texto.", Ico_layers), new Tecnica("Scroll reveal", "Cada bloque aparece solo cuando entra en pantalla. Nada se revela antes de tiempo.", Ico_scroll), new Tecnica("Scrollytelling", "Un panel fijo se transforma según el porcentaje exacto de avance: una escena que el cliente dirige.", Ico_story)]), new Demo(2, []), "amber"), new Categoria("cursor", "04", "Interacción con el cursor", "Mouse tracking", "Reacción fluida. La interfaz reconoce al usuario antes de que toque nada.", "Esto es lo que hace que una demo se sienta viva en la sala. El cliente mueve el mouse y la página responde: no está viendo una imagen, está tocando un producto.", "«¿Y en celular, donde no hay cursor?»", "Se degrada con elegancia: en táctil el efecto no se monta y en su lugar entra la microinteracción de toque. Ningún usuario ve algo roto.", ofArray([new Tecnica("Botones magnéticos", "El botón se desplaza hacia el cursor cuando entra en su radio de atracción y regresa con inercia al salir.", Ico_magnet), new Tecnica("Seguimiento de mirada", "Elementos ilustrados giran sutilmente hacia el puntero. Da sensación de atención, no de truco.", Ico_eye), new Tecnica("Suavizado por inercia", "Nada salta: la posición se interpola cuadro a cuadro para que el movimiento se sienta físico.", Ico_feather)]), new Demo(3, []), "brand"), new Categoria("media", "05", "Media enriquecida", "Animaciones complejas", "Innovación visual de alto nivel, sin castigar el peso de la página.", "Este es el cierre de la demo. Es lo que el cliente no puede conseguir con una plantilla, y es exactamente el tipo de detalle que justifica un presupuesto de agencia.", "«Eso debe pesar muchísimo.»", "Al revés. Lottie es JSON vectorial: pesa una fracción de un GIF equivalente, escala a cualquier tamaño sin pixelarse y se puede recolorear desde código.", ofArray([new Tecnica("Lottie", "Animación vectorial en JSON, exportada desde After Effects. Nítida en cualquier pantalla y controlable por código.", Ico_feather), new Tecnica("Canvas / WebGL", "Campo de partículas con proyección en perspectiva y repulsión al cursor, dibujado cuadro a cuadro.", Ico_cube), new Tecnica("Presupuesto de rendimiento", "Todo se pausa fuera de pantalla y respeta «reducir movimiento». La animación nunca compite con el contenido.", Ico_target)]), new Demo(4, []), "violet")]);

export const heroKicker = "Plan profesional de integración de animación";

export const heroTitulo = "El movimiento no decora.\nVende.";

export const heroBajada = "Cinco capas de interacción que convierten una página estática en una demostración. Cada sección de este documento es, a la vez, la explicación y el ejemplo funcionando.";

export const heroNotaVendedor = "Todo lo que ve en esta página está vivo. Invite al cliente a mover el mouse, hacer clic y bajar: la presentación se demuestra sola.";

export class Metrica extends Record {
    constructor(Valor, Etiqueta) {
        super();
        this.Valor = Valor;
        this.Etiqueta = Etiqueta;
    }
}

export function Metrica_$reflection() {
    return record_type("Data.Metrica", [], Metrica, () => [["Valor", string_type], ["Etiqueta", string_type]]);
}

export const metricas = ofArray([new Metrica("5", "capas de interacción"), new Metrica("0", "dependencias de terceros en el núcleo"), new Metrica("60", "cuadros por segundo objetivo"), new Metrica("A11y", "respeta «reducir movimiento»")]);

