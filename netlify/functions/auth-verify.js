// Verify authentication token
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
    const token = event.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ valid: false, message: 'No token provided' })
      };
    }

    // In production, verify token against database or session store
    // For now, basic validation
    if (token.length === 64) { // Simple check for hex token
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          valid: true,
          message: 'Token is valid'
        })
      };
    } else {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ valid: false, message: 'Invalid token' })
      };
    }
  } catch (error) {
    console.error('Verify error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ valid: false, message: 'Server error' })
    };
  }
};
