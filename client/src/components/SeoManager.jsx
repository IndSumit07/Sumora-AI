import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://sumoraai.in";

const ROUTE_META = {
  "/": {
    title: "Sumora AI | AI Interview Preparation & Resume Analysis",
    description:
      "Practice interviews, analyze your resume, and improve faster with AI-driven feedback.",
    robots: "index, follow",
  },
  "/login": {
    title: "Login | Sumora AI",
    description:
      "Login to access your Sumora AI interview preparation dashboard.",
    robots: "noindex, nofollow",
  },
  "/register": {
    title: "Create Account | Sumora AI",
    description:
      "Create your Sumora AI account and start interview preparation.",
    robots: "noindex, nofollow",
  },
  "/forgot-password": {
    title: "Forgot Password | Sumora AI",
    description: "Reset your Sumora AI account password.",
    robots: "noindex, nofollow",
  },
  "/reset-password": {
    title: "Reset Password | Sumora AI",
    description: "Set a new password for your Sumora AI account.",
    robots: "noindex, nofollow",
  },
  "/verify-otp": {
    title: "Verify OTP | Sumora AI",
    description: "Verify your one-time password to continue.",
    robots: "noindex, nofollow",
  },
};

function ensureMeta(selector, attr, value) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  return tag;
}

function setMetaName(name, content) {
  const tag = ensureMeta(`meta[name="${name}"]`, "name", name);
  tag.setAttribute("content", content);
}

function setMetaProperty(property, content) {
  const tag = ensureMeta(`meta[property="${property}"]`, "property", property);
  tag.setAttribute("content", content);
}

function getRouteMeta(pathname) {
  if (pathname.startsWith("/dashboard")) {
    return {
      title: "Dashboard | Sumora AI",
      description:
        "Your Sumora AI dashboard for interview practice and analysis.",
      robots: "noindex, nofollow",
    };
  }

  return ROUTE_META[pathname] || ROUTE_META["/"];
}

export default function SeoManager() {
  const location = useLocation();

  useEffect(() => {
    const { pathname } = location;
    const meta = getRouteMeta(pathname);
    const canonicalUrl = `${SITE_URL}${pathname === "/" ? "/" : pathname}`;

    document.title = meta.title;

    setMetaName("description", meta.description);
    setMetaName("robots", meta.robots);

    setMetaProperty("og:title", meta.title);
    setMetaProperty("og:description", meta.description);
    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:type", "website");
    setMetaProperty("og:image", `${SITE_URL}/logo.png`);

    setMetaName("twitter:title", meta.title);
    setMetaName("twitter:description", meta.description);
    setMetaName("twitter:image", `${SITE_URL}/logo.png`);

    let canonical = document.head.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [location]);

  return null;
}
