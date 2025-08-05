const errorMiddleware = (err, req, res, next) => {
    console.error(err); // Log error details for debugging
  
    const statusCode = err.statusCode || 500; // Default to 500 if no status code
    const message = err.message || 'Internal Server Error';
  
    res.status(statusCode).json({ message });
  };
  
  module.exports = errorMiddleware;