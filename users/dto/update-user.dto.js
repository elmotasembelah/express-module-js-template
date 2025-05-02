const { z } = require("zod");
const { phoneNumberDto } = require("./fields/phone-number.dto");
const { passwordDto } = require("./fields/password.dto");
const { passwordConfirmationDto } = require("./fields/confirm-password.dto");
const { nameDto } = require("./fields/name.dto");
const { ageDto } = require("./fields/age.dto");
const { userIdDto } = require("./fields/user-id.dto");

const updateUserDto = z.object({
  body: z.object({
    name: nameDto,
    phoneNumber: phoneNumberDto,
    age: ageDto,
    gender: z.enum(["male", "female"]),
  }),
  params: z.object({
    userId: userIdDto,
  }),
});

module.exports = {
  updateUserDto,
};
