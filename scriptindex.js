// EVITAR CLICK DERECHO EN TODA LA PÁGINA
document.addEventListener('contextmenu', (e) => e.preventDefault());

// DESACTIVAR TODOS LOS TIPOS DE ZOOM EN MÓVILES
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {

    // Evitar el gesto de pinza para hacer zoom
    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault(); // Bloquea zoom de pinza
        }
    }, { passive: false });

    // Evitar zoom en doble toque
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault(); // Bloquea zoom en doble toque
        }
        lastTouchEnd = now;
    }, false);

    // EVITAR ZOOM EN CAMPOS DE TEXTO EN MÓVILES
    document.querySelectorAll('input, textarea, select').forEach((element) => {
        element.addEventListener('focus', () => {
            document.body.style.zoom = '100%'; // Previene el zoom en campos de entrada
        });
        element.addEventListener('blur', () => {
            document.body.style.zoom = ''; // Restaura el estilo de zoom después
        });
    });

    // EVITAR ZOOM CON GESTO DE DESPLAZAMIENTO (DOS DEDOS)
    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 1) {
            event.preventDefault(); // Bloquea zoom de desplazamiento de dos dedos
        }
    }, { passive: false });
}

// EVITAR ZOOM EN LA PÁGINA A TRAVÉS DE META TAGS EN DISPOSITIVOS MÓVILES
const metaTag = document.createElement('meta');
metaTag.name = 'viewport';
metaTag.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
document.head.appendChild(metaTag);











// FUNCIÓN PARA FORMATEAR LOS NÚMEROS CON PUNTOS COMO SEPARADORES DE MILES
function formatNumber(number) {
    return number.toLocaleString('es-CO');}






