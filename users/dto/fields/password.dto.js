const z = require("zod");

const signupErrors = {
  password_min: "Password must be at least 8 characters long",
  password_uppercase: "Password must include at least one uppercase letter",
  password_lowercase: "Password must include at least one lowercase letter",
  password_number: "Password must include at least one number",
  password_symbol: "Password must include at least one special character",
  password_match: "Passwords do not match",
};

const passwordDto = z
  .string({ required_error: "Password is required" })
  .min(8, signupErrors.password_min)
  .regex(/[A-Z]/, signupErrors.password_uppercase)
  .regex(/[a-z]/, signupErrors.password_lowercase)
  .regex(/[0-9]/, signupErrors.password_number)
  .regex(/[^A-Za-z0-9]/, signupErrors.password_symbol);

module.exports = {
  passwordDto,
};
