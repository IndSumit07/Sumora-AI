import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";

const INPUT =
  "h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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
    <AuthLayout
      leftText={
        <>
          Start your interview
          <br />
          prep journey
          <br />
          today.
        </>
      }
      heading="Get Started"
      subheading="Welcome to Sumora AI — Let's get started"
      footer={
        <>
          Already have account?{" "}
          <Link
            to="/login"
            className="font-semibold text-gray-900 dark:text-white underline decoration-gray-900/30 dark:decoration-white/30 underline-offset-4 hover:decoration-gray-900 dark:hover:decoration-white transition-colors"
          >
            Login
          </Link>
        </>
      }
    >
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
            className={INPUT}
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
            className={INPUT}
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
            "Create new account"
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
