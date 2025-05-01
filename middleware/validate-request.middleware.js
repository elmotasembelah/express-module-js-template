const { ZodError } = require("zod");
const { ApiError } = require("../error/api-error");

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errorMessage = err.errors.map((e) => e.message).join(", ");
      return next(new ApiError(errorMessage, 400));
    }

    next(err);
  }
};

module.exports = { validate };
