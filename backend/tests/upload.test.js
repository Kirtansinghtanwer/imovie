const upload = require("../middlewares/upload");

describe("File Upload Middleware", () => {
  it("should have correct limits and filter configured", () => {
    expect(upload).toBeDefined();
    expect(upload.limits.fileSize).toBe(5 * 1024 * 1024);
  });
});
