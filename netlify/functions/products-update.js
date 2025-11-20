// Update an existing product
const fs = require('fs');
const path = require('path');

function verifyToken(token) {
  return token && token.length === 64;
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'PUT, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const token = event.headers.authorization?.replace('Bearer ', '');
    if (!verifyToken(token)) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const { id, ...updateData } = JSON.parse(event.body);

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Product ID is required' })
      };
    }

    const productsPath = path.join(__dirname, 'data', 'products-store.json');
    let products = [];
    
    try {
      const data = fs.readFileSync(productsPath, 'utf8');
      products = JSON.parse(data);
    } catch (error) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Products data not found' })
      };
    }

    const productIndex = products.findIndex(p => p.id == id);
    
    if (productIndex === -1) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Product not found' })
      };
    }

    // Update product
    products[productIndex] = {
      ...products[productIndex],
      ...updateData,
      id: parseInt(id), // Preserve original ID
      updated: new Date().toISOString()
    };

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        product: products[productIndex],
        message: 'Product updated successfully'
      })
    };
  } catch (error) {
    console.error('Update product error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error updating product' })
    };
  }
};
