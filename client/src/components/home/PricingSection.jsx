import React from "react";
import { PricingSection as UIPricingSection } from "../ui/pricing";

const PLANS = [
  {
    id: "free",
    name: "Free Tier",
    info: "Test the waters with our platform",
    price: {
      once: 0,
    },
    features: [
      { text: "100 Free Tokens on Signup" },
      { text: "Live Technical Interviews" },
      { text: "Resume Analyzer Access" },
      {
        text: "Community access",
        tooltip: "Get answers quickly on Discord",
      },
    ],
    btn: {
      text: "Start for Free",
      href: "/dashboard/billing",
    },
  },
  {
    highlighted: true,
    id: "starter",
    name: "Starter Pack",
    info: "Perfect for quick interview prep",
    price: {
      once: 9,
    },
    features: [
      { text: "100 AI Tokens" },
      { text: "Up to 5 Live Interviews" },
      { text: "Advanced AI Feedback" },
      {
        text: "Resume optimizer tool",
        tooltip: "Upload your resume and get ATS optimizations",
      },
      { text: "No Token Expiry" },
    ],
    btn: {
      text: "Buy for ₹9",
      href: "/dashboard/billing",
    },
  },
  {
    name: "Pro Pack",
    info: "For serious job seekers",
    price: {
      once: 59,
    },
    features: [
      { text: "1000 AI Tokens" },
      { text: "Up to 50 Live Interviews" },
      {
        text: "Best value bundle",
        tooltip: "Highest token-per-rupee ratio",
      },
      { text: "Save specific session history" },
      { text: "Premium Dedicated Support" },
    ],
    btn: {
      text: "Buy for ₹59",
      href: "/dashboard/billing",
    },
  },
];

export default function PricingSection() {
  return (
    <div className="py-24 relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
      <UIPricingSection
        plans={PLANS}
        frequencies={["once"]}
        hideFrequencyToggle={true}
        heading="Simple Token-Based Pricing"
        description="Get started with 100 free tokens. Buy more tokens whenever you need them. No recurring subscriptions!"
      />
    </div>
  );
}
