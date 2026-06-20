import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

interface PricingTier {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: 0,
    period: "/month",
    description: "Get started with the basics",
    features: ["Basic AI assistance", "5 stories per month"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: 19,
    period: "/month",
    description: "For serious storytellers",
    features: ["Unlimited stories", "Priority support"],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 49,
    period: "/month",
    description: "For teams and organizations",
    features: ["Team collaboration", "API access"],
    cta: "Contact Sales",
  },
];

const PricingComponent: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (tier: PricingTier) => {
    if (tier.name === "Enterprise") {
      navigate("/contact-us");
      return;
    }
    navigate(`/pricing/payment?plan=${tier.name}&price=${tier.price}`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Choose the plan that fits your storytelling journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300 ${
                tier.highlighted
                  ? "bg-gradient-to-br from-fuchsia-600 to-orange-500 text-white shadow-xl shadow-fuchsia-500/20 scale-100 md:scale-105"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white shadow-sm hover:shadow-lg"
              }`}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-fuchsia-700 text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full shadow">
                  Most Popular
                </span>
              )}

              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p
                className={`mt-1 text-sm ${
                  tier.highlighted ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {tier.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">${tier.price}</span>
                <span
                  className={`text-sm font-medium ${
                    tier.highlighted ? "text-white/70" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {tier.period}
                </span>
              </div>

              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check
                      size={16}
                      className={tier.highlighted ? "text-white" : "text-fuchsia-600 dark:text-fuchsia-400"}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleSelectPlan(tier)}
                className={`mt-8 w-full rounded-xl py-3 text-sm font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  tier.highlighted
                    ? "bg-white text-fuchsia-700 hover:bg-slate-100 focus-visible:ring-white"
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 focus-visible:ring-fuchsia-500"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComponent;