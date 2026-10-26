const User = require("../models/User");
const ApiResponse = require("../utils/apiResponse");

const userController = {
  // GET /api/users/me & /api/users/profile
  getProfile: async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      return ApiResponse.success(res, "Profile retrieved successfully", {
        user: user.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/users/me & PUT /api/users/profile
  updateProfile: async (req, res, next) => {
    try {
      const { name, phone, avatar } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return ApiResponse.error(res, "User not found", [], 404);
      }

      if (name && name.trim()) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (avatar !== undefined) user.avatar = avatar.trim();

      // Ensure ordinary users cannot change their role or status!
      await user.save();

      return ApiResponse.success(res, "Profile updated successfully", {
        user: user.toJSON()
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/users/me/password
  changePassword: async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return ApiResponse.error(
          res,
          "Both currentPassword and newPassword are required",
          [],
          422
        );
      }

      if (newPassword.length < 6) {
        return ApiResponse.error(
          res,
          "New password must be at least 6 characters long",
          [],
          422
        );
      }

      const user = await User.findById(req.user._id).select("+passwordHash");
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return ApiResponse.error(res, "Current password is incorrect", [], 400);
      }

      user.passwordHash = await User.hashPassword(newPassword);
      await user.save();

      return ApiResponse.success(res, "Password changed successfully", {});
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