// SIMULA LA CARGA DE PRODUCTOS Y SU VISUALIZACIÓN EN LA PÁGINA PRINCIPAL
function displayProducts(category = '', searchQuery = '') {
    const products = [
        { 
            id: 1, 
            image: 'img/tacos.jpg', 
            name: 'Tacos de birria', 
            category: 'tacos', 
            price: 17000, 
            description: 'Carnitas doradas, tiernas y jugosas, perfectas con cebolla y cilantro..' 
        },
        { 
            id: 2, 
            image: 'img/tacos.jpg', 
            name: 'Tacos al pastor', 
            category: 'tacos', 
            price: 17000, 
            description: 'Cerdo marinado con un toque de piña y adobo. Sabor único en cada mordida..' 
        },
        { 
            id: 3, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco S', 
            category: 'dorilocos', 
            price: 5000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 4, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco M', 
            category: 'dorilocos', 
            price: 10000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 5, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco L', 
            category: 'dorilocos', 
            price: 15000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 6, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco XL', 
            category: 'dorilocos', 
            price: 25000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 7, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco 2XL', 
            category: 'dorilocos', 
            price: 5000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
    ];




    
// FILTRA LOS PRODUCTOS POR CATEGORÍA (SI SE PROPORCIONA) Y POR NOMBRE (SI HAY UNA BÚSQUEDA)
    const filteredProducts = products.filter(p => 
        (!category || p.category === category) && 
        (!searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product-item');

        productElement.onclick = function() {
        openModal(product.id); // Llama a la función openModal con el ID del producto
    };

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image"> <!-- Imagen del producto -->
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>$ ${formatNumber(product.price)}</strong></p> <!-- Formatear el precio aquí -->
            <button onclick="openModal(${product.id})">Ordenar</button>
        `;
        productList.appendChild(productElement);
    });
}





// FUNCIÓN PARA BUSCAR PRODUCTOS POR NOMBRE 
function searchProducts() {
    const searchQuery = document.getElementById('search-input').value;
    displayProducts('', searchQuery); // Se pasa la consulta de búsqueda al filtro
}





// FUNCIÓN PARA ABRIR EL MODAL CON LOS DETALLES DEL PRODUCTO
function openModal(productId) {
    const products = [
        { 
            id: 1, 
            image: 'img/tacos.jpg', 
            name: 'Tacos de birria', 
            category: 'tacos', 
            price: 17000, 
            description: 'Carnitas doradas, tiernas y jugosas, perfectas con cebolla y cilantro..' 
        },
        { 
            id: 2, 
            image: 'img/tacos.jpg', 
            name: 'Tacos al pastor', 
            category: 'tacos', 
            price: 17000, 
            description: 'Cerdo marinado con un toque de piña y adobo. Sabor único en cada mordida..' 
        },
        { 
            id: 3, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco S', 
            category: 'dorilocos', 
            price: 5000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 4, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco M', 
            category: 'dorilocos', 
            price: 10000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 5, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco L', 
            category: 'dorilocos', 
            price: 15000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 6, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco XL', 
            category: 'dorilocos', 
            price: 25000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
        { 
            id: 7, 
            image: 'img/dorilocos.jpg', 
            name: 'Doriloco 2XL', 
            category: 'dorilocos', 
            price: 5000, 
            description: 'Doritos crujientes con cueritos, jícama, cacahuates, chamoy, salsa y limón. ¡Un antojo loco y delicioso!.' 
        },
    ];





//FUNCIÓN PARA MOSTRAR LA INFORMACIÓN DEL PRODUCTO EN UN MODAL
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById('modal-product-name').innerText = product.name;
        document.getElementById('modal-product-description').innerText = product.description;
        document.getElementById('modal-product-price').innerText = formatNumber(product.price); // Formatear el precio en el modal
        document.getElementById('modal-product-image').src = product.image; // Aseguramos que la imagen del modal se actualice
        document.getElementById('product-modal').style.display = 'block';
    }
}
// FUNCIÓN PARA CERRAR EL MODAL
        function closeModal() {
            document.getElementById('product-modal').style.display = 'none';
        }





//FUNCION AGREGAR AL CARRTIO DESDE EL MODAL
function addToCartFromModal() {
    console.log('Verificando si la tienda está abierta...');

    // VERIFICAR SI LA TIENDA ESTÁ ABIERTA
    if (!estaAbierta()) {
        alert("La tienda está cerrada. No puedes agregar productos al carrito en este momento.");
        return; // DETIENE LA FUNCIÓN SI LA TIENDA ESTÁ CERRADA
    }

    const name = document.getElementById('modal-product-name').innerText;
    const priceFormatted = document.getElementById('modal-product-price').innerText;
    const instructions = document.getElementById('modal-product-instructions').value.trim(); // USAMOS TRIM PARA QUITAR ESPACIOS INNECESARIOS
    const quantity = parseInt(document.getElementById('modal-quantity').value, 10); // OBTENER LA CANTIDAD
    const image = document.getElementById('modal-product-image').src; // CAPTURA LA URL DE LA IMAGEN

    // CONVERTIMOS EL PRECIO CON FORMATO A SU VALOR NUMÉRICO (ELIMINANDO EL PUNTO)
    const price = parseInt(priceFormatted.replace(/\./g, ''), 10);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // VERIFICAR SI EL PRODUCTO YA EXISTE EN EL CARRITO, SI ES ASÍ, AUMENTAR LA CANTIDAD
    const existingProductIndex = cart.findIndex(product => product.name === name && product.instructions === instructions);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity; // Aumentar la cantidad
    } else {
        cart.push({ name, price, instructions, quantity, image }); // Agregar producto nuevo con la imagen
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // AUMENTAMOS EL CONTADOR
    updateCartCount();

    // MOSTRAR LA ANIMACIÓN DEL CARRITO EXPANDIÉNDOSE
    const cartButton = document.getElementById('floating-cart');
    cartButton.classList.add('expanded');  // Expande el botón

    // MOSTRAR LA NOTIFICACION
    showNotification(`${name} ha sido agregado al carrito ${quantity} veces.`);

    // DESPUÉS DE 3 SEGUNDOS, RESTAURAR EL TAMAÑO DEL CARRITO Y OCULTAR LA NOTIFICACIÓN
    setTimeout(() => {
        cartButton.classList.remove('expanded');
        hideNotification();
    }, 3000); // Mantener expandido por 3 segundos

    closeModal(); // Cierra el modal después de agregar al carrito

    // LIMPIAR EL TEXTAREA PARA QUE NO APAREZCA EL TEXTO DE LAS INSTRUCCIONES ANTERIORES
    document.getElementById('modal-product-instructions').value = ''; // Limpiar el contenido del textarea
    document.getElementById('modal-quantity').value = 1; // Restablecer la cantidad a 1
}

// FUNCIÓN PARA MOSTRAR LA NOTIFICACIÓN
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message; // Asigna el mensaje a la notificación

    // Mostrar la notificación
    notification.classList.add('show');
}

// FUNCIÓN PARA OCULTAR LA NOTIFICACIÓN
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}





// MOSTRAR TODOS LOS PRODUCTOS AL CARGAR LA PÁGINA
window.onload = function() {displayProducts();};






//FUNCION PARA LA CANTIDAD QUE SE INGRESA DESDE EL MODAL
let quantity = 1;

// FUNCIÓN PARA INCREMENTAR LA CANTIDAD
function increaseQuantity() {
    quantity++;
    document.getElementById('product-quantity').value = quantity;
}

// FUNCIÓN PARA DECREMENTAR LA CANTIDAD, ASEGURANDO QUE NO SEA MENOR QUE 1
function decreaseQuantity() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('product-quantity').value = quantity;
    }
}

// FUNCIÓN PARA VALIDAR QUE LA ENTRADA SEA UN NÚMERO VÁLIDO Y ACTUALIZAR LA CANTIDAD
function validateQuantityInput() {
    const input = document.getElementById('product-quantity');
    const value = parseInt(input.value);

    if (!isNaN(value) && value > 0) {
        quantity = value; // Actualiza la cantidad si el valor es válido
    } else {
        quantity = 1; // Si el valor no es válido, ajusta la cantidad a 1
    }
    input.value = quantity; // Actualiza el campo con la cantidad validada
}





//ARREGLO PARA HORARIO DE TIENDA
const horariosTienda = [
    { dia: 0, horaApertura: 0, horaCierre: 24 },  // Domingo
    { dia: 1, horaApertura: 0, horaCierre: 24 },  // Lunes 
    { dia: 2, horaApertura: 0, horaCierre: 24 },  // Martes
    { dia: 3, horaApertura: 0, horaCierre: 24 },  // Miércoles
    { dia: 4, horaApertura: 0, horaCierre: 24 },  // Jueves
    { dia: 5, horaApertura: 0, horaCierre: 24 },  // Viernes
    { dia: 6, horaApertura: 0, horaCierre: 24 }, // Sábado
];




// FUNCIÓN PARA VERIFICAR SI LA TIENDA ESTÁ ABIERTA
function estaAbierta() {
    const horaActual = new Date().getHours(); // Obtiene la hora actual
    const diaActual = new Date().getDay();   // Obtiene el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)

    console.log(`Hora actual: ${horaActual}, Día actual: ${diaActual}`); // Para depurar

    // BUSCAR EL HORARIO CORRESPONDIENTE AL DÍA ACTUAL
    const horarioHoy = horariosTienda.find(horario => horario.dia === diaActual);

    // VERIFICAR SI EL DÍA TIENE UN HORARIO DEFINIDO
    if (horarioHoy) {
        return horaActual >= horarioHoy.horaApertura && horaActual < horarioHoy.horaCierre;
    } else {
        return false; // Si no hay horario para el día, la tienda está cerrada
    }
}

// FUNCIÓN PARA ACTUALIZAR EL ESTADO DE LA TIENDA (USADA POR EL HTML)
function actualizarEstadoTienda() {
    const estadoTienda = document.getElementById('estado-tienda');
    const horaActual = new Date().getHours(); // Obtiene la hora actual
    const diaActual = new Date().getDay();   // Obtiene el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)

    console.log(`Hora actual para estado: ${horaActual}, Día actual: ${diaActual}`); // Para depurar

    // BUSCAR EL HORARIO CORRESPONDIENTE AL DÍA ACTUAL
    const horarioHoy = horariosTienda.find(horario => horario.dia === diaActual);

    if (horarioHoy && horaActual >= horarioHoy.horaApertura && horaActual < horarioHoy.horaCierre) {
        estadoTienda.textContent = "¡La tienda está abierta!";
        estadoTienda.classList.add("abierto");
        estadoTienda.classList.remove("cerrado");
    } else {
        estadoTienda.textContent = "La tienda está cerrada.";
        estadoTienda.classList.add("cerrado");
        estadoTienda.classList.remove("abierto");
    }
}

// LLAMAMOS A LA FUNCIÓN PARA ACTUALIZAR EL ESTADO AL CARGAR LA PÁGINA
document.addEventListener("DOMContentLoaded", function() {
    actualizarEstadoTienda();
});





// ESCUCHAR EL EVENTO DE ENTRADA EN EL CAMPO DE CANTIDAD EN MODAL
document.getElementById('modal-quantity').addEventListener('input', function(event) {
    let value = parseInt(event.target.value, 10);
    
    // VERIFICAR SI EL VALOR ES MAYOR QUE 99
    if (value > 99) {
        event.target.value = 99; // Limitar el valor a 100
    } else if (value < 1) {
        event.target.value = 1; // Asegurarse de que el valor no sea menor que 1
    }
});

// Función para cambiar la cantidad con los botones + y -
function changeQuantity(amount) {
    const quantityInput = document.getElementById('modal-quantity');
    let currentQuantity = parseInt(quantityInput.value, 10);

    // Limitar la cantidad a un máximo de 99 productos
    if (currentQuantity + amount <= 99 && currentQuantity + amount >= 1) {
        quantityInput.value = currentQuantity + amount;
    } else if (currentQuantity + amount > 99) {
        quantityInput.value = 99; // Limitar a 99 si el número excede
    } else {
        quantityInput.value = 1; // Mantener al menos 1
    }
}





//FUNCION CONTAR LOS PRODUCTOS QUE SE ENCUENTRAN EN EL CARRITO
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');

    // Calcular la cantidad total de todos los productos en el carrito
    let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQuantity > 0) {
        cartCount.innerText = totalQuantity;
        cartCount.style.display = 'inline-block'; // Muestra el contador
    } else {
        cartCount.style.display = 'none'; // Oculta el contador si está vacío
    }
}





// LLAMA A ESTA FUNCIÓN CUANDO LA PÁGINA TERMINE DE CARGAR
document.addEventListener('DOMContentLoaded', updateCartCount);
