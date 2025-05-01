const { z } = require("zod");

const passwordConfirmationDto = z.string({ required_error: "Password confirmation is required" });

module.exports = {
  passwordConfirmationDto,
};
