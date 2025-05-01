require("express-async-errors");
require("dotenv").config();
const { errorHandler } = require("./error/error-handler");
const express = require("express");
const { userRouter } = require("./users/users.routes");
const { logger } = require("./lib/logger");
const { connectDatabase } = require("./lib/db/connect-database");
const { deserializeUser } = require("./middleware/deserialize-user.middleware");
const app = express();

process.once("uncaughtException", (err) => {
  logger.info("Shutting down the server due to uncaught exception...");
  logger.error("An uncaught exception occurred:", err);
  process.exit(1);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(deserializeUser);

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

app.use("/api/v1/users", userRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

let server;

if (process.env.NODE_ENV === "production") {
  server = app.listen(PORT, async () => {
    await connectDatabase();

    logger.info(`server is listening on port ${PORT}`);
  });
} else if (process.env.NODE_ENV === "development") {
  server = app.listen(PORT, async () => {
    await connectDatabase();

    logger.info(`server is listening on port ${PORT}`);
  });
}

process.once("unhandledRejection", (err) => {
  logger.info("an unhandled rejection occured, shutting down the server...");
  logger.error(err.message);

  server.close(() => {
    process.exit(1);
  });
});
