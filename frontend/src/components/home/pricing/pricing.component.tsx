import React from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  price: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: 0,
    description: "Get started with the basics",
    features: [
      "Generate up to 5 stories/month",
      "1 story variation per prompt",
      "Community access",
    ],
  },
  {
    name: "Pro",
    price: 19.99,
    description: "For regular creators",
    features: [
      "Unlimited story generations",
      "Up to 5 variations per prompt",
      "Priority support",
      "Early access to new features",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: 49.99,
    description: "For groups and studios",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Shared story libraries",
      "Dedicated support",
    ],
  },
];

const PricingMainComponent = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: Plan) => {
    if (plan.price === 0) {
      navigate("/signup");
      return;
    }
    navigate(`/payment?plan=${encodeURIComponent(plan.name)}&price=${plan.price}`);
  };

  return (
    <section className="w-full box-border mb-12 text-slate-900 dark:text-slate-100">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Choose the plan that fits how you create.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 flex flex-col ${
              plan.highlighted
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-[1.02]"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {plan.description}
            </p>

            <div className="mb-6">
              <span className="text-3xl font-extrabold">
                ${plan.price.toFixed(2)}
              </span>
              {plan.price > 0 && (
                <span className="text-slate-500 dark:text-slate-400 text-sm">
                  {" "}
                  / month
                </span>
              )}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`w-full py-2.5 rounded-lg font-semibold transition ${
                plan.highlighted
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {plan.price === 0 ? "Get Started" : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingMainComponent;