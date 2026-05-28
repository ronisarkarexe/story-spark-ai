import React from "react";
import { useNavigate } from "react-router-dom";

const pricingPlans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    features: [
      "Basic AI writing assistance",
      "5 stories per month",
      "Community access",
    ],
    buttonLabel: "Get Started",
    buttonStyle:
      "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10",
    highlight: false,
    // Free plan → signup
    linkto: "/signup",
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    features: [
      "Advanced AI writing tools",
      "Unlimited stories",
      "Priority support",
      "Analytics dashboard",
    ],
    buttonLabel: "Start Pro Trial",
    buttonStyle:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25",
    highlight: true,
    // Pass plan info to payment page
    linkto: "/payment?plan=Pro&price=19",
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    features: [
      "Custom AI models",
      "Team collaboration",
      "API access",
      "24/7 dedicated support",
    ],
    buttonLabel: "Contact Sales",
    buttonStyle:
      "bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white shadow-slate-900/10",
    highlight: false,
    // Enterprise → contact page (replaces broken /sales)
    linkto: "/contact-us",
  },
];

const PricingComponent = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-16 py-12" id="pricing-section">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Simple, Transparent Pricing
        </h2>

        <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the plan that best fits your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`
              motion-card
              relative
              p-8
              rounded-2xl
              backdrop-blur-md
              transition-all duration-300
              hover:scale-[1.02]
              cursor-pointer
              ${
                plan.highlight
                  ? "bg-slate-50/80 dark:bg-indigo-950/20 border-2 border-indigo-500 shadow-xl shadow-indigo-500/5"
                  : "bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 shadow-md shadow-slate-100 dark:shadow-none hover:border-indigo-500/30"
              }
            `}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-bl-xl rounded-tr-2xl shadow-sm">
                Popular
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">
              {plan.title}
            </h3>

            {/* Price */}
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {plan.price}
              </span>

              <span className="text-slate-500 dark:text-slate-500 ml-1">
                {plan.duration}
              </span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-400">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i>

                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              className={`motion-cta mt-8 block w-full text-center font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer ${plan.buttonStyle}`}
              onClick={() => navigate(plan.linkto)}
            >
              {plan.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingComponent;