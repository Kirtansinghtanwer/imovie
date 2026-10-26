const express = require("express");
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.post("/create-order", authenticate, paymentController.createOrder);
router.post("/verify", authenticate, paymentController.verifyPayment);

module.exports = router;
