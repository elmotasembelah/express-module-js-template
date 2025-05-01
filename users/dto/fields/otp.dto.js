const config = require("config");
const { z } = require("zod");

const otpLength = config.get("otp.length");

const otpDto = z
  .string({ required_error: "OTP is required" })
  .regex(new RegExp(`^\\d{${otpLength}}$`), `OTP must be ${otpLength} digits`);

module.exports = {
  otpDto,
};
