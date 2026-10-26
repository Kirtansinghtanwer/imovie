const { validationResult } = require("express-validator");
const ApiResponse = require("../utils/apiResponse");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return ApiResponse.error(
      res,
      formattedErrors[0]?.message || "Validation failed",
      formattedErrors,
      422
    );
  }
  next();
}

module.exports = validate;
