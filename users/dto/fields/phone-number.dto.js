const z = require("zod");

const phoneNumberDto = z
  .string({ required_error: "Phone number is required" })
  .regex(/^\d{10,15}$/, "Phone number must be 10 to 15 digits");

module.exports = {
  phoneNumberDto,
};
