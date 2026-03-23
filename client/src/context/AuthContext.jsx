import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const api = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    try {
      const { data } = await api.get("/me", { signal: controller.signal });
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
    const { data } = await api.post("/register", {
      username,
      email,
      password,
      turnstileToken,
    });
    toast.success("OTP sent to your email");
    return data;
  };

  const verifyOtp = async (email, otp) => {
    const { data } = await api.post("/verify-otp", { email, otp });
    setUser(data.user);
    toast.success("Email verified!");
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post("/resend-otp", { email });
    toast.success("OTP resent");
    return data;
  };

  const login = async (email, password, turnstileToken) => {
    const { data } = await api.post("/login", {
      email,
      password,
      turnstileToken,
    });
    setUser(data.user);
    toast.success("Welcome back!");
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post("/google", { credential });
    setUser(data.user);
    toast.success("Welcome back!");
    return data;
  };

  const setPassword = async (newPassword) => {
    const { data } = await api.post("/set-password", { newPassword });
    await fetchUser(); // Refresh user to get updated hasPassword flag or authProvider
    toast.success("Password set successfully");
    return data;
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    toast.success("Logged out");
  };

  const forgotPassword = async (email) => {
    const { data } = await api.post("/forgot-password", { email });
    toast.success("If an account exists, an OTP has been sent");
    return data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const { data } = await api.post("/reset-password", {
      email,
      otp,
      newPassword,
    });
    toast.success("Password reset successfully");
    return data;
  };

  const updateProfile = async (updates) => {
    const { data } = await api.put("/update-profile", updates);
    setUser(data.user);
    toast.success("Profile updated");
    return data;
  };

  const sendEmailChangeOtp = async (newEmail) => {
    const { data } = await api.post("/send-email-change-otp", { newEmail });
    toast.success("OTP sent to your new email");
    return data;
  };

  const verifyEmailChange = async (newEmail, otp) => {
    const { data } = await api.post("/verify-email-change", { newEmail, otp });
    setUser(data.user);
    toast.success("Email updated successfully");
    return data;
  };

  const sendChangePasswordOtp = async () => {
    const { data } = await api.post("/send-change-password-otp");
    toast.success("OTP sent to your email");
    return data;
  };

  const changePassword = async (otp, newPassword) => {
    const { data } = await api.post("/change-password", { otp, newPassword });
    toast.success("Password changed");
    return data;
  };

  const deleteAccount = async () => {
    await api.delete("/delete-account");
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
