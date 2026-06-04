import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    features: [
      "✓ 5 stories per month",
      "✓ Basic AI model access",
      "✓ Standard community support",
      "✓ Export to Plain Text",
    ],
    linkTo: "/signup",
    buttonLabel: "Get Started",
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    features: [
      "✓ Unlimited story generation",
      "✓ Advanced AI models (GPT-4 / Claude 3)",
      "✓ Priority email support",
      "✓ Advanced Markdown & PDF exports",
      "✓ Commercial usage rights",
    ],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Pro Trial",
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    features: [
      "✓ Everything in Pro",
      "✓ Real-time team collaboration",
      "✓ Dedicated account manager",
      "✓ Full API access",
      "✓ Custom model fine-tuning",
    ],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
  },
];

const PricingComponent = () => {
  const navigate = useNavigate();
  return (
    <section id="pricing-section" className="w-full box-border py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border relative z-10">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 select-none shadow-sm dark:shadow-none">
            <i className="fa-solid fa-credit-card text-xs"></i>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Flexible Tiers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
            Choose the operational workspace tier tailored perfectly to match your creative pipeline volume requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 sm:px-0 w-full box-border items-stretch">
          {plans.map((plan) => (
            <div 
              key={plan.title} 
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 border transition-all duration-300 flex flex-col justify-between w-full box-border group hover:shadow-xl ${
                plan.highlight 
                  ? "bg-white dark:bg-[#111827]/60 border-blue-500/40 dark:border-blue-500/40 shadow-md md:scale-[1.03]" 
                  : "bg-white dark:bg-[#111827]/30 border-slate-200 dark:border-white/10 shadow-sm hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-white select-none">
                  Popular
                </div>
              )}

              <div className="w-full box-border">
                <h3 className="mb-2 text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {plan.title}
                </h3>
                
                <div className="mb-6 flex items-baseline select-none">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-xs sm:text-sm font-medium text-slate-400 dark:text-slate-500">
                    {plan.duration}
                  </span>
                </div>

                <div className="h-px bg-slate-100 dark:bg-white/5 w-full mb-6" />

                <ul className="mb-8 list-none p-0 m-0 space-y-3.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      <div className="flex items-center justify-center h-5 w-5 shrink-0 select-none mt-0.5">
                        <i className={`fa-solid fa-circle-check text-xs ${plan.highlight ? "text-blue-500 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                type="button"
                onClick={() => navigate(plan.linkTo)}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] cursor-pointer select-none uppercase tracking-wider ${
                  plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/10"
                    : "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5"
                }`}
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