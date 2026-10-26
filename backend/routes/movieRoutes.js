const express = require("express");
const movieController = require("../controllers/movieController");
const showController = require("../controllers/showController");
const reviewController = require("../controllers/reviewController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// Specific routes before param :id
router.get("/featured", movieController.getFeaturedMovies);
router.get("/now-showing", movieController.getNowShowing);
router.get("/coming-soon", movieController.getComingSoon);

// Shows for movie
router.get("/:movieId/shows", (req, res, next) => {
  req.query.movieId = req.params.movieId;
  return showController.getShows(req, res, next);
});

// Reviews for movie
router.get("/:movieId/reviews", reviewController.getMovieReviews);
router.post("/:movieId/reviews", authenticate, reviewController.submitReview);

// General listings and by ID/slug
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);

// Admin operations (also accessible via /api/movies directly)
router.post("/", authenticate, authorize("admin"), movieController.createMovie);
router.put("/:id", authenticate, authorize("admin"), movieController.updateMovie);
router.patch("/:id", authenticate, authorize("admin"), movieController.updateMovie);
router.delete("/:id", authenticate, authorize("admin"), movieController.deleteMovie);

module.exports = router;
