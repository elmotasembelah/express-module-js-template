const config = require("config");
const { z } = require("zod");
const { phoneNumberDto } = require("./fields/phone-number.dto");
const { otpDto } = require("./fields/otp.dto");

const verifyOtpDto = z.object({
  body: z.object({
    phoneNumber: phoneNumberDto,
    otp: otpDto,
  }),
});

module.exports = {
  verifyOtpDto,
};
