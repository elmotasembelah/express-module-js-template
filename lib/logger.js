const Pino = require("pino");
const dayjs = require("dayjs");

const logger = Pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: false,
    },
  },
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DD HH:mm:ss")}"`,
});

module.exports = { logger };
