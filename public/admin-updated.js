// Updated Admin JavaScript for Delvin Kicks with Netlify Functions Integration

// API Base URL - update this to your Netlify site URL
const API_BASE = '/.netlify/functions';

// Authentication token storage
let authToken = localStorage.getItem('adminToken');

// Check if user is authenticated
async function checkAuth() {
    const token = localStorage.getItem('adminToken');
    
    if (!token && !window.location.href.includes('admin.html')) {
        window.location.href = 'admin.html';
        return false;
    }
    
    if (token) {
        try {
            const response = await fetch(`${API_BASE}/auth-verify`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!data.valid) {
                localStorage.removeItem('adminToken');
                window.location.href = 'admin.html';
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }
    
    return false;
}

// Initialize admin system
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.href.includes('admin.html')) {
        initializeLogin();
    } else if (window.location.href.includes('dashboard.html')) {
        checkAuth().then(isAuth => {
            if (isAuth) {
                initializeDashboard();
            }
        });
    }
});

// Login System
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            try {
                const response = await fetch(`${API_BASE}/auth-login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (data.success && data.token) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminUsername', data.username);
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = data.message || 'Invalid credentials';
                    errorMessage.classList.remove('d-none');
                    setTimeout(() => {
                        errorMessage.classList.add('d-none');
                    }, 3000);
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = 'Server connection error';
                errorMessage.classList.remove('d-none');
            }
        });
    }
}

// Dashboard System
function initializeDashboard() {
    loadProducts();
    setupEventListeners();
    updateStatistics();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.sidebar .nav-link[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUsername');
            window.location.href = 'admin.html';
        });
    }
    
    // Add Product Form
    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
}

// Show specific section
function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.style.display = 'block';
        
        if (sectionName === 'products') {
            displayProducts();
        } else if (sectionName === 'dashboard') {
            updateStatistics();
            displayRecentProducts();
        }
    }
}

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products-get`);
        
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error('Load products error:', error);
        return [];
    }
}

// Handle adding new product
async function handleAddProduct(e) {
    e.preventDefault();
    
    const token = localStorage.getItem('adminToken');
    
    const product = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        price: parseInt(document.getElementById('product-price').value),
        sizes: document.getElementById('product-sizes').value,
        image: document.getElementById('product-image-url').value || 'images/default.jpg'
    };
    
    try {
        const response = await fetch(`${API_BASE}/products-create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        
        const data = await response.json();
        
        if (data.success) {
            e.target.reset();
            alert('Product added successfully!');
            showSection('products');
            document.querySelector('[data-section="products"]').click();
        } else {
            alert('Failed to add product: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Add product error:', error);
        alert('Error adding product');
    }
}

// Display products
async function displayProducts() {
    const products = await loadProducts();
    const productsList = document.getElementById('products-list');
    
    if (!productsList) return;
    
    if (products.length === 0) {
        productsList.innerHTML = '<div class="alert alert-info">No products found. Add your first product!</div>';
        return;
    }
    
    productsList.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/default.jpg'">
                </div>
                <div class="col-md-6">
                    <h5>${product.name}</h5>
                    <p class="text-muted mb-1">${product.description}</p>
                    <small class="text-muted">Category: ${product.category} | Sizes: ${product.sizes}</small>
                </div>
                <div class="col-md-2">
                    <h4 class="text-primary">KES ${product.price.toLocaleString()}</h4>
                </div>
                <div class="col-md-2 text-end">
                    <button class="btn btn-sm btn-warning btn-action" onclick="editProduct(${product.id})">
                        <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger btn-action" onclick="deleteProduct(${product.id})">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display recent products
async function displayRecentProducts() {
    const products = await loadProducts();
    const recentProductsSection = document.getElementById('recent-products');
    
    if (!recentProductsSection) return;
    
    const recentProducts = products.slice(-3).reverse();
    
    if (recentProducts.length === 0) {
        recentProductsSection.innerHTML = '<div class="alert alert-info">No products yet. Add your first product!</div>';
        return;
    }
    
    recentProductsSection.innerHTML = recentProducts.map(product => `
        <div class="product-card">
            <div class="row align-items-center">
                <div class="col-md-2">
                    <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='images/default.jpg'">
                </div>
                <div class="col-md-6">
                    <h5>${product.name}</h5>
                    <small class="text-muted">Category: ${product.category}</small>
                </div>
                <div class="col-md-2">
                    <h5 class="text-primary">KES ${product.price.toLocaleString()}</h5>
                </div>
                <div class="col-md-2">
                    <small class="text-muted">${new Date(product.created).toLocaleDateString()}</small>
                </div>
            </div>
        </div>
    `).join('');
}

// Update dashboard statistics
async function updateStatistics() {
    const products = await loadProducts();
    
    document.getElementById('total-products').textContent = products.length;
    
    const categories = [...new Set(products.map(p => p.category))];
    document.getElementById('total-categories').textContent = categories.length;
    
    const avgPrice = products.length > 0 
        ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)
        : 0;
    document.getElementById('avg-price').textContent = avgPrice.toLocaleString();
    
    const lastUpdated = products.length > 0
        ? new Date(Math.max(...products.map(p => new Date(p.created)))).toLocaleDateString()
        : 'Never';
    document.getElementById('last-updated').textContent = lastUpdated;
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const token = localStorage.getItem('adminToken');
    
    try {
        const response = await fetch(`${API_BASE}/products-delete?id=${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Product deleted successfully!');
            displayProducts();
            updateStatistics();
        } else {
            alert('Failed to delete product: ' + (data.error || 'Unknown error'));
        }
    } catch (error) {
        console.error('Delete product error:', error);
        alert('Error deleting product');
    }
}

// Edit product (placeholder - implement modal or form)
async function editProduct(productId) {
    alert('Edit functionality - to be implemented with a modal form');
    // TODO: Show edit modal with product data
}

// Export products
async function exportProducts() {
    const products = await loadProducts();
    
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'products-backup.json');
    linkElement.click();
}
