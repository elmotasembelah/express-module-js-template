const { z } = require("zod");
const { phoneNumberDto } = require("./fields/phone-number.dto");

const resendOtpDto = z.object({
  body: z.object({
    phoneNumber: phoneNumberDto,
  }),
});

module.exports = {
  resendOtpDto,
};
