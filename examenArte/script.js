
/*objeto con las claves y valores de respuestas correctas*/ 

const respuestasCorrectas = {
    'facil-p1': 'dali',
    'facil-p2': ['fragmentacion', 'perspectivas', 'geometria'],
    'facil-p3': 'caminante',
    'facil-p4': 'nuevaYork',
    'facil-p5': ['monet', 'renoir', 'degas'],
    'facil-p6': ['realismo1', 'realismo2', 'realismo3'],
    
    'medio-p1': ['delacroix1', 'delacroix3'],
    'medio-p2': ['accion', 'contemplativa'],
    'medio-p3': 'avignon',
    'medio-p4': 'medusa',
    'medio-p5': 'velocidad',
    'medio-p6': 'guerra',
    
    'dificil-p1': ['mondrian', 'doesburg'],
    'dificil-p2': 'ingres',
    'dificil-p3': 'breton',
    'dificil-p4': 'espiritual',
    'dificil-p5': 'kirchner',
    'dificil-p6': 'romanticismo'
};

/*objeto claves y valores de  explicacion si fallas */
const explicaciones = {
    'facil-p1': 'Salvador Dalí pintó "La persistencia de la memoria" en 1931, una de las obras más importantes del Surrealismo.',
    'facil-p2': 'El Cubismo se caracteriza por la fragmentación de formas, múltiples perspectivas y planos geométricos.',
    'facil-p3': '"El caminante frente al mar de nubes" (1818) es una obra icónica del Romanticismo pintada por Caspar David Friedrich.',
    'facil-p4': 'El Expresionismo Abstracto se desarrolló en Nueva York tras la Segunda Guerra Mundial.',
    'facil-p5': 'Claude Monet, Pierre-Auguste Renoir y Edgar Degas fueron artistas del Impresionismo.',
    'facil-p6': 'Todos son cuadros de los realistas Courbet y Millet, menos el Carro de Heno, de John Constable.',
    
    'medio-p1': 'Los cuadros de Eugène Delacroix son el primero (Libertad guiando al Pueblo) y el tercero (La muerte de Sardanápalo).',
    'medio-p2': 'Las dos principales vertientes fueron la Pintura de Acción (Pollock) y la Contemplativa (Rothko).',
    'medio-p3': '"Las señoritas de Avignon" (1907) de Picasso marcó el inicio del Cubismo.',
    'medio-p4': '"Es La balsa de la Medusa", del romántico Théodore Géricault.',
    'medio-p5': 'El Futurismo se caracterizó por la exaltación de la velocidad, el dinamismo y la tecnología moderna.',
    'medio-p6': 'El Dadaísmo surgió como rechazo a la Primera Guerra Mundial y los valores tradicionales que la causaron.',
    
    'dificil-p1': 'Piet Mondrian y Theo van Doesburg fundaron el movimiento De Stijl en 1917.',
    'dificil-p2': 'La ilustración muestra el famoso duelo artístico entre Ingres (neoclásico) y Delacroix (romántico).',
    'dificil-p3': 'André Breton escribió el primer "Manifiesto del Surrealismo" en 1924.',
    'dificil-p4': 'El Suprematismo busca lo espiritual y la abstracción pura, mientras el Constructivismo busca lo funcional y social.',
    'dificil-p5': 'Ernst Ludwig Kirchner fue uno de los fundadores del grupo expresionista alemán "Die Brücke" (El Puente).',
    'dificil-p6': '"Tormenta de nieve" de J.M.W. Turner es una obra maestra del Romanticismo inglés.'
};

/*declaración variables*/
let nivelActual = '';
let estadoPreguntas = {};
let evaluacionFinalizada = false;

/* estado preguntas */
function inicializarEstado(nivel) {
    estadoPreguntas = {};/*vacia objeto */
    for (let i = 1; i <= 6; i++) {
        const preguntaId = `${nivel}-p${i}`;/* crea los nombres facil-p1... */
        estadoPreguntas[preguntaId] = {
            respondida: false,
            correcta: null,
            puntos: 0
        };
    }
}

