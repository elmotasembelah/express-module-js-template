const UserModel = require("./users.model");
const config = require("config");
const { logger } = require("../lib/logger");
const { ApiError } = require("../error/api-error");
const { signJWT } = require("../lib/jwt");
const { hashPassword } = require("./helpers/hash-password.helper");
const { comparePasswords } = require("./helpers/compare-passwords.helper");
const { toSafeUser } = require("./helpers/to-safe-user.helper");
const otpHelper = require("./helpers/otp.helpers");

const create = async (createUserDto) => {
  const { password, passwordConfirmation, phoneNumber } = createUserDto;

  createUserDto.password = await hashPassword(password);

  // todo on produciton: remove otp from response
  const otp = await otpHelper.requestOtp(phoneNumber);

  const user = await UserModel.create(createUserDto);

  const safeUser = toSafeUser(user);

  return { otp, user: safeUser };
};

const login = async (loginDto) => {
  const user = await validatePassword(loginDto);

  if (!user) {
    throw new ApiError("Invalid phone number or password", 401);
  }

  if (!user._isVerified) {
    throw new ApiError("Please verify your phone number", 401);
  }

  const accessToken = signJWT({ ...user }, { expiresIn: config.get("accessTokenTtl") });

  return { user, accessToken };
};

const validatePassword = async ({ phoneNumber, password }) => {
  const user = await UserModel.findOne({ phoneNumber });

  if (!user) {
    return null;
  }

  const isPasswordValid = await comparePasswords(password, user.password);

  if (!isPasswordValid) {
    return null;
  }

  const safeUser = toSafeUser(user);

  return safeUser;
};

const verifyOtp = async (phoneNumber, inputOtp) => {
  const user = await UserModel.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user._isVerified) {
    throw new ApiError("User is already verified", 400);
  }

  const isOtpValid = await otpHelper.verifyOtp(phoneNumber, inputOtp);

  if (!isOtpValid) {
    throw new ApiError("Invalid or expired OTP", 400);
  }

  user._isVerified = true;
  await user.save();
};

const resendOtp = async (phoneNumber) => {
  const user = await UserModel.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (user._isVerified) {
    throw new ApiError("User is already verified", 400);
  }

  const otp = await otpHelper.requestOtp(phoneNumber);

  return otp;
};

const startForgotPasswordFlow = async (phoneNumber) => {
  const user = await UserModel.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (!user._isVerified) {
    throw new ApiError("User must verify phone before resetting password", 403);
  }

  // todo on production: remove otp from response
  const otp = await otpHelper.requestOtp(phoneNumber);

  return otp;
};

const resetPassword = async (phoneNumber, otp, newPassword) => {
  const user = await UserModel.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  if (!user._isVerified) {
    throw new ApiError("Phone number is not verified", 403);
  }

  const isOtpValid = await otpHelper.verifyOtp(phoneNumber, otp);

  if (!isOtpValid) {
    throw new ApiError("Invalid or expired OTP", 400);
  }

  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;

  await user.save();
};

const find = async (query) => {
  const user = await UserModel.findOne(query);
  if (!user) {
    return null;
  }
  const safeUser = user.toSafeObject();
  return safeUser;
};

const findAndUpdate = async (query, update, options = { new: true }) => {
  const user = await UserModel.findOneAndUpdate(query, update, options);

  if (!user) {
    return null;
  }

  return typeof user.toSafeObject === "function" ? user.toSafeObject() : user;
};

const findAnddelete = async (query, update, options = { new: true }) => {
  const user = await UserModel.findOneAndDelete(query);

  if (!user) {
    return null;
  }

  return typeof user.toSafeObject === "function" ? user.toSafeObject() : user;
};

module.exports = {
  create,
  login,
  verifyOtp,
  resendOtp,
  validatePassword,
  startForgotPasswordFlow,
  resetPassword,
  find,
  findAndUpdate,
};
