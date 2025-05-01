const { z } = require("zod");
const { phoneNumberDto } = require("./fields/phone-number.dto");
const { passwordDto } = require("./fields/password.dto");

const loginDto = z.object({
  body: z.object({
    phoneNumber: phoneNumberDto,
    password: passwordDto,
  }),
});

module.exports = {
  loginDto,
};
