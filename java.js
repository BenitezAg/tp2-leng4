// Variable global para almacenar el Blob
let miBlob;

// Función 1: Crear el Blob
function crearBlob() {
  // Creamos un texto de prueba
  const contenido = "Hola, este es un archivo de texto creado con un Blob para el TP4. Aquí probaremos la función slice.";
  
  // Instanciamos el Blob indicando que es texto plano
  miBlob = new Blob([contenido], { type: 'text/plain' });
  
  document.getElementById("resultado").innerText = "Blob creado correctamente en memoria (Tamaño: " + miBlob.size + " bytes).";
}

// Función 2: Descargar el Blob
function descargarBlob() {
  if (!miBlob) {
    alert("Primero debes hacer clic en 'Crear Blob de texto'.");
    return;
  }
  
  // Creamos una URL temporal para el Blob
  const url = URL.createObjectURL(miBlob);
  
  // Creamos un elemento <a> invisible para forzar la descarga
  const a = document.createElement('a');
  a.href = url;
  a.download = 'archivo_tp4.txt'; // Nombre del archivo a descargar
  
  // Simulamos el clic y luego limpiamos
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Liberamos la memoria de la URL
  URL.revokeObjectURL(url);
  document.getElementById("resultado").innerText = "Archivo descargado con éxito.";
}

// Función 3: Utilizar el concepto Slice
function usarSlice() {
  if (!miBlob) {
    alert("Primero debes hacer clic en 'Crear Blob de texto'.");
    return;
  }
  
  // Cortamos el Blob (por ejemplo, desde el byte 0 hasta el 45)
  const blobCortado = miBlob.slice(0, 45);
  
  // Leemos el nuevo fragmento para mostrarlo en pantalla usando FileReader
  const lector = new FileReader();
  lector.onload = function(e) {
    document.getElementById("resultado").innerText = "Resultado de Slice: '" + e.target.result + "'";
  };
  lector.readAsText(blobCortado);
}