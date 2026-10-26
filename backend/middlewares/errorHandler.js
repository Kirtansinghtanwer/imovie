const ApiResponse = require("../utils/apiResponse");
const config = require("../config/env");

function notFoundHandler(req, res, next) {
  return ApiResponse.error(res, `Endpoint not found: ${req.method} ${req.originalUrl}`, [], 404);
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let errors = err.errors || [];

  // Mongoose Bad ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid identifier format for field '${err.path}'`;
    errors = [{ field: err.path, message }];
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = "Validation failed";
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
  }

  // Duplicate key (MongoDB E11000)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicatedField = Object.keys(err.keyValue || {})[0] || "field";
    const duplicatedValue = err.keyValue ? err.keyValue[duplicatedField] : "";
    message = `Duplicate value '${duplicatedValue}' for unique field '${duplicatedField}'`;
    errors = [{ field: duplicatedField, message }];
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid authentication token";
    errors = [{ message: "Token signature is invalid" }];
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Authentication token has expired";
    errors = [{ message: "Token has expired, please log in again" }];
  }

  // Only log detailed errors on non-test/internal errors
  if (statusCode >= 500 && config.nodeEnv !== "test") {
    console.error("[ServerError]", err);
  }

  // Don't leak internals in production
  if (config.nodeEnv === "production" && statusCode >= 500) {
    message = "An unexpected server error occurred";
    errors = [];
  }

  return ApiResponse.error(res, message, errors, statusCode);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
