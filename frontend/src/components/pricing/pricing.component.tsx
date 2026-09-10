import { useNavigate } from "react-router-dom";

const plans = [
  { title: "Free", price: "$0", duration: "/month", features: ["Basic AI assistance", "5 stories per month"], linkTo: "/signup", buttonLabel: "Get Started" },
  { title: "Pro", price: "$19", duration: "/month", features: ["Unlimited stories", "Priority support"], linkTo: "/payment?plan=Pro&price=19", buttonLabel: "Start Pro Trial" },
  { title: "Enterprise", price: "$49", duration: "/month", features: ["Team collaboration", "API access"], linkTo: "/contact-us", buttonLabel: "Contact Sales" },
];

const PricingMainComponent = () => {
  const navigate = useNavigate();
  return (
    <section className="story-section" id="pricing-section">
      <div className="story-page-shell">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          <h2 className="story-section-heading">Simple, Transparent Pricing</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {plans.map((plan) => (
            <div key={plan.title} className="motion-card story-panel rounded-lg p-6">
              <h3 className="mb-2 text-xl font-bold text-slate-100">{plan.title}</h3>
              <div className="mb-4">
                <span className="text-4xl font-extrabold text-slate-50">{plan.price}</span>
                <span className="text-slate-500">{plan.duration}</span>
              </div>
              <ul className="mb-6 space-y-2 text-slate-400">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button className="motion-cta mt-2 w-full rounded-lg px-4 py-3 text-center font-semibold" onClick={() => navigate(plan.linkTo)}>
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingMainComponent;
