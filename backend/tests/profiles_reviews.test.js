const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const Movie = require("../models/Movie");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const Review = require("../models/Review");
const { signToken } = require("../utils/jwt");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/imovies_test_profiles_reviews";

let user1;
let user1Token;
let user2;
let user2Token;
let movie;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await Promise.all([
    Movie.deleteMany({}),
    User.deleteMany({}),
    Favorite.deleteMany({}),
    Review.deleteMany({})
  ]);

  user1 = await User.create({
    name: "User One",
    email: "userone@test.com",
    passwordHash: await User.hashPassword("Password@123"),
    role: "user",
    status: "active"
  });
  user1Token = signToken({ id: user1._id, role: user1.role });

  user2 = await User.create({
    name: "User Two",
    email: "usertwo@test.com",
    passwordHash: await User.hashPassword("Password@456"),
    role: "user",
    status: "active"
  });
  user2Token = signToken({ id: user2._id, role: user2.role });

  movie = await Movie.create({
    title: "Gladiator II",
    slug: "gladiator-ii",
    synopsis: "Years after witnessing the death of Maximus.",
    posterUrl: "https://example.com/gladiator.jpg",
    genres: ["Action", "Drama"],
    language: "English",
    durationMinutes: 148,
    releaseDate: new Date("2024-11-22"),
    releaseStatus: "now-showing",
    averageRating: 0,
    reviewCount: 0
  });
});

afterAll(async () => {
  try {
    await Promise.all([
      Movie.deleteMany({}),
      User.deleteMany({}),
      Favorite.deleteMany({}),
      Review.deleteMany({})
    ]);
    await mongoose.connection.close();
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

describe("User Profile, Favorites & Reviews APIs", () => {
  it("PATCH /api/users/me should update profile fields", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        name: "User One Updated",
        phone: "+1 555-9988"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.name).toBe("User One Updated");
    expect(res.body.data.user.phone).toBe("+1 555-9988");
  });

  it("POST /api/favorites/:movieId should add movie to favorites", async () => {
    const res = await request(app)
      .post(`/api/favorites/${movie._id}`)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    const getRes = await request(app)
      .get("/api/favorites")
      .set("Authorization", `Bearer ${user1Token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.data.favorites.length).toBe(1);
    expect(getRes.body.data.favorites[0].title).toBe("Gladiator II");
  });

  it("DELETE /api/favorites/:movieId should remove movie from favorites", async () => {
    const res = await request(app)
      .delete(`/api/favorites/${movie._id}`)
      .set("Authorization", `Bearer ${user1Token}`);

    expect(res.statusCode).toBe(200);

    const getRes = await request(app)
      .get("/api/favorites")
      .set("Authorization", `Bearer ${user1Token}`);

    expect(getRes.body.data.favorites.length).toBe(0);
  });

  let createdReviewId;

  it("POST /api/movies/:movieId/reviews should submit review and recalculate movie rating", async () => {
    const res = await request(app)
      .post(`/api/movies/${movie._id}/reviews`)
      .set("Authorization", `Bearer ${user1Token}`)
      .send({
        rating: 9,
        reviewText: "Spectacular cinematic experience!"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.review.rating).toBe(9);
    createdReviewId = res.body.data.review._id || res.body.data.review.id;

    // Check movie average rating was updated
    const updatedMovie = await Movie.findById(movie._id);
    expect(updatedMovie.averageRating).toBe(9);
    expect(updatedMovie.reviewCount).toBe(1);
  });

  it("PATCH /api/reviews/:id should block User 2 from editing User 1's review", async () => {
    const res = await request(app)
      .patch(`/api/reviews/${createdReviewId}`)
      .set("Authorization", `Bearer ${user2Token}`)
      .send({ rating: 1 });

    expect(res.statusCode).toBe(403);
  });
});
