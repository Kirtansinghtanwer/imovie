const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.patch("/:id", authenticate, reviewController.updateReview);
router.put("/:id", authenticate, reviewController.updateReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

module.exports = router;
