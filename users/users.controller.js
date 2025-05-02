const usersService = require("./users.service");
const { signJWT } = require("../lib/jwt");
const { logger } = require("../lib/logger");
const { ApiError } = require("../error/api-error");

const createHandler = async (req, res) => {
  const data = await usersService.create(req.body);
  res.status(201).json({ success: true, message: "user was created successfully", data });
};

const loginHandler = async (req, res) => {
  const { user, accessToken } = await usersService.login(req.body);
  res
    .status(200)
    .json({ success: true, message: "logged in successfully", data: { user, accessToken } });
};

const verifyOtpHandler = async (req, res) => {
  const { phoneNumber, otp } = req.body;

  await usersService.verifyOtp(phoneNumber, otp);

  res.status(200).json({ success: true, message: "Phone verified successfully" });
};

const resendOtpHandler = async (req, res) => {
  const { phoneNumber } = req.body;

  // todo before production: remvoe otp from response
  const otp = await usersService.resendOtp(phoneNumber);

  res.status(200).json({ success: true, message: "OTP resent successfully", data: { otp } });
};

const forgotPasswordHandler = async (req, res) => {
  const { phoneNumber } = req.body;

  // todo before production: remove otp from response
  const otp = await usersService.startForgotPasswordFlow(phoneNumber);

  res.status(200).json({
    success: true,
    message: "OTP sent to your phone for password reset",
    data: { otp },
  });
};

const resetPasswordHandler = async (req, res) => {
  const { phoneNumber, otp, password } = req.body;

  await usersService.resetPassword(phoneNumber, otp, password);

  res.status(200).json({ success: true, message: "Password reset successful" });
};

const updateHandler = async (req, res) => {
  const { userId } = req.params;
  const { body } = req;

  const updatedUser = await usersService.findAndUpdate({ _id: userId }, body);

  res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
};

const deleteHandler = async (req, res) => {
  const { userId } = req.params;

  const deletedUser = await usersService.findAndUpdate({ _id: userId });

  res.status(200).json({ success: true, message: "User deleted successfully", data: deletedUser });
};

const getCurrentUserHandler = async (req, res) => {
  const currentUser = res.locals.user;

  res
    .status(200)
    .json({ succuss: true, message: "Current user was found", data: { user: currentUser } });
};

module.exports = {
  createHandler,
  loginHandler,
  verifyOtpHandler,
  resendOtpHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  updateHandler,
  deleteHandler,
  getCurrentUserHandler,
};
