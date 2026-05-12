// Panel Admin - Súper Simple para UMMA ACTIVE

// Contraseña simple (puedes cambiarla)
const ADMIN_PASSWORD = 'admin123';

// Productos por defecto si no hay nada en localStorage
const DEFAULT_PRODUCTS = [
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

// Variables globales
let productos = [];
let editingProductId = null;

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupForm();
});

// Funciones de Login
function login() {
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
    } else {
        document.getElementById('loginError').style.display = 'block';
        document.getElementById('adminPassword').value = '';
    }
}

function logout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
    cancelEdit();
}

// Enter para login
document.getElementById('adminPassword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});

// Cargar productos desde localStorage
function loadProducts() {
    const stored = localStorage.getItem('umma_products');
    if (stored) {
        productos = JSON.parse(stored);
    } else {
        productos = [...DEFAULT_PRODUCTS];
        saveProducts();
    }
    renderProducts();
}

// Guardar productos en localStorage
function saveProducts() {
    localStorage.setItem('umma_products', JSON.stringify(productos));
}

// Configurar formulario
function setupForm() {
    const form = document.getElementById('productForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
}

// Guardar producto (nuevo o editado)
function saveProduct() {
    const productData = {
        nombre: document.getElementById('productName').value,
        categoria: document.getElementById('productCategory').value,
        precio: parseInt(document.getElementById('productPrice').value),
        precioOriginal: document.getElementById('productOriginalPrice').value ? 
                        parseInt(document.getElementById('productOriginalPrice').value) : null,
        imagen: document.getElementById('productImage').value,
        etiqueta: document.getElementById('productLabel').value || null
    };

    if (editingProductId) {
        // Editar producto existente
        const index = productos.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            productos[index] = { ...productData, id: editingProductId };
            showMessage('Producto actualizado con éxito', 'success');
        }
    } else {
        // Agregar nuevo producto
        const newProduct = {
            ...productData,
            id: Date.now() // ID único basado en timestamp
        };
        productos.push(newProduct);
        showMessage('Producto agregado con éxito', 'success');
    }

    saveProducts();
    renderProducts();
    resetForm();
}

// Editar producto
function editProduct(id) {
    const product = productos.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;
    
    // Llenar formulario con datos del producto
    document.getElementById('productName').value = product.nombre;
    document.getElementById('productCategory').value = product.categoria;
    document.getElementById('productPrice').value = product.precio;
    document.getElementById('productOriginalPrice').value = product.precioOriginal || '';
    document.getElementById('productImage').value = product.imagen;
    document.getElementById('productLabel').value = product.etiqueta || '';

    // Cambiar título y mostrar botón cancelar
    document.getElementById('formTitle').textContent = '✏️ Editar Producto';
    document.getElementById('cancelBtn').style.display = 'block';
    
    // Scroll al formulario
    document.querySelector('.product-form').scrollIntoView({ behavior: 'smooth' });
}

// Eliminar producto
function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        saveProducts();
        renderProducts();
        showMessage('Producto eliminado con éxito', 'success');
    }
}

// Cancelar edición
function cancelEdit() {
    resetForm();
}

// Resetear formulario
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('formTitle').textContent = '➕ Agregar Nuevo Producto';
    document.getElementById('cancelBtn').style.display = 'none';
    editingProductId = null;
}

// Renderizar lista de productos
function renderProducts() {
    const container = document.getElementById('productsContainer');
    
    if (productos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No hay productos agregados</p>';
        return;
    }

    container.innerHTML = productos.map(product => `
        <div class="product-item">
            <div class="product-info">
                <div class="product-name">${product.nombre}</div>
                <div class="product-details">
                    <strong>Categoría:</strong> ${getCategoryName(product.categoria)}<br>
                    <strong>Precio:</strong> $${product.precio.toLocaleString()}
                    ${product.precioOriginal ? `<br><strong>Original:</strong> $${product.precioOriginal.toLocaleString()}` : ''}
                    ${product.etiqueta ? `<br><strong>Etiqueta:</strong> ${product.etiqueta}` : ''}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct(${product.id})">✏️ Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

// Obtener nombre de categoría
function getCategoryName(category) {
    const names = {
        'calzas': 'Calzas Deportivas',
        'corpiño': 'Corpiño Deportivo',
        'top': 'Top Deportivo'
    };
    return names[category] || category;
}

// Mostrar mensaje
function showMessage(message, type) {
    // Eliminar mensajes anteriores
    const existingMessage = document.querySelector('.success-message, .error-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Crear nuevo mensaje
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    
    // Insertar al principio del main
    const main = document.querySelector('main');
    main.insertBefore(messageDiv, main.firstChild);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
