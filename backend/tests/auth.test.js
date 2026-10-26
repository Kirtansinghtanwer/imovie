const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const User = require("../models/User");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/imovies_test_auth";

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await User.deleteMany({});
}, 30000);

afterAll(async () => {
  try {
    await User.deleteMany({});
    await mongoose.connection.close();
  } catch (err) {
    console.error("Cleanup error:", err);
  }
}, 30000);

describe("Auth APIs", () => {
  const testUser = {
    name: "Alex Doe",
    email: "alex.doe@example.com",
    password: "Password@123",
    phone: "+1-555-0199"
  };

  it("POST /api/auth/register should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.data.user.role).toBe("user");
    expect(res.body.data.user.passwordHash).toBeUndefined();
    expect(res.body.data.token).toBeDefined();
  });

  it("POST /api/auth/register should reject duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("already exists");
  });

  it("POST /api/auth/register should reject invalid inputs", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "",
        email: "not-an-email",
        password: "123"
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("POST /api/auth/register should not allow privilege escalation to admin", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Hacker User",
        email: "hacker@example.com",
        password: "Password@123",
        role: "admin"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.role).toBe("user");
  });

  it("POST /api/auth/login should log in an existing user", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  it("POST /api/auth/login should reject incorrect password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: "WrongPassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/auth/me should return current user profile with valid token", async () => {
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });

    const token = loginRes.body.data.token;

    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(meRes.statusCode).toBe(200);
    expect(meRes.body.data.user.email).toBe(testUser.email.toLowerCase());
  });

  it("GET /api/auth/me should reject request without token", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
