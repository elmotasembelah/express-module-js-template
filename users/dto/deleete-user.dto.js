const { z } = require("zod");
const { userIdDto } = require("./fields/user-id.dto");

const deleteUserDto = z.object({
  params: z.object({
    userId: userIdDto,
  }),
});

module.exports = {
  deleteUserDto,
};
