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
let categories = [
    { id: 'calzas', name: 'Calzas Deportivas' },
    { id: 'corpiño', name: 'Corpiño Deportivo' },
    { id: 'top', name: 'Top Deportivo' }
];
let uploadedImages = {}; // Almacenar imágenes subidas

// Inicializar cuando carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCategories();
    setupForm();
    setupImageUpload();
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
        productos = [...DEFAULT_PRODUCTS.map(p => ({...p, stock: 10}))]; // Agregar stock por defecto
        saveProducts();
    }
    renderProducts();
}

// Cargar categorías desde localStorage
function loadCategories() {
    const stored = localStorage.getItem('umma_categories');
    if (stored) {
        categories = JSON.parse(stored);
    } else {
        localStorage.setItem('umma_categories', JSON.stringify(categories));
    }
    renderCategories();
    updateCategorySelect();
}

// Guardar categorías en localStorage
function saveCategories() {
    localStorage.setItem('umma_categories', JSON.stringify(categories));
}

// Configurar subida de imágenes
function setupImageUpload() {
    const fileInput = document.getElementById('productImageFile');
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Convertir imagen a base64
function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
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
async function saveProduct() {
    const fileInput = document.getElementById('productImageFile');
    const file = fileInput.files[0];
    
    // Validar que se haya subido una imagen solo para productos nuevos
    if (!file && !editingProductId) {
        showMessage('Por favor sube una imagen del producto', 'error');
        return;
    }

    let imageUrl = '';
    
    // Si hay una nueva imagen, convertirla a base64
    if (file) {
        try {
            imageUrl = await imageToBase64(file);
        } catch (error) {
            showMessage('Error al procesar la imagen', 'error');
            return;
        }
    } else if (editingProductId) {
        // Si estamos editando y no hay nueva imagen, mantener la imagen existente
        const existingProduct = productos.find(p => p.id === editingProductId);
        imageUrl = existingProduct.imagen;
    }

    const productData = {
        nombre: document.getElementById('productName').value,
        categoria: document.getElementById('productCategory').value,
        precio: parseInt(document.getElementById('productPrice').value),
        precioOriginal: document.getElementById('productOriginalPrice').value ? 
                        parseInt(document.getElementById('productOriginalPrice').value) : null,
        stock: parseInt(document.getElementById('productStock').value),
        imagen: imageUrl,
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
    document.getElementById('productStock').value = product.stock || 10;
    document.getElementById('productLabel').value = product.etiqueta || '';

    // Mostrar imagen existente
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');
    previewImg.src = product.imagen;
    preview.style.display = 'block';
    
    // Limpiar input de archivo para evitar confusión
    document.getElementById('productImageFile').value = '';
    
    // Actualizar texto de ayuda para edición
    document.getElementById('imageHelp').textContent = 'Opcional: Sube una nueva imagen para reemplazar la actual';

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
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('imageHelp').textContent = 'Sube una imagen desde tu computadora';
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
                    <br><strong>Stock:</strong> ${product.stock || 0} unidades
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

// Funciones de Gestión de Categorías
function addCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    
    if (!categoryName) {
        showMessage('Por favor ingresa un nombre para la categoría', 'error');
        return;
    }
    
    // Verificar si ya existe
    if (categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
        showMessage('Esta categoría ya existe', 'error');
        return;
    }
    
    // Crear ID a partir del nombre
    const categoryId = categoryName.toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
    
    const newCategory = {
        id: categoryId,
        name: categoryName
    };
    
    categories.push(newCategory);
    saveCategories();
    renderCategories();
    updateCategorySelect();
    
    // Limpiar input
    document.getElementById('newCategoryName').value = '';
    
    showMessage('Categoría agregada con éxito', 'success');
}

function editCategory(id) {
    const category = categories.find(cat => cat.id === id);
    if (!category) return;
    
    const newName = prompt('Editar nombre de la categoría:', category.name);
    if (newName && newName.trim() && newName.trim() !== category.name) {
        category.name = newName.trim();
        saveCategories();
        renderCategories();
        updateCategorySelect();
        showMessage('Categoría actualizada con éxito', 'success');
    }
}

function deleteCategory(id) {
    // Verificar si hay productos usando esta categoría
    const productsInCategory = productos.filter(p => p.categoria === id);
    if (productsInCategory.length > 0) {
        showMessage(`No se puede eliminar la categoría. Hay ${productsInCategory.length} productos usándola.`, 'error');
        return;
    }
    
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        categories = categories.filter(cat => cat.id !== id);
        saveCategories();
        renderCategories();
        updateCategorySelect();
        showMessage('Categoría eliminada con éxito', 'success');
    }
}

function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    
    if (categories.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No hay categorías agregadas</p>';
        return;
    }
    
    container.innerHTML = categories.map(category => `
        <div class="category-item">
            <span class="category-name">${category.name}</span>
            <div class="category-actions">
                <button class="btn-edit" onclick="editCategory('${category.id}')">✏️</button>
                <button class="btn-delete" onclick="deleteCategory('${category.id}')">🗑️</button>
            </div>
        </div>
    `).join('');
}

function updateCategorySelect() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Seleccionar categoría</option>' + 
        categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
}
