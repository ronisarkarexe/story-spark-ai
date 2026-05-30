import React, { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Lock,
  User,
} from "lucide-react";
import { getUserInfo } from "../../../services/auth.service";

const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUserInfo();
  const loggedIn = !!user;

  // Read selected plan from pricing page
  const [searchParams] = useSearchParams();

  const planName = searchParams.get("plan") || "Pro";
  const planPrice = Number(searchParams.get("price") || "19.99");

  // Razorpay payment handler
  const handlePayment = async () => {
    // Load Razorpay SDK
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    try {
      // Create order from backend
      const res = await fetch("/api/v1/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(planPrice * 100), // Convert to paisa
        }),
      });

      const data = await res.json();

      if (!data.success) {
        alert("Failed to create order.");
        return;
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "StorySparkAI",
        description: `${planName} Subscription`,
        order_id: data.order.id,

        handler: async (response: Record<string, unknown>) => {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/v1/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              alert("Payment successful!");
            } else {
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error(error);
            alert("Verification failed.");
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: "",
        },

        theme: {
          color: "#06b6d4",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const paymentObject = new (window as any).Razorpay(options);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      paymentObject.on("payment.failed", function (response: any) {
        console.error(response.error);
        alert("Payment failed.");
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="gradient-bg min-h-screen px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Payment Section */}
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
                  Finish your upgrade with secure Razorpay payment integration.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300 sm:block">
                <CreditCard size={22} />
              </div>
            </div>

            {/* Selected Plan */}
            <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">
                    Selected Plan
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {planName} Plan
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-300">
                    ₹{planPrice}
                  </p>

                  <p className="text-sm text-slate-400">
                    per month
                  </p>
                </div>
              </div>
            </div>

            {/* User Account Info Chip if logged in */}
            {loggedIn && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Account Upgrading</p>
                  <p className="text-sm font-bold text-white">{user?.email}</p>
                </div>
              </div>
            )}

            {!loggedIn ? (
              <div className="space-y-6 py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Lock size={32} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">Authentication Required</h2>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-300">
                    To upgrade to the <span className="font-semibold text-cyan-300">{planName}</span> plan, you must log in or sign up first. This links the subscription to your StorySpark AI profile.
                  </p>
                </div>

                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <button
                    onClick={() =>
                      navigate("/login", {
                        state: { from: `${location.pathname}${location.search}` },
                      })
                    }
                    className="motion-cta flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30"
                  >
                    Log In to Continue
                  </button>

                  <button
                    onClick={() =>
                      navigate("/signup", {
                        state: { from: `${location.pathname}${location.search}` },
                      })
                    }
                    className="motion-cta flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/50 px-5 py-4 text-base font-semibold text-white transition hover:bg-slate-800"
                  >
                    Create New Account
                  </button>
                </div>

                <p className="text-xs text-slate-400">
                  After signing in, you will be redirected back here automatically to complete your secure payment.
                </p>
              </div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePay();
                }}
              >
                {/* Cardholder Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Cardholder Name
                  </label>

                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-200">
                    Card Number
                  </label>

                  <div className="relative">
                    <CreditCard
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />

                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>

                {/* Expiry + CVV */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      Expiry Date
                    </label>

                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) =>
                        setExpiry(formatExpiry(e.target.value))
                      }
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">
                      CVC
                    </label>

                    <input
                      type="password"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(
                          e.target.value.replace(/\D/g, "").slice(0, 3)
                        )
                      }
                      className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/70 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20"
                    />
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="motion-cta inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg
                        className="h-5 w-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />

                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>

                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={18} />
                      Pay Now — ${planPrice}/mo
                    </>
                  )}
                </button>

                <p className="text-xs leading-5 text-slate-400">
                  Your payment information is protected with encrypted processing
                  and is never stored on our servers.
                </p>
              </form>
            )}

            {/* Back Button */}
            <Link
              to="/pricing"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-cyan-300"
            >
              <ArrowLeft size={16} />
              Back to Pricing
            </Link>
          </section>

          {/* Summary */}
          <aside className="motion-card rounded-[2rem] border border-slate-700/50 bg-slate-950/55 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-300">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">
                  What you get
                </h2>

                <p className="text-sm text-slate-400">
                  A quick summary before you confirm.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-300">
                  {planName} subscription
                </span>

                <span className="text-lg font-semibold text-white">
                  ₹{planPrice}/mo
                </span>
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
              <p className="text-sm font-medium text-cyan-200">
                Need help?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                If your payment fails, please try again or contact support.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;