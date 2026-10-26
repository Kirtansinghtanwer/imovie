const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const Movie = require("../models/Movie");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/imovies_test_movies";

let adminToken;
let userToken;
let sampleMovie;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await Movie.deleteMany({});
  await User.deleteMany({});

  const admin = await User.create({
    name: "Admin User",
    email: "admin.movies@test.com",
    passwordHash: "hash123",
    role: "admin",
    status: "active"
  });
  adminToken = signToken({ id: admin._id, role: admin.role });

  const user = await User.create({
    name: "Normal User",
    email: "user.movies@test.com",
    passwordHash: "hash123",
    role: "user",
    status: "active"
  });
  userToken = signToken({ id: user._id, role: user.role });

  sampleMovie = await Movie.create({
    title: "Interstellar",
    slug: "interstellar",
    synopsis: "A team of explorers travel through a wormhole in space.",
    posterUrl: "https://example.com/interstellar.jpg",
    genres: ["Sci-Fi", "Adventure"],
    language: "English",
    durationMinutes: 169,
    releaseDate: new Date("2014-11-07"),
    releaseStatus: "now-showing",
    averageRating: 8.7,
    reviewCount: 250,
    featured: true
  });
});

afterAll(async () => {
  try {
    await Movie.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

describe("Movie APIs", () => {
  it("GET /api/movies should return movie list with pagination", async () => {
    const res = await request(app).get("/api/movies");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.movies.length).toBeGreaterThan(0);
    expect(res.body.data.total).toBeGreaterThan(0);
  });

  it("GET /api/movies/:id should return movie by slug", async () => {
    const res = await request(app).get("/api/movies/interstellar");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.movie.title).toBe("Interstellar");
  });

  it("GET /api/movies/:id should return movie by ObjectId", async () => {
    const res = await request(app).get(`/api/movies/${sampleMovie._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.movie.slug).toBe("interstellar");
  });

  it("GET /api/movies/featured should return featured movies", async () => {
    const res = await request(app).get("/api/movies/featured");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.movies.length).toBeGreaterThan(0);
    expect(res.body.data.movies[0].title).toBe("Interstellar");
  });

  it("GET /api/movies/:id should return 404 for unknown movie", async () => {
    const res = await request(app).get("/api/movies/non-existent-movie-slug");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/movies should allow admin to create a movie", async () => {
    const newMovieData = {
      title: "Inception",
      synopsis: "A thief who steals corporate secrets through dream-sharing.",
      posterUrl: "https://example.com/inception.jpg",
      genres: ["Sci-Fi", "Action"],
      language: "English",
      durationMinutes: 148,
      releaseDate: "2010-07-16",
      releaseStatus: "now-showing"
    };

    const res = await request(app)
      .post("/api/movies")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newMovieData);

    expect(res.statusCode).toBe(201);
    expect(res.body.data.movie.title).toBe("Inception");
    expect(res.body.data.movie.slug).toBe("inception");
  });

  it("POST /api/movies should reject non-admin users with 403", async () => {
    const res = await request(app)
      .post("/api/movies")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ title: "Unauthorized Movie" });

    expect(res.statusCode).toBe(403);
  });
});
