// Datos de Productos
const productos = [
    {
        id: 1,
        nombre: "Calza Sport Negra",
        categoria: "calzas",
        precio: 8500,
        precioOriginal: 10500,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/1b0f146b1-a10b-458e-a292-73efd42db096.png",
        etiqueta: "Más vendido"
    },
    {
        id: 2,
        nombre: "Calza Sport Rosa",
        categoria: "calzas",
        precio: 8500,
        precioOriginal: null,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/1d6ec66ed-c5cf-4feb-a6d8-66fb5b2a622f.png",
        etiqueta: "Nuevo"
    },
    {
        id: 3,
        nombre: "Calza Sport Gris",
        categoria: "calzas",
        precio: 8500,
        precioOriginal: null,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/186b87510-c266-4d5d-8779-2fad0db2f34f.png",
        etiqueta: null
    },
    {
        id: 4,
        nombre: "Corpiño Sport Purple",
        categoria: "corpiño",
        precio: 6200,
        precioOriginal: 7800,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/171a9b583-501d-43a3-8507-1ea356892990.png",
        etiqueta: "Más vendido"
    },
    {
        id: 5,
        nombre: "Corpiño Sport Black",
        categoria: "corpiño",
        precio: 6200,
        precioOriginal: null,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/115c2fd57-9e77-4315-b514-2b9c0026ccf8.png",
        etiqueta: null
    },
    {
        id: 6,
        nombre: "Corpiño Sport White",
        categoria: "corpiño",
        precio: 6200,
        precioOriginal: null,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/112f832dd-b72c-4f91-8c27-0de60c479bf0.png",
        etiqueta: "Nuevo"
    },
    {
        id: 7,
        nombre: "Top Sport Blanco",
        categoria: "top",
        precio: 5800,
        precioOriginal: 7200,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/1175566fd-81ce-4203-a42c-cad41c664759.png",
        etiqueta: "Más vendido"
    },
    {
        id: 8,
        nombre: "Top Sport Purple",
        categoria: "top",
        precio: 5800,
        precioOriginal: null,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/144e46f26-7e1e-460e-8e3b-796c37a01add.png",
        etiqueta: null
    },
    {
        id: 9,
        nombre: "Top Sport Black",
        categoria: "top",
        precio: 5800,
        precioOriginal: null,
        imagen: "https://image.qwenlm.ai/public_source/36e35967-3659-4c3e-b57f-3005fd4fb867/1fb0a260d-3ad9-43f9-abaf-61e9622475a8.png",
        etiqueta: "Nuevo"
    }
];

// Estado del carrito
let carrito = [];

// Renderizar Productos
function renderizarProductos(filtro = 'all') {
    const grid = document.getElementById('productsGrid');
    const filtrados = filtro === 'all' ? productos : productos.filter(p => p.categoria === filtro);

    grid.innerHTML = filtrados.map(producto => `
        <div class="product-card" data-category="${producto.categoria}">
            <div class="product-image-wrap">
                <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                ${producto.etiqueta ? `<span class="product-badge">${producto.etiqueta}</span>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${obtenerEtiquetaCategoria(producto.categoria)}</div>
                <div class="product-name">${producto.nombre}</div>
                <div class="product-price">
                    $${producto.precio.toLocaleString()}
                    ${producto.precioOriginal ? `<span class="original">$${producto.precioOriginal.toLocaleString()}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" id="btnAgregar${producto.id}" onclick="agregarAlCarrito(${producto.id})">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

function obtenerEtiquetaCategoria(cat) {
    const etiquetas = {
        'calzas': 'Calza Deportiva',
        'corpiño': 'Corpiño Deportivo',
        'top': 'Top Deportivo'
    };
    return etiquetas[cat] || cat;
}

function filtrarProductos(categoria, boton) {
    document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
    if (boton) boton.classList.add('active');
    renderizarProductos(categoria);
}

// Funciones del Carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    const existente = carrito.find(item => item.id === idProducto);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    // Animación del botón
    const boton = document.getElementById(`btnAgregar${idProducto}`);
    if (boton) {
        boton.classList.add('added');
        boton.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> ¡Agregado!`;
        setTimeout(() => {
            boton.classList.remove('added');
            boton.innerHTML = `<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg> Agregar al Carrito`;
        }, 1500);
    }

    actualizarUI();
    mostrarNotificacion(`${producto.nombre} agregado al carrito`);
}

function eliminarDelCarrito(idProducto) {
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarUI();
}

function actualizarCantidad(idProducto, delta) {
    const item = carrito.find(i => i.id === idProducto);
    if (item) {
        item.cantidad += delta;
        if (item.cantidad <= 0) {
            eliminarDelCarrito(idProducto);
            return;
        }
    }
    actualizarUI();
}

function actualizarUI() {
    const contador = document.getElementById('cartCount');
    const items = document.getElementById('cartItems');
    const vacio = document.getElementById('cartEmpty');
    const pie = document.getElementById('cartFooter');
    const total = document.getElementById('cartTotal');

    const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
    const totalPrecio = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

    contador.textContent = totalItems;

    if (carrito.length === 0) {
        pie.style.display = 'none';
        items.innerHTML = `<div class="cart-empty" id="cartEmpty">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <p>Tu carrito está vacío</p>
        </div>`;
    } else {
        pie.style.display = 'block';
        items.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.imagen}" alt="${item.nombre}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.nombre}</div>
                    <div class="cart-item-price">$${(item.precio * item.cantidad).toLocaleString()}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="actualizarCantidad(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.cantidad}</span>
                        <button class="qty-btn" onclick="actualizarCantidad(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="eliminarDelCarrito(${item.id})">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        `).join('');
    }

    total.textContent = `$${totalPrecio.toLocaleString()}`;
}

