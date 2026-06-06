import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { loadRazorpayScript } from "../../../utils/loadRazorpay";

interface RazorpayResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
  };
}

interface RazorpayOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (
    event: string,
    callback: (response: RazorpayFailureResponse) => void
  ) => void;
}

interface RazorpayWindow extends Window {
  Razorpay: new (options: object) => RazorpayInstance;
}

const PaymentComponent = () => {
  const navigate = useNavigate();

  // Read selected plan from pricing page
  const [searchParams] = useSearchParams();
  const planName = searchParams.get("plan") || "Pro";
  const planPrice = Number(searchParams.get("price") || "19.99");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

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

      const data: RazorpayOrderResponse = await res.json();

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

        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/v1/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            });

            const verifyData: { success: boolean } =
              await verifyRes.json();

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

      const paymentObject = new ((window as unknown) as RazorpayWindow).Razorpay(
        options
      );

      paymentObject.on(
        "payment.failed",
        (response: RazorpayFailureResponse) => {
          console.error(response.error);
          alert(response.error?.description || "Payment failed.");
        }
      );

      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }; // <-- Properly closing the handlePayment block here

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/^(\d{2})(\d)/, "$1/$2");
  };

  const isFormValid =
    name.trim() &&
    cardNumber.length === 19 &&
    expiry.length === 5 &&
    cvv.length === 3;

  const handlePay = () => {
    if (!isFormValid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-10 relative overflow-hidden transition-colors duration-300 w-full box-border sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center w-full box-border relative z-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start box-border">
          
          <section className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 w-full box-border">
            <div className="mb-8 flex items-start justify-between gap-4 w-full box-border">
              <div className="min-w-0 flex-1">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 dark:border-cyan-400/20 bg-cyan-500/5 dark:bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 select-none">
                  Secure checkout
                </span>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Complete Your Subscription
                </h1>

                <p className="mt-2 text-xs sm:text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                  Finish your upgrade with secure Razorpay payment integration setup protocols.
                </p>
              </div>

              <div className="hidden rounded-xl border border-slate-200 dark:border-cyan-400/20 bg-slate-50 dark:bg-cyan-400/10 p-3 text-slate-500 dark:text-cyan-300 sm:flex shrink-0 select-none">
                <CreditCard size={20} />
              </div>
            </div>

            <div className="mb-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-cyan-400/10 bg-slate-50/50 dark:bg-cyan-400/5 p-4 sm:p-5 w-full box-border">
              <div className="flex items-center justify-between gap-4 w-full box-border">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
                    Selected Plan
                  </p>

                  <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                    {planName} Plan
                  </h2>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 tracking-tight">
                    ₹{planPrice}
                  </p>

                  <p className="text-[11px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 select-none">
                    per month
                  </p>
                </div>
              </div>
            </div>

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
                    Pay Now — ₹{planPrice}/mo
                  </>
                )}
              </button>

              <p className="text-xs leading-5 text-slate-400">
                Your payment information is protected with encrypted processing
                and is never stored on our servers.
              </p>
            </form>

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

          <aside className="bg-white dark:bg-[#111827]/20 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm w-full box-border">
            <div className="mb-6 flex items-center gap-3 w-full box-border select-none">
              <div className="rounded-xl border border-slate-200 dark:border-emerald-400/20 bg-slate-50 dark:bg-emerald-400/10 p-2.5 text-slate-500 dark:text-emerald-400 shrink-0">
                <CheckCircle2 size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  What you get
                </h2>

                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                  A quick summary before you confirm.
                </p>
              </div>
            </div>

            <div className="space-y-4 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5 w-full box-border">
              <div className="flex items-center justify-between gap-4 w-full box-border">
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tracking-tight truncate">
                  {planName} subscription
                </span>

                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight shrink-0">
                  ₹{planPrice}/mo
                </span>
              </div>

              <div className="h-px bg-slate-200 dark:bg-slate-800 w-full" />

              <ul className="space-y-3 list-none p-0 m-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 size={14} className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5 select-none" />
                  <span>Unlimited AI writing tools</span>
                </li>

                <li className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 size={14} className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5 select-none" />
                  <span>Priority access to premium features</span>
                </li>

                <li className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 size={14} className="text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5 select-none" />
                  <span>Cancel anytime from your account settings</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl sm:rounded-2xl border border-slate-100 dark:border-cyan-400/10 bg-slate-50/30 dark:bg-cyan-400/5 p-4 sm:p-5 w-full box-border">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-cyan-400 select-none tracking-tight">
                Need help?
              </p>

              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                If your payment transaction parameters fail, please refresh to loop again or reach out to platform operations support.
              </p>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;