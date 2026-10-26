const rateLimit = require("express-rate-limit");
const config = require("../config/env");

const isTest = config.nodeEnv === "test";

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    errors: ["Rate limit exceeded"]
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again after 15 minutes.",
    errors: ["Auth rate limit exceeded"]
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
