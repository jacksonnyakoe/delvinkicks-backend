// Get all products or a single product
const faunadb = require('faunadb');
const q = faunadb.query;

// In-memory storage for demo (replace with FaunaDB, MongoDB, or other database)
let productsStore = require('./data/products-store.json');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get specific product by ID
    const productId = event.queryStringParameters?.id;
    
    if (productId) {
      const product = productsStore.find(p => p.id == productId);
      if (product) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(product)
        };
      } else {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Product not found' })
        };
      }
    }

    // Get all products with optional filters
    const category = event.queryStringParameters?.category;
    let products = productsStore;

    if (category) {
      products = products.filter(p => p.category === category);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        products,
        total: products.length
      })
    };
  } catch (error) {
    console.error('Get products error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Server error fetching products' })
    };
  }
};
