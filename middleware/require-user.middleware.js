const { ApiError } = require("../error/api-error");

const requireUser = (req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    throw new ApiError("Unauthorized", 401);
  }

  next();
};

module.exports = { requireUser };
