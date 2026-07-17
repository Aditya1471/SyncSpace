const errorHandler = (err, req, res, next) => {

  console.error(err);

  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = "Room already exists";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    message,
  });

};

module.exports = errorHandler;