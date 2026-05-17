import React, { useState } from "react";

const pricingPlans = [
  {
    title: "Free",
    monthly: 0,
    yearly: 0,
    features: [
      "Basic AI writing assistance",
      "5 stories per month",
      "Community access",
    ],
    buttonLabel: "Get Started",
    highlight: false,
  },
  {
    title: "Pro",
    monthly: 19,
    yearly: 169,
    features: [
      "Advanced AI writing tools",
      "Unlimited stories",
      "Priority support",
      "Analytics dashboard",
    ],
    buttonLabel: "Start Pro Trial",
    highlight: true,
  },
  {
    title: "Enterprise",
    monthly: 49,
    yearly: 449,
    features: [
      "Custom AI models",
      "Team collaboration",
      "API access",
      "24/7 dedicated support",
    ],
    buttonLabel: "Contact Sales",
    highlight: false,
  },
];

const formatPrice = (value: number) => `$${value}`;

const PricingComponent: React.FC = () => {
  const [billingAnnual, setBillingAnnual] = useState(false);

  return (
    <section className="mb-16 py-12" id="pricing-section">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-50">Simple, Transparent Pricing</h2>
        <p className="mt-2 text-gray-300 max-w-2xl mx-auto">Choose the plan that best fits your needs</p>
        <div className="inline-flex items-center gap-3 mt-4 bg-white/3 rounded-full p-1 px-2">
          <span className={`px-3 py-1 rounded-full text-sm cursor-pointer ${!billingAnnual ? 'bg-white/7 text-white' : 'text-gray-300'}`} onClick={() => setBillingAnnual(false)}>Monthly</span>
          <span className={`px-3 py-1 rounded-full text-sm cursor-pointer ${billingAnnual ? 'bg-amber-500 text-black font-semibold' : 'text-gray-300'}`} onClick={() => setBillingAnnual(true)}>Annual</span>
          <span className="ml-3 text-xs text-slate-400">Save up to 2 months on annual</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {pricingPlans.map((plan, index) => {
          const price = billingAnnual ? plan.yearly : plan.monthly;
          const duration = billingAnnual ? "/year" : "/month";
          return (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border backdrop-blur bg-gradient-to-b from-white/3 to-white/2 border-white/8 shadow-[0_8px_30px_rgba(2,6,23,0.6)] transition-transform duration-300 hover:-translate-y-2 ${plan.highlight ? 'scale-[1.02] border-indigo-400/40' : ''}`}
            >

              <div className={`pointer-events-none absolute -inset-[1px] rounded-[1.5rem] ${plan.highlight ? 'opacity-100' : 'opacity-40'} bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.18),transparent 30%)] blur-lg`} />
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 text-sm rounded-full shadow-md">Most Popular</div>
              )}

              <h3 className="text-xl font-semibold mb-2 text-slate-100">{plan.title}</h3>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white">{formatPrice(price)}</span>
                <span className="text-slate-400">{duration}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-7 h-7 inline-flex items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                      <i className="fas fa-check text-emerald-400" />
                    </span>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full rounded-lg px-4 py-3 ${plan.highlight ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg hover:from-indigo-600' : 'bg-white/6 text-white hover:bg-white/8'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300`}
              >
                {plan.buttonLabel}
              </button>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingComponent;
