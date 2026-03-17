import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#372314]">
      <div className="flex w-full max-w-[1000px] bg-white rounded-[2rem] overflow-hidden shadow-2xl min-h-[600px] relative">
        {/* Left Panel */}
        <div className="hidden lg:flex w-1/2 bg-[#090909] m-3 rounded-[1.5rem] flex-col justify-between p-12 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-[2.5rem] leading-[1.1] font-medium text-white mb-2 tracking-tight">
              Recover your
              <br />
              account in
              <br />
              seconds.
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
            <div className="flex items-center gap-2.5 mb-6">
              <img src="/logo.png" alt="Sumora" className="h-14 w-auto" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">Sumora AI</span>
            </div>
            <h1 className="text-[2rem] font-semibold text-gray-900 mb-2 tracking-tight">
              Forgot password?
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your email and we&apos;ll send you a reset code.
            </p>
          </div>

          <div className="h-px bg-gray-100 w-full mb-8" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-400 font-medium">
                Your email
              </label>
              <input
                type="email"
                placeholder="hi@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-12 w-full rounded-xl bg-[#ea580c] text-sm font-medium text-white transition-all hover:bg-[#d24e0b] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "Send reset code"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-gray-900 underline decoration-gray-900/30 underline-offset-4 hover:decoration-gray-900 transition-colors"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
