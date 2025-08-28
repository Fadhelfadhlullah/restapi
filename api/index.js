// Main API handler for Vercel
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

  const { url } = req;

  try {
    // Health check endpoint
    if (url === '/health') {
      return res.status(200).json({
        success: true,
        message: 'Server is running on Vercel',
        timestamp: new Date().toISOString()
      });
    }

    // Root endpoint
    if (url === '/' || url === '') {
      return res.status(200).json({
        success: true,
        message: 'Welcome to REST API on Vercel',
        version: '1.0.0',
        endpoints: {
          health: '/health',
          items: '/api/items',
          itemById: '/api/items/[id]'
        }
      });
    }

    // 404 for other routes
    res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Route ${url} not found`,
      statusCode: 404
    });

  } catch (error) {
    console.error('Error in main handler:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Something went wrong!',
      statusCode: 500
    });
  }
};
