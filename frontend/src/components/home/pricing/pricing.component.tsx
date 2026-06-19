import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    features: ["Basic AI assistance", "5 stories per month"],
    linkTo: "/signup",
    buttonLabel: "Get Started",
    highlight: false,
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    features: ["Unlimited stories", "Priority support", "Advanced AI models"],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Pro Trial",
    highlight: true,
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    features: ["Team collaboration", "API access", "Dedicated support"],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
    highlight: false,
  },
];

const PricingComponent = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-20" id="pricing-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-400">
            Choose the plan that fits your creative journey. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`motion-card relative flex flex-col rounded-2xl border p-7 shadow-lg transition-all duration-300 ${
                plan.highlight
                  ? "border-indigo-500/60 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-indigo-200/60 dark:border-indigo-500/40 dark:from-indigo-950/60 dark:to-violet-950/60 dark:shadow-indigo-900/30"
                  : "border-slate-200 bg-white dark:border-slate-700/50 dark:bg-slate-800/60"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-indigo-500/30">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{plan.title}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-slate-50">{plan.price}</span>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{plan.duration}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                      <svg className="h-5 w-5 shrink-0 text-indigo-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`motion-cta mt-8 w-full rounded-xl px-5 py-3 text-sm font-bold transition-all duration-200 ${
                  plan.highlight
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
                    : "border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                }`}
                onClick={() => navigate(plan.linkTo)}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingComponent;
