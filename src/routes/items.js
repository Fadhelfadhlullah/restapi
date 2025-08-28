const express = require('express');
const Item = require('../models/Item');
const {
  validateCreateItem,
  validateUpdateItem,
  validateQueryParams,
  validateIdParam
} = require('../validators/itemValidator');

const router = express.Router();

// GET /api/items - Get all items with filtering and pagination
router.get('/', validateQueryParams, async (req, res) => {
  try {
    const options = req.validatedQuery;

    // Get items and total count
    const [items, totalCount] = await Promise.all([
      Item.findAll(options),
      Item.count(options)
    ]);

    // Calculate pagination info
    const { limit, offset } = options;
    const totalPages = Math.ceil(totalCount / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    res.status(200).json({
      success: true,
      data: items.map(item => item.toJSON()),
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        limit,
        offset,
        hasNextPage,
        hasPrevPage
      },
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

// POST /api/items - Create new item
router.post('/', validateCreateItem, async (req, res) => {
  try {
    const itemData = req.validatedData;

    const newItem = await Item.create(itemData);

    res.status(201).json({
      success: true,
      data: newItem.toJSON(),
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Error in POST /api/items:', error);

    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Item with this name already exists',
        statusCode: 409
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create item',
      statusCode: 500
    });
  }
});

// GET /api/items/:id - Get item by ID
router.get('/:id', validateIdParam, async (req, res) => {
  try {
    const itemId = req.validatedId;

    const item = await Item.findById(itemId);

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
      data: item.toJSON(),
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

// PATCH /api/items/:id - Partial update item
router.patch('/:id', validateIdParam, validateUpdateItem, async (req, res) => {
  try {
    const itemId = req.validatedId;
    const updateData = req.validatedData;

    // Check if item exists
    const existingItem = await Item.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Item with ID ${itemId} not found`,
        statusCode: 404
      });
    }

    const updatedItem = await Item.partialUpdate(itemId, updateData);

    res.status(200).json({
      success: true,
      data: updatedItem.toJSON(),
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Error in PATCH /api/items/:id:', error);

    // Handle specific database errors
    if (error.code === '23505') { // Unique constraint violation
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Item with this name already exists',
        statusCode: 409
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update item',
      statusCode: 500
    });
  }
});

// DELETE /api/items/:id - Delete item
router.delete('/:id', validateIdParam, async (req, res) => {
  try {
    const itemId = req.validatedId;

    // Check if item exists
    const existingItem = await Item.findById(itemId);
    if (!existingItem) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Item with ID ${itemId} not found`,
        statusCode: 404
      });
    }

    const deletedItem = await Item.delete(itemId);

    res.status(200).json({
      success: true,
      data: deletedItem.toJSON(),
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE /api/items/:id:', error);

    // Handle foreign key constraint errors
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'Cannot delete item because it is referenced by other records',
        statusCode: 409
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete item',
      statusCode: 500
    });
  }
});

// GET /api/items/categories - Get all categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Item.getCategories();

    res.status(200).json({
      success: true,
      data: categories,
      count: categories.length,
      message: 'Categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error in GET /api/items/categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to retrieve categories',
      statusCode: 500
    });
  }
});

module.exports = router;
