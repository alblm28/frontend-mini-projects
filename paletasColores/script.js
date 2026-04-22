// variables 
let tipoSeleccionado = 'aleatorio';
let coloresBloqueados = [];

// elementos del dom
const paletaContenedor = document.getElementById('paleta-contenedor');
const btnGenerar = document.getElementById('generar-paleta');
const cantidadInput = document.getElementById('cantidad-colores');
const botonesTipo = document.querySelectorAll('.btn-tipo');

//  para generar un color aleatorio en hexadecimal
function generarColorAleatorio() {
    const letras = '0123456789ABCDEF';
    let color = '#';
    
    // bucle para generar 6 caracteres
    for (let i = 0; i < 6; i++) {
        color += letras[Math.floor(Math.random() * 16)];
    }
    
    return color;
}

// funcion para convertir hex a hsl: hue, saturation, lightness para q sea mas facil calcular 
function hexAHsl(hex) {
    // eliminar el simbolo #
    hex = hex.replace('#', '');
    
    // convertir a rgb
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        if (max === r) {
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        } else if (max === g) {
            h = ((b - r) / d + 2) / 6;
        } else {
            h = ((r - g) / d + 4) / 6;
        }
    }
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

//  volver de hsl a hex
function hslAHex(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    
    if (h >= 0 && h < 60) {
        r = c; g = x; b = 0;
    } else if (h >= 60 && h < 120) {
        r = x; g = c; b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0; g = c; b = x;
    } else if (h >= 180 && h < 240) {
        r = 0; g = x; b = c;
    } else if (h >= 240 && h < 300) {
        r = x; g = 0; b = c;
    } else if (h >= 300 && h < 360) {
        r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

// funcion para generar colores complementarios
function generarComplementarios(cantidad) {
    const colores = [];
    const colorBase = generarColorAleatorio();
    const hsl = hexAHsl(colorBase);
    
    colores.push(colorBase);
    
    // color complementario, 180 grados opuest
    const hComplementario = (hsl.h + 180) % 360;
    colores.push(hslAHex(hComplementario, hsl.s, hsl.l));
    
    // si se necesitan mas colores, generar variaciones
    for (let i = colores.length; i < cantidad; i++) {
        const baseHue = Math.random() > 0.5 ? hsl.h : hComplementario;
        const hVariacion = baseHue + (Math.random() * 60 - 30);
        const sVariacion = Math.max(40, Math.min(100, hsl.s + (Math.random() * 40 - 20)));
        const lVariacion = 30 + Math.random() * 50;
        colores.push(hslAHex(hVariacion % 360, sVariacion, lVariacion));
    }
    
    return colores;
}

// funcion para generar colores analogos
function generarAnalogos(cantidad) {
    const colores = [];
    const colorBase = generarColorAleatorio();
    const hsl = hexAHsl(colorBase);
    
    colores.push(colorBase);
    
    // generar colores adyacentes ,30 grados de diferencia
    for (let i = 1; i < cantidad; i++) {
        const hNuevo = (hsl.h + (i * 25) + (Math.random() * 20 - 10)) % 360;
        const sVariacion = Math.max(40, Math.min(100, hsl.s + (Math.random() * 30 - 15)));
        const lVariacion = Math.max(20, Math.min(80, hsl.l + (Math.random() * 40 - 20)));
        colores.push(hslAHex(hNuevo, sVariacion, lVariacion));
    }
    
    return colores;
}

// funcion para generar colores triadicos
function generarTriadicos(cantidad) {
    const colores = [];
    const colorBase = generarColorAleatorio();
    const hsl = hexAHsl(colorBase);
    
    colores.push(colorBase);
    
    // a 120 grados
    colores.push(hslAHex((hsl.h + 120) % 360, hsl.s, hsl.l));
    if (cantidad > 2) {
        colores.push(hslAHex((hsl.h + 240) % 360, hsl.s, hsl.l));
    }
    
    // si se necesitan mas, generar variaciones
    for (let i = colores.length; i < cantidad; i++) {
        const baseIndex = i % 3;
        const hslBase = hexAHsl(colores[baseIndex]);
        const hVariacion = (hslBase.h + (Math.random() * 30 - 15)) % 360;
        const sVariacion = Math.max(40, Math.min(100, hslBase.s + (Math.random() * 30 - 15)));
        const lVariacion = 30 + Math.random() * 50;
        colores.push(hslAHex(hVariacion, sVariacion, lVariacion));
    }
    
    return colores;
}

// funcion para generar colores tetradicos
function generarTetradicos(cantidad) {
    const colores = [];
    const colorBase = generarColorAleatorio();
    const hsl = hexAHsl(colorBase);
    
    // dos pares complementarios
    colores.push(colorBase);
    if (cantidad > 1) colores.push(hslAHex((hsl.h + 90) % 360, hsl.s, hsl.l));
    if (cantidad > 2) colores.push(hslAHex((hsl.h + 180) % 360, hsl.s, hsl.l));
    if (cantidad > 3) colores.push(hslAHex((hsl.h + 270) % 360, hsl.s, hsl.l));
    
    // si se necesitan mas, generar variaciones
    for (let i = colores.length; i < cantidad; i++) {
        const baseIndex = i % 4;
        const hslBase = hexAHsl(colores[baseIndex]);
        const hVariacion = (hslBase.h + (Math.random() * 40 - 20)) % 360;
        const sVariacion = Math.max(40, Math.min(100, hslBase.s + (Math.random() * 30 - 15)));
        const lVariacion = 30 + Math.random() * 50;
        colores.push(hslAHex(hVariacion, sVariacion, lVariacion));
    }
    
    return colores;
}

// funcion para generar colores monocromaticos
function generarMonocromaticos(cantidad) {
    const colores = [];
    const colorBase = generarColorAleatorio();
    const hsl = hexAHsl(colorBase);
    
    // generar variaciones de luminosidad
    const lInicial = 15 + Math.random() * 10;
    const lFinal = 70 + Math.random() * 15;
    const paso = (lFinal - lInicial) / (cantidad - 1);
    
    for (let i = 0; i < cantidad; i++) {
        const lNuevo = lInicial + (i * paso);
        const sVariacion = Math.max(40, Math.min(100, hsl.s + (Math.random() * 20 - 10)));
        colores.push(hslAHex(hsl.h, sVariacion, lNuevo));
    }
    
    return colores;
}

//generar paleta segun el tipo
function generarPaleta() {
    const cantidad = parseInt(cantidadInput.value);
    let colores = [];
    
    // estructura if/else para seleccionar el tipo de paleta
    if (tipoSeleccionado === 'complementario') {
        colores = generarComplementarios(cantidad);
    } else if (tipoSeleccionado === 'analogo') {
        colores = generarAnalogos(cantidad);
    } else if (tipoSeleccionado === 'triadico') {
        colores = generarTriadicos(cantidad);
    } else if (tipoSeleccionado === 'tetradico') {
        colores = generarTetradicos(cantidad);
    } else if (tipoSeleccionado === 'monocromatico') {
        colores = generarMonocromaticos(cantidad);
    } else {
        // aleatorio por defecto
        for (let i = 0; i < cantidad; i++) {
            colores.push(generarColorAleatorio());
        }
    }
    
    mostrarPaleta(colores);
}

// funcion para mostrar la paleta en el html
function mostrarPaleta(colores) {
    paletaContenedor.innerHTML = '';
    
    // bucle para crear cada tarjeta de color
    for (let i = 0; i < colores.length; i++) {
        const color = colores[i];
        const esBloqueado = coloresBloqueados.includes(i);
        
        const card = document.createElement('article');
        card.className = 'color-card';
        card.style.backgroundColor = color;
        card.dataset.index = i;
        
        const info = document.createElement('div');
        info.className = 'color-info';
        
        const codigo = document.createElement('p');
        codigo.className = 'color-code';
        codigo.textContent = color;
        
        const status = document.createElement('p');
        status.className = 'color-status';
        
        const btnBloquear = document.createElement('button');
        btnBloquear.className = esBloqueado ? 'btn-bloquear bloqueado' : 'btn-bloquear';
        btnBloquear.innerHTML = '<span class="unlocked-icon">🔓</span><span class="locked-icon">🔒</span> ' + 
                                (esBloqueado ? 'Bloqueado' : 'Bloquear');
        
        info.appendChild(codigo);
        info.appendChild(status);
        info.appendChild(btnBloquear);
        card.appendChild(info);
        paletaContenedor.appendChild(card);
        
        // evento click para copiar color
        card.addEventListener('click', function(e) {
            if (e.target !== btnBloquear && !e.target.parentElement.classList.contains('btn-bloquear')) {
                copiarColor(color, status);
            }
        });
        
        // evento click para bloquear
        btnBloquear.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleBloqueo(i, btnBloquear);
        });
    }
}

