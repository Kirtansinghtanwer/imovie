const express = require("express");
const theatreController = require("../controllers/theatreController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

router.get("/", theatreController.getTheatres);
router.get("/:id", theatreController.getTheatreById);
router.get("/:id/screens", theatreController.getTheatreScreens);

// Admin operations
router.post("/", authenticate, authorize("admin"), theatreController.createTheatre);
router.put("/:id", authenticate, authorize("admin"), theatreController.updateTheatre);
router.patch("/:id", authenticate, authorize("admin"), theatreController.updateTheatre);
router.delete("/:id", authenticate, authorize("admin"), theatreController.deleteTheatre);

module.exports = router;
