const z = require("zod");

const ageDto = z
  .number({ required_error: "Age is required" })
  .min(0, "Age must be a positive number")
  .max(120, "Age is too high");

module.exports = {
  ageDto,
};