function alternarCarrito() {
    document.getElementById('cartOverlay').classList.toggle('open');
    document.getElementById('cartSidebar').classList.toggle('open');
}

// Pago / Checkout
function abrirPago() {
    alternarCarrito();
    setTimeout(() => {
        const modal = document.getElementById('checkoutModal');
        modal.classList.add('open');
        renderizarResumen();
        document.getElementById('checkoutForm').classList.remove('hidden');
        document.getElementById('successView').classList.add('hidden');
    }, 300);
}

function cerrarPago() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function renderizarResumen() {
    const resumen = document.getElementById('orderSummary');
    const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);

    resumen.innerHTML = `
        <h4>Resumen del Pedido</h4>
        ${carrito.map(item => `
            <div class="order-item">
                <span class="order-item-name">${item.nombre} x${item.cantidad}</span>
                <span class="order-item-price">$${(item.precio * item.cantidad).toLocaleString()}</span>
            </div>
        `).join('')}
        <div class="order-total-line">
            <span>Total</span>
            <span class="total-price">$${total.toLocaleString()}</span>
        </div>
    `;
}

function enviarPedido(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('customerName').value;
    const telefono = document.getElementById('customerPhone').value;
    const notas = document.getElementById('customerNotes').value;

    // Validación básica (sin dirección)
    if (!nombre || !telefono) {
        mostrarNotificación('Por favor completa nombre y teléfono.');
        return;
    }

    const total = carrito.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    const listaArticulos = carrito.map(item =>
        `• ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toLocaleString()}`
    ).join('\n');

    const whatsappTienda = '2901464567';
    const detallesPedido = 
        `NUEVO PEDIDO - UMMA ACTIVE\n` +
        `================================\n\n` +
        `DATOS DEL CLIENTE:\n` +
        `Nombre: ${nombre}\n` +
        `WhatsApp: ${telefono}\n` +
        `${notas ? `Notas: ${notas}\n` : ''}\n` +
        `Nro. WhatsApp de contacto (tienda): ${whatsappTienda}\n\n` +
        `================================\n` +
        `ARTÍCULOS DEL PEDIDO:\n` +
        `${listaArticulos}\n\n` +
        `================================\n` +
        `COSTO TOTAL: $${total.toLocaleString()}\n` +
        `================================\n\n` +
        `Fecha: ${new Date().toLocaleString('es-AR')}`;

    // Set order details in hidden field (ahora usa fi-text-message)
    document.getElementById('orderDetails').value = detallesPedido;

    // Getform es mucho más simple - solo enviamos el formulario
    const submitBtn = document.getElementById('confirmBtn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;

    // Enviar formulario con Getform
    evento.target.submit();

    // Mostrar éxito después de un momento
    setTimeout(() => {
        document.getElementById('checkoutForm').classList.add('hidden');
        document.getElementById('successView').classList.remove('hidden');
        
        // Vaciar carrito
        carrito = [];
        actualizarUI();
        
        mostrarNotificación('¡Pedido enviado con éxito!');
        
        // Restaurar botón
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Notificación
function mostrarNotificacion(mensaje) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Navegación
function irASegion(id) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Menú móvil
function alternarMenuMovil() {
    const nav = document.querySelector('.nav-links');
    if (nav.style.display === 'flex') {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'flex';
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = 'rgba(15, 15, 26, 0.98)';
        nav.style.flexDirection = 'column';
        nav.style.padding = '1rem 1.5rem';
        nav.style.borderBottom = '1px solid rgba(139, 92, 246, 0.2)';
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    renderizarProductos();
});
