const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// This asyncHanlder() will wrap around all controller methods which do DB operations...
// If there is an error in DB Operation, asyncHandler() catches that error...
// Then passes it to errorHandler() middleware...
// Then the errorHandler middleware gives JSON as response.
