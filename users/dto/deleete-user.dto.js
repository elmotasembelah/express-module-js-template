const { z } = require("zod");

const deleteUserDto = z.object({
  params: z.object({
    userId: z.string().min(1, "Id is required"),
  }),
});

module.exports = {
  deleteUserDto,
};