function resetearTestCompleto(nivel) {
    // resetea el nivel
    for (let i = 1; i <= 6; i++) {
        const preguntaId = `${nivel}-p${i}`;
        
        // resetear formulario
        /*
        document.getElementById busca el id en el html
        `form-${preguntaId}`inserta los valores var
        */
        const form = document.getElementById(`form-${preguntaId}`);
        if (form) {
            const inputs = form.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            //form.querySelectorAll todos los elementos q coincidan
            //for each recorre array
            inputs.forEach(input => {
                input.checked = false;
            });
        }
        
        // limpiar resultado
        const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);
        if (resultadoDiv) {
            //textContent cambia el texto
            resultadoDiv.textContent = '';
            resultadoDiv.className = 'resultado';
        }
        
        // rehabilitar botón comprobar
        const btnComprobar = document.querySelector(`#form-${preguntaId}`).parentElement.querySelector('.check-btn');
        if (btnComprobar) {
            btnComprobar.disabled = false;
            btnComprobar.textContent = '✓ Comprobar';
        }

        // rehabilitar botón reset
        const btnReset = document.querySelector(`#form-${preguntaId}`).parentElement.querySelector('.reset-btn');
        if (btnReset) {
            btnReset.disabled = false;
        }

        // rehabilitar opciones
        const formActual = document.getElementById(`form-${preguntaId}`);
        if (formActual) {
            const inputs = formActual.querySelectorAll('input[type="radio"], input[type="checkbox"]');
            inputs.forEach(input => {
                input.disabled = false;
            });
        }
        
        // quitar clase respondida del bloque
        const questionBlock = document.querySelector(`#form-${preguntaId}`).closest('.question-block');
        if (questionBlock) {
            questionBlock.classList.remove('respondida');
        }
    }
}

