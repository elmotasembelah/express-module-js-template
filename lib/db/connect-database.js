const mongoose = require("mongoose");
const config = require("config");
const { logger } = require("../logger");

async function connectDatabase() {
  const dbUrl = config.get("dbUrl");

  try {
    await mongoose.connect(dbUrl);
    logger.info("Connected to DB");
  } catch (error) {
    logger.error("Could not connect to DB");
    logger.error(error);
    process.exit(1);
  }
}

module.exports = { connectDatabase };