// funcion para copiar color
function copiarColor(color, elementoStatus) {
    navigator.clipboard.writeText(color).then(function() {
        // modificacion del texto del elemento html
        elementoStatus.textContent = '¡Copiado!';
        elementoStatus.style.color = '#0ea5e9';
        elementoStatus.style.fontWeight = '700';
        
        // restaurar texto despues de 2 segundos
        setTimeout(function() {
            elementoStatus.textContent = '';
        }, 2000);
    });
}

//  bloquear/desbloquear
function toggleBloqueo(index, boton) {
    const posicion = coloresBloqueados.indexOf(index);
    
    if (posicion > -1) {
        coloresBloqueados.splice(posicion, 1);
        boton.classList.remove('bloqueado');
        boton.innerHTML = '<span class="unlocked-icon">🔓</span><span class="locked-icon">🔒</span> Bloquear';
    } else {
        coloresBloqueados.push(index);
        boton.classList.add('bloqueado');
        boton.innerHTML = '<span class="unlocked-icon">🔓</span><span class="locked-icon">🔒</span> Bloqueado';
    }
}

//  regenerar paleta con colores bloqueados
function regenerarPaleta() {
    const cantidad = parseInt(cantidadInput.value);
    const cards = document.querySelectorAll('.color-card');
    const coloresAntiguos = [];
    
    // guardar los colores actuales
    for (let i = 0; i < cards.length; i++) {
        const rgb = cards[i].style.backgroundColor.match(/\d+/g);
        if (rgb) {
            const r = parseInt(rgb[0]);
            const g = parseInt(rgb[1]);
            const b = parseInt(rgb[2]);
            const hex = '#' + [r, g, b].map(x => {
                const h = x.toString(16);
                return h.length === 1 ? '0' + h : h;
            }).join('').toUpperCase();
            coloresAntiguos.push(hex);
        }
    }
    
    let colores = [];
    
    //  seleccionar el tipo de paleta
    if (tipoSeleccionado === 'complementario') {
        colores = generarComplementarios(cantidad);
    } else if (tipoSeleccionado === 'analogo') {
        colores = generarAnalogos(cantidad);
    } else if (tipoSeleccionado === 'triadico') {
        colores = generarTriadicos(cantidad);
    } else if (tipoSeleccionado === 'tetradico') {
        colores = generarTetradicos(cantidad);
    } else if (tipoSeleccionado === 'monocromatico') {
        colores = generarMonocromaticos(cantidad);
    } else {
        for (let i = 0; i < cantidad; i++) {
            colores.push(generarColorAleatorio());
        }
    }
    
    // mantener colores bloqueados en sus posiciones
    for (let i = 0; i < coloresBloqueados.length; i++) {
        const index = coloresBloqueados[i];
        if (index < coloresAntiguos.length && index < colores.length) {
            colores[index] = coloresAntiguos[index];
        }
    }
    
    mostrarPaleta(colores);
}

btnGenerar.addEventListener('click', regenerarPaleta);

// bucle para agregar eventos a los botones de tipo
for (let i = 0; i < botonesTipo.length; i++) {
    botonesTipo[i].addEventListener('click', function() {
        // remover clase active de todos
        for (let j = 0; j < botonesTipo.length; j++) {
            botonesTipo[j].classList.remove('active');
        }
        
        this.classList.add('active');
        tipoSeleccionado = this.dataset.tipo;
        coloresBloqueados = [];
        generarPaleta();
    });
}

// evento para la barra espaciadora
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        regenerarPaleta();
    }
});

// generar paleta inicial al cargar la pagina
generarPaleta();