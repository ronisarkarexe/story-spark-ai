import React from "react";
import PricingComponent from "./pricing.component";

const PricingMainComponent = () => {
  return (

    <section ref={sectionRef} style={sectionStyles} id="pricing-section">
      {/* ── Inline Styles ── */}
      <style>{`
        @keyframes pricing-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pricing-badge-glow {
          0%, 100% { box-shadow: 0 0 12px rgba(99,102,241,0.4), 0 0 24px rgba(99,102,241,0.15); }
          50% { box-shadow: 0 0 20px rgba(99,102,241,0.6), 0 0 40px rgba(99,102,241,0.25); }
        }
        @keyframes pricing-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .pricing-card-wrapper {
          perspective: 800px;
          transform-style: preserve-3d;
        }
        .pricing-card-inner {
          position: relative;
          border-radius: 1.5rem;
          padding: 2px;
          transform-style: preserve-3d;
          will-change: transform;
          transition: box-shadow 0.4s ease;
        }
        .pricing-card-inner:hover {
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.35);
        }
        .pricing-card-border {
          position: absolute;
          inset: 0;
          border-radius: 1.5rem;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(99,102,241,0.3) 25%,
            rgba(6,182,212,0.3) 50%,
            rgba(168,85,247,0.3) 75%,
            transparent 100%
          );
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        .pricing-card-inner:hover .pricing-card-border {
          opacity: 1;
        }
        .pricing-card-border-highlight {
          opacity: 0.6 !important;
        }
        .pricing-card-content {
          position: relative;
          border-radius: calc(1.5rem - 2px);
          padding: 2.25rem 2rem;
          backdrop-filter: blur(16px);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .pricing-card-glow {
          position: absolute;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
        }
        .pricing-toggle-track {
          position: relative;
          display: inline-flex;
          align-items: center;
          border-radius: 9999px;
          padding: 4px;
          cursor: pointer;
          width: 240px;
          height: 48px;
        }
        .pricing-toggle-pill {
          position: absolute;
          top: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          border-radius: 9999px;
          transition: left 0.35s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          z-index: 0;
        }
        .pricing-toggle-label {
          position: relative;
          z-index: 1;
          flex: 1;
          text-align: center;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s;
          user-select: none;
        }
        .pricing-cta-btn {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.875rem 1.5rem;
          border-radius: 1rem;
          font-weight: 600;
          font-size: 0.9375rem;
          transition: all 0.3s ease;
          cursor: pointer;
          border: none;
          outline: none;
          border: 2px solid rgba(99, 102, 241, 0.6);
          box-shadow:
          0 0 15px rgba(99, 102, 241, 0.3),
          0 0 30px rgba(99, 102, 241, 0.15);
        }
        .pricing-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .pricing-cta-btn:hover::before {
          opacity: 1;
        }
        .pricing-cta-btn:hover {
          transform: translateY(-2px);
          border-color: rgba(34, 211, 238, 0.9);
          box-shadow:
          0 0 20px rgba(34, 211, 238, 0.5),
          0 0 40px rgba(34, 211, 238, 0.25);

        }
        .pricing-cta-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .pricing-save-badge {
          animation: pricing-float 2s ease-in-out infinite;
        }
      `}</style>

      {/* ── Background Floating Orbs ── */}
      <div ref={orbsRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="pricing-orb absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pricing-orb absolute top-1/3 right-0 h-96 w-96 rounded-full bg-cyan-500/8 blur-3xl" />
        <div className="pricing-orb absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-purple-500/8 blur-3xl" />
        <div className="pricing-orb absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/6 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* ── Section Header ── */}
        <div ref={headingRef} className="mb-10 text-center">
          <div className="pricing-heading-reveal inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400 dark:text-indigo-300 mb-5">
            <Sparkles size={14} />
            Pricing Plans
          </div>

          <h2
            className="pricing-heading-reveal text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Simple,{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              Transparent
            </span>{" "}
            Pricing
          </h2>

          <p className="pricing-heading-reveal mx-auto mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400">
            Choose the perfect plan for your creative journey. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* ── Monthly / Yearly Toggle ── */}
        <div ref={toggleRef} className="mb-14 flex items-center justify-center gap-3">
          <div
            className="pricing-toggle-track border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800/60"
            onClick={() => setIsYearly(!isYearly)}
            role="button"
            tabIndex={0}
            aria-label={`Switch to ${isYearly ? "monthly" : "yearly"} billing`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsYearly(!isYearly); }}
          >
            <div
              className="pricing-toggle-pill bg-white dark:bg-indigo-600 shadow-lg"
              style={{ left: isYearly ? "calc(50%)" : "4px" }}
            />
            <span
              className={`pricing-toggle-label ${
                !isYearly ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-400"
              }`}
            >
              Monthly
            </span>
            <span
              className={`pricing-toggle-label ${
                isYearly ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-400"
              }`}
            >
              Yearly
            </span>
          </div>

          {/* Save badge */}
          <div
            className={`pricing-save-badge rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 transition-all duration-500 ${
              isYearly ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
            }`}
          >
            Save 20%
          </div>
        </div>

        {/* ── Pricing Cards ── */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8 items-stretch">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.title}
              className={`pricing-card-wrapper ${plan.highlight ? "md:-mt-4 md:mb-[-1rem]" : ""}`}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <div
                ref={setCardRef(index)}
                className="pricing-card-inner"
                style={{ opacity: 0 }}
              >
                {/* Animated gradient border */}
                <div
                  className={`pricing-card-border ${plan.highlight ? "pricing-card-border-highlight" : ""}`}
                />

                {/* Hover glow */}
                <div
                  className="pricing-card-glow"
                  style={{ background: plan.glowColor }}
                />

                {/* Card content */}
                <div
                  className={`pricing-card-content ${
                    plan.highlight
                      ? "bg-slate-50/90 dark:bg-[#0c1425]/90 border border-indigo-500/20"
                      : "bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/50 dark:border-white/5"
                  }`}
                >
                  {/* Popular badge */}
                  {plan.highlight && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
                      style={{ animation: "pricing-badge-glow 2s ease-in-out infinite" }}
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                        <Zap size={12} />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan icon + title */}
                  <div className="relative z-10 mb-6 flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} text-white shadow-lg`}
                    >
                      {plan.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                      {plan.title}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="relative z-10 mb-8">
                    <div className="flex items-baseline gap-1">
                      <span
                        ref={setPriceRef(index)}
                        className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                      >
                        ${getPrice(plan)}
                      </span>
                      <span className="text-base font-medium text-slate-400 dark:text-slate-500">
                        /{isYearly ? "mo" : "mo"}
                      </span>
                    </div>
                    {isYearly && plan.monthlyPrice > 0 && (
                      <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                        <span className="line-through">${plan.monthlyPrice}/mo</span>
                        {" "}billed annually
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="relative z-10 mb-8 flex-1 space-y-3">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className="pricing-feature-item flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300"
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${plan.gradient} text-white`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`pricing-cta-btn relative z-10 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl shadow-indigo-500/20"
                        : "bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10"
                    }`}
                    onClick={() => navigate(getLink(plan))}
                  >
                    {plan.buttonLabel}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-slate-400 dark:text-slate-500">
            🔒 Secured with 256-bit SSL encryption&nbsp;&nbsp;•&nbsp;&nbsp;Cancel anytime&nbsp;&nbsp;•&nbsp;&nbsp;No hidden fees
          </p>
        </div>
      </div>
    </section>

    <div>
      <PricingComponent />
    </div>

  );
};

export default PricingMainComponent;
