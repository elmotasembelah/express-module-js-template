const { ApiError } = require("../error/api-error");

const ownerOrAdmin = (paramKey = "userId") => {
  return (req, res, next) => {
    const loggedInUser = res.locals.user;
    const userIdFromToken = loggedInUser._id || loggedInUser.id;
    const userRole = loggedInUser.role || "user";
    const userIdFromParams = req.params[paramKey];

    if (userIdFromToken === userIdFromParams || userRole === "admin") {
      return next();
    }

    throw new ApiError("You are not authorized to perform this action", 403);
  };
};

module.exports = { ownerOrAdmin };
