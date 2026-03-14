import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { resetPassword, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) navigate("/forgot-password", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    text.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setOtp(next);
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Enter the 6-digit code");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#372314]">
      <div className="flex w-full max-w-[1000px] bg-white rounded-[2rem] overflow-hidden shadow-2xl min-h-[600px] relative">
        {/* Left Panel */}
        <div className="hidden lg:flex w-1/2 bg-[#090909] m-3 rounded-[1.5rem] flex-col justify-between p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-[2.5rem] leading-[1.1] font-medium text-white mb-2 tracking-tight">
              Create a new
              <br />
              password and
              <br />
              stay secure.
            </h1>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[60%] flex items-end justify-center gap-4 opacity-80 pointer-events-none">
            <div className="w-16 h-full bg-gradient-to-t from-[#ea580c] to-transparent blur-2xl" />
            <div className="w-24 h-[80%] bg-gradient-to-t from-[#ea580c] to-transparent blur-3xl opacity-70" />
            <div className="w-20 h-full bg-gradient-to-t from-[#ea580c] to-transparent blur-2xl opacity-90" />
            <div className="w-16 h-[60%] bg-gradient-to-t from-[#f97316] to-transparent blur-3xl opacity-60" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 relative z-10">
          <div className="mb-6">
            <svg
              viewBox="0 0 24 24"
              className="w-10 h-10 text-[#ea580c] mb-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
            <h1 className="text-[2rem] font-semibold text-gray-900 mb-2 tracking-tight">
              Reset password
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the code sent to{" "}
              <span className="font-medium text-gray-700">{email}</span>{" "}
              and choose a new password.
            </p>
          </div>

          <div className="h-px bg-gray-100 w-full mb-8" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] text-gray-400 font-medium">
                Verification code
              </label>
              <div className="flex gap-2" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="h-12 w-full rounded-xl border border-gray-200 text-center text-lg font-semibold text-gray-900 outline-none transition-all focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-400 font-medium">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-11 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-gray-400">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Reset password"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Didn&apos;t receive a code?{" "}
            <button
              onClick={async () => {
                setResending(true);
                try {
                  await forgotPassword(email);
                  setCooldown(30);
                } catch (err) {
                  toast.error(err.response?.data?.message || "Failed to resend");
                } finally {
                  setResending(false);
                }
              }}
              disabled={resending || cooldown > 0}
              className="font-semibold text-gray-900 underline decoration-gray-900/30 underline-offset-4 hover:decoration-gray-900 transition-colors disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
