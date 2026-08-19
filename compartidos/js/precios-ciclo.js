/* ═══════════════════════════════════════════════════════════════════════
   PRECIOS DEL CICLO · la configuración comercial y su aritmética, en UN sitio

   COPIA CONSCIENTE del APP_CONFIG del cotizador (paginas/cotizador/index.html,
   busca «CONFIGURACIÓN FIJA DEL CICLO»). El cotizador es la ÚNICA fuente de
   verdad de los precios: si allá cambian precios, factores, descuentos o
   fechas, hay que actualizar este archivo a mano.

   Este archivo existe porque ya son DOS las páginas que enseñan estos números
   —paginas/precios/ y la lámina del desglose del deck de upgrade-edu— y una
   tercera copia pegada a mano es la forma conocida de que un deck y una
   cotización digan cifras distintas delante del mismo director.
   Regla de compartidos/ en docs/estructura.md.

   Script clásico a propósito, como motion.js: las páginas se abren con doble
   clic desde file:// y un módulo ES no cargaría ahí.

   A diferencia de motion.js, esto NO es opcional: una página que lo pierda se
   queda sin números. Quien lo use debe comprobar `window.PreciosCiclo` y decir
   que faltan datos, nunca enseñar una lámina con huecos.
   ═══════════════════════════════════════════════════════════════════════ */
