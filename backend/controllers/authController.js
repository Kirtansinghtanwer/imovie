const User = require("../models/User");
const { signToken } = require("../utils/jwt");
const ApiResponse = require("../utils/apiResponse");

const authController = {
  // POST /api/auth/register
  register: async (req, res, next) => {
    try {
      const { name, email, password, phone, avatar } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return ApiResponse.error(res, "An account with this email address already exists.", [
          { field: "email", message: "Email is already registered" }
        ], 409);
      }

      const passwordHash = await User.hashPassword(password);

      // Public registration strictly assigns role: "user"
      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        phone: phone ? phone.trim() : "",
        avatar: avatar || undefined,
        role: "user",
        status: "active"
      });

      const token = signToken({ id: newUser._id, role: newUser.role });
      const safeUser = newUser.toJSON();

      return ApiResponse.success(
        res,
        "Account created successfully! Welcome to IMovies.",
        { user: safeUser, token },
        201
      );
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/login
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ email: normalizedEmail }).select("+passwordHash");
      if (!user) {
        return ApiResponse.error(res, "Invalid email or password.", [], 401);
      }

      if (user.status !== "active") {
        return ApiResponse.error(
          res,
          `Account is ${user.status}. Please contact support.`,
          [],
          403
        );
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return ApiResponse.error(res, "Invalid email or password.", [], 401);
      }

      const token = signToken({ id: user._id, role: user.role });
      const safeUser = user.toJSON();

      return ApiResponse.success(
        res,
        `Welcome back, ${user.name}!`,
        { user: safeUser, token },
        200
      );
    } catch (error) {
      next(error);
    }
  },

  // GET /api/auth/me
  me: async (req, res, next) => {
    try {
      return ApiResponse.success(res, "User profile retrieved successfully", {
        user: req.user.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/auth/logout
  logout: async (req, res, next) => {
    try {
      return ApiResponse.success(res, "Logged out successfully", {});
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
