const express = require("express");
const favoriteController = require("../controllers/favoriteController");
const { authenticate } = require("../middlewares/auth");

const router = express.Router();

router.get("/", authenticate, favoriteController.getFavorites);
router.post("/:movieId", authenticate, favoriteController.addFavorite);
router.delete("/:movieId", authenticate, favoriteController.removeFavorite);

module.exports = router;
