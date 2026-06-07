import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const planName = searchParams.get("plan") || "Pro";
  const planPrice = Number(searchParams.get("price") || "19.99");

  // Razorpay payment handler
  const handlePayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    // Load Razorpay SDK
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      setError("Failed to load Razorpay SDK.");
      setLoading(false);
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
        setError("Failed to create order.");
        setLoading(false);
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
              navigate("/dashboard");
            } else {
              setError("Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            setError("Verification failed.");
          } finally {
            setLoading(false);
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
          setError(response.error?.description || "Payment failed.");
          setLoading(false);
        }
      );

      paymentObject.open();
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="gradient-bg min-h-screen px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Payment Form */}
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
                  Finish your upgrade with a clean, encrypted payment flow and
                  keep access to StorySpark AI uninterrupted.
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
                  <p className="text-sm text-slate-400">Selected Plan</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {planName} Plan
                  </h2>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-cyan-300">
                    ${planPrice}
                  </p>
                  <p className="text-sm text-slate-400">per month</p>
                </div>
              </div>
            </div>

            {/* Error Message Layout */}
            {error && (
              <p className="text-sm text-red-500 text-center mb-4 font-medium bg-red-500/10 py-2.5 px-4 rounded-xl border border-red-500/20">
                {error}
              </p>
            )}

            {/* Payment Action Submission Trigger Form */}
            <form className="space-y-5" onSubmit={handlePayment}>
              <button
                type="submit"
                disabled={loading}
                className="motion-cta inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
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
                Your verification processing details are protected with standard gateway layers. 
                Sensitive financial credentials are safe inside standard sandboxed overlay systems.
              </p>
            </form>

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
                  ${planPrice}/mo
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
                If your payment fails, double-check the card number, expiry
                date, and CVC before trying again.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;
