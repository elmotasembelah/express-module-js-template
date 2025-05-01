const bcrypt = require("bcrypt");
const config = require("config");

const hashPassword = async (plainPassword) => {
  const saltRounds = config.get("saltWorkFactor");
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(plainPassword, salt);
};

module.exports = { hashPassword };
