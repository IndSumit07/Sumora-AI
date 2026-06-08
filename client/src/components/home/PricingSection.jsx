import { Check, Zap, Star } from "lucide-react";
import PRICING_PLANS from "../../shared/pricing.json";

const PLANS = [
  {
    id: PRICING_PLANS.free.id,
    name: PRICING_PLANS.free.name,
    info: PRICING_PLANS.free.info,
    price: PRICING_PLANS.free.price,
    tokens: PRICING_PLANS.free.tokens,
    features: PRICING_PLANS.free.features,
    btnText: "Start for Free",
    href: "/dashboard/billing",
    highlighted: false,
  },
  {
    id: PRICING_PLANS.starter.id,
    name: PRICING_PLANS.starter.name,
    info: PRICING_PLANS.starter.info,
    price: PRICING_PLANS.starter.price,
    originalPrice: PRICING_PLANS.starter.originalPrice,
    discountText: PRICING_PLANS.starter.discountText,
    tokens: PRICING_PLANS.starter.tokens,
    features: PRICING_PLANS.starter.features,
    btnText: `Buy for ₹${PRICING_PLANS.starter.price}`,
    href: "/dashboard/billing",
    highlighted: true,
  },
  {
    id: PRICING_PLANS.pro.id,
    name: PRICING_PLANS.pro.name,
    info: PRICING_PLANS.pro.info,
    price: PRICING_PLANS.pro.price,
    originalPrice: PRICING_PLANS.pro.originalPrice,
    discountText: PRICING_PLANS.pro.discountText,
    tokens: PRICING_PLANS.pro.tokens,
    features: PRICING_PLANS.pro.features,
    btnText: `Buy for ₹${PRICING_PLANS.pro.price}`,
    href: "/dashboard/billing",
    highlighted: false,
  },
];

function PlanCard({ plan }) {
  return (
    <div
      className={[
        "relative flex flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
        plan.highlighted
          ? "border-[#ea580c] bg-gradient-to-br from-[#ea580c]/10 via-[#ea580c]/5 to-transparent shadow-xl shadow-[#ea580c]/10"
          : "border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#161616] shadow-sm",
      ].join(" ")}
    >
      {/* Popular badge */}
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 bg-[#ea580c] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#ea580c]/30">
            <Star size={11} className="fill-white" /> Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#ea580c] mb-1">
          {plan.name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{plan.info}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        {plan.originalPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-gray-400 line-through">
              ₹{plan.originalPrice}
            </span>
            {plan.discountText && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                {plan.discountText}
              </span>
            )}
          </div>
        )}
        <div className="flex items-end gap-1">
          {plan.price === 0 ? (
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              Free
            </span>
          ) : (
            <>
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                ₹{plan.price}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500 mb-1.5">
                /one-time
              </span>
            </>
          )}
        </div>
        {plan.tokens && (
          <div className="flex items-center gap-1.5 mt-2">
            <Zap size={13} className="text-[#ea580c] fill-[#ea580c]" />
            <span className="text-sm font-semibold text-[#ea580c]">
              {plan.tokens} AI Tokens
            </span>
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span className="flex-shrink-0 mt-0.5 h-4 w-4 rounded-full bg-[#ea580c]/15 flex items-center justify-center">
              <Check size={10} className="text-[#ea580c]" />
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {f.text}
              {f.tooltip && (
                <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                  ({f.tooltip})
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={plan.href}
        className={[
          "flex items-center justify-center gap-2 h-12 rounded-2xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
          plan.highlighted
            ? "bg-[#ea580c] text-white hover:bg-[#d24e0b] shadow-lg shadow-[#ea580c]/25"
            : "bg-gray-100 dark:bg-[#222] text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]",
        ].join(" ")}
      >
        {plan.price > 0 && <Zap size={14} className={plan.highlighted ? "fill-white" : ""} />}
        {plan.btnText}
      </a>
    </div>
  );
}

export default function PricingSection() {
  return (
    <div className="py-24 relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-14">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ea580c] mb-3">
          Pricing
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple Token-Based Pricing
        </h2>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Get started with 100 free tokens. Buy more whenever you need them. No
          recurring subscriptions!
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id || plan.name} plan={plan} />
        ))}
      </div>
    </div>
  );
}
