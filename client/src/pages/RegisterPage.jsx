import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import { useGoogleLogin } from "@react-oauth/google";
import { Turnstile } from "react-turnstile";

const INPUT =
  "h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] px-4 text-sm text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]";

const RegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!turnstileToken) {
      toast.error("Please complete the captcha");
      return;
    }

    setLoading(true);
    try {
      await register(form.username, form.email, form.password, turnstileToken);
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      const message =
        err.response?.data?.reason && err.response?.data?.message
          ? `${err.response.data.message} (${err.response.data.reason})`
          : err.response?.data?.message || "Registration failed";
      toast.error(message);
      setTurnstileToken("");
      turnstileRef.current?.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        await googleLogin(tokenResponse.access_token);
        navigate("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Google signup failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google signup failed");
    },
  });

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
        <div className="flex justify-center flex-col gap-2">
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            className="h-12 w-full rounded-xl border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#1a1a1a] text-sm font-medium text-gray-900 dark:text-white transition-all hover:bg-gray-50 dark:hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-[#ea580c] focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 41.939 C -8.804 40.009 -11.514 38.889 -14.754 38.889 C -19.444 38.889 -23.494 41.589 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                />
              </g>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="h-px flex-1 bg-gray-200 dark:bg-[#2a2a2a]" />
          <span className="text-xs text-gray-500 uppercase">Or</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-[#2a2a2a]" />
        </div>

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

        <div className="flex justify-center">
          {siteKey ? (
            <Turnstile
              ref={turnstileRef}
              sitekey={siteKey}
              options={{ theme: "light" }}
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken("")}
              onError={() => setTurnstileToken("")}
            />
          ) : (
            <p className="text-xs text-red-500">
              Missing captcha key. Set VITE_TURNSTILE_SITE_KEY in client env.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !turnstileToken || !siteKey}
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
