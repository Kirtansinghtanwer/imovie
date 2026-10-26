const mongoose = require("mongoose");
const Favorite = require("../models/Favorite");
const Movie = require("../models/Movie");
const ApiResponse = require("../utils/apiResponse");

const favoriteController = {
  // GET /api/favorites
  getFavorites: async (req, res, next) => {
    try {
      const favorites = await Favorite.find({ user: req.user._id })
        .populate("movie")
        .sort({ createdAt: -1 });

      const favoriteMovies = favorites
        .filter((f) => f.movie != null)
        .map((f) => f.movie.toJSON());

      return ApiResponse.success(res, "Favorites retrieved successfully", {
        favorites: favoriteMovies,
        total: favoriteMovies.length
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/favorites/:movieId
  addFavorite: async (req, res, next) => {
    try {
      const { movieId } = req.params;

      let movie = null;
      if (mongoose.Types.ObjectId.isValid(movieId)) {
        movie = await Movie.findById(movieId);
      } else {
        movie = await Movie.findOne({ slug: movieId });
      }

      if (!movie) {
        return ApiResponse.error(res, "Movie not found", [], 404);
      }

      const existing = await Favorite.findOne({
        user: req.user._id,
        movie: movie._id
      });

      if (existing) {
        return ApiResponse.success(res, "Movie is already in favorites", {
          movie: movie.toJSON()
        });
      }

      await Favorite.create({
        user: req.user._id,
        movie: movie._id
      });

      return ApiResponse.success(
        res,
        "Movie added to favorites",
        { movie: movie.toJSON() },
        201
      );
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/favorites/:movieId
  removeFavorite: async (req, res, next) => {
    try {
      const { movieId } = req.params;

      let movie = null;
      if (mongoose.Types.ObjectId.isValid(movieId)) {
        movie = await Movie.findById(movieId);
      } else {
        movie = await Movie.findOne({ slug: movieId });
      }

      if (!movie) {
        return ApiResponse.error(res, "Movie not found", [], 404);
      }

      await Favorite.findOneAndDelete({
        user: req.user._id,
        movie: movie._id
      });

      return ApiResponse.success(res, "Movie removed from favorites", {
        movieId: movie._id.toString()
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = favoriteController;
