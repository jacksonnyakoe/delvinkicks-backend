// Create a new product
const fs = require('fs');
const path = require('path');

// Helper to verify admin token
function verifyToken(token) {
  return token && token.length === 64; // Basic validation
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify authentication
    const token = event.headers.authorization?.replace('Bearer ', '');
    if (!verifyToken(token)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const productData = JSON.parse(event.body);

    // Validate required fields
    if (!productData.name || !productData.category || !productData.price) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Create new product
    const newProduct = {
      id: Date.now(),
      name: productData.name,
      category: productData.category,
      description: productData.description || '',
      price: parseInt(productData.price),
      sizes: productData.sizes || '40-45',
      image: productData.image || 'images/default.jpg',
      created: new Date().toISOString()
    };

    // Load existing products
    const productsPath = path.join(__dirname, 'data', 'products-store.json');
    let products = [];
    
    try {
      const data = fs.readFileSync(productsPath, 'utf8');
      products = JSON.parse(data);
    } catch (error) {
      console.log('Creating new products file');
    }

    // Add new product
    products.push(newProduct);

    // Save products
    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        success: true,
        product: newProduct,
        message: 'Product created successfully'
      })
    };
  } catch (error) {
    console.error('Create product error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error creating product' })
    };
  }
};
