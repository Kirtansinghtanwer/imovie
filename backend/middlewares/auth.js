const User = require("../models/User");
const { verifyToken } = require("../utils/jwt");
const ApiResponse = require("../utils/apiResponse");

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ApiResponse.error(res, "Authentication required. Please provide a Bearer token.", [], 401);
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return ApiResponse.error(res, "Invalid authorization token format", [], 401);
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return ApiResponse.error(res, "Authentication token has expired", [], 401);
      }
      return ApiResponse.error(res, "Invalid or corrupt authentication token", [], 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return ApiResponse.error(res, "User associated with this token no longer exists", [], 401);
    }

    if (user.status !== "active") {
      return ApiResponse.error(res, `Account is ${user.status}. Please contact support.`, [], 403);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.error(res, "Authentication required", [], 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        `Access denied. Requires one of: [${allowedRoles.join(", ")}]`,
        [],
        403
      );
    }

    next();
  };
}

async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token) {
        try {
          const decoded = verifyToken(token);
          const user = await User.findById(decoded.id);
          if (user && user.status === "active") {
            req.user = user;
          }
        } catch {
          // Token invalid or expired - ignore for optional auth
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate,
  authorize,
  optionalAuthenticate
};
