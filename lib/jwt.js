const jwt = require("jsonwebtoken");
const config = require("config");

const JWT_SECRET = config.get("JWT_Secret"); // Use one secret for both sign/verify

const signJWT = (payload, options) => {
  return jwt.sign(payload, JWT_SECRET, {
    ...(options && options),
  });
};

const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
};

const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  signJWT,
  verifyJWT,
  decodeToken,
};
