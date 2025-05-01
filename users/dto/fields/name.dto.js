const z = require("zod");

const nameDto = z
  .string({ required_error: "Name is required" })
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters");

module.exports = {
  nameDto,
};
