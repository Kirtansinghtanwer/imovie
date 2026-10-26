const express = require("express");
const showController = require("../controllers/showController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

router.get("/", showController.getShows);
router.get("/:id", showController.getShowById);
router.get("/:showId/seats", showController.getSeatLayout);

// Admin operations
router.post("/", authenticate, authorize("admin"), showController.createShow);
router.put("/:id", authenticate, authorize("admin"), showController.updateShow);
router.patch("/:id", authenticate, authorize("admin"), showController.updateShow);
router.delete("/:id", authenticate, authorize("admin"), showController.deleteShow);

module.exports = router;
