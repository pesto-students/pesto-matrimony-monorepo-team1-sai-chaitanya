// All Errors in this Express Application come here...
// as errorHandler() is middleware function...
// This helps send a customized response after identifying the error.
const ErrorResponse = require('../utilities/errorResponse');
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.log(error);

  // Duplicate Phone/Email Used while Registration
  if (err.code === 11000) {
    const message = `Email / Phone already used for registration.`;
    error = new ErrorResponse(message, 400); // 400 = bad request
  }

  if (err.code === 'E0000001') {
    const message = `password: This password was found in a list of commonly used passwords. Please try another password.`;
    error = new ErrorResponse(message, 400); // 400 = bad request
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    console.log(message);
    error = new ErrorResponse(message.join(' & '), 400);
  }

  res.json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
