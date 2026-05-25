import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";

const PaymentComponent = () => {
  return (
    <div className="gradient-bg min-h-screen px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="motion-card rounded-[2rem] border border-slate-700/50 bg-slate-950/75 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                  Secure checkout
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Complete Your Subscription
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Finish your upgrade with a clean, encrypted payment flow and keep access to StorySpark AI uninterrupted.
                </p>
              </div>
              <div className="hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300 sm:block">
                <CreditCard size={22} />
              </div>
            </div>

            <form className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">Card Details</label>
                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              <button
                type="button"
                className="motion-cta inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30"
              >
                <ShieldCheck size={18} />
                Pay Now
              </button>

              <p className="text-xs leading-5 text-slate-400">
                Your payment information is protected with encrypted processing and is never stored on our servers.
              </p>
            </form>

            <Link
              to="/pricing"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Pricing
            </Link>
          </section>

          <aside className="motion-card rounded-[2rem] border border-slate-700/50 bg-slate-950/55 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">What you get</h2>
                <p className="text-sm text-slate-400">A quick summary before you confirm.</p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-300">Premium subscription</span>
                <span className="text-lg font-semibold text-white">$19.99/mo</span>
              </div>
              <div className="h-px bg-slate-800" />
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-300" />
                  Unlimited AI writing tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-300" />
                  Priority access to premium features
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-300" />
                  Cancel anytime from your account settings
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-5">
              <p className="text-sm font-medium text-cyan-200">Need help?</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                If your payment fails, double-check the card number, expiry date, and CVC before trying again.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;