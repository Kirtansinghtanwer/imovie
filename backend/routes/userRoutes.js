const express = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/me", authenticate, userController.getProfile);
router.get("/profile", authenticate, userController.getProfile);
router.patch("/me", authenticate, userController.updateProfile);
router.put("/profile", authenticate, userController.updateProfile);
router.patch("/me/password", authenticate, userController.changePassword);
router.put("/me/password", authenticate, userController.changePassword);

module.exports = router;
