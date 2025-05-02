const { Router } = require("express");
const usersController = require("./users.controller");
const { deserializeUser } = require("../middleware/deserialize-user.middleware");
const { requireUser } = require("../middleware/require-user.middleware");
const { validate } = require("../middleware/validate-request.middleware");
const { createUserDto } = require("./dto/create-user.dto");
const { verifyOtpDto } = require("./dto/verify-otp.dto");
const { resendOtpDto } = require("./dto/resend-otp.dto");
const { loginDto } = require("./dto/login.dto");
const { forgotPasswordDto } = require("./dto/forgot-password.dto");
const { resetPasswordDto } = require("./dto/reset-password.dto");
const { updateUserDto } = require("./dto/update-user.dto");
const { ownerOrAdmin } = require("../middleware/owner-or-admin.middleware");
const { deleteUserDto } = require("./dto/deleete-user.dto");

const userRouter = Router();

userRouter.post("/", (req, res) => {
  res.send("register");
});
userRouter.post("/register", validate(createUserDto), usersController.createHandler);
userRouter.post("/login", validate(loginDto), usersController.loginHandler);
userRouter.post("/verify-otp", validate(verifyOtpDto), usersController.verifyOtpHandler);
userRouter.post("/resend-otp", validate(resendOtpDto), usersController.resendOtpHandler);
userRouter.post(
  "/forgot-password",
  validate(forgotPasswordDto),
  usersController.forgotPasswordHandler,
);
userRouter.post(
  "/reset-password",
  validate(resetPasswordDto),
  usersController.resetPasswordHandler,
);
userRouter.put(
  "/:userId",
  requireUser,
  validate(updateUserDto),
  ownerOrAdmin(),
  usersController.updateHandler,
);
userRouter.delete(
  "/:userId",
  requireUser,
  validate(deleteUserDto),
  ownerOrAdmin(),
  usersController.deleteHandler,
);

userRouter.get("/me", requireUser, usersController.getCurrentUserHandler);

module.exports = { userRouter };
