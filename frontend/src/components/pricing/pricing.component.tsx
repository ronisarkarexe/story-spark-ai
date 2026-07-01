import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    features: [
      "Basic AI assistance",
      "5 stories per month",
    ],
    linkTo: "/signup",
    buttonLabel: "Get Started",
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    features: [
      "Unlimited stories",
      "Priority support",
      "Advanced AI features",
      "Faster generation",
    ],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Pro Trial",
    featured: true,
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    features: [
      "Team collaboration",
      "API access",
      "Dedicated support",
      "Custom integrations",
    ],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
  },
];

const PricingComponent = () => {
  const navigate = useNavigate();

  return (
    <section className="story-section" id="pricing-section">
      <div className="story-page-shell">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="story-section-heading">
            Simple, Transparent Pricing
          </h2>

          <p className="mt-4 text-slate-400">
            Choose the plan that best fits your storytelling journey.
            Upgrade anytime as your needs grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`
                motion-card
                story-panel
                relative
                flex
                flex-col
                rounded-2xl
                p-8
                transition-all
                duration-300
                hover:-translate-y-2
                ${
                  plan.featured
                    ? "border-2 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105"
                    : ""
                }
              `}
            >
              {/* Featured Badge */}
              {plan.featured && (
                <div className="absolute -top-3 right-5 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  Most Popular
                </div>
              )}

              {/* Plan Name */}
              <h3 className="mb-4 text-2xl font-bold text-slate-100">
                {plan.title}
              </h3>

              {/* Pricing */}
              <div className="mb-6">
                <span className="text-5xl font-extrabold text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-slate-400">
                  {plan.duration}
                </span>
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-sm text-green-400">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`
                  motion-cta
                  mt-auto
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  font-semibold
                  transition-all
                  duration-300
                  ${
                    plan.featured
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }
                `}
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
