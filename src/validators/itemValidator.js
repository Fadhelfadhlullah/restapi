const Joi = require('joi');

// Validation schemas
const createItemSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number',
      'any.required': 'Price is required'
    }),
  
  category: Joi.string()
    .min(1)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category must be at least 1 character long',
      'string.max': 'Category must not exceed 50 characters',
      'any.required': 'Category is required'
    }),
  
  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock must be 0 or greater',
      'any.required': 'Stock is required'
    })
});

const updateItemSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name must not exceed 100 characters'
    }),
  
  description: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 500 characters'
    }),
  
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be a positive number'
    }),
  
  category: Joi.string()
    .min(1)
    .max(50)
    .optional()
    .messages({
      'string.empty': 'Category cannot be empty',
      'string.min': 'Category must be at least 1 character long',
      'string.max': 'Category must not exceed 50 characters'
    }),
  
  stock: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.base': 'Stock must be a number',
      'number.integer': 'Stock must be an integer',
      'number.min': 'Stock must be 0 or greater'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

const queryParamsSchema = Joi.object({
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(50)
    .optional(),
  
  offset: Joi.number()
    .integer()
    .min(0)
    .default(0)
    .optional(),
  
  page: Joi.number()
    .integer()
    .min(1)
    .optional(),
  
  category: Joi.string()
    .max(50)
    .optional(),
  
  search: Joi.string()
    .max(100)
    .optional(),
  
  sortBy: Joi.string()
    .valid('id', 'name', 'price', 'category', 'stock', 'created_at', 'updated_at')
    .default('created_at')
    .optional(),
  
  sortOrder: Joi.string()
    .valid('ASC', 'DESC', 'asc', 'desc')
    .default('DESC')
    .optional()
});

const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'ID must be a number',
      'number.integer': 'ID must be an integer',
      'number.positive': 'ID must be a positive number',
      'any.required': 'ID is required'
    })
});

// Validation middleware functions
const validateCreateItem = (req, res, next) => {
  const { error, value } = createItemSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors,
      statusCode: 400
    });
  }
  
  req.validatedData = value;
  next();
};

const validateUpdateItem = (req, res, next) => {
  const { error, value } = updateItemSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors,
      statusCode: 400
    });
  }
  
  req.validatedData = value;
  next();
};

const validateQueryParams = (req, res, next) => {
  const { error, value } = queryParamsSchema.validate(req.query, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid query parameters',
      details: errors,
      statusCode: 400
    });
  }
  
  // Handle pagination
  if (value.page && !value.offset) {
    value.offset = (value.page - 1) * value.limit;
  }
  
  req.validatedQuery = value;
  next();
};

const validateIdParam = (req, res, next) => {
  const { error, value } = idParamSchema.validate({ id: parseInt(req.params.id) }, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid ID parameter',
      details: errors,
      statusCode: 400
    });
  }
  
  req.validatedId = value.id;
  next();
};

module.exports = {
  validateCreateItem,
  validateUpdateItem,
  validateQueryParams,
  validateIdParam,
  createItemSchema,
  updateItemSchema,
  queryParamsSchema,
  idParamSchema
};
