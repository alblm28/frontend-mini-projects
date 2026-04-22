// VARIABLES
let vidaEnemigo = 1000;
let vidaJugador = 1000;
let contadorAtaques = 0;

function AtaqueMasivo() {

    //si esta muerto, no ataca
    if (vidaEnemigo <= 0) return;
    if (vidaJugador <= 0) return;
    //DAÑO 
    //aleatorio entre 50 y 200, floor redondea
    let dañoBase = Math.floor(Math.random() * 151) + 50;

    let dañoBaseEnemigo = (Math.random() * 100) + 50;

    //LEER OPCIONES
    let personajeSeleccionado = document.getElementById("personaje").value;
    let armaduraSeleccionada = document.getElementById("armadura").value;

    //para el radio button queryselector, indica q sea un input llamado arma y este marcado
    let armaSeleccionada = document.querySelector("input[name='arma']:checked")?.value;

    //guarda T/F según si está checked o no
    let intentaCritico = document.getElementById("critico").checked;



    // IMGS
    //selectorAll selecciona todo de los selectores,
    //  for each los recorre
    //la función anónima (xq solo la uso una vez) les pone clase oculto si no lo están antes
    //tmb puedo hacer arrow function (.forEach(img =>{...}))
    document.querySelectorAll("#imagenes-personajes img, #imagenes-armaduras img").forEach(function (img) {
        img.classList.remove("visible");
        img.classList.add("oculto");
    });

    // quita clase para que solo salga teniendo foto
    document.getElementById("imagenes-personajes").classList.remove("con-imagen");
    document.getElementById("imagenes-armaduras").classList.remove("con-imagen");

    // hace visible el personaje seleccionado y pone el fondo
    let imgPersonaje = document.getElementById(personajeSeleccionado);
    imgPersonaje.classList.remove("oculto");
    imgPersonaje.classList.add("visible");

    document.getElementById("imagenes-personajes").classList.add("con-imagen");

    // muestra armadura , concatena el nombre
    let imgArmadura = document.getElementById("armadura-" + armaduraSeleccionada);
    imgArmadura.classList.remove("oculto");
    imgArmadura.classList.add("visible");

    document.getElementById("imagenes-armaduras").classList.add("con-imagen");



    // SONIDO ARMA
    let rutaSonido = "";//ruta empieza vacia y se cambia con el if
    if (armaSeleccionada == "espada") {
        rutaSonido = "recursos/espada.mp3";
    } else if (armaSeleccionada == "arco") {
        rutaSonido = "recursos/flecha.mp3";
    } else if (armaSeleccionada == "cetro") {
        rutaSonido = "recursos/cetro.mp3";
    }
    if (rutaSonido) {
        let sonido = new Audio(rutaSonido);//comprueba q no está vacia
        sonido.play();//reproduce
    }


    // CÁLCULOS
    let multiplicadorArma = 1;
    let multiplicadorContraataque = 1;
    let textoArma = "";

    
    if (armaSeleccionada === "espada") {//mejor === que ==
        // espada aumenta 50% siempre
        multiplicadorArma = 1.5;
        multiplicadorContraataque = 1.75;
        textoArma = "La Espada aumenta en un 50% el daño base contra todas las armaduras";

    } else if (armaSeleccionada === "arco") {
        if (armaduraSeleccionada === "ligera") {
            multiplicadorArma = 3;// (xq le suma 2 unidades a la q ya estaba)
            multiplicadorContraataque = 0.50;
            textoArma = "El arco es SUPER EFICAZ contra la armadura ligera, aumenta en un 200% el daño";

        } else if (armaduraSeleccionada === "media") {
            multiplicadorArma = 1.5;
            multiplicadorContraataque = 1.5;
            textoArma = "El arco aumenta en un 50% el daño contra la armadura media";
        } else if (armaduraSeleccionada === "pesada") {
            multiplicadorArma = 0.5;
            multiplicadorContraataque = 2;
            textoArma = "El arco no es muy útil contra la armadura pesada, disminuye en un 50% el daño";
        }

    } else if (armaSeleccionada === "cetro") {//en el word pone hacha
        if (armaduraSeleccionada === "ligera") {
            multiplicadorArma = 0.5;
            multiplicadorContraataque = 2;
            textoArma = "El cetro no es muy útil contra la armadura ligera, disminuye en un 50% el daño";
        } else if (armaduraSeleccionada === "media") {
            multiplicadorArma = 1.5;
            multiplicadorContraataque = 1.5;
            textoArma = "El cetro aumenta en un 50% el daño contra la armadura media";
        } else if (armaduraSeleccionada === "pesada") {
            multiplicadorArma = 3;
            multiplicadorContraataque = 0.5;
            textoArma = "El cetro es SUPER EFICAZ contra la armadura pesada, aumenta en un 200% el daño";
        }

    } else {
        // mensaje si no hay arma elegida
        document.getElementById("resultado").innerHTML = "¡Debes elegir un arma antes de atacar!";
        document.getElementById("resultado").className = "";
        return;
    }

    // DAÑO TOTAL
    let dañoConArma = Math.round(dañoBase * multiplicadorArma);//el que hace AL enemigo


    // GOLPE CRÍTICO
    let textoCritico = "";
    let dañoCritico = 0;

    if (intentaCritico) {
        if (Math.random() < 0.5) {//mismas posibilidades mayor q menor
            dañoCritico = 100;
            textoCritico = "Crítico exitoso (+100)";
        } else {
            dañoCritico = -100;
            textoCritico = "Crítico fallido (-100), Gran oportunidad para el enemigo!";
            dañoBaseEnemigo += 100;

        }
    }


    // DAÑO FINAL 
    let dañoFinal = dañoConArma + dañoCritico;
    if (dañoFinal < 0) dañoFinal = 0;
    let dañoTotalEnemigo = Math.round(dañoBaseEnemigo * multiplicadorContraataque)// el que hace AL jugador
    if (dañoTotalEnemigo < 0) dañoTotalEnemigo = 0;

    // VIDA
    contadorAtaques++;
    vidaEnemigo -= dañoFinal;
    if (vidaEnemigo < 0) vidaEnemigo = 0;
    vidaJugador -= dañoTotalEnemigo;
    if (vidaJugador < 0) vidaJugador = 0;
    // html empieza en 1000, actualiza el valor
    document.getElementById("vida-actual").textContent = vidaEnemigo;
    document.getElementById("vida-actual-jugador").textContent = vidaJugador;
    //en css el width de la barra es un porcentaje, se calcula y se actualiza
    let porcentajeVida = (vidaEnemigo / 1000) * 100;
    let barraVida = document.getElementById("barra-vida");
    barraVida.style.width = porcentajeVida + "%";

    let porcentajeVidaJugador = (vidaJugador / 1000) * 100;
    let barraVidaJugador = document.getElementById("barra-vida-jugador");
    barraVidaJugador.style.width = porcentajeVidaJugador + "%";

    //cambia de color segun la vida restante
    if (porcentajeVida > 50) {
        barraVida.style.background = "linear-gradient(90deg, #2d5a1b, #7ab648)";
        document.getElementById("vida-actual").style.color = "#7ab648";
    } else if (porcentajeVida > 25) {
        barraVida.style.background = "linear-gradient(90deg, #e67e22, #f39c12)";
        document.getElementById("vida-actual").style.color = "#e67e22";
    } else {
        barraVida.style.background = "linear-gradient(90deg, #c0392b, #e74c3c)";
        document.getElementById("vida-actual").style.color = "#c0392b";
    }

    if (porcentajeVidaJugador > 50) {
        barraVidaJugador.style.background = "linear-gradient(90deg, #2d5a1b, #7ab648)";
        document.getElementById("vida-actual-jugador").style.color = "#7ab648";
    } else if (porcentajeVidaJugador > 25) {
        barraVidaJugador.style.background = "linear-gradient(90deg, #e67e22, #f39c12)";
        document.getElementById("vida-actual-jugador").style.color = "#e67e22";
    } else {
        barraVidaJugador.style.background = "linear-gradient(90deg, #c0392b, #e74c3c)";
        document.getElementById("vida-actual-jugador").style.color = "#c0392b";
    }

    // MENSAJES
    let nombrePersonaje = {//objeto para mostrar los nombres mejor escritos
        "shrek": "Shrek",
        "fiona": "Fiona",
        "burro": "El Burro",
        "gato-botas": "El Gato con Botas"
    }[personajeSeleccionado];

    let nombreArmadura = {
        "pesada": "Pesada",
        "media": "Media",
        "ligera": "Ligera"
    }[armaduraSeleccionada];

    let desglose = nombrePersonaje + " ataca con " + armaSeleccionada + " a la armadura " + nombreArmadura + ".<br>";
    desglose += "Daño base: " + dañoBase + "<br>";
    desglose += textoArma + "<br>";

    if (intentaCritico) {
        desglose += textoCritico + "<br>";
    }

    desglose += "<strong>DAÑO FINAL: " + dañoFinal + "</strong><br>";

    //MENSAJE J
    let elementoResultado = document.getElementById("resultado");
    //limpia las clases 
    elementoResultado.classList.remove("daño-alto", "daño-medio", "daño-bajo");

    if (dañoFinal > 300) {
        desglose += "¡Golpe devastador! El enemigo esta confuso.";
        elementoResultado.classList.add("daño-alto");
    } else if (dañoFinal >= 200) {
        desglose += "¡Buen golpe! El enemigo no puede contraatacar con fuerza.";
        elementoResultado.classList.add("daño-medio");
    } else {
        desglose += "¡El golpe no ha surtido mucho efecto! Preparate para el contraataque.";
        elementoResultado.classList.add("daño-bajo");
    }

    //VICTORIA
    if (vidaEnemigo <= 0) {
        let sonidoVictoria = new Audio("recursos/all_star.mp3");
        sonidoVictoria.play();

        desglose = "<br><span class='texto-victoria'>¡VICTORIA!</span><br>Has derrotado al enemigo en " + contadorAtaques + " ataques.";
        elementoResultado.classList.remove("daño-alto", "daño-medio", "daño-bajo");
        elementoResultado.classList.add("victoria");
        // limpia estilos x si acaso
        elementoResultado.style.color = "";
        elementoResultado.style.borderColor = "";
    } else if (vidaJugador <= 0) {
  let sonidoDerrota = new Audio("recursos/derrota.mp3");
        sonidoDerrota.play();

        desglose = "<br><span class='texto-derrota'>DERROTA...</span><br>El enemigo te ha vencido en " + contadorAtaques + " ataques.";
        elementoResultado.classList.remove("daño-alto", "daño-medio", "daño-bajo");
        elementoResultado.classList.add("derrota");
    }

    //CUADRO INFO
    elementoResultado.innerHTML = desglose;//lo muestra
    elementoResultado.style.animation = "none";//para mostrar la animacion cada ataque
    elementoResultado.offsetHeight;
    elementoResultado.style.animation = "";
}