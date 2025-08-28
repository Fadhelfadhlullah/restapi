const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Helper function to read items data
const getItemsData = () => {
  try {
    const dataPath = path.join(__dirname, '../data/items.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading items data:', error);
    return [];
  }
};

// GET /api/items - Get all items
router.get('/', (req, res) => {
  try {
    const items = getItemsData();

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
      message: 'Items retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/items:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve items',
      statusCode: 500
    });
  }
});

// GET /api/items/:id - Get item by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;

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
    console.error('Error in GET /api/items/:id:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve item',
      statusCode: 500
    });
  }
});

module.exports = router;
