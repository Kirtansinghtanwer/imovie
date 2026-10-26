require("dotenv").config();

const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`[Config Warning] Missing environment variable: ${envVar}. Using fallback.`);
  }
}

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/imovies",
  jwtSecret: process.env.JWT_SECRET || "imovies_jwt_super_secret_development_key_123456",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  nodeEnv: process.env.NODE_ENV || "development",
  paymentProvider: process.env.PAYMENT_PROVIDER || "dev",
  reservationHoldMinutes: parseInt(process.env.RESERVATION_HOLD_MINUTES, 10) || 10
};

module.exports = config;
