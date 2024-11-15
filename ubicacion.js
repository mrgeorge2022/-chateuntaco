

// INICIALIZAR EL MAPA AL CARGAR LA PÁGINA
window.onload = initMap;

//VARIABLES GLOBALES
        let map;
        let marker;
        let autocomplete;
        let ubicacion = { lat: 10.3737561, lng: -75.4736056 }; // Coordenadas iniciales en Cartagena
        const cartagenaBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(10.200000, -75.600000),
            new google.maps.LatLng(10.550000, -75.300000) //limitador de mapa rectangular acoplando toda cargaena y sus arrededores mas cercanos
        );
        const tarifaPorKm = 1653; // Tarifa en pesos por kilómetro
        const origen = { lat: 10.3866555, lng: -75.4897850 }; // Coordenadas de tu tienda

        let directionsService;
        let directionsRenderer;





//FUNCION PARA INICIAR EL MAPA
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: ubicacion,
                zoom: 12,
                center: ubicacion, // Centrado en la ubicación de Cartagena
                restriction: {
                    latLngBounds: cartagenaBounds,
                    strictBounds: true
                    
                }
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true // Evita mostrar los marcadores predeterminados
            });






// VERIFICAR SI EXISTE UNA POSICIÓN GUARDADA PARA EL MARCADOR
            const marcadorLat = parseFloat(localStorage.getItem('marcadorLat'));
            const marcadorLng = parseFloat(localStorage.getItem('marcadorLng'));

            if (!isNaN(marcadorLat) && !isNaN(marcadorLng)) {
                // Si existe, mover el marcador a la posición guardada
                ubicacion = { lat: marcadorLat, lng: marcadorLng };
                marker = new google.maps.Marker({
                    map: map,
                    draggable: true,
                    position: ubicacion
                });






// REDIBUJAR LA RUTA CON LA POSICIÓN GUARDADA
    calcularRuta(origen, ubicacion);
        } else {
         // Si no hay posición guardada, coloca el marcador en la posición inicial
        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: ubicacion
        });
    }






// VERIFICAR SI EXISTE UNA RUTA GUARDADA EN LOCALSTORAGE
    const destinoLat = parseFloat(localStorage.getItem('destinoLat'));
    const destinoLng = parseFloat(localStorage.getItem('destinoLng'));

    if (!isNaN(destinoLat) && !isNaN(destinoLng)) {
        const destinoGuardado = { lat: destinoLat, lng: destinoLng };
        calcularRuta(origen, destinoGuardado);
    }





// AGREGAR MARCADOR PARA LA TIENDA
            const tiendaUbicacion = { lat: 10.3866555, lng: -75.4897850 }; // Reemplaza con tus coordenadas
            const tiendaMarker = new google.maps.Marker({
                position: tiendaUbicacion,
                map: map,
                title: "Icono de tienda",
                icon: {
                    url: 'img/iconoinicio.jpg', // Cambia esto por tu imagen de ícono de tienda
                    scaledSize: new google.maps.Size(30, 30) // Ajusta el tamaño según sea necesario
                }
            });






//AUTOCOMPLETADO DE INPUT DE DIRRECIONES 
autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('direccion'), {
        bounds: cartagenaBounds, // Limita las sugerencias a un área geográfica específica (Cartagena)
        strictBounds: true, // Fuerza la restricción a los límites definidos en `cartagenaBounds`
        types: ['geocode', 'establishment'], // Buscar direcciones y lugares de interés como tiendas, restaurantes, etc.
        componentRestrictions: { country: 'co' } // Limita la búsqueda a Colombia
    }
);







