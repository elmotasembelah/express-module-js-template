const { z } = require("zod");

const userIdDto = z.string().min(1, "User id is required");

module.exports = {
  userIdDto,
};
