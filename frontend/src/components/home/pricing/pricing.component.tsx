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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-blue-600 dark:text-blue-400">
            <i className="fa-solid fa-credit-card text-xs" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Flexible Pricing
            </span>
          </div>

          <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-500 dark:text-slate-400">
            Choose the perfect plan for your creative workflow. Start for free
            and upgrade whenever you're ready to unlock advanced AI tools.
          </p>
        </div>

        {/* Social Proof */}
        <div className="mb-14">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                25,000+
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Stories Generated
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                4.9/5
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Customer Rating
              </p>
            </div>

            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                5,000+
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Active Creators
              </p>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="mb-14 flex flex-col items-center">
          <div className="flex rounded-full bg-slate-200 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-white shadow dark:bg-slate-700"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billing === "yearly"
                  ? "bg-white shadow dark:bg-slate-700"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Yearly
            </button>
          </div>

          <p className="mt-3 text-sm font-semibold text-green-600 dark:text-green-400">
            Save up to 17% with annual billing
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-2 border-blue-500 bg-white shadow-2xl shadow-blue-500/10 dark:bg-slate-900 lg:scale-105"
                  : "border border-slate-200 bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-900/50"
              }`}
            >
              {plan.badge && (
                <div className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.title}
                </h3>

                <div className="mt-6 flex items-end">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                    $
                    {billing === "monthly"
                      ? plan.price.monthly
                      : plan.price.yearly}
                  </span>

                  <span className="mb-1 ml-2 text-slate-500 dark:text-slate-400">
                    {billing === "monthly" ? "/month" : "/year"}
                  </span>
                </div>

                {billing === "yearly" && plan.savings && (
                  <div className="mt-3 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    {plan.savings}
                  </div>
                )}

                <div className="my-8 h-px bg-slate-200 dark:bg-white/10" />

                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <i className="fa-solid fa-circle-check mt-1 shrink-0 text-green-500" />

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => navigate(plan.linkTo)}
                className={`mt-10 w-full rounded-xl px-4 py-4 font-bold uppercase tracking-wide transition-all active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-500 hover:to-indigo-500"
                    :  "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                }`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-24 max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
            <i className="fa-solid fa-quote-left mb-5 text-4xl text-blue-500" />

            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              “This platform reduced our content production time by over 70%.
              The Pro plan paid for itself within the first week.”
            </p>

            <div className="mt-6">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Sarah Johnson
              </h4>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                Content Director, StoryForge Media
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-24 max-w-4xl">
          <h2 className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900 dark:text-white">
                  {faq.question}

                  <i className="fa-solid fa-plus text-sm transition-transform group-open:rotate-45" />
                </summary>

                <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingComponent;