window.PreciosCiclo = (function () {
  "use strict";

  var CFG = {
    ciclo: "2026–2027",
    firmaTemprana: "19 de marzo de 2027",
    firmaTempranaCorta: "19 mar 2027",
    /* La primera exhibición cae en agosto, cuando se entregan los equipos: el
       cotizador lo fija en APP_CONFIG.cycle.delivery = "15 de agosto de 2027".
       El año va escrito porque el corte de firma temprana (marzo 2027) es
       ANTERIOR a ese agosto, y sin año la lámina se lee al revés. */
    primeraExhibicion: "agosto 2027",

    /* precio de lista por alumno y por año: paquete → fila de equipo → modalidad
       (índices: 0 = sin equipos, 1 = 1:4, 2 = 1:3, 3 = 1:2, 4 = 1:1) */
    pricing: {
      edu:  {n3:[3000,4225,4633.333333,5450,7900], n4:[3000,3975,4300,4950,6900],
             flip:[3000,3300,3400,3600,4200], tab:[3000,3300,3400,3600,4200]},
      plus: {n3:[3500,4725,5133.333333,5950,8400], n4:[3500,4475,4800,5450,7400],
             flip:[3500,3875,4000,4250,5000], tab:[3500,3875,4000,4250,5000]}
    },

    /* cómo escala el precio de lista año con año, según el plazo */
    factores: { three:[0.94,1.02,1.10], four:[0.90,0.97,1.04,1.11], twoFlat:[1,1] },

    /* descuentos por forma de pago, y su calendario */
    pagos: [
      {k:"contado", disc:0.10, agosto:1,  mensualidades:0,  cls:"con", insignia:"−10%"},
      {k:"antes",   disc:0.05, agosto:0.5, mensualidades:10, cls:"ant", insignia:"−5%"},
      {k:"despues", disc:0,    agosto:0.5, mensualidades:10, cls:"des", insignia:"Precio de lista", suave:true}
    ],

    /* referencia de descuento por volumen para redes de colegios (validación
       comercial requerida, igual que en el cotizador) */
    volumen: [["500 – 999",10],["1,000 – 1,499",15],["1,500 – 1,999",20],
              ["2,000 – 2,499",30],["2,500 – 2,999",40],["3,000 – 4,999",45],["5,000 +",55]]
  };

  /* Los rótulos de las tres formas de pago se DERIVAN de las fechas de arriba.
     Escribirlos a mano en cada lámina fue justo como el año de agosto acabó
     faltando en una de ellas. */
  CFG.pagos[0].titulo = "Contado en " + CFG.primeraExhibicion;
  CFG.pagos[1].titulo = "Firma antes del " + CFG.firmaTempranaCorta;
  CFG.pagos[2].titulo = "Firma a partir del " + CFG.firmaTempranaCorta;

  var TERMS = [
    {k:"cb3", row:"n3",   years:3, sched:CFG.factores.three,   nombre:"Chromebook nueva",                plazo:"3 años", corto:"Chromebook · 3 años", ico:"laptop"},
    {k:"cb4", row:"n4",   years:4, sched:CFG.factores.four,    nombre:"Chromebook nueva",                plazo:"4 años", corto:"Chromebook · 4 años", ico:"laptop"},
    {k:"fl2", row:"flip", years:2, sched:CFG.factores.twoFlat, nombre:"Chromebook Flip-Touch seminueva", plazo:"2 años", corto:"Flip-Touch · 2 años", ico:"flip"},
    {k:"tb3", row:"tab",  years:3, sched:CFG.factores.three,   nombre:"Tablet",                          plazo:"3 años", corto:"Tablet · 3 años",     ico:"tablet"}
  ];

  var MODS = [
    {i:0, label:"Sin equipos"},
    {i:1, label:"1:4"}, {i:2, label:"1:3"}, {i:3, label:"1:2"}, {i:4, label:"1:1"}
  ];

  /* ── aritmética: la misma cadena del cotizador ──────────────────────
     precio → factor anual → descuento, en precisión completa, y solo se
     redondea al final (ver calculatePaymentYear en el cotizador). Si un
     importe de una lámina no coincide con el del cotizador para el mismo
     escenario, el error está aquí o en la lámina, nunca en el cotizador. */
  function roundFinancial(n){ return Math.round((Number(n) + Number.EPSILON) * 1e6) / 1e6; }
  function roundCurrency(n){ return Math.round((Number(n) + Number.EPSILON) * 100) / 100; }

  function money(n){
    return roundCurrency(Number(n) || 0).toLocaleString("es-MX",
      {style:"currency", currency:"MXN", minimumFractionDigits:2, maximumFractionDigits:2});
  }
  /* sin centavos cuando el importe es redondo: para matrices y titulares */
  function moneyCompact(n){
    var v = roundCurrency(Number(n) || 0);
    return v.toLocaleString("es-MX", {style:"currency", currency:"MXN",
      minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits:2});
  }

  function calcAnio(lista, factor, pago){
    var net = roundCurrency(roundFinancial(lista * factor * (1 - pago.disc)));
    if(!pago.mensualidades) return {net:net, agosto:net, mensual:0};
    var mensual = roundCurrency(net * (1 - pago.agosto) / pago.mensualidades);
    var agosto  = roundCurrency(net - mensual * pago.mensualidades);
    return {net:net, agosto:agosto, mensual:mensual};
  }

  /* El desglose año por año de un escenario, que es lo que comparten las dos
     páginas: una fila por año del contrato, y en cada una los tres esquemas. */
  function desglose(pkg, termKey, mod){
    var t = TERMS.filter(function(x){ return x.k === termKey; })[0] || TERMS[1];
    var lista = CFG.pricing[pkg][t.row][mod];
    return {
      term: t,
      lista: lista,
      filas: t.sched.map(function(factor, i){
        return { i:i, factor:factor, pagos: CFG.pagos.map(function(p){ return calcAnio(lista, factor, p); }) };
      })
    };
  }

  /* El rótulo del escenario. Sin equipos NO se nombra el equipo: el precio de
     la modalidad 0 es el mismo en las cuatro filas de equipo, y anunciar
     «Flip-Touch seminueva · sin equipos» se contradice en la misma línea. */
  function tramosEscenario(pkg, t, mod){
    return mod === 0
      ? ["Sin equipos", t.years + " años"]
      : [t.nombre, "modalidad " + MODS[mod].label, t.years + " años"];
  }

  function nombrePaquete(pkg){ return pkg === "plus" ? "Upgrade Edu Plus" : "Upgrade Edu"; }

  return {
    CFG: CFG, TERMS: TERMS, MODS: MODS,
    roundFinancial: roundFinancial, roundCurrency: roundCurrency,
    money: money, moneyCompact: moneyCompact,
    calcAnio: calcAnio, desglose: desglose,
    tramosEscenario: tramosEscenario, nombrePaquete: nombrePaquete
  };
})();