//ESCUCHADOR DE EVENTO PARA EL AUTOCOMPLETADO: ACTUALIZACIÓN DE UBICACIÓN SELECCIONADA, MAPA Y RUTA
autocomplete.addListener('place_changed', function () {
    // Se obtiene la información del lugar seleccionado
    const place = autocomplete.getPlace();
    
    // Verifica si el lugar tiene información geográfica válida y si está dentro de los límites de Cartagena
    if (!place.geometry || !cartagenaBounds.contains(place.geometry.location)) {
        alert("Selecciona una ubicación dentro de Cartagena.");
        return; // Detiene la ejecución si no es una ubicación válida
    }
    
    // Si la ubicación es válida, centra el mapa en esa ubicación
    map.setCenter(place.geometry.location);
    
    // Mueve el marcador a la ubicación seleccionada
    marker.setPosition(place.geometry.location);
    
    // Actualiza la variable `ubicacion` con las coordenadas del lugar
    ubicacion = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };

    // Actualiza el campo de texto con la dirección completa del lugar seleccionado
    document.getElementById("direccion").value = place.formatted_address;

    // Calcula la ruta desde el origen hasta la nueva ubicación
    calcularRuta(origen, ubicacion);
    
    // Calcula el costo del envío basado en la nueva ubicación
    calcularCostoEnvio(ubicacion);
    
    // Guarda los datos de la ubicación en el localStorage
    guardarDatos();
});






// ESCUCHADOR DE EVENTO PARA EL MARCADOR ARRASTRADO: ACTUALIZACIÓN DE LA UBICACIÓN Y LA RUTA
google.maps.event.addListener(marker, 'dragend', function () {
    // Obtiene las nuevas coordenadas del marcador después de ser arrastrado
    const nuevaUbicacion = { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() };

    // Verifica que el marcador permanezca dentro de los límites de Cartagena
    if (!cartagenaBounds.contains(marker.getPosition())) {
        alert("El marcador debe permanecer dentro de Cartagena.");
        marker.setPosition(ubicacion); // Restablece el marcador si está fuera de los límites
        return;
    }
    
    // Actualiza la variable `ubicacion` con las nuevas coordenadas
    ubicacion = nuevaUbicacion;

    // Geocodifica la nueva ubicación para obtener la dirección y actualizar el campo de texto
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: ubicacion }, function(results, status) {
        if (status === "OK" && results[0]) {
            document.getElementById("direccion").value = results[0].formatted_address;

            // Guarda la dirección y coordenadas en localStorage
            localStorage.setItem('ubicacion', results[0].formatted_address);
            localStorage.setItem('marcadorLat', ubicacion.lat);
            localStorage.setItem('marcadorLng', ubicacion.lng);

            // Genera el enlace de Google Maps y lo guarda en localStorage
            const enlaceGoogleMaps = `https://www.google.com/maps?q=${ubicacion.lat},${ubicacion.lng}`;
            localStorage.setItem('enlaceGoogleMaps', enlaceGoogleMaps);
        }
    });

    // Calcula la ruta y el costo de envío automáticamente
    calcularRuta(origen, ubicacion);
    calcularCostoEnvio(ubicacion);
});
}







//FUNCIÓN AL DAR CLIC EN "LISTO"
function habilitarModalDatosPersonales() {
    const direccion = document.getElementById("direccion").value; // Obtener la dirección ingresada
    
    if (direccion) {
        // Si la dirección está llena, proceder a abrir el modal de datos personales
        abrirModalDatosPersonales(); // Abre el modal de nombre y teléfono
    } else {
        // Si la dirección no está llena, mostrar una alerta
        alert("Por favor, ingresa tu dirección.");
    }
}

//FUNCIÓN PARA ABRIR EL MODAL DE DATOS PERSONALES (NOMBRE Y TELÉFONO)
function abrirModalDatosPersonales() {
    document.getElementById('datospersonales').classList.add('active'); // Mostrar modal de datos
}

// FUNCIÓN PARA CERRAR EL MODAL DE DATOS PERSONALES (NOMBRE Y TELÉFONO)
function cerrarModaldatospersonales() {
    document.getElementById('datospersonales').classList.remove('active');
}


//VALIDACIÓN DE TELÉFONO (MÁXIMO 10 DÍGITOS)
function validarTelefono() {
    const telefono = document.getElementById("telefono");
    telefono.value = telefono.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos
    if (telefono.value.length > 10) {
        telefono.value = telefono.value.substring(0, 10); // Limitar a 10 caracteres
    }
}

