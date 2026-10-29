let map;
let rutaRoja;
let contador = 0;

// Inicialización del mapa centrado en Salta
map = L.map('map').setView([-24.7821, -65.4233], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

rutaRoja = L.polyline([], { color: 'red' }).addTo(map);

// 1. Buscar ingresando texto en "Nombre Ubicación"
async function buscarPorNombre() {
    let nombre = document.getElementById("nombre").value.trim();
    if (nombre === "") {
        alert("Por favor, ingrese un lugar en 'Nombre Ubicación'.");
        return;
    }

    try {
        let respuesta = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(nombre)}`);
        let datos = await respuesta.json();
        
        if (datos && datos.length > 0) {
            let lat = parseFloat(datos[0].lat);
            let lng = parseFloat(datos[0].lon);
            
            // Autocompletar los campos de coordenadas
            document.getElementById("lat").value = lat;
            document.getElementById("lng").value = lng;
            
            marcarEnMapa(lat, lng, nombre);
        } else {
            alert("No se encontró la ubicación. Intente agregar ciudad o provincia.");
        }
    } catch (error) {
        alert("Error de red al intentar buscar la ubicación.");
    }
}

// 2. Obtener ubicación por GPS del navegador
function obtenerUbicacionActual() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(posicion) {
                let lat = posicion.coords.latitude;
                let lng = posicion.coords.longitude;
                
                document.getElementById('lat').value = lat;
                document.getElementById('lng').value = lng;
                document.getElementById('nombre').value = "Mi ubicación actual";
                
                marcarEnMapa(lat, lng, "Mi ubicación actual");
            },
            function(error) {
                alert("Error al obtener ubicación: " + error.message);
            }
        );
    } else {
        alert("Geolocalización no soportada en este navegador.");
    }
}

// 3. Abrir ubicación escribiendo Latitud y Longitud manualmente
function abrirCoordenadas() {
    let latTexto = document.getElementById("lat").value.replace(",", ".").trim();
    let lngTexto = document.getElementById("lng").value.replace(",", ".").trim();
    
    let lat = parseFloat(latTexto);
    let lng = parseFloat(lngTexto);

    if (!isNaN(lat) && !isNaN(lng)) {
        let nombre = document.getElementById("nombre").value.trim();
        let etiqueta = nombre !== "" ? nombre : "Coordenada Manual";
        marcarEnMapa(lat, lng, etiqueta);
    } else {
        alert("Por favor, ingrese valores numéricos válidos en Latitud y Longitud.");
    }
}

// Función central para dibujar en el mapa y guardar historial
function marcarEnMapa(lat, lng, etiqueta) {
    map.setView([lat, lng], 15);
    
    L.marker([lat, lng]).addTo(map).bindPopup(etiqueta).openPopup();
    rutaRoja.addLatLng([lat, lng]);
    
    contador++;
    let lista = document.getElementById("lista-historial");
    lista.innerHTML += `<li><strong>${contador}-</strong> ${etiqueta} <br> <small>Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</small></li>`;
}
