import React from "react";
import { PricingSection as UIPricingSection } from "../ui/pricing";
import PRICING_PLANS from "../../shared/pricing.json";

const PLANS = [
  {
    id: PRICING_PLANS.free.id,
    name: PRICING_PLANS.free.name,
    info: PRICING_PLANS.free.info,
    price: {
      once: PRICING_PLANS.free.price,
    },
    features: PRICING_PLANS.free.features,
    btn: {
      text: "Start for Free",
      href: "/dashboard/billing",
    },
  },
  {
    highlighted: true,
    id: PRICING_PLANS.starter.id,
    name: PRICING_PLANS.starter.name,
    info: PRICING_PLANS.starter.info,
    originalPrice: PRICING_PLANS.starter.originalPrice,
    discountText: PRICING_PLANS.starter.discountText,
    tokens: PRICING_PLANS.starter.tokens,
    price: {
      once: PRICING_PLANS.starter.price,
    },
    features: PRICING_PLANS.starter.features,
    btn: {
      text: `Buy for ₹${PRICING_PLANS.starter.price}`,
      href: "/dashboard/billing",
    },
  },
  {
    name: PRICING_PLANS.pro.name,
    info: PRICING_PLANS.pro.info,
    originalPrice: PRICING_PLANS.pro.originalPrice,
    discountText: PRICING_PLANS.pro.discountText,
    tokens: PRICING_PLANS.pro.tokens,
    price: {
      once: PRICING_PLANS.pro.price,
    },
    features: PRICING_PLANS.pro.features,
    btn: {
      text: `Buy for ₹${PRICING_PLANS.pro.price}`,
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
