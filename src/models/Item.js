const { query, transaction } = require('../config/database');

class Item {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.category = data.category;
    this.stock = data.stock;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Get all items with optional filtering and pagination
  static async findAll(options = {}) {
    const { 
      limit = 50, 
      offset = 0, 
      category, 
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    let queryText = `
      SELECT id, name, description, price, category, stock, created_at, updated_at
      FROM items
      WHERE 1=1
    `;
    const queryParams = [];
    let paramCount = 0;

    // Add category filter
    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    // Add search filter
    if (search) {
      paramCount++;
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    // Add sorting
    const allowedSortFields = ['id', 'name', 'price', 'category', 'stock', 'created_at', 'updated_at'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    if (allowedSortFields.includes(sortBy) && allowedSortOrders.includes(sortOrder.toUpperCase())) {
      queryText += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
    }

    // Add pagination
    paramCount++;
    queryText += ` LIMIT $${paramCount}`;
    queryParams.push(limit);

    paramCount++;
    queryText += ` OFFSET $${paramCount}`;
    queryParams.push(offset);

    const result = await query(queryText, queryParams);
    return result.rows.map(row => new Item(row));
  }

  // Get total count for pagination
  static async count(options = {}) {
    const { category, search } = options;

    let queryText = 'SELECT COUNT(*) FROM items WHERE 1=1';
    const queryParams = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      queryText += ` AND category = $${paramCount}`;
      queryParams.push(category);
    }

    if (search) {
      paramCount++;
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }

    const result = await query(queryText, queryParams);
    return parseInt(result.rows[0].count);
  }

  // Find item by ID
  static async findById(id) {
    const queryText = `
      SELECT id, name, description, price, category, stock, created_at, updated_at
      FROM items
      WHERE id = $1
    `;
    const result = await query(queryText, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Item(result.rows[0]);
  }

  // Create new item
  static async create(itemData) {
    const { name, description, price, category, stock } = itemData;
    
    const queryText = `
      INSERT INTO items (name, description, price, category, stock)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, name, description, price, category, stock, created_at, updated_at
    `;
    
    const result = await query(queryText, [name, description, price, category, stock]);
    return new Item(result.rows[0]);
  }

  // Update item
  static async update(id, itemData) {
    const { name, description, price, category, stock } = itemData;
    
    const queryText = `
      UPDATE items
      SET name = $2, description = $3, price = $4, category = $5, stock = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, description, price, category, stock, created_at, updated_at
    `;
    
    const result = await query(queryText, [id, name, description, price, category, stock]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Item(result.rows[0]);
  }

  // Partial update item
  static async partialUpdate(id, itemData) {
    const fields = [];
    const values = [id];
    let paramCount = 1;

    // Build dynamic query for partial updates
    Object.keys(itemData).forEach(key => {
      if (['name', 'description', 'price', 'category', 'stock'].includes(key)) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(itemData[key]);
      }
    });

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    const queryText = `
      UPDATE items
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, name, description, price, category, stock, created_at, updated_at
    `;

    const result = await query(queryText, values);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Item(result.rows[0]);
  }

  // Delete item
  static async delete(id) {
    const queryText = 'DELETE FROM items WHERE id = $1 RETURNING *';
    const result = await query(queryText, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Item(result.rows[0]);
  }

  // Check if item exists
  static async exists(id) {
    const queryText = 'SELECT 1 FROM items WHERE id = $1';
    const result = await query(queryText, [id]);
    return result.rows.length > 0;
  }

  // Get categories
  static async getCategories() {
    const queryText = 'SELECT DISTINCT category FROM items ORDER BY category';
    const result = await query(queryText);
    return result.rows.map(row => row.category);
  }

  // Bulk operations
  static async bulkCreate(itemsData) {
    return await transaction(async (client) => {
      const results = [];
      for (const itemData of itemsData) {
        const { name, description, price, category, stock } = itemData;
        const queryText = `
          INSERT INTO items (name, description, price, category, stock)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, name, description, price, category, stock, created_at, updated_at
        `;
        const result = await client.query(queryText, [name, description, price, category, stock]);
        results.push(new Item(result.rows[0]));
      }
      return results;
    });
  }

  // Instance methods
  async save() {
    if (this.id) {
      return await Item.update(this.id, this);
    } else {
      return await Item.create(this);
    }
  }

  async delete() {
    if (!this.id) {
      throw new Error('Cannot delete item without ID');
    }
    return await Item.delete(this.id);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: parseFloat(this.price),
      category: this.category,
      stock: this.stock,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Item;
