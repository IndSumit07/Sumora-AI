import { useState, useRef, useEffect } from "react";
import { X, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AccountModal = ({ open, onClose }) => {
  const {
    user,
    updateProfile,
    sendEmailChangeOtp,
    verifyEmailChange,
    sendChangePasswordOtp,
    changePassword,
    deleteAccount,
    logout,
  } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [savingUsername, setSavingUsername] = useState(false);

  // Email change
  const [emailStep, setEmailStep] = useState("idle"); // idle | otp-sent | submitting
  const [email, setEmail] = useState(user?.email || "");
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [resendingEmailOtp, setResendingEmailOtp] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const emailInputsRef = useRef([]);

  // Password change
  const [pwStep, setPwStep] = useState("idle"); // idle | otp-sent | submitting
  const [pwOtp, setPwOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resendingPwOtp, setResendingPwOtp] = useState(false);
  const [pwCooldown, setPwCooldown] = useState(0);
  const pwInputsRef = useRef([]);

  // Delete
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (pwCooldown <= 0) return;
    const id = setInterval(() => setPwCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [pwCooldown]);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const id = setInterval(() => setEmailCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [emailCooldown]);

  if (!open || !user) return null;

  const handleSaveUsername = async () => {
    if (!username.trim() || username === user.username) return;
    setSavingUsername(true);
    try {
      await updateProfile({ username: username.trim() });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSavingUsername(false);
    }
  };

  // Email change OTP handlers
  const handleSendEmailOtp = async () => {
    if (!email.trim() || email.trim() === user.email) return;
    setSendingEmailOtp(true);
    try {
      await sendEmailChangeOtp(email.trim());
      setEmailStep("otp-sent");
      setEmailCooldown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingEmailOtp(false);
    }
  };

  const handleEmailOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...emailOtp];
    next[index] = value.slice(-1);
    setEmailOtp(next);
    if (value && index < 5) emailInputsRef.current[index + 1]?.focus();
  };

  const handleEmailOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !emailOtp[index] && index > 0) {
      emailInputsRef.current[index - 1]?.focus();
    }
  };

  const handleEmailOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...emailOtp];
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setEmailOtp(next);
    emailInputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const handleVerifyEmailChange = async () => {
    const code = emailOtp.join("");
    if (code.length !== 6) return toast.error("Enter the 6-digit code");
    setEmailStep("submitting");
    try {
      await verifyEmailChange(email.trim(), code);
      setEmailStep("idle");
      setEmailOtp(["", "", "", "", "", ""]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify");
      setEmailStep("otp-sent");
    }
  };

  const handleSendPwOtp = async () => {
    setSendingOtp(true);
    try {
      await sendChangePasswordOtp();
      setPwStep("otp-sent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handlePwOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...pwOtp];
    next[index] = value.slice(-1);
    setPwOtp(next);
    if (value && index < 5) pwInputsRef.current[index + 1]?.focus();
  };

  const handlePwOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pwOtp[index] && index > 0) {
      pwInputsRef.current[index - 1]?.focus();
    }
  };

  const handlePwOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...pwOtp];
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setPwOtp(next);
    pwInputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const handleChangePassword = async () => {
    const code = pwOtp.join("");
    if (code.length !== 6) return toast.error("Enter the 6-digit code");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    setPwStep("submitting");
    try {
      await changePassword(code, newPassword);
      setPwStep("idle");
      setPwOtp(["", "", "", "", "", ""]);
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
      setPwStep("otp-sent");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#111111] shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#111111] px-6 py-5 rounded-t-3xl">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Manage account</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-600 dark:text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* ── Username ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-600 dark:text-gray-400">
              Username
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 flex-1 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-50 dark:bg-[#1c1c1c] px-4 text-sm text-gray-900 dark:text-white outline-none transition-all hover:border-gray-300 dark:border-gray-300 dark:border-white/20 focus:border-[#ea580c] focus:bg-white dark:bg-white dark:bg-[#1A1A1A] focus:ring-1 focus:ring-[#ea580c]"
              />
              <button
                onClick={handleSaveUsername}
                disabled={
                  savingUsername ||
                  username === user.username ||
                  !username.trim()
                }
                className="h-11 rounded-xl bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-40"
              >
                {savingUsername ? "..." : "Save"}
              </button>
            </div>
          </div>

          {/* ── Email ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-600 dark:text-gray-400">
              Email
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailStep !== "idle") {
                    setEmailStep("idle");
                    setEmailOtp(["", "", "", "", "", ""]);
                  }
                }}
                disabled={
                  emailStep === "otp-sent" || emailStep === "submitting"
                }
                className="h-11 flex-1 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-50 dark:bg-[#1c1c1c] px-4 text-sm text-gray-900 dark:text-white outline-none transition-all hover:border-gray-300 dark:border-gray-300 dark:border-white/20 focus:border-[#ea580c] focus:bg-white dark:bg-white dark:bg-[#1A1A1A] focus:ring-1 focus:ring-[#ea580c] disabled:opacity-50"
              />
              <button
                onClick={handleSendEmailOtp}
                disabled={
                  sendingEmailOtp ||
                  email.trim() === user.email ||
                  !email.trim() ||
                  emailStep === "otp-sent" ||
                  emailStep === "submitting"
                }
                className="h-11 rounded-xl bg-white px-5 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-40"
              >
                {sendingEmailOtp ? "..." : "Save"}
              </button>
            </div>

            {/* OTP verification area (appears after Save is clicked) */}
            {(emailStep === "otp-sent" || emailStep === "submitting") && (
              <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-50 dark:bg-[#1c1c1c] p-5">
                <p className="text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400">
                  A verification code has been sent to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex gap-2" onPaste={handleEmailOtpPaste}>
                  {emailOtp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (emailInputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleEmailOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleEmailOtpKeyDown(i, e)}
                      className="h-12 w-12 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#111111] text-center text-lg font-semibold text-white outline-none transition-all hover:border-gray-300 dark:border-gray-300 dark:border-white/20 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleVerifyEmailChange}
                    disabled={emailStep === "submitting"}
                    className="h-9 rounded-lg bg-gray-900 px-4 text-sm font-medium text-gray-900 dark:text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                  >
                    {emailStep === "submitting" ? "..." : "Verify & update"}
                  </button>
                  <button
                    onClick={() => {
                      setEmailStep("idle");
                      setEmailOtp(["", "", "", "", "", ""]);
                      setEmail(user.email);
                    }}
                    className="h-9 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Didn&apos;t receive a code?{" "}
                  <button
                    onClick={async () => {
                      setResendingEmailOtp(true);
                      try {
                        await sendEmailChangeOtp(email.trim());
                        setEmailOtp(["", "", "", "", "", ""]);
                        setEmailCooldown(30);
                      } catch (err) {
                        toast.error(
                          err.response?.data?.message || "Failed to resend",
                        );
                      } finally {
                        setResendingEmailOtp(false);
                      }
                    }}
                    disabled={resendingEmailOtp || emailCooldown > 0}
                    className="font-medium text-gray-900 transition-colors hover:text-gray-700 disabled:opacity-50"
                  >
                    {resendingEmailOtp
                      ? "Sending..."
                      : emailCooldown > 0
                        ? `Resend in ${emailCooldown}s`
                        : "Resend"}
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-white/10" />

          {/* ── Password ── */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600 dark:text-gray-600 dark:text-gray-400">
              Password
            </label>

            {pwStep === "idle" && (
              <button
                onClick={handleSendPwOtp}
                disabled={sendingOtp}
                className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-gray-50 dark:bg-[#1c1c1c] px-4 text-sm font-medium text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50"
              >
                {sendingOtp ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-300 dark:border-white/20 border-t-[#ea580c]" />
                ) : null}
                Change password
              </button>
            )}

            {(pwStep === "otp-sent" || pwStep === "submitting") && (
              <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 dark:border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-50 dark:bg-[#1c1c1c] p-5 mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-600 dark:text-gray-400">
                  A verification code has been sent to{" "}
                  <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
                </p>

                {/* OTP Inputs */}
                <div className="flex gap-2" onPaste={handlePwOtpPaste}>
                  {pwOtp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (pwInputsRef.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePwOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handlePwOtpKeyDown(i, e)}
                      className="h-12 w-12 rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#111111] text-center text-lg font-semibold text-white outline-none transition-all hover:border-gray-300 dark:border-gray-300 dark:border-white/20 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                    />
                  ))}
                </div>

                {/* New password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-white dark:bg-white dark:bg-[#111111] px-4 pr-10 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 dark:text-gray-400 dark:placeholder:text-gray-400 dark:placeholder:text-gray-600 hover:border-gray-300 dark:border-gray-300 dark:border-white/20 focus:border-[#ea580c] focus:bg-white dark:bg-white dark:bg-[#1A1A1A] focus:ring-1 focus:ring-[#ea580c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleChangePassword}
                    disabled={pwStep === "submitting"}
                    className="h-9 rounded-lg bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-gray-200 disabled:opacity-50"
                  >
                    {pwStep === "submitting" ? "..." : "Update password"}
                  </button>
                  <button
                    onClick={() => {
                      setPwStep("idle");
                      setPwOtp(["", "", "", "", "", ""]);
                      setNewPassword("");
                    }}
                    className="h-9 rounded-lg border border-gray-200 dark:border-gray-200 dark:border-white/10 px-4 text-sm font-medium text-gray-600 dark:text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Didn&apos;t receive a code?{" "}
                  <button
                    onClick={async () => {
                      setResendingPwOtp(true);
                      try {
                        await sendChangePasswordOtp();
                        setPwOtp(["", "", "", "", "", ""]);
                        setPwCooldown(30);
                      } catch (err) {
                        toast.error(
                          err.response?.data?.message || "Failed to resend",
                        );
                      } finally {
                        setResendingPwOtp(false);
                      }
                    }}
                    disabled={resendingPwOtp || pwCooldown > 0}
                    className="font-medium text-gray-900 dark:text-white transition-colors hover:text-gray-300 disabled:opacity-50"
                  >
                    {resendingPwOtp
                      ? "Sending..."
                      : pwCooldown > 0
                        ? `Resend in ${pwCooldown}s`
                        : "Resend"}
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div className="h-px bg-white/10" />

          {/* ── Danger zone ── */}
          <div>
            <p className="mb-2 text-sm font-medium text-red-500">Danger zone</p>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex h-11 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20 hover:border-red-500/30"
              >
                Delete account
              </button>
            ) : (
              <div className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-gray-50 dark:bg-gray-50 dark:bg-[#1c1c1c] p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <p className="text-sm text-gray-300 leading-relaxed">
                    This will permanently delete your account and all data. This
                    action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="h-9 rounded-lg bg-red-500 px-4 text-sm font-medium text-gray-900 dark:text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, delete my account"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="h-9 rounded-lg border border-gray-200 dark:border-gray-200 dark:border-white/10 bg-transparent px-4 text-sm font-medium text-gray-600 dark:text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
