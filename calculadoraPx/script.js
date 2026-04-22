// esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // obtiente los elementos del DOM
    const ppiForm = document.getElementById('ppi-form');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const diagonalInput = document.getElementById('diagonal');
    const densityOutput = document.getElementById('density');
    
    // función para calcular el PPI
    function calculatePPI(event) {
        event.preventDefault();
        
        // obtiene valores de los inputs
        const width = parseFloat(widthInput.value);
        const height = parseFloat(heightInput.value);
        const diagonal = parseFloat(diagonalInput.value);
        
        // validar los inputs
        if (isNaN(width) || isNaN(height) || isNaN(diagonal)) {
            alert('Por favor, complete todos los campos con valores numéricos válidos.');
            return;//debe tneer un valor numerico
        }
        
        if (width <= 0 || height <= 0 || diagonal <= 0) {
            alert('Todos los valores deben ser mayores que cero.');
            return;
        }
        
        // calcular la diagonal con el teorema de Pitágoras
        const diagonalPixels = Math.sqrt(width * width + height * height);
        
        // PPI
        const ppi = diagonalPixels / diagonal;
        
        // mostrar el resultado redondeado
        densityOutput.textContent = ppi.toFixed(2) + ' PPI';
    }
    
    //limpiar el resultado
    function clearResult() {
        densityOutput.textContent = 'Resultado';
    }
    
    // añade eventos al formulario
    ppiForm.addEventListener('submit', calculatePPI);
    ppiForm.addEventListener('reset', clearResult);
    
    // hace que el cursor empiece en el primer campo
    widthInput.focus();
});