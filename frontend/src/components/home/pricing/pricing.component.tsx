import { useNavigate } from "react-router-dom";

const plans = [
  {
    title: "Free",
    price: "$0",
    duration: "/month",
    description: "Perfect for getting started with AI-powered storytelling.",
    features: [
      "Basic AI writing assistance",
      "5 stories per month",
      "Standard templates",
      "Community access",
    ],
    linkTo: "/signup",
    buttonLabel: "Get Started Free",
    popular: false,
    accent: "rgba(96,165,250,0.18)",
    borderColor: "rgba(148,163,184,0.18)",
    buttonStyle: {
      background: "linear-gradient(135deg, rgba(96,165,250,0.18), rgba(99,102,241,0.18))",
      border: "1px solid rgba(96,165,250,0.35)",
      color: "#93c5fd",
    } as React.CSSProperties,
  },
  {
    title: "Pro",
    price: "$19",
    duration: "/month",
    description: "Unlock your full creative potential with unlimited access.",
    features: [
      "Unlimited AI stories",
      "Priority AI processing",
      "Advanced story templates",
      "Priority support",
      "Analytics dashboard",
      "Export in all formats",
    ],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Pro Trial",
    popular: true,
    accent: "rgba(56,189,248,0.22)",
    borderColor: "rgba(56,189,248,0.45)",
    buttonStyle: {
      background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
      border: "none",
      color: "#ffffff",
      boxShadow: "0 8px 32px rgba(14,165,233,0.35)",
    } as React.CSSProperties,
  },
  {
    title: "Enterprise",
    price: "$49",
    duration: "/month",
    description: "Built for teams that need collaboration and full API access.",
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "Full API access",
      "Custom integrations",
      "Dedicated account manager",
    ],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
    popular: false,
    accent: "rgba(168,85,247,0.18)",
    borderColor: "rgba(148,163,184,0.18)",
    buttonStyle: {
      background: "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(236,72,153,0.18))",
      border: "1px solid rgba(168,85,247,0.35)",
      color: "#d8b4fe",
    } as React.CSSProperties,
  },
];

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    style={{ flexShrink: 0, marginTop: "2px" }}
  >
    <circle cx="8" cy="8" r="8" fill="rgba(56,189,248,0.15)" />
    <path
      d="M5 8l2.5 2.5L11 5.5"
      stroke="#38bdf8"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PricingComponent = () => {
  const navigate = useNavigate();

  return (
    <section
      id="pricing-section"
      style={{
        paddingBlock: "clamp(3rem, 7vw, 5.5rem)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glows */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          borderRadius: "9999px",
          background: "radial-gradient(ellipse, rgba(56,189,248,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      <div className="story-page-shell">
        {/* Heading */}
        <div style={{ maxWidth: "560px", margin: "0 auto 3rem", textAlign: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              borderRadius: "9999px",
              border: "1px solid rgba(56,189,248,0.25)",
              background: "rgba(56,189,248,0.08)",
              color: "#38bdf8",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 14px",
              marginBottom: "16px",
            }}
          >
            Pricing
          </span>
          <h2 className="story-section-heading" style={{ marginBottom: "12px" }}>
            Simple, Transparent Pricing
          </h2>
          <p className="story-section-copy">
            Choose the plan that fits your creative journey. Upgrade or cancel anytime.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.title}
              className="motion-card"
              style={{
                position: "relative",
                borderRadius: "20px",
                border: `1px solid ${plan.borderColor}`,
                background: plan.popular
                  ? "linear-gradient(160deg, rgba(15,23,42,0.92) 0%, rgba(12,36,60,0.88) 100%)"
                  : "linear-gradient(180deg, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.58) 100%)",
                boxShadow: plan.popular
                  ? "0 0 0 1px rgba(56,189,248,0.45), 0 24px 64px rgba(2,6,23,0.4), 0 0 60px rgba(56,189,248,0.08)"
                  : "0 20px 55px rgba(2,6,23,0.24)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-13px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "4px 18px",
                    borderRadius: "9999px",
                    boxShadow: "0 4px 18px rgba(14,165,233,0.45)",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✦ Most Popular
                </div>
              )}

              {/* Accent glow behind card top */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "120px",
                  borderRadius: "20px 20px 0 0",
                  background: `radial-gradient(ellipse at 50% 0%, ${plan.accent}, transparent 70%)`,
                  pointerEvents: "none",
                }}
              />

              {/* Plan title */}
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: plan.popular ? "#38bdf8" : "#94a3b8",
                  marginBottom: "12px",
                }}
              >
                {plan.title}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: "12px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
                <span
                  style={{
                    fontSize: "clamp(2.5rem, 5vw, 3rem)",
                    fontWeight: 800,
                    lineHeight: 1,
                    color: "#f8fafc",
                    letterSpacing: "-0.02em",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#64748b",
                    fontWeight: 500,
                    marginBottom: "6px",
                  }}
                >
                  {plan.duration}
                </span>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#94a3b8",
                  lineHeight: 1.6,
                  marginBottom: "1.5rem",
                  minHeight: "42px",
                }}
              >
                {plan.description}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "rgba(148,163,184,0.12)",
                  marginBottom: "1.5rem",
                }}
              />

              {/* Features */}
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "2rem",
                  flex: 1,
                }}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontSize: "0.875rem",
                      color: "#cbd5e1",
                      lineHeight: 1.5,
                    }}
                  >
                    <CheckIcon />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className="motion-cta"
                onClick={() => navigate(plan.linkTo)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  ...plan.buttonStyle,
                }}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p
          style={{
            textAlign: "center",
            marginTop: "2.5rem",
            fontSize: "0.8125rem",
            color: "#475569",
          }}
        >
          All plans include a 14-day money-back guarantee. No credit card required for Free.
        </p>
      </div>
    </section>
  );
};

export default PricingComponent;
