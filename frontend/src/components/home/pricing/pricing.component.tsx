import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  title: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  linkTo: string;
  buttonLabel: string;
  highlight?: boolean;
  badge?: string;
  savings?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const plans: Plan[] = [
  {
    title: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "5 AI stories per month",
      "Basic AI model access",
      "Community support",
      "Plain text export",
      "Basic templates",
      "Single-user workspace",
    ],
    linkTo: "/signup",
    buttonLabel: "Start Free",
  },
  {
    title: "Pro",
    highlight: true,
    badge: "Most Popular",
    savings: "Save 17%",
    price: {
      monthly: 19,
      yearly: 190,
    },
    features: [
      "Unlimited story generation",
      "GPT-4 & Claude access",
      "Priority email support",
      "Advanced Markdown & PDF export",
      "Commercial usage rights",
      "Custom writing styles",
      "Version history",
      "Advanced prompt controls",
    ],
    linkTo: "/payment?plan=Pro&price=19",
    buttonLabel: "Start Pro Trial",
  },
  {
    title: "Enterprise",
    savings: "Save 17%",
    price: {
      monthly: 49,
      yearly: 490,
    },
    features: [
      "Everything in Pro",
      "Real-time team collaboration",
      "Dedicated account manager",
      "Full API access",
      "Custom model fine-tuning",
      "SSO & advanced security",
      "Usage analytics",
      "Priority SLA support",
    ],
    linkTo: "/contact-us",
    buttonLabel: "Contact Sales",
  },
];

const faqs: FAQ[] = [
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. You can cancel your subscription at any time without penalties.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes. The Pro plan includes a 14-day free trial so you can explore all premium features before subscribing.",
  },
  {
    question: "Can I upgrade later?",
    answer:
      "Absolutely. You can upgrade or downgrade your subscription whenever your needs change.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Yes. Enterprise includes collaboration tools, advanced permissions, API access, and dedicated support.",
  },
];

const PricingComponent: React.FC = () => {
  const navigate = useNavigate();

  const [billing, setBilling] = useState<BillingCycle>("monthly");

  return (
    <section
      id="pricing-section"
      aria-labelledby="pricing-title"
      className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 py-16 sm:py-24 transition-colors duration-300"
    >
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/5 px-4 py-2 text-blue-600 dark:text-blue-400">
            <i className="fa-solid fa-credit-card text-xs" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest">
              Flexible Pricing
            </span>
          </div>

          <h2 id="pricing-title" className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl">
            Simple, Transparent Pricing
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-500 dark:text-slate-400">
            Choose the perfect plan for your creative workflow. Start for free
            and upgrade whenever you're ready to unlock advanced AI tools.
          </p>
        </div>

        {/* ✅ Semantic improvement: Stats as definition list */}
        <div className="mb-14">
          <dl className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            <div>
              <dt className="sr-only">Stories Generated</dt>
              <dd className="text-3xl font-extrabold text-slate-900 dark:text-white">
                25,000+
              </dd>
              <dd className="text-slate-500 dark:text-slate-400">
                Stories Generated
              </dd>
            </div>

            <div>
              <dt className="sr-only">Customer Rating</dt>
              <dd className="text-3xl font-extrabold text-slate-900 dark:text-white">
                4.9/5
              </dd>
              <dd className="text-slate-500 dark:text-slate-400">
                Customer Rating
              </dd>
            </div>

            <div>
              <dt className="sr-only">Active Creators</dt>
              <dd className="text-3xl font-extrabold text-slate-900 dark:text-white">
                5,000+
              </dd>
              <dd className="text-slate-500 dark:text-slate-400">
                Active Creators
              </dd>
            </div>
          </dl>
        </div>

        {/* Billing Toggle */}
        <div 
          className="mb-14 flex flex-col items-center"
          role="group"
          aria-label="Billing cycle selection"
        >
          <div className="flex rounded-full bg-slate-200 p-1 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              aria-pressed={billing === "monthly"}
              aria-label="Monthly billing"
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-white shadow dark:bg-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBilling("yearly")}
              aria-pressed={billing === "yearly"}
              aria-label="Yearly billing - save up to 17%"
              className={`rounded-full px-6 py-2 text-sm font-semibold transition-all ${
                billing === "yearly"
                  ? "bg-white shadow dark:bg-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
              role="article"
              aria-label={`${plan.title} plan`}
              className={`relative flex flex-col rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                plan.highlight
                  ? "border-2 border-blue-500 bg-white shadow-2xl shadow-blue-500/10 dark:bg-slate-900 lg:scale-105"
                  : "border border-slate-200 bg-white hover:shadow-xl dark:border-white/10 dark:bg-slate-900/50"
              }`}
            >
              {plan.badge && (
                <div 
                  className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-lg"
                  aria-label={`${plan.badge} plan`}
                >
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {plan.title}
                </h3>

                <div className="mt-6 flex items-end">
                  <span className="text-5xl font-extrabold text-slate-900 dark:text-white">
                    ${billing === "monthly" ? plan.price.monthly : plan.price.yearly}
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

                <div className="my-8 h-px bg-slate-200 dark:bg-white/10" aria-hidden="true" />

                <ul className="space-y-4" role="list">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <i className="fa-solid fa-circle-check mt-1 shrink-0 text-green-500" aria-hidden="true" />
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
                aria-label={`Select ${plan.title} plan`}
                className={`mt-10 w-full rounded-xl px-4 py-4 font-bold uppercase tracking-wide transition-all active:scale-[0.98] ${
                  plan.highlight
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-500 hover:to-indigo-500"
                    : "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                }`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="mx-auto mt-24 max-w-4xl">
          <blockquote className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
            <i className="fa-solid fa-quote-left mb-5 text-4xl text-blue-500" aria-hidden="true" />

            <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
              “This platform reduced our content production time by over 70%.
              The Pro plan paid for itself within the first week.”
            </p>

            <footer className="mt-6">
              <cite className="not-italic">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Sarah Johnson
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Content Director, StoryForge Media
                </p>
              </cite>
            </footer>
          </blockquote>
        </div>

        {/* FAQ */}
        <section 
          className="mx-auto mt-24 max-w-4xl"
          aria-labelledby="faq-title"
        >
          <h2 id="faq-title" className="mb-10 text-center text-3xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <dl className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <dt>{faq.question}</dt>
                  <i className="fa-solid fa-plus text-sm transition-transform group-open:rotate-45" aria-hidden="true" />
                </summary>

                <dd className="mt-4 leading-relaxed text-slate-600 dark:text-slate-400">
                  {faq.answer}
                </dd>
              </details>
            ))}
          </dl>
        </section>
      </div>
    </section>
  );
};

export default PricingComponent;