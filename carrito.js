
// FUNCIÓN PARA FORMATEAR LOS NÚMEROS CON PUNTOS
function formatNumber(number) {
    return number.toLocaleString('es-CO');
}





// FUNCIÓN PARA CARGAR LOS PRODUCTOS DEL CARRITO
function loadCart() {
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartItemsList = document.getElementById('cart-items-list');
const cartTotal = document.getElementById('cart-total');
let total = 0;

// LIMPIAR LA LISTA DE PRODUCTOS EN EL CARRITO
cartItemsList.innerHTML = '';

// Verificar si el carrito está vacío
if (cartItems.length === 0) {
cartItemsList.innerHTML = `<p>No hay productos en tu carrito.</p>`;
} else {
// MOSTRAR PRODUCTOS DEL CARRITO
cartItems.forEach((product, index) => {
    const price = isNaN(parseFloat(product.price)) ? 0 : parseFloat(product.price);
    const imageUrl = product.image ? product.image : 'img/default.jpg'; // Imagen alternativa

    const itemElement = document.createElement('div');
    itemElement.classList.add('cart-item');
    itemElement.innerHTML = `
    <div id="contenedordeimagencarrito">
    <img src="${imageUrl}" alt="${product.name}" class="cart-product-image"> <!-- Imagen del producto -->
    </div>
        <div id="nombre_precio_intrucciones">
            <!-- Información del producto -->
            <p><strong>${product.name} - $${formatNumber(price)} x ${product.quantity}</strong></p>
            <p>Indicaciones: ${product.instructions || 'Ninguna'}</p>
        </div>
        
        <img id="basura" src="img/basura.png" alt="Eliminar" onclick="removeItem(${index})">
    `;
    cartItemsList.appendChild(itemElement);

    // ASEGURARSE DE QUE EL CÁLCULO SEA NUMÉRICO
    total += price * product.quantity; // Calculamos el total teniendo en cuenta la cantidad
});
}

// MOSTRAR EL TOTAL CON FORMATO DE PUNTOS DE MIL
cartTotal.innerText = `Total: $ ${formatNumber(total)}`;
}





// FUNCIÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO
function removeItem(index) {
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
// Eliminar el producto en la posición indicada
cartItems.splice(index, 1);

// Guardar de nuevo el carrito en el localStorage
localStorage.setItem('cart', JSON.stringify(cartItems));
    
// Recargar el carrito
loadCart();}

// FUNCIÓN PARA ELIMINAR UN PRODUCTO DEL CARRITO CON (ANIMACIÓN)
function removeItem(index) {
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

// Obtener el elemento del producto específico
const cartItemsList = document.getElementById('cart-items-list');
const itemElement = cartItemsList.children[index];

// Añadir la clase de animación
itemElement.classList.add('fade-out');

// Esperar a que termine la animación (0.5s) y luego eliminar el elemento
setTimeout(() => {
// Eliminar el producto en la posición indicada
cartItems.splice(index, 1);

// Guardar de nuevo el carrito en el localStorage
localStorage.setItem('cart', JSON.stringify(cartItems));

// Recargar el carrito
loadCart();
}, 500); // Tiempo que dura la animación
}






// FUNCIÓN PARA VACIAR EL CARRITO CON ANIMACIÓN
function emptyCart() {
if (confirm("¿Estás seguro de que deseas vaciar el carrito?")) {
const cartItemsList = document.getElementById('cart-items-list');

// Añadir clase de animación de desvanecimiento a cada elemento del carrito
const cartItems = Array.from(cartItemsList.children);
cartItems.forEach((item, index) => {
    item.style.transition = `opacity 0.3s ease ${(index + 1) * 0.1}s`; // Retraso escalonado
    item.style.opacity = '0'; // Desvanecer elemento
});

// Esperar que la animación termine antes de limpiar el carrito
setTimeout(() => {
    localStorage.removeItem('cart'); // Eliminar elementos del carrito en localStorage
    loadCart(); // Recargar el carrito después de vaciarlo
}, cartItems.length * 100 + 300); // Tiempo total de animación
}
}







// FUNCIÓN PARA VERIFICAR SI EL CARRITO ESTA LLENO Y TAMBIEN INSERTAR METODO DE PAGO (ABRE EL MODAL)
function openModal() {
const metodoPago = document.getElementById('opcionesPago').value; // Obtener el valor del select de pago
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];


// Verificar si el carrito está vacío
if (cartItems.length === 0) {
alert("Tu carrito está vacío. Agrega productos antes de proceder.");
} 

// Verificar si no se ha seleccionado un método de pago
if (!metodoPago) {
alert("Por favor, selecciona un método de pago antes de continuar.");
return; // Evita abrir el modal si no se seleccionó un método de pago
} else {
// Si todo está bien, abrir el modal
document.getElementById('payment-modal').style.display = 'block'; // Mostrar el modal
}
}

