import validator from "validator";

const { isEmail, isLength, isAlphanumeric, trim, normalizeEmail, escape } =
  validator;

/**
 * Sanitize and validate registration input
 */
export function validateRegister(req, res, next) {
  let { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  // Sanitize
  username = trim(username).toLowerCase();
  email = normalizeEmail(trim(email), { gmail_remove_dots: false }) || "";

  // Validate username: 3-30 chars, alphanumeric + underscores
  if (!isLength(username, { min: 3, max: 30 })) {
    return res
      .status(400)
      .json({ message: "Username must be 3–30 characters" });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      message: "Username can only contain letters, numbers, and underscores",
    });
  }

  // Validate email
  if (!isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (email.length > 254) {
    return res.status(400).json({ message: "Email is too long" });
  }

  // Validate password: 6-128 chars
  if (!isLength(password, { min: 6, max: 128 })) {
    return res
      .status(400)
      .json({ message: "Password must be 6–128 characters" });
  }

  req.body.username = username;
  req.body.email = email;
  next();
}

/**
 * Sanitize and validate login input
 */
export function validateLogin(req, res, next) {
  let { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  email = normalizeEmail(trim(email), { gmail_remove_dots: false }) || "";

  if (!isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  req.body.email = email;
  next();
}

export function validateTurnstile(req, res, next) {
  const { turnstileToken } = req.body;

  if (!turnstileToken || typeof turnstileToken !== "string") {
    return res.status(400).json({ message: "Captcha token is required" });
  }

  req.body.turnstileToken = trim(turnstileToken);
  next();
}

/**
 * Sanitize and validate email-only inputs (forgot-password, resend-otp)
 */
export function validateEmail(req, res, next) {
  let { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  email = normalizeEmail(trim(email), { gmail_remove_dots: false }) || "";

  if (!isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  req.body.email = email;
  next();
}

/**
 * Validate OTP input (6-digit numeric string)
 */
export function validateOtp(req, res, next) {
  let { otp, email } = req.body;

  if (email) {
    email = normalizeEmail(trim(email), { gmail_remove_dots: false }) || "";
    if (!isEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }
    req.body.email = email;
  }

  if (!otp || typeof otp !== "string") {
    return res.status(400).json({ message: "OTP is required" });
  }

  otp = trim(otp);
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit code" });
  }

  req.body.otp = otp;
  next();
}

/**
 * Validate password reset input
 */
export function validateResetPassword(req, res, next) {
  let { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, OTP, and new password are required" });
  }

  email = normalizeEmail(trim(email), { gmail_remove_dots: false }) || "";
  otp = trim(otp);

  if (!isEmail(email)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit code" });
  }
  if (!isLength(newPassword, { min: 6, max: 128 })) {
    return res
      .status(400)
      .json({ message: "Password must be 6–128 characters" });
  }

  req.body.email = email;
  req.body.otp = otp;
  next();
}

/**
 * Validate change password input (OTP + new password)
 */
export function validateChangePassword(req, res, next) {
  let { otp, newPassword } = req.body;

  if (!otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "OTP and new password are required" });
  }

  otp = trim(otp);

  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit code" });
  }
  if (!isLength(newPassword, { min: 6, max: 128 })) {
    return res
      .status(400)
      .json({ message: "Password must be 6–128 characters" });
  }

  req.body.otp = otp;
  next();
}

/**
 * Validate profile update input (username only now — email changes use OTP flow)
 */
export function validateUpdateProfile(req, res, next) {
  let { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: "Provide a username to update" });
  }

  username = trim(username).toLowerCase();
  if (!isLength(username, { min: 3, max: 30 })) {
    return res
      .status(400)
      .json({ message: "Username must be 3–30 characters" });
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({
      message: "Username can only contain letters, numbers, and underscores",
    });
  }
  req.body.username = username;

  next();
}

/**
 * Validate send email change OTP input (newEmail)
 */
export function validateNewEmail(req, res, next) {
  let { newEmail } = req.body;

  if (!newEmail) {
    return res.status(400).json({ message: "New email is required" });
  }

  newEmail = normalizeEmail(trim(newEmail), { gmail_remove_dots: false }) || "";

  if (!isEmail(newEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (newEmail.length > 254) {
    return res.status(400).json({ message: "Email is too long" });
  }

  req.body.newEmail = newEmail;
  next();
}

/**
 * Validate verify email change input (newEmail + otp)
 */
export function validateEmailChangeOtp(req, res, next) {
  let { newEmail, otp } = req.body;

  if (!newEmail || !otp) {
    return res.status(400).json({ message: "New email and OTP are required" });
  }

  newEmail = normalizeEmail(trim(newEmail), { gmail_remove_dots: false }) || "";
  otp = trim(otp);

  if (!isEmail(newEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }
  if (!/^\d{6}$/.test(otp)) {
    return res.status(400).json({ message: "OTP must be a 6-digit code" });
  }

  req.body.newEmail = newEmail;
  req.body.otp = otp;
  next();
}
