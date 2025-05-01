module.exports = {
  dbUrl: process.env.DATABASE_URI,
  port: 3000,
  JWT_Secret: process.env.JWT_SECRET,
  saltWorkFactor: 10,
  accessTokenTtl: "15m",
  otp: {
    length: 6,
    ttl: 300,
    cooldown: 60,
    maxRetries: 5,
    rateLimit: 100,
    rateWindow: 60 * 60,
  },
};