// FUNCIÓN PARA GUARDAR EL MÉTODO DE PAGO EN LOCALSTORAGE
document.getElementById('opcionesPago').addEventListener('change', function() {
const metodoPago = this.value;
localStorage.setItem('metodoPago', metodoPago);  // Guardar el método de pago
});

// FUNCIÓN PARA CERRAR EL MODAL CON EL BOTON CANCELAR
function closeModal() {
document.getElementById('payment-modal').style.display = 'none'; // Ocultar el modal
}






// FUNCIÓN PARA ABRIR EL MODAL DE DATOS PERSONALES CUANDO SE HACE CLIC EN "RECOGER EN TIENDA"
function abrirModaldatospersonales() {
document.getElementById('datospersonales').classList.add('active');
}

// FUNCIÓN PARA CERRAR EL MODAL DE DATOS PERSONALES
function cerrarModaldatospersonales() {
document.getElementById('datospersonales').classList.remove('active');
}

// FUNCIÓN PARA VALIDAR SOLO NÚMEROS EN EL TELÉFONO Y LIMITAR A 10 DÍGITOS
function validarTelefono() {
const telefono = document.getElementById("telefono");
telefono.value = telefono.value.replace(/[^0-9]/g, '').substring(0, 10);
}

// FUNCIÓN PARA MANEJAR LA VALIDACIÓN Y ENVIAR MENSAJE DE WHATSAPP SI LOS DATOS SON VÁLIDOS
function aceptarModaldatos() {
const nombre = document.getElementById("nombre").value.trim();
const telefono = document.getElementById("telefono").value.trim();

// Validar que ambos campos estén llenos y que el teléfono tenga 10 dígitos
if (nombre && telefono.length === 10) {
// Guardar datos en localStorage
localStorage.setItem('nombre', nombre);
localStorage.setItem('telefono', telefono);

// Cerrar el modal y enviar el mensaje de WhatsApp
cerrarModaldatospersonales();
enviarMensajeRecoger(); // Llama a la función para enviar el mensaje
} else {
// Mostrar alerta si la validación falla
alert("Por favor, ingresa tu nombre y un teléfono válido de 10 dígitos.");
}
}













// FUNCIÓN PARA ENVIAR LOS DATOS DEL CARRITO A WHATSAPP
function enviarMensajeRecoger() {
const nombre = localStorage.getItem('nombre') || "Nombre no proporcionado";
const telefono = localStorage.getItem('telefono') || "Teléfono no proporcionado";
const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
const cartTotalElement = document.getElementById('cart-total').innerText.replace('Total: $ ', '');
const cartTotal = parseFloat(cartTotalElement.replace(/\./g, '').replace(',', '.')); // Eliminar formato y convertir a número
const metodoPago = localStorage.getItem('metodoPago') || 'No seleccionado';  // Por defecto 'No seleccionado' si no hay valor


// CREAR EL BLOQUE DE TEXTO CON PRODUCTOS SELECCIONADOS, INCLUYENDO LA CANTIDAD
let messageProducts = cartItems.map(item => 
`*${item.name} - $${formatNumber(parseFloat(item.price) || 0)} x ${item.quantity}*` + `\n   _Instrucciones: ${item.instructions || ''}_`).join('\n');

// GENERAR EL MENSAJE DE WHATSAPP PARA RECOGER EN TIENDA
let mensaje = "*RECOGER EN TIENDA*\n\n";
mensaje += "*DATOS DEL USUARIO:*\n";
mensaje += `Nombre: ${nombre}\n`;
mensaje += `Teléfono: ${telefono}\n\n`;
mensaje += "*PRODUCTOS SELECCIONADOS:*\n\n";
mensaje += `${messageProducts}\n\n`;
mensaje += `*TOTAL A PAGAR: $${formatNumber(cartTotal)}*\n`;
mensaje += `*MÉTODO DE PAGO:* ${metodoPago}\n\n`; 
mensaje += "*Ubicación de la tienda:*\n";
mensaje += "https://www.google.com/maps/place/Mr.+George/@10.3737614,-75.4761805,17z/data=!3m1!4b1!4m6!3m5!1s0x8ef63b2aa9ab677f:0x239b6ab0ab1c329e!8m2!3d10.3737561!4d-75.4736056!16s%2Fg%2F11l1l0md04?hl.\n";

// CODIFICAR EL MENSAJE Y ABRIR WHATSAPP
const encodedMessage = encodeURIComponent(mensaje);
window.open(`https://wa.me/3024345404?text=${encodedMessage}`, '_blank');

// Limpiar todo el localStorage después de 5 minutos (300000 ms)
setTimeout(function() {
localStorage.clear();  // Limpiar el localStorage
window.location.href = 'index.html';  // Redirigir a la página de inicio
}, 300000);  // 300000 ms = 5 minutos
}





// Cargar los productos del carrito cuando se carga la página
window.onload = loadCart;



