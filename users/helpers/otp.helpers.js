const cacheService = require("../../lib/cache/cache.service");
const { ApiError } = require("../../error/api-error");
const config = require("config");

const otpConfig = config.get("otp");

const OTP_TTL = otpConfig.ttl;
const OTP_COOLDOWN = otpConfig.cooldown;
const OTP_MAX_RETRIES = otpConfig.maxRetries;
const OTP_RATE_LIMIT = otpConfig.rateLimit;
const OTP_RATE_WINDOW = otpConfig.rateWindow;
const OTP_LENGTH = otpConfig.length || 6;

const keyForOtp = (phone) => `otp:${phone}`;
const keyForCooldown = (phone) => `otp:cooldown:${phone}`;
const keyForRetry = (phone) => `otp:retry:${phone}`;
const keyForRate = (phone) => `otp:rate:${phone}`;

const generateOtp = () => {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

const requestOtp = async (phone) => {
  const onCooldown = await cacheService.get(keyForCooldown(phone));
  if (onCooldown) {
    throw new ApiError("OTP recently sent. Please wait before retrying.", 429);
  }

  // Rate limit check
  const currentRate = (await cacheService.get(keyForRate(phone))) || 0;
  if (currentRate >= OTP_RATE_LIMIT) {
    throw new ApiError("Too many OTP requests. Please try again later.", 429);
  }

  // Generate & store OTP
  const otp = generateOtp();
  await cacheService.set(keyForOtp(phone), otp, OTP_TTL);
  await cacheService.set(keyForCooldown(phone), true, OTP_COOLDOWN);
  await cacheService.set(keyForRate(phone), currentRate + 1, OTP_RATE_WINDOW);

  // Reset retry count
  await cacheService.remove(keyForRetry(phone));

  return otp;
};

const verifyOtp = async (phone, inputCode) => {
  const otpKey = keyForOtp(phone);
  const retryKey = keyForRetry(phone);

  const expectedOtp = await cacheService.get(otpKey);
  if (!expectedOtp) {
    throw new ApiError("OTP expired or not found.", 400);
  }

  // Validate
  if (expectedOtp !== inputCode) {
    const retryCount = (await cacheService.get(retryKey)) || 0;

    if (retryCount + 1 >= OTP_MAX_RETRIES) {
      await cacheService.remove(otpKey);
      await cacheService.remove(retryKey);
      throw new ApiError("Maximum OTP attempts exceeded.", 403);
    }

    await cacheService.set(retryKey, retryCount + 1, OTP_TTL);
    throw new ApiError("Incorrect OTP. Please try again.", 400);
  }

  await cacheService.remove(otpKey);
  await cacheService.remove(retryKey);
  return true;
};

const clearOtp = async (phone) => {
  await cacheService.remove(keyForOtp(phone));
  await cacheService.remove(keyForRetry(phone));
  await cacheService.remove(keyForCooldown(phone));
};

module.exports = {
  requestOtp,
  verifyOtp,
  clearOtp,
};
