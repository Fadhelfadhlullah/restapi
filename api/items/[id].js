// GET /api/items/[id] - Get item by ID
const path = require('path');
const fs = require('fs');

// Helper function to read items data
const getItemsData = () => {
  try {
    // In Vercel, we need to read from the correct path
    const dataPath = path.join(process.cwd(), 'data', 'items.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading items data:', error);
    // Fallback data if file not found
    return [
      {
        "id": 1,
        "name": "Laptop Gaming",
        "description": "High-performance gaming laptop with RTX graphics",
        "price": 15000000,
        "category": "electronics",
        "stock": 5,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Wireless Mouse",
        "description": "Ergonomic wireless mouse with RGB lighting",
        "price": 250000,
        "category": "accessories",
        "stock": 20,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      {
        "id": 3,
        "name": "Mechanical Keyboard",
        "description": "RGB mechanical keyboard with blue switches",
        "price": 800000,
        "category": "accessories",
        "stock": 15,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ];
  }
};

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET method for this endpoint
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed',
      message: 'Only GET method is allowed for this endpoint',
      statusCode: 405
    });
  }

  try {
    const { id } = req.query;
    
    // Validate ID format
    const itemId = parseInt(id);
    if (isNaN(itemId) || itemId <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Invalid ID format. ID must be a positive integer.',
        statusCode: 400
      });
    }
    
    const items = getItemsData();
    const item = items.find(item => item.id === itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Item with ID ${itemId} not found`,
        statusCode: 404
      });
    }
    
    res.status(200).json({
      success: true,
      data: item,
      message: 'Item retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/items/[id]:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve item',
      statusCode: 500
    });
  }
};
