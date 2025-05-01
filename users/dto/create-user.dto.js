const { z } = require("zod");
const { phoneNumberDto } = require("./fields/phone-number.dto");
const { passwordDto } = require("./fields/password.dto");
const { passwordConfirmationDto } = require("./fields/confirm-password.dto");
const { nameDto } = require("./fields/name.dto");
const { ageDto } = require("./fields/age.dto");

const createUserDto = z.object({
  body: z
    .object({
      name: nameDto,
      password: passwordDto,
      passwordConfirmation: passwordConfirmationDto,
      phoneNumber: phoneNumberDto,
      age: ageDto,
      gender: z.enum(["male", "female"]),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords do not match",
      path: ["passwordConfirmation"],
    }),
});

module.exports = {
  createUserDto,
};
