const request = require("supertest");
const { app } = require("../server");

describe("Health API & Error Handling", () => {
  it("GET /api/health should return 200 and healthy status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("IMovies backend is running");
    expect(res.body.data.status).toBe("healthy");
  });

  it("GET unknown endpoint should return 404 error response", async () => {
    const res = await request(app).get("/api/unknown-endpoint-404");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Endpoint not found");
  });
});
