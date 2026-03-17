import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const INPUT =
  "h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftText={
        <>
          Ace your next
          <br />
          interview with
          <br />
          AI preparation.
        </>
      }
      heading="Welcome Back"
      subheading="Sign in to your Sumora AI account"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-gray-900 dark:text-white underline decoration-gray-900/30 dark:decoration-white/30 underline-offset-4 hover:decoration-gray-900 dark:hover:decoration-white transition-colors"
          >
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            className={INPUT}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[13px] text-gray-400 font-medium">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-[12px] text-[#ea580c] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            name="password"
            type="password"
            placeholder="**********"
            value={form.password}
            onChange={handleChange}
            required
            className={INPUT}
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
            "Log in to your account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
