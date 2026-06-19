import React from "react";
import { motion } from "framer-motion";

const PricingComponent = () => {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      features: ["5 stories/month", "Basic AI assistance", "Community access"],
    },
    {
      name: "Pro",
      price: "$29",
      features: ["Unlimited stories", "Advanced AI features", "Priority support", "Analytics"],
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Custom features", "Dedicated support", "API access", "Team collaboration"],
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`rounded-lg p-8 ${
                plan.highlighted
                  ? "bg-indigo-600 text-white scale-105"
                  : "bg-white border border-slate-200 text-slate-900"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-6">{plan.price}</p>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <span className="mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`w-full mt-8 py-2 px-4 rounded-lg font-semibold transition ${
                  plan.highlighted
                    ? "bg-white text-indigo-600 hover:bg-slate-100"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComponent;
