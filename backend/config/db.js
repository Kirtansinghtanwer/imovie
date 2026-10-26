const mongoose = require("mongoose");
const config = require("./env");

async function connectDB(uri = config.mongodbUri) {
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("[MongoDB] Connection failure:", error.message);
    throw error;
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("[MongoDB] Lost connection to MongoDB database.");
});

mongoose.connection.on("reconnected", () => {
  console.log("[MongoDB] Reconnected to MongoDB database.");
});

module.exports = connectDB;
