import React, { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getBaseUrl } from "../../../helpers/config";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Lock,
  User,
} from "lucide-react";
import { getUserInfo } from "../../../services/auth.service";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rawUser = null;
  const user = rawUser || getUserInfo();
  const loggedIn = !!user;

  // Read selected plan from URL search parameters (pricing page redirects to "/payment?plan=Pro&price=19")
  const [searchParams] = useSearchParams();
  const rawPlan = searchParams.get("plan") || "Pro";
  
  // Backend expects 'basic', 'pro', or 'premium'
  const plan = (rawPlan.toLowerCase() === "pro" || rawPlan.toLowerCase() === "basic" || rawPlan.toLowerCase() === "premium")
    ? (rawPlan.toLowerCase() as "basic" | "pro" | "premium")
    : "pro";
  
  const planName = rawPlan;
  
  // Price displayed on checkout matching backend map (basic: 499, pro: 999, premium: 1999)
  const planPriceDisplay = plan === "pro" ? "₹999" : plan === "premium" ? "₹1999" : "₹499";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = getBaseUrl();

  // Load Razorpay script dynamically if not already present
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1. Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Create order on backend — send plan name, NOT amount
      const orderRes = await fetch(`${API_BASE_URL}/api/v1/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      });

      if (!orderRes.ok) {
        const data = await orderRes.json();
        setError(data.message || "Could not initiate payment.");
        setLoading(false);
        return;
      }

      const { orderId, amount, currency } = await orderRes.json();

      // 3. Open Razorpay checkout — Razorpay handles card details securely
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Story Spark AI",
        description: `${planName} Plan`,
        order_id: orderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify payment on backend
          const verifyRes = await fetch(`${API_BASE_URL}/api/v1/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Subscription upgraded — redirect
            window.location.href = "/dashboard?upgraded=true";
          } else {
            setError("Payment verification failed. Please contact support.");
          }
          setLoading(false);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-10 relative overflow-hidden transition-colors duration-300 w-full box-border sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center w-full box-border relative z-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start box-border">
          {/* Main payment panel */}
          <section className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 w-full box-border">
            <div className="mb-8 flex items-start justify-between gap-4 w-full box-border">
              <div className="min-w-0 flex-1">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 dark:border-cyan-400/20 bg-cyan-500/5 dark:bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 select-none">
                  Secure checkout
                </span>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Complete Your Subscription
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-505 dark:text-slate-300">
                  Finish your upgrade with secure Razorpay payment integration.
                </p>
              </div>

              <div className="hidden rounded-2xl border border-cyan-400 bg-cyan-400/10 p-3 text-cyan-500 dark:text-cyan-300 sm:block">
                <CreditCard size={22} />
              </div>
            </div>

            {/* Selected Plan */}
            <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Selected Plan
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">
                    {planName} Plan
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-300">
                    {planPriceDisplay}
                  </p>

                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    per month
                  </p>
                </div>
              </div>
            </div>

            {/* User Account Info Chip if logged in */}
            {loggedIn && (
              <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-55 dark:bg-slate-900/40 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">Account Upgrading</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
            )}

            {/* Checkout Action or Auth Required */}
            {!loggedIn ? (
              <div className="space-y-6 py-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-500 dark:text-cyan-300">
                  <Lock size={32} />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
                  <p className="mx-auto max-w-md text-sm leading-relaxed text-slate-605 dark:text-slate-300">
                    To upgrade to the <span className="font-semibold text-cyan-600 dark:text-cyan-300">{planName}</span> plan, you must log in or sign up first. This links the subscription to your StorySpark AI profile.
                  </p>
                </div>

                <div className="grid gap-4 pt-4 sm:grid-cols-2">
                  <button
                    onClick={() =>
                      navigate("/login", {
                        state: { from: `${location.pathname}${location.search}` },
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 cursor-pointer"
                  >
                    Log In to Continue
                  </button>

                  <button
                    onClick={() =>
                      navigate("/signup", {
                        state: { from: `${location.pathname}${location.search}` },
                      })
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50 px-5 py-4 text-base font-semibold text-slate-700 dark:text-white transition hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Create New Account
                  </button>
                </div>

                <p className="text-xs text-slate-505 dark:text-slate-400">
                  After signing in, you will be redirected back here automatically to complete your secure payment.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-650 dark:text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer animate-pulse-subtle"
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
                      Pay Now — {planPriceDisplay}
                    </>
                  )}
                </button>

                <p className="text-xs leading-5 text-slate-505 dark:text-slate-400">
                  Your payment information is protected with secure Razorpay modal integration
                  and is never stored on our servers.
                </p>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 w-full box-border">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors select-none group"
              >
                <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
                Back to Pricing
              </Link>
            </div>
          </section>

          {/* Summary Sidebar */}
          <aside className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 w-full box-border">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl border border-emerald-500/10 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/10 p-3 text-emerald-600 dark:text-emerald-300">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  What you get
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  A quick summary before you confirm.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/70 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {planName} subscription
                </span>

                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  {planPriceDisplay}/mo
                </span>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800" />

              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 list-none p-0 m-0">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-300" />
                  Unlimited AI writing tools
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-300" />
                  Priority access to premium features
                </li>

                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-cyan-600 dark:text-cyan-300" />
                  Cancel anytime from your account settings
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-500/10 dark:border-cyan-400/10 bg-cyan-500/5 dark:bg-cyan-400/5 p-5">
              <p className="text-sm font-medium text-cyan-600 dark:text-cyan-200">
                Need help?
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-505 dark:text-slate-300">
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
