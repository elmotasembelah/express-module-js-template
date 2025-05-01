const { verifyJWT } = require("../lib/jwt");

const deserializeUser = (req, res, next) => {
  const authorizationHeader = req.headers["authorization"] || "";

  const accessToken = authorizationHeader.replace(/^Bearer\s/, "");

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJWT(accessToken);

  if (decoded && typeof decoded === "object") {
    res.locals.user = decoded;
  }

  return next();
};

module.exports = { deserializeUser };
