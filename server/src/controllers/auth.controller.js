import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import Blacklist from "../models/blacklist.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendOtpEmail, generateOtp } from "../services/brevo.service.js";
import { OAuth2Client } from "google-auth-library";
import { verifyTurnstileToken } from "../services/turnstile.service.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
}

function userPayload(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    authProvider: user.authProvider,
    hasPassword: !!user.password,
    tokens: user.tokens,
  };
}

/**
 * POST /api/auth/register
 */
export async function registerUserController(req, res) {
  try {
    const { username, email, password, turnstileToken } = req.body;

    const turnstileResult = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!turnstileResult.success) {
      return res.status(400).json({
        message: "Captcha verification failed. Please try again.",
        reason: turnstileResult.error,
      });
    }

    // Remove unverified user with same email/username so they can re-register
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing && existing.isVerified) {
      return res.status(400).json({
        message: "An account with that username or email already exists",
      });
    }
    if (existing && !existing.isVerified) {
      await User.findByIdAndDelete(existing._id);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const otp = generateOtp();
    await Otp.deleteMany({ email, type: "registration" });
    await Otp.create({ email, otp, type: "registration" });
    await sendOtpEmail(email, otp, "registration");

    res
      .status(201)
      .json({ message: "OTP sent to your email", email: newUser.email });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/verify-otp
 */
export async function verifyOtpController(req, res) {
  try {
    const { email, otp } = req.body;

    const valid = await Otp.verifyOtp(email, otp, "registration");
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = signToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Email verified successfully",
      user: userPayload(user),
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/resend-otp
 */
export async function resendOtpController(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: false });
    if (!user) {
      return res
        .status(400)
        .json({ message: "No pending verification for this email" });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email, type: "registration" });
    await Otp.create({ email, otp, type: "registration" });
    await sendOtpEmail(email, otp, "registration");

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/login
 */
export async function loginUserController(req, res) {
  try {
    const { email, password, turnstileToken } = req.body;

    const turnstileResult = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!turnstileResult.success) {
      return res.status(400).json({
        message: "Captcha verification failed. Please try again.",
        reason: turnstileResult.error,
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = signToken(user);
    setTokenCookie(res, token);

    res
      .status(200)
      .json({ message: "Login successful", user: userPayload(user) });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/logout
 */
export async function logoutUserController(req, res) {
  try {
    const token = req.cookies.token;
    if (token) {
      await Blacklist.create({ token });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * GET /api/auth/me  (protected)
 */
export async function getCurrentUserController(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: userPayload(user) });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * PUT /api/auth/update-profile  (protected)
 * Only updates username now — email changes go through the OTP flow
 */
export async function updateProfileController(req, res) {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    if (!username) {
      return res.status(400).json({ message: "Provide a username to update" });
    }

    const conflict = await User.findOne({ _id: { $ne: userId }, username });
    if (conflict) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    const token = signToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Profile updated successfully",
      user: userPayload(user),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/send-email-change-otp  (protected)
 * Sends OTP to the NEW email to verify ownership before changing
 */
export async function sendEmailChangeOtpController(req, res) {
  try {
    const { newEmail } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newEmail === user.email) {
      return res
        .status(400)
        .json({ message: "New email is the same as your current email" });
    }

    // Check if the new email is already taken by another verified user
    const existing = await User.findOne({ email: newEmail, isVerified: true });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email: newEmail, type: "change-email" });
    await Otp.create({ email: newEmail, otp, type: "change-email" });
    await sendOtpEmail(newEmail, otp, "change-email");

    res.status(200).json({ message: "OTP sent to your new email" });
  } catch (error) {
    console.error("Send email change OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/verify-email-change  (protected)
 * Verifies OTP and updates the user's email
 */
export async function verifyEmailChangeController(req, res) {
  try {
    const { newEmail, otp } = req.body;
    const userId = req.user.id;

    const valid = await Otp.verifyOtp(newEmail, otp, "change-email");
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Double-check the email isn't taken (race condition guard)
    const existing = await User.findOne({
      email: newEmail,
      isVerified: true,
      _id: { $ne: userId },
    });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    const token = signToken(user);
    setTokenCookie(res, token);

    res
      .status(200)
      .json({ message: "Email updated successfully", user: userPayload(user) });
  } catch (error) {
    console.error("Verify email change error:", error);
    if (error.name === "ValidationError") {
      const msg = Object.values(error.errors)
        .map((e) => e.message)
        .join(", ");
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/send-change-password-otp  (protected)
 */
export async function sendChangePasswordOtpController(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email: user.email, type: "change-password" });
    await Otp.create({ email: user.email, otp, type: "change-password" });
    await sendOtpEmail(user.email, otp, "change-password");

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send change password OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/change-password  (protected)
 */
export async function changePasswordController(req, res) {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await Otp.verifyOtp(user.email, otp, "change-password");
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/forgot-password
 */
export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isVerified: true });
    if (!user) {
      // Don't reveal whether the email exists — same response either way
      return res
        .status(200)
        .json({ message: "If an account exists, an OTP has been sent" });
    }

    const otp = generateOtp();
    await Otp.deleteMany({ email, type: "forgot-password" });
    await Otp.create({ email, otp, type: "forgot-password" });
    await sendOtpEmail(email, otp, "forgot-password");

    res
      .status(200)
      .json({ message: "If an account exists, an OTP has been sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/reset-password
 */
export async function resetPasswordController(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const valid = await Otp.verifyOtp(email, otp, "forgot-password");
    if (!valid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/google
 */
export async function googleLoginController(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const response = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${credential}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user profile from Google");
    }

    const payload = await response.json();
    const { email, sub: googleId, name, given_name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      // derive a unique username based on the email prefix, not the name
      let baseUsername = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "");
      if (baseUsername.length < 3) baseUsername += "user";
      let username = baseUsername.substring(0, 20);

      let usernameExists = await User.findOne({ username });
      while (usernameExists) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        username = `${baseUsername.substring(0, 20)}${randomSuffix}`;
        usernameExists = await User.findOne({ username });
      }

      user = await User.create({
        username,
        email,
        googleId,
        authProvider: "google",
        isVerified: true,
      });
    } else {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = user.password ? "local" : "google";
        user.isVerified = true;
        await user.save();
      }
    }

    const token = signToken(user);
    setTokenCookie(res, token);

    res.status(200).json({
      message: "Google login successful",
      user: { ...userPayload(user), hasPassword: !!user.password },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * POST /api/auth/set-password  (protected)
 */
export async function setPasswordController(req, res) {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password) {
      return res.status(400).json({
        message: "Password is already set. Use change password instead.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.authProvider = "local"; // they now have local auth
    await user.save();

    res.status(200).json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * DELETE /api/auth/delete-account
 */
export async function deleteAccountController(req, res) {
  try {
    const token = req.cookies.token;
    const user = await User.findById(req.user.id).select("email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (token) {
      await Blacklist.create({ token });
    }
    await User.findByIdAndDelete(req.user.id);
    await Otp.deleteMany({ email: user.email });
    res.clearCookie("token");
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
