import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const OTP_INPUT =
  "h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-center text-lg font-semibold text-gray-900 dark:text-white outline-none transition-all focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

const VerifyOtpPage = () => {
  const { verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!email) navigate("/register", { replace: true });
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleChange = (index, value) => {
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
    setLoading(true);
    try {
      await verifyOtp(email, code);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOtp(email);
      setCooldown(30);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  if (!email) return null;

  return (
    <AuthLayout
      leftText={
        <>
          Check your
          <br />
          inbox and
          <br />
          verify.
        </>
      }
      heading="Check your email"
      subheading={
        <>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {email}
          </span>
        </>
      }
      footer={
        <>
          Didn&apos;t receive a code?{" "}
          <button
            onClick={handleResend}
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={OTP_INPUT}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            "Verify email"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtpPage;
