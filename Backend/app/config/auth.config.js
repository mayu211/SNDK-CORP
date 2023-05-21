require("dotenv").config();

module.exports = {
  port: process.env.APP_PORT || 8080,
  secret: process.env.SECRET || "sndk-secret-key",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:4200",
};
