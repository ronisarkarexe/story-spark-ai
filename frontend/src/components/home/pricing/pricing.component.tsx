import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaArrowRight, FaBolt, FaRegStar } from "react-icons/fa";

const plans = [
  {
    title: "Free Starter",
    price: "$0",
    duration: "/month",
    features: [
      "Access to basic AI model",
      "Generate up to 5 stories/month",
      "Standard community access",
      "Standard reading mode",
    ],
    linkTo: "/signup",
    buttonLabel: "Get Started",
    highlight: false,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Pro Creator",
    price: "$19",
    duration: "/month",
    features: [
      "Unlimited story generation",
      "Priority access to advanced models",
      "Co-writing & collaboration rooms",
      "Export to PDF & Markdown formats",
      "Plot-hole & consistency checker",
    ],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Free Trial",
    highlight: true,
    badge: "Most Popular",
    gradient: "from-indigo-600 via-purple-600 to-pink-500",
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    features: [
      "Everything in Pro Creator",
      "Team workspaces & billing",
      "Fine-tuned custom narrative styles",
      "Dedicated account manager",
      "API access with custom limits",
    ],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
    highlight: false,
    gradient: "from-purple-500 to-pink-500",
  },
];

export const PricingComponent = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 px-6 bg-slate-950 overflow-hidden" id="pricing-section">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-4">
            <FaRegStar size={12} className="text-indigo-400" />
            Pricing Plans
          </div>
          <h2 className="text-4xl font-extrabold text-white md:text-5xl mb-4 tracking-tight">
            Simple, <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Transparent</span> Pricing
          </h2>
          <p className="max-w-xl mx-auto text-slate-400 text-lg">
            Choose the perfect plan for your creative journey. Cancel or upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`relative flex flex-col rounded-3xl p-8 border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-indigo-500 bg-slate-900/80 shadow-2xl shadow-indigo-500/10 md:scale-105"
                  : "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-pink-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                    <FaBolt size={10} />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.title}</h3>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm">{plan.duration}</span>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-6" />

              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                      <FaCheck size={10} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => navigate(plan.linkTo)}
                className={`w-full rounded-xl py-3.5 px-4 font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg hover:shadow-indigo-500/20"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                }`}
              >
                {plan.buttonLabel}
                <FaArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComponent;
