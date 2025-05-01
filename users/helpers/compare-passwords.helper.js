const bcrypt = require("bcrypt");

const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch {
    return false;
  }
};

module.exports = { comparePasswords };