//VALIDAR QUE LOS CAMPOS NOMBRE Y TELÉFONO ESTÉN LLENOS Y CON TELÉFONO DE 10 DÍGITOS
function aceptarModalDatos() {
    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    // Validar que ambos campos estén llenos y que el teléfono tenga 10 dígitos
    if (nombre && telefono.length === 10) {
        // Guardar los datos en localStorage
        localStorage.setItem('nombre', nombre);
        localStorage.setItem('telefono', telefono);
        
        // Habilitar el botón de finalizar compra
        habilitarBotonFinalizar();
    } else {
        // Mostrar alerta si los campos no están completos o el teléfono no tiene 10 dígitos
        alert("Por favor, ingresa tu nombre y un teléfono válido de 10 dígitos.");
    }
}

//HABILITAR EL BOTÓN DE "FINALIZAR COMPRA"
function habilitarBotonFinalizar() {
    const direccion = document.getElementById("direccion").value; // Obtener la dirección ingresada

    if (direccion) { // Verificar si se ha ingresado una dirección
        // Mostrar el botón de "Finalizar compra" y ocultar el botón de "¡Listo!"
        document.getElementById('btnFinalizar').style.display = 'inline-block'; // Mostrar botón de finalizar
        
    } else {
        // Si no se ha ingresado una dirección, mostrar un mensaje de alerta
        alert("Por favor, selecciona tu ubicación.");
    }
}









//FUNCION UBICACION ACTUAL
function usarUbicacionActual() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            // Obtener las coordenadas de la ubicación actual
            const nuevaUbicacion = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Actualizar el marcador y centrar el mapa en la ubicación actual
            marker.setPosition(nuevaUbicacion);
            map.setCenter(nuevaUbicacion);

            // Guardar la ubicación en localStorage
            localStorage.setItem('marcadorLat', nuevaUbicacion.lat);
            localStorage.setItem('marcadorLng', nuevaUbicacion.lng);

            // Obtener la dirección de la ubicación actual y mostrarla en el campo de dirección
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: nuevaUbicacion }, function(results, status) {
                if (status === 'OK' && results[0]) {
                    const direccion = results[0].formatted_address;
                    document.getElementById("direccion").value = direccion;
                    localStorage.setItem('ubicacion', direccion);
                }
            });

            // Actualizar la ruta en el mapa y el costo de envío
            calcularRuta(origen, nuevaUbicacion);
            calcularCostoEnvio(nuevaUbicacion);

        }, function () {
            alert("No se pudo obtener la ubicación.");
        });
    } else {
        alert("La geolocalización no es compatible con tu navegador.");
    }
}













//AUTOCOMPLETADO DE INPUT DE DIRECCIONES
autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('direccion'), {
        bounds: cartagenaBounds, // Limita las sugerencias a un área geográfica específica (Cartagena)
        strictBounds: true, // Fuerza la restricción a los límites definidos en `cartagenaBounds`
        types: ['geocode', 'establishment'], // Buscar direcciones y lugares de interés como tiendas, restaurantes, etc.
        componentRestrictions: { country: 'co' } // Limita la búsqueda a Colombia
    }
);

// **Escuchador de evento para el autocompletado: actualización de ubicación seleccionada, mapa y ruta**
autocomplete.addListener('place_changed', function () {
    // Se obtiene la información del lugar seleccionado
    const place = autocomplete.getPlace();
    
    // Verifica si el lugar tiene información geográfica válida y si está dentro de los límites de Cartagena
    if (!place.geometry || !cartagenaBounds.contains(place.geometry.location)) {
        alert("Selecciona una ubicación dentro de Cartagena.");
        return; // Detiene la ejecución si no es una ubicación válida
    }
    
    // Si la ubicación es válida, centra el mapa en esa ubicación
    map.setCenter(place.geometry.location);
    
    // Mueve el marcador a la ubicación seleccionada
    marker.setPosition(place.geometry.location);
    
    // Actualiza la variable `ubicacion` con las coordenadas del lugar
    ubicacion = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
    };

    // Actualiza el campo de texto con la dirección completa del lugar seleccionado
    document.getElementById("direccion").value = place.formatted_address;

    // Calcula la ruta desde el origen hasta la nueva ubicación
    calcularRuta(origen, ubicacion);
    
    // Calcula el costo del envío basado en la nueva ubicación
    calcularCostoEnvio(ubicacion);
    
    // Guarda los datos de la ubicación en el localStorage
    guardarDatos();
});

