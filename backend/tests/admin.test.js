const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const User = require("../models/User");
const Review = require("../models/Review");
const { signToken } = require("../utils/jwt");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/imovies_test_admin";

let adminToken;
let userToken;
let testUser;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await Promise.all([
    Movie.deleteMany({}),
    Theatre.deleteMany({}),
    User.deleteMany({}),
    Review.deleteMany({})
  ]);

  const admin = await User.create({
    name: "Master Admin",
    email: "master.admin@test.com",
    passwordHash: "hash123",
    role: "admin",
    status: "active"
  });
  adminToken = signToken({ id: admin._id, role: admin.role });

  testUser = await User.create({
    name: "Regular Guy",
    email: "regular@test.com",
    passwordHash: "hash123",
    role: "user",
    status: "active"
  });
  userToken = signToken({ id: testUser._id, role: testUser.role });
});

afterAll(async () => {
  try {
    await Promise.all([
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      User.deleteMany({}),
      Review.deleteMany({})
    ]);
    await mongoose.connection.close();
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

describe("Admin APIs & Permissions", () => {
  it("GET /api/admin/stats should block normal users with 403", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/admin/stats should allow admin and return metrics", async () => {
    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.stats).toBeDefined();
    expect(res.body.data.stats.totalMovies).toBeDefined();
    expect(res.body.data.stats.totalBookings).toBeDefined();
    expect(res.body.data.trends).toBeDefined();
  });

  it("GET /api/admin/users should return users list for admin", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.users.length).toBeGreaterThan(0);
  });

  it("PATCH /api/admin/users/:id/status should toggle user status", async () => {
    const res = await request(app)
      .patch(`/api/admin/users/${testUser._id}/status`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.user.status).toBe("inactive");
  });

  it("GET /api/admin/reports should return report data", async () => {
    const res = await request(app)
      .get("/api/admin/reports")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.topMovies).toBeDefined();
    expect(res.body.data.theatreBreakdown).toBeDefined();
  });
});
