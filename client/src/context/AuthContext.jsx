import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../lib/api";

const AuthContext = createContext(null);

// All requests go through the shared api instance (baseURL = VITE_API_URL + /api)
// so paths here start with /auth

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const { data } = await api.get("/auth/me", { signal: controller.signal });
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const register = async (username, email, password, turnstileToken) => {
    const { data } = await api.post("/auth/register", {
      username,
      email,
      password,
      turnstileToken,
    });
    toast.success("OTP sent to your email");
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    setUser(data.user);
    toast.success("Email verified!");
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post("/auth/resend-otp", { email });
    toast.success("OTP resent");
    return data;
  };

  const login = async (email, password, turnstileToken) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
      turnstileToken,
    });
    setUser(data.user);
    toast.success("Welcome back!");
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post("/auth/google", { credential });
    setUser(data.user);
    toast.success("Welcome back!");
    return data;
  };

  const setPassword = async (newPassword) => {
    const { data } = await api.post("/auth/set-password", { newPassword });
    await fetchUser(); // Refresh user to get updated hasPassword flag or authProvider
    toast.success("Password set successfully");
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    toast.success("Logged out");
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    toast.success("If an account exists, an OTP has been sent");
    return data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const { data } = await api.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    toast.success("Password reset successfully");
    return data;
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put("/auth/update-profile", updates);
    setUser(data.user);
    toast.success("Profile updated");
    return data;
  };

  const sendEmailChangeOtp = async (newEmail) => {
    const { data } = await api.post("/auth/send-email-change-otp", { newEmail });
    toast.success("OTP sent to your new email");
    return data;
  };

  const verifyEmailChange = async (newEmail, otp) => {
    const { data } = await api.post("/auth/verify-email-change", { newEmail, otp });
    setUser(data.user);
    toast.success("Email updated successfully");
    return data;
  };

  const sendChangePasswordOtp = async () => {
    const { data } = await api.post("/auth/send-change-password-otp");
    toast.success("OTP sent to your email");
    return data;
  };

  const changePassword = async (otp, newPassword) => {
    const { data } = await api.post("/auth/change-password", { otp, newPassword });
    toast.success("Password changed");
    return data;
  };

  const deleteAccount = async () => {
    await api.delete("/auth/delete-account");
    setUser(null);
    toast.success("Account deleted");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        register,
        verifyOtp,
        resendOtp,
        login,
        googleLogin,
        setPassword,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        sendEmailChangeOtp,
        verifyEmailChange,
        sendChangePasswordOtp,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
