import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Lenis from "lenis";
import ServerWakeOverlay from "./components/ServerWakeOverlay";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import DashboardHome from "./components/dashboard/DashboardHome";
import InterviewView from "./components/dashboard/interview/InterviewView";
import AnalyzeView from "./components/dashboard/analyze/AnalyzeView";
import PrepareView from "./components/dashboard/prepare/PrepareView";
import BillingView from "./components/dashboard/billing/BillingView";
import StatsView from "./components/dashboard/views/StatsView";
import SeoManager from "./components/SeoManager";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#ea580c] border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
      smoothTouch: false,
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [location.pathname]);

  return (
    <>
      <SeoManager />
      <ServerWakeOverlay />
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="interview" element={<InterviewView />} />
          <Route path="analyze" element={<AnalyzeView />} />
          <Route path="prepare" element={<PrepareView />} />
          <Route path="stats" element={<StatsView />} />
          <Route path="billing" element={<BillingView />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
