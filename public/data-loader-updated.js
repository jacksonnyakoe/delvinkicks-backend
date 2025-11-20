// Updated Data Loader - Fetches from Netlify Functions

const API_BASE = '/.netlify/functions';

document.addEventListener('DOMContentLoaded', function() {
    loadWebsiteProducts();
});

// Load products from API for the main website
async function loadWebsiteProducts() {
    try {
        const response = await fetch(`${API_BASE}/products-get`);
        
        if (!response.ok) {
            console.log('Could not load products from API');
            return;
        }
        
        const data = await response.json();
        const products = data.products || [];
        
        displayProductsOnWebsite(products);
        displayOffersOnWebsite(products);
        displayCategoryProducts(products);
        
    } catch (error) {
        console.log('Error loading products:', error);
    }
}

// Display products in the products section
function displayProductsOnWebsite(products) {
    const productGrid = document.querySelector('#products .product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    const mainProducts = products.slice(0, 8);
    mainProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

// Display offers
function displayOffersOnWebsite(products) {
    const offersGrid = document.querySelector('#offers .product-grid');
    if (!offersGrid) return;
    
    offersGrid.innerHTML = '';
    
    const offerProducts = products.slice(-4);
    
    offerProducts.forEach(product => {
        const productCard = createProductCard(product);
        offersGrid.appendChild(productCard);
    });
}

// Display category products
function displayCategoryProducts(products) {
    const currentPage = window.location.pathname.split('/').pop();
    
    let categoryProducts = [];
    
    switch(currentPage) {
        case 'sneakers.html':
            categoryProducts = products.filter(p => p.category === 'Sneakers');
            break;
        case 'sports-shoes.html':
            categoryProducts = products.filter(p => p.category === 'Sports Shoes');
            break;
        case 'official.html':
            categoryProducts = products.filter(p => p.category === 'Official');
            break;
        case 'slip-ons.html':
            categoryProducts = products.filter(p => p.category === 'Slip Ons');
            break;
    }
    
    if (categoryProducts.length > 0) {
        displayCategoryPageProducts(categoryProducts);
    }
}

// Display products on category page
function displayCategoryPageProducts(products) {
    const categoryGrid = document.querySelector('.category-products .product-grid');
    if (!categoryGrid) return;
    
    categoryGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        categoryGrid.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/default.jpg'">
        <h3>${product.name}</h3>
        <p class="category">${product.category}</p>
        <p class="description">${product.description}</p>
        <p class="price">KES ${product.price.toLocaleString()}</p>
        <p class="sizes">Sizes: ${product.sizes}</p>
        <button class="btn-primary" onclick="orderProduct('${product.name}', ${product.price})">
            Order Now
        </button>
    `;
    
    return card;
}

// Order product function (WhatsApp integration)
function orderProduct(productName, price) {
    const message = `Hi, I would like to order: ${productName} - KES ${price.toLocaleString()}`;
    const whatsappNumber = '254706734109'; // Your WhatsApp number
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}
