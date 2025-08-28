// Global error handling middleware

const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = 500;
  let error = 'Internal Server Error';
  let message = 'Something went wrong on the server';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error = 'Validation Error';
    message = 'Invalid input data';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    error = 'Bad Request';
    message = 'Invalid data format';
  } else if (err.code === '23505') {
    // PostgreSQL unique constraint violation
    statusCode = 409;
    error = 'Conflict';
    message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key constraint violation
    statusCode = 409;
    error = 'Conflict';
    message = 'Cannot delete resource due to dependencies';
  } else if (err.code === '23502') {
    // PostgreSQL not null constraint violation
    statusCode = 400;
    error = 'Bad Request';
    message = 'Required field is missing';
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503;
    error = 'Service Unavailable';
    message = 'Database connection failed';
  } else if (err.statusCode) {
    // Custom error with status code
    statusCode = err.statusCode;
    error = err.error || error;
    message = err.message || message;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error,
    message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler
};