// **Escuchar los cambios manuales en el input de dirección**
document.getElementById('direccion').addEventListener('input', function() {
    const direccionManual = document.getElementById("direccion").value;
    
    if (direccionManual) {
        // Guarda la dirección manualmente ingresada en localStorage
        localStorage.setItem('ubicacion', direccionManual);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: direccionManual }, function(results, status) {
            if (status === "OK" && results[0]) {
                const lat = results[0].geometry.location.lat();
                const lng = results[0].geometry.location.lng();
                // Guarda las coordenadas de la ubicación manual en localStorage
                localStorage.setItem('marcadorLat', lat);
                localStorage.setItem('marcadorLng', lng);
                
                // Actualiza la ubicación en el mapa
                marker.setPosition({ lat: lat, lng: lng });
                map.setCenter({ lat: lat, lng: lng });
                // Calcula la ruta y el costo del envío basado en la ubicación manual
                calcularRuta(origen, { lat: lat, lng: lng });
                calcularCostoEnvio({ lat: lat, lng: lng });
            }
        });
    }
});





// FUNCIÓN PARA GUARDAR LA DIRECCIÓN Y LAS COORDENADAS EN EL LOCALSTORAGE
function guardarDatos() {
    localStorage.setItem('ubicacion', document.getElementById("direccion").value);
    localStorage.setItem('Punto_de_referencia', document.getElementById("Punto_de_referencia").value);
}






