import React from "react";
import { PricingSection as UIPricingSection } from "../ui/pricing";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    info: "Perfect for quick preparations",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      { text: "3 AI Interviews per month" },
      { text: "Basic textual feedback" },
      { text: "Standard difficulty models" },
      {
        text: "Community access",
        tooltip: "Get answers quickly on Discord",
      },
      { text: "Resume tips" },
    ],
    btn: {
      text: "Start for Free",
      href: "#",
    },
  },
  {
    highlighted: true,
    id: "pro",
    name: "Pro",
    info: "For serious job seekers",
    price: {
      monthly: 1499,
      yearly: Math.round(1499 * 12 * (1 - 0.2)), // 20% off for yearly
    },
    features: [
      { text: "Unlimited AI Interviews" },
      { text: "Deep-dive analytic feedback" },
      { text: "Advanced voice LLM capabilities" },
      {
        text: "Resume optimizer tool",
        tooltip: "Upload your resume and get ATS optimizations",
      },
      { text: "Priority support", tooltip: "Get 24/7 dedicated support" },
      { text: "Save specific session history" },
    ],
    btn: {
      text: "Upgrade to Pro",
      href: "#",
    },
  },
  {
    name: "Business",
    info: "For hiring teams & large organizations",
    price: {
      monthly: 5999,
      yearly: Math.round(5999 * 12 * (1 - 0.25)), // 25% off for yearly
    },
    features: [
      { text: "Unlimited organization usage" },
      {
        text: "Custom AI personas",
        tooltip: "Train the AI on your specific hiring needs",
      },
      { text: "Role-specific assessment rubrics" },
      { text: "Advanced analytics dashboard" },
      { text: "API Access", tooltip: "Integrate directly into your ATS" },
      { text: "Dedicated Account Manager" },
    ],
    btn: {
      text: "Contact Team",
      href: "#",
    },
  },
];

export default function PricingSection() {
  return (
    <div className="py-24 relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
      <UIPricingSection
        plans={PLANS}
        heading="Plans that Scale with You"
        description="Whether you're preparing for your first interview or optimizing your hiring process, we have the right plan for you."
      />
    </div>
  );
}
