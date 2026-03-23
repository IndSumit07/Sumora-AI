import express from "express";
import {
  registerUserController,
  verifyOtpController,
  resendOtpController,
  loginUserController,
  logoutUserController,
  getCurrentUserController,
  updateProfileController,
  sendEmailChangeOtpController,
  verifyEmailChangeController,
  sendChangePasswordOtpController,
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
  deleteAccountController,
  googleLoginController,
  setPasswordController,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  authLimiter,
  otpLimiter,
  apiLimiter,
} from "../middlewares/rateLimiter.middleware.js";
import {
  validateRegister,
  validateLogin,
  validateEmail,
  validateOtp,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile,
  validateNewEmail,
  validateEmailChangeOtp,
  validateTurnstile,
} from "../middlewares/validate.middleware.js";

const authRouter = express.Router();

/* ── Public ── */
authRouter.post("/google", authLimiter, googleLoginController);
authRouter.post(
  "/register",
  authLimiter,
  validateTurnstile,
  validateRegister,
  registerUserController,
);
authRouter.post("/verify-otp", authLimiter, validateOtp, verifyOtpController);
authRouter.post("/resend-otp", otpLimiter, validateEmail, resendOtpController);
authRouter.post(
  "/login",
  authLimiter,
  validateTurnstile,
  validateLogin,
  loginUserController,
);
authRouter.post("/logout", logoutUserController);
authRouter.post(
  "/forgot-password",
  otpLimiter,
  validateEmail,
  forgotPasswordController,
);
authRouter.post(
  "/reset-password",
  authLimiter,
  validateResetPassword,
  resetPasswordController,
);

/* ── Protected ── */
authRouter.get("/me", apiLimiter, authMiddleware, getCurrentUserController);
authRouter.put(
  "/update-profile",
  apiLimiter,
  authMiddleware,
  validateUpdateProfile,
  updateProfileController,
);
authRouter.post(
  "/send-email-change-otp",
  otpLimiter,
  authMiddleware,
  validateNewEmail,
  sendEmailChangeOtpController,
);
authRouter.post(
  "/verify-email-change",
  authLimiter,
  authMiddleware,
  validateEmailChangeOtp,
  verifyEmailChangeController,
);
authRouter.post(
  "/send-change-password-otp",
  otpLimiter,
  authMiddleware,
  sendChangePasswordOtpController,
);
authRouter.post(
  "/change-password",
  authLimiter,
  authMiddleware,
  validateChangePassword,
  changePasswordController,
);
authRouter.post(
  "/set-password",
  authLimiter,
  authMiddleware,
  setPasswordController,
);
authRouter.delete(
  "/delete-account",
  apiLimiter,
  authMiddleware,
  deleteAccountController,
);

export default authRouter;