//FINALIZAR LA COMPRA Y ENVIAR UN MENSAJE A TRAVÉS DE WHATSAPP
function finalizarCompra() {
    // Crear el mensaje de productos seleccionados
    const messageProducts = cart.map(item => 
        `*${item.name} - $${formatPrice(item.price)} x ${item.quantity}*` + 
        `\n   _Instrucciones: ${item.instructions || ''}_`).join('\n');
    
    // Calcular el total de productos en el carrito
    const totalProductos = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Obtener el costo de domicilio desde localStorage
    const costoDomicilio = parseFloat(localStorage.getItem('costoDomicilio') || 0);

    // Sumar el total de productos y el costo de domicilio para obtener el total final
    const totalFinal = totalProductos + costoDomicilio;

    // Obtener el método de pago desde el localStorage
    const metodoPago = localStorage.getItem('metodoPago') || 'No seleccionado';  // Por defecto 'No seleccionado' si no hay valor
    
    // Obtener la dirección desde el campo de búsqueda o el input
    const ubicacion = localStorage.getItem('ubicacion') || document.getElementById('direccion').value || "Ubicación no disponible";
    
    // Obtener el punto de referencia
    const puntoDeReferencia = document.getElementById('Punto_de_referencia').value || "Ninguna";

    // Obtener las coordenadas de latitud y longitud del localStorage
    const latitud = localStorage.getItem('marcadorLat');
    const longitud = localStorage.getItem('marcadorLng');

    // Obtener los datos del usuario (nombre, teléfono) desde localStorage
    const nombre = localStorage.getItem('nombre') || "Nombre no proporcionado";
    const telefono = localStorage.getItem('telefono') || "Teléfono no proporcionado";

    // Crear el enlace de Google Maps con las coordenadas de la ubicación
    const googleMapsLink = `https://www.google.com/maps?q=${latitud},${longitud}`;

    // Crear el mensaje para enviar a través de WhatsApp
    const whatsappMessage = `
*DOMICILIO*

*DATOS DEL USUARIO:*
Nombre: ${nombre}
Teléfono: ${telefono}

*DIRECCIÓN:*
${ubicacion}

*PUNTO DE REFERENCIA:*
${puntoDeReferencia}

*PRODUCTOS SELECCIONADOS:*

${messageProducts}

*TOTAL PRODUCTOS: $${formatPrice(totalProductos)}*
COSTO DE DOMICILIO: $${formatPrice(costoDomicilio)}

*TOTAL A PAGAR: $${formatPrice(totalFinal)}*
*MÉTODO DE PAGO:* ${metodoPago}

*Ubicación en Google Maps:*
${googleMapsLink}`;

    // Función auxiliar para formatear los precios en el formato de moneda colombiana
    function formatPrice(price) {
        return Math.round(price).toLocaleString('es-CO');
    }

    // Codificar el mensaje y abrir WhatsApp con el mensaje preformateado
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/3024345404?text=${encodedMessage}`, '_blank');

    // Limpiar todo el localStorage después de 5 minutos (300000 ms)
    setTimeout(function() {
        localStorage.clear();  // Limpiar el localStorage
        window.location.href = 'index.html';  // Redirigir a la página de inicio
    }, 300000);  // 300000 ms = 5 minutos
}










//FUNCIÓN PARA CALCULAR Y MOSTRAR LA RUTA ENTRE UN ORIGEN Y UN DESTINO EN EL MAPA
function calcularRuta(origen, destino) {
    // Configurar la solicitud para calcular la ruta
    const request = {
        origin: origen,  // Ubicación de inicio
        destination: destino,  // Ubicación de destino
        travelMode: google.maps.TravelMode.DRIVING  // Modo de transporte (conducción)
    };

    // Solicitar la ruta al servicio de direcciones
    directionsService.route(request, function(result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            // Mostrar la ruta en el mapa
            directionsRenderer.setDirections(result);

            // Guardar la latitud y longitud del destino en localStorage
            localStorage.setItem('destinoLat', destino.lat);
            localStorage.setItem('destinoLng', destino.lng);
        } 
        
        /*else {
            // Mostrar un mensaje de error si no se pudo calcular la ruta
            alert("Lo sentimos, Estamos trabajando para cubrir tu zona.");
        }*/
    });
}





//FUNCIÓN PARA CALCULAR EL COSTO DE ENVÍO BASADO EN LA DISTANCIA ENTRE ORIGEN Y DESTINO
function calcularCostoEnvio(destino) {
    // Crear una nueva instancia del servicio de matriz de distancias
    const service = new google.maps.DistanceMatrixService();
    
    // Realizar la solicitud para obtener la distancia entre el origen y el destino
    service.getDistanceMatrix({
        origins: [origen],  // Origen de la ruta
        destinations: [destino],  // Destino de la ruta
        travelMode: google.maps.TravelMode.DRIVING,  // Modo de transporte (conducción)
    }, function(response, status) {
        if (status === google.maps.DistanceMatrixStatus.OK) {
            // Extraer la distancia en metros y convertirla a kilómetros
            const distanciaEnMetros = response.rows[0].elements[0].distance.value;
            const distanciaEnKm = distanciaEnMetros / 1000;
            
            // Calcular el costo de envío basado en la distancia y la tarifa por kilómetro
            let costoEnvio = Math.ceil(distanciaEnKm * tarifaPorKm);

            // Limitar el costo de envío a un rango específico
            if (costoEnvio < 3000) {
                costoEnvio = 3000;
            } else if (costoEnvio > 20000) {
                costoEnvio = 20000;
            }

            // Guardar el costo de envío en localStorage para su uso posterior
            localStorage.setItem('costoDomicilio', costoEnvio);

            // Mostrar el costo de domicilio en la interfaz de usuario
            document.getElementById("costo-envio").textContent = `Costo de domicilio: $${costoEnvio.toLocaleString('es-CO')}`;

            // Actualizar el total de la compra
            actualizarTotal(costoEnvio);
        } else {
            // Manejo de errores si no se pudo calcular la distancia
            alert("No se pudo calcular la distancia.");
        }
    });
}







// VARIABLES ADICIONALES PARA LA FUNCIONALIDAD DEL CARRITO
let cart = JSON.parse(localStorage.getItem('cart')) || [];





// CARGAR DATOS ALMACENADOS AL ACTUALIZAR EL SITIO WEB
function cargarDatos() {
            const ubicacionGuardada = localStorage.getItem('ubicacion');
            const puntoReferenciaGuardado = localStorage.getItem('puntoReferencia');
            if (ubicacionGuardada) {
                document.getElementById("direccion").value = ubicacionGuardada;
            }
            if (puntoReferenciaGuardado) {
                document.getElementById('Punto_de_referencia').value = puntoReferenciaGuardado;
            }
            const costoDomicilioGuardado = localStorage.getItem('costoDomicilio');
            
            if (costoDomicilioGuardado) {
                document.getElementById("costo-envio").textContent = `Costo de domicilio: $${parseFloat(costoDomicilioGuardado).toLocaleString('es-CO')}`;
            }
        }