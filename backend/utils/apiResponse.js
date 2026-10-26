/**
 * Standard API Response Utilities
 * Enforces:
 * Success: { success: true, message: string, data: object/array, ...topLevelProperties }
 * Error: { success: false, message: string, errors: array }
 */

class ApiResponse {
  static success(res, message = "Request completed successfully", data = {}, statusCode = 200) {
    const payload = {
      success: true,
      message,
      data
    };

    // If data is a plain object (not null and not an array), spread top-level keys
    // to provide backward compatibility with frontend consumers expecting res.data.user etc.
    if (data && typeof data === "object" && !Array.isArray(data)) {
      Object.assign(payload, data);
    }

    return res.status(statusCode).json(payload);
  }

  static error(res, message = "An error occurred", errors = [], statusCode = 400) {
    const formattedErrors = Array.isArray(errors) ? errors : [errors];
    return res.status(statusCode).json({
      success: false,
      message,
      errors: formattedErrors
    });
  }
}

module.exports = ApiResponse;
