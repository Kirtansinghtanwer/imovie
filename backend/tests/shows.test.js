const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../server");
const Movie = require("../models/Movie");
const Theatre = require("../models/Theatre");
const Screen = require("../models/Screen");
const Show = require("../models/Show");
const ShowSeat = require("../models/ShowSeat");
const User = require("../models/User");
const SeatService = require("../services/seatService");
const { signToken } = require("../utils/jwt");

const TEST_DB_URI = "mongodb://127.0.0.1:27017/imovies_test_shows";

let adminToken;
let userToken;
let movie;
let theatre;
let screen;
let show;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await Promise.all([
    Movie.deleteMany({}),
    Theatre.deleteMany({}),
    Screen.deleteMany({}),
    Show.deleteMany({}),
    ShowSeat.deleteMany({}),
    User.deleteMany({})
  ]);

  const admin = await User.create({
    name: "Admin Shows",
    email: "admin.shows@test.com",
    passwordHash: "hash123",
    role: "admin",
    status: "active"
  });
  adminToken = signToken({ id: admin._id, role: admin.role });

  const user = await User.create({
    name: "User Shows",
    email: "user.shows@test.com",
    passwordHash: "hash123",
    role: "user",
    status: "active"
  });
  userToken = signToken({ id: user._id, role: user.role });

  movie = await Movie.create({
    title: "Dune: Part Two",
    slug: "dune-part-two",
    synopsis: "Paul Atreides unites with Chani and the Fremen.",
    posterUrl: "https://example.com/dune.jpg",
    genres: ["Sci-Fi", "Adventure"],
    language: "English",
    durationMinutes: 166,
    releaseDate: new Date("2024-03-01"),
    releaseStatus: "now-showing"
  });

  theatre = await Theatre.create({
    name: "Grand Cinema IMAX",
    address: "100 Main St",
    city: "New York",
    screensCount: 2
  });

  screen = await Screen.create({
    theatre: theatre._id,
    name: "Screen 1 - IMAX",
    screenType: "IMAX"
  });

  const startTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // Tomorrow
  const endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);

  show = await Show.create({
    movie: movie._id,
    theatre: theatre._id,
    screen: screen._id,
    screenName: screen.name,
    startTime,
    endTime,
    date: startTime.toISOString().split("T")[0],
    time: "07:00 PM",
    standardPrice: 16.5,
    premiumPrice: 24.0,
    vipPrice: 30.0
  });

  await SeatService.initializeShowSeats(show._id);
});

afterAll(async () => {
  try {
    await Promise.all([
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Screen.deleteMany({}),
      Show.deleteMany({}),
      ShowSeat.deleteMany({}),
      User.deleteMany({})
    ]);
    await mongoose.connection.close();
  } catch (err) {
    console.error("Cleanup error:", err);
  }
});

describe("Theatre & Show APIs", () => {
  it("GET /api/theatres should return active theatres", async () => {
    const res = await request(app).get("/api/theatres");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.theatres.length).toBeGreaterThan(0);
    expect(res.body.data.theatres[0].city).toBe("New York");
  });

  it("GET /api/theatres?city=London should filter by city", async () => {
    const res = await request(app).get("/api/theatres?city=London");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.theatres.length).toBe(0);
  });

  it("GET /api/shows/:id should return show details", async () => {
    const res = await request(app).get(`/api/shows/${show._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.show.screenName).toBe("Screen 1 - IMAX");
    expect(res.body.data.show.standardPrice).toBe(16.5);
  });

  it("GET /api/shows/:showId/seats should return layout with rows and seats", async () => {
    const res = await request(app).get(`/api/shows/${show._id}/seats`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.seatLayout).toBeDefined();
    expect(res.body.data.seatLayout.length).toBeGreaterThan(0);
    expect(res.body.data.seatLayout[0].seats.length).toBe(12);
  });

  it("POST /api/shows should reject conflicting schedule for same screen (409)", async () => {
    // Attempt to create another show on the same screen overlapping the existing show
    const conflictRes = await request(app)
      .post("/api/shows")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        movieId: movie._id.toString(),
        theatreId: theatre._id.toString(),
        screenId: screen._id.toString(),
        startTime: new Date(show.startTime.getTime() + 30 * 60 * 1000), // starts 30 mins after show starts
        endTime: new Date(show.endTime.getTime() + 30 * 60 * 1000),
        standardPrice: 15,
        premiumPrice: 20
      });

    expect(conflictRes.statusCode).toBe(409);
    expect(conflictRes.body.success).toBe(false);
    expect(conflictRes.body.message).toContain("conflict");
  });

  it("SeatService should prevent duplicate seat reservations under concurrency", async () => {
    const user1Id = new mongoose.Types.ObjectId();
    const user2Id = new mongoose.Types.ObjectId();
    const targetSeat = ["B5"];

    // User 1 reserves B5
    const res1 = await SeatService.reserveSeats({
      showId: show._id,
      seatIdentifiers: targetSeat,
      userId: user1Id
    });
    expect(res1.success).toBe(true);

    // User 2 attempts to reserve B5 at the same time -> must fail
    await expect(
      SeatService.reserveSeats({
        showId: show._id,
        seatIdentifiers: targetSeat,
        userId: user2Id
      })
    ).rejects.toThrow(/no longer available/);
  });
});
