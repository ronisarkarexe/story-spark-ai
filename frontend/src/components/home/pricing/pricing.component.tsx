import React from "react";
import { Link } from "react-router-dom";

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
    buttonStyle: "bg-slate-700 hover:bg-slate-600 text-white",
    highlight: false,
    linkto: "/signup"
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
    buttonStyle: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25",
    highlight: true,
    linkto: "/payment"
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
    buttonStyle: "bg-slate-800 hover:bg-slate-700 text-white",
    highlight: false,
    linkto: "/payment"
  },
];

const PricingComponent = () => {
  return (
    <section className="mb-16 py-12" id="pricing-section">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-gray-100">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-4 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
          Choose the plan that best fits your needs
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-6">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-blue-500/5 dark:bg-blue-500/10 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 cursor-pointer ${
              plan.highlight
                ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/10"
                : ""
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded-bl-2xl rounded-tr-3xl uppercase tracking-wider">
                Popular
              </div>
            )}
            
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">
              {plan.title}
            </h3>
            
            <div className="mb-6 flex items-baseline">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                {plan.price}
              </span>
              <span className="text-slate-500 dark:text-slate-400 ml-1 text-sm font-semibold">
                {plan.duration}
              </span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <i className="fas fa-check text-green-500 mt-1 mr-3 shrink-0"></i>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
            
            <Link 
              to={plan.linkto} 
              className={`block w-full text-center font-bold py-3 px-4 rounded-xl transition-all duration-200 uppercase tracking-wider text-xs active:scale-[0.98] ${plan.buttonStyle}`}
            >
              {plan.buttonLabel}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingComponent;
