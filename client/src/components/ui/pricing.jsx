import React from "react";
import { LiquidMetalButton } from "./liquid-metal-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "../../lib/utils";
import { CheckCircleIcon, StarIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const frequencies = ["monthly", "yearly"];

export function PricingSection({
  plans,
  heading,
  description,
  className,
  ...props
}) {
  const [frequency, setFrequency] = React.useState("monthly");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center space-y-5 p-4 z-10 relative",
        className,
      )}
      {...props}
    >
      <div className="mx-auto max-w-xl space-y-2">
        <h2 className="text-center text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl text-gray-900 dark:text-white">
          {heading}
        </h2>
        {description && (
          <p className="text-center text-sm md:text-base text-gray-600 dark:text-[#a8a19b] max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <PricingFrequencyToggle
        frequency={frequency}
        setFrequency={setFrequency}
      />
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
        {plans.map((plan) => (
          <PricingCard plan={plan} key={plan.name} frequency={frequency} />
        ))}
      </div>
    </div>
  );
}

export function PricingFrequencyToggle({
  frequency,
  setFrequency,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-white/40 dark:bg-[#161616]/40 backdrop-blur-md mx-auto flex w-fit rounded-full border border-gray-200 dark:border-[#2a2a2a] p-1 shadow-sm",
        className,
      )}
      {...props}
    >
      {frequencies.map((freq) => (
        <button
          key={freq}
          onClick={() => setFrequency(freq)}
          className={cn(
            "relative px-6 py-2 text-sm font-medium capitalize rounded-full transition-colors",
            frequency === freq
              ? "text-gray-900 dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white",
          )}
        >
          <span className="relative z-10">{freq}</span>
          {frequency === freq && (
            <motion.span
              layoutId="frequency"
              transition={{ type: "spring", duration: 0.4 }}
              className="absolute inset-0 z-0 rounded-full bg-white dark:bg-[#2a2a2a] shadow-sm border border-gray-200 dark:border-gray-700"
            />
          )}
        </button>
      ))}
    </div>
  );
}

export function PricingCard({
  plan,
  className,
  frequency = frequencies[0],
  ...props
}) {
  return (
    <div
      key={plan.name}
      className={cn(
        "relative flex w-full flex-col rounded-[2rem] border bg-white/40 dark:bg-[#161616]/40 backdrop-blur-md transition-transform duration-300 hover:-translate-y-1",
        plan.highlighted
          ? "border-[#ea580c] shadow-xl shadow-[#ea580c]/10 bg-white/60 dark:bg-[#1a1512]/80"
          : "border-gray-200 dark:border-[#2a2a2a]",
        className,
      )}
      {...props}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 rounded-t-[2rem] right-0 left-0 flex justify-center z-10">
          <span className="bg-gradient-to-r from-[#ea580c] to-[#f97316] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider py-1 sm:py-1.5 px-3 sm:px-4 rounded-full shadow-lg">
            Most Popular
          </span>
        </div>
      )}

      <div
        className={cn("rounded-t-[2rem] p-6 lg:p-8", plan.highlighted && "")}
      >
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {frequency === "yearly" &&
            plan.price.monthly > 0 &&
            plan.price.yearly < plan.price.monthly * 12 && (
              <p className="bg-[#0ea5e9]/10 text-[#0ea5e9] flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border border-[#0ea5e9]/20">
                {Math.round(
                  ((plan.price.monthly * 12 - plan.price.yearly) /
                    (plan.price.monthly * 12)) *
                    100,
                )}
                % off
              </p>
            )}
        </div>

        <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </div>
        <p className="text-gray-500 dark:text-[#a8a19b] text-sm mb-6 max-w-[200px]">
          {plan.info}
        </p>
        <h3 className="mt-2 flex items-baseline gap-1">
          <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
            ₹{plan.price[frequency]}
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium ml-1 text-sm sm:text-base">
            {plan.price[frequency] !== 0
              ? "/" + (frequency === "monthly" ? "mo" : "yr")
              : "/ forever"}
          </span>
        </h3>
      </div>
      <div
        className={cn(
          "space-y-4 px-6 lg:px-8 py-6 text-sm text-gray-700 dark:text-gray-300 flex-1",
          plan.highlighted && "",
        )}
      >
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <CheckCircleIcon
              className={cn(
                "h-5 w-5 shrink-0",
                plan.highlighted ? "text-[#ea580c]" : "text-[#0ea5e9]",
              )}
            />
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <p
                    className={cn(
                      "leading-relaxed",
                      feature.tooltip &&
                        "cursor-pointer border-b border-dashed border-gray-400 dark:border-gray-600",
                    )}
                  >
                    {feature.text}
                  </p>
                </TooltipTrigger>
                {feature.tooltip && (
                  <TooltipContent className="bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white border-gray-200 dark:border-[#2a2a2a]">
                    <p>{feature.tooltip}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        ))}
      </div>
      <div
        className={cn(
          "mt-auto w-full p-6 lg:p-8 pt-0 flex justify-center",
          plan.highlighted && "",
        )}
      >
        <LiquidMetalButton
          label={plan.btn.text}
          onClick={() => {
            window.location.href = plan.btn.href;
          }}
        />
      </div>
    </div>
  );
}
