import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { InterviewProvider } from "./context/InterviewContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <AuthProvider>
        <InterviewProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#18181b",
                color: "#fff",
                fontSize: "14px",
                borderRadius: "8px",
                padding: "10px 16px",
              },
            }}
          />
          <App />
        </InterviewProvider>
      </AuthProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>,
);
