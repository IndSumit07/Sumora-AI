import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const OTP_INPUT =
  "h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-center text-lg font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

const PASS_INPUT =
  "h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 pr-11 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

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
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
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
    <AuthLayout
      leftText={
        <>
          Create a new
          <br />
          password and
          <br />
          stay secure.
        </>
      }
      heading="Reset password"
      subheading={
        <>
          Enter the code sent to{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {email}
          </span>{" "}
          and choose a new password.
        </>
      }
      footer={
        <>
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
            className="font-semibold text-gray-900 dark:text-white underline decoration-gray-900/30 dark:decoration-white/30 underline-offset-4 hover:decoration-gray-900 dark:hover:decoration-white transition-colors disabled:opacity-50"
          >
            {resending
              ? "Sending..."
              : cooldown > 0
                ? `Resend in ${cooldown}s`
                : "Resend"}
          </button>
        </>
      }
    >
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
                className={OTP_INPUT}
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
              className={PASS_INPUT}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Must be at least 6 characters
          </p>
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
    </AuthLayout>
  );
};

export default ResetPasswordPage;
