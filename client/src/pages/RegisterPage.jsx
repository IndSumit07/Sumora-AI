import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
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
              Start your interview
              <br />
              prep journey
              <br />
              today.
            </h1>
          </div>

          {/* Abstract glowing bars background */}
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
            <img src="/light_logo.png" alt="Sumora" className="h-10 w-auto mb-6" />

            <h1 className="text-[2rem] font-semibold text-gray-900 mb-2 tracking-tight">
              Get Started
            </h1>
            <p className="text-gray-400 text-sm">
              Welcome to Sumora AI — Let's get started
            </p>
          </div>

          <div className="h-px bg-gray-100 w-full mb-8" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-400 font-medium">
                Username
              </label>
              <input
                name="username"
                type="text"
                placeholder="johndoe"
                value={form.username}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-400 font-medium">
                Your email
              </label>
              <input
                name="email"
                type="email"
                placeholder="hi@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-gray-400 font-medium">
                Create new password
              </label>
              <input
                name="password"
                type="password"
                placeholder="**********"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
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
                "Create new account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have account?{" "}
            <Link
              to="/login"
              className="font-semibold text-gray-900 underline decoration-gray-900/30 underline-offset-4 hover:decoration-gray-900 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
