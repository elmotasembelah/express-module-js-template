const config = require("config");
const { z } = require("zod");
const { phoneNumberDto } = require("./fields/phone-number.dto");
const { otpDto } = require("./fields/otp.dto");
const { passwordDto } = require("./fields/password.dto");
const { passwordConfirmationDto } = require("./fields/confirm-password.dto");

const otpLength = config.get("otp.length");

const resetPasswordDto = z.object({
  body: z
    .object({
      phoneNumber: phoneNumberDto,
      otp: otpDto,
      password: passwordDto,
      passwordConfirmation: passwordConfirmationDto,
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

module.exports = {
  resetPasswordDto,
};