//iniciar test
function startTest(nivel) {
    nivelActual = nivel;
    evaluacionFinalizada = false;
    inicializarEstado(nivel);
    resetearTestCompleto(nivel);
    
    document.getElementById('levelSelection').style.display = 'none';
    
    //concatena y crea x ej testFacil
    const testId = 'test' + nivel.charAt(0).toUpperCase() + nivel.slice(1);
    document.getElementById(testId).style.display = 'block';
    
    document.getElementById('sidebarNota').style.display = 'block';
    document.getElementById('sidebarVolver').style.display = 'block';
    
    // resetea nota en el sidebar
    document.getElementById('notaActual').textContent = '--';
    
    // resetea body
    document.body.classList.remove('aprobado', 'suspenso');
    
    // oculta el resultado
    const nivelCapitalizado = nivel.charAt(0).toUpperCase() + nivel.slice(1);
    document.getElementById(`resultadoFinal${nivelCapitalizado}`).style.display = 'none';
    
    //hace que la pagina inicie arriba siempre
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function volverAlMenu() {

    //mensaje para confirmar salir del test, devuelve T/F
    const confirmar = confirm('¿Estás seguro de que quieres volver al menú? Se perderán tus respuestas.');
    //al ser T
    if (confirmar) {
        // ocultar todos los tests
        document.getElementById('testFacil').style.display = 'none';
        document.getElementById('testMedio').style.display = 'none';
        document.getElementById('testDificil').style.display = 'none';
        
        // ocultar sidebars
        document.getElementById('sidebarNota').style.display = 'none';
        document.getElementById('sidebarVolver').style.display = 'none';
        
        // mostrar selección de nivel
        document.getElementById('levelSelection').style.display = 'block';
        
        // resetear body
        document.body.classList.remove('aprobado', 'suspenso');
        
        // ocultar resultados 
        document.getElementById('resultadoFinalFacil').style.display = 'none';
        document.getElementById('resultadoFinalMedio').style.display = 'none';
        document.getElementById('resultadoFinalDificil').style.display = 'none';
        
        // resetear nota
        document.getElementById('notaActual').textContent = '--';
        
        // resetear estado
        estadoPreguntas = {};
        nivelActual = '';
        evaluacionFinalizada = false;
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

//resetea pregunta concreta
function resetearPregunta(preguntaId) {
    //si ambas son T, pregunta existe y ya esta respondida, sale de la funcion sin hacer nada
    if (estadoPreguntas[preguntaId] && estadoPreguntas[preguntaId].respondida) {
        return;
    }

    const form = document.getElementById(`form-${preguntaId}`);
    const inputs = form.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    
    inputs.forEach(input => {
        input.checked = false;
    });//desmarca todos
    
    const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);
    resultadoDiv.textContent = '';
    resultadoDiv.className = 'resultado';
}

//comprueba respuestas
function comprobarRespuesta(preguntaId) {
    if (evaluacionFinalizada) {
        alert('Ya has calculado la nota final. No puedes responder más preguntas.');
        return;
    }

    if (estadoPreguntas[preguntaId].respondida) {
        alert('Ya has respondido esta pregunta. No puedes volver a responderla.');
        return;
    }
    
    const form = document.getElementById(`form-${preguntaId}`);
    const respuestaCorrecta = respuestasCorrectas[preguntaId];
    let esCorrecta = false;
    
    if (Array.isArray(respuestaCorrecta)) {
        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        const respuestasUsuario = Array.from(checkboxes).map(cb => cb.value).sort();
        const respuestasCorrectasOrdenadas = [...respuestaCorrecta].sort();
        
        if (respuestasUsuario.length === 0) {
            alert('Debes seleccionar al menos una opción.');
            return;
        }
        //pasa de array a texto para comparar
        esCorrecta = JSON.stringify(respuestasUsuario) === JSON.stringify(respuestasCorrectasOrdenadas);
    } else {
        const seleccionado = form.querySelector('input[type="radio"]:checked');
        
        if (!seleccionado) {
            alert(' Debes seleccionar una opción.');
            return;
        }
        
        const respuestaUsuario = seleccionado.value;
        esCorrecta = respuestaUsuario === respuestaCorrecta;
    }
    
    estadoPreguntas[preguntaId].respondida = true;
    estadoPreguntas[preguntaId].correcta = esCorrecta;
    
    if (esCorrecta) {
        estadoPreguntas[preguntaId].puntos = 1;
    } else {
        estadoPreguntas[preguntaId].puntos = -0.25;
    }
    
    mostrarResultado(preguntaId, esCorrecta);
    
    const btnComprobar = form.parentElement.querySelector('.check-btn');
    btnComprobar.disabled = true;
    btnComprobar.textContent = '✓ Respondida';

         //parentElement accede al elemento padre
    const btnReset = form.parentElement.querySelector('.reset-btn');
    if (btnReset) {
        btnReset.disabled = true;
    }

    const inputs = form.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    const questionBlock = form.closest('.question-block');
    //busca el ancestro más cercano que coincida

    questionBlock.classList.add('respondida');//para CSS
}

//resultado por pregunta
function mostrarResultado(preguntaId, esCorrecta) {
    const resultadoDiv = document.getElementById(`resultado-${preguntaId}`);
    
    if (esCorrecta) {
        resultadoDiv.className = 'resultado correcto';
        resultadoDiv.innerHTML = ' ¡Correcto! (+1 punto)';
    } else {
        resultadoDiv.className = 'resultado incorrecto';
        resultadoDiv.innerHTML = `
            Incorrecto (-0.25 puntos)
            <span class="respuesta-correcta">${explicaciones[preguntaId]}</span>
        `;//innerHTML para usar etiquetas html, x ej textContent solo usa texto plano
    }
}


function calcularNotaFinal() {
    const preguntasRespondidas = Object.values(estadoPreguntas).filter(p => p.respondida).length;//para las q sea respondida true
    const totalPreguntas = Object.keys(estadoPreguntas).length;
    
    if (preguntasRespondidas < totalPreguntas) {
        const confirmar = confirm(
            `Has respondido ${preguntasRespondidas} de ${totalPreguntas} preguntas.\n\n` +
            `¿Quieres ver tu nota ahora o prefieres seguir respondiendo?\n\n` +
            `Pulsa "Aceptar" para ver la nota o "Cancelar" para seguir respondiendo.`
        );
        
        if (!confirmar) {
            return;
        }
    }
    
    let notaTotal = 0;
    Object.values(estadoPreguntas).forEach(pregunta => {
        notaTotal += pregunta.puntos;
    });
    
    notaTotal = Math.max(0, Math.min(6, notaTotal));
    notaTotal = Math.round(notaTotal * 100) / 100;
    
    document.getElementById('notaActual').textContent = notaTotal.toFixed(2);
    //to fixed indica decimales
    evaluacionFinalizada = true;
    
    const body = document.body;
    body.classList.remove('aprobado', 'suspenso');
    
    // resultado final
    const nivelCapitalizado = nivelActual.charAt(0).toUpperCase() + nivelActual.slice(1);
    const resultadoFinalDiv = document.getElementById(`resultadoFinal${nivelCapitalizado}`);
    
    let titulo, mensaje, claseEstado;
    
    if (notaTotal >= 3) {
        body.classList.add('aprobado');
        titulo = '¡APROBADO!';
        mensaje = '¡Enhorabuena por tu excelente conocimiento del arte!';
        claseEstado = 'aprobado';
    } else {
        body.classList.add('suspenso');
        titulo = 'Suspenso';
        mensaje = '¡Ánimo! Puedes volver al menú e intentarlo de nuevo para mejorar tu nota.';
        claseEstado = 'suspenso';
    }
    
    resultadoFinalDiv.innerHTML = `
        <h2>${titulo}</h2>
        <p class="nota-final">Nota Final: ${notaTotal.toFixed(2)} / 6</p>
        <p class="mensaje-texto">${mensaje}</p>
    `;
    resultadoFinalDiv.className = `resultado-final ${claseEstado}`;
    resultadoFinalDiv.style.display = 'block';
    
    // scroll al resultado final
    setTimeout(() => {
        resultadoFinalDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Test de Historia del Arte cargado correctamente');
    console.log('Niveles disponibles: Fácil, Medio, Difícil');
});
