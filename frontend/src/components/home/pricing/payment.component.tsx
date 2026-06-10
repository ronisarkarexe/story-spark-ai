import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import { getBaseUrl } from "../../../helpers/config";
import { getUserInfo } from "../../../services/auth.service";
import { loadRazorpayScript } from "../../../utils/loadRazorpay";

type PaymentPlan = "basic" | "pro" | "premium";

interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayFailureResponse {
  error?: {
    description?: string;
  };
}

interface RazorpayCheckout {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: RazorpayFailureResponse) => void,
  ) => void;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
  theme: {
    color: string;
  };
}

interface CreateOrderResponse {
  success?: boolean;
  orderId?: string;
  amount?: number;
  currency?: string;
  message?: string;
}

interface VerifyPaymentResponse {
  success?: boolean;
  message?: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

const API_BASE_URL = getBaseUrl();

const PLAN_LABELS: Record<PaymentPlan, string> = {
  basic: "Basic",
  pro: "Pro",
  premium: "Premium",
};

const PLAN_FALLBACK_PRICES: Record<PaymentPlan, string> = {
  basic: "₹499",
  pro: "₹999",
  premium: "₹1,999",
};

const isPaymentPlan = (value: string | null): value is PaymentPlan =>
  value === "basic" || value === "pro" || value === "premium";

const PaymentComponent = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestedPlan = searchParams.get("plan")?.toLowerCase() ?? null;
  const plan: PaymentPlan = isPaymentPlan(requestedPlan)
    ? requestedPlan
    : "pro";
  const planLabel = PLAN_LABELS[plan];

  const requestedPrice = searchParams.get("price");
  const displayAmount =
    requestedPrice && /^\d+(?:\.\d{1,2})?$/.test(requestedPrice)
      ? `$${requestedPrice}`
      : PLAN_FALLBACK_PRICES[plan];

  const handlePayment = async () => {
    setError(null);
    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Failed to load the payment gateway. Please try again.");
      }

      const orderResponse = await fetch(
        `${API_BASE_URL}/api/v1/payment/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ plan }),
        },
      );
      const orderData = (await orderResponse.json()) as CreateOrderResponse;

      if (
        !orderResponse.ok ||
        !orderData.orderId ||
        typeof orderData.amount !== "number" ||
        !orderData.currency
      ) {
        throw new Error(orderData.message || "Could not initiate payment.");
      }

      const user = getUserInfo();
      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StorySparkAI",
        description: `${planLabel} Plan`,
        order_id: orderData.orderId,
        prefill: {
          name: user?.name ?? "",
          email: user?.email ?? "",
        },
        handler: async (response) => {
          try {
            const verifyResponse = await fetch(
              `${API_BASE_URL}/api/v1/payment/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(response),
              },
            );
            const verifyData =
              (await verifyResponse.json()) as VerifyPaymentResponse;

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed. Please contact support.",
              );
            }

            window.location.href = "/dashboard?upgraded=true";
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : "Payment verification failed. Please contact support.",
            );
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
        theme: {
          color: "#06b6d4",
        },
      };

      const checkout = new window.Razorpay(options);
      checkout.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      checkout.open();
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "An unexpected error occurred. Please try again.",
      );
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-50 px-4 py-10 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-96 w-96 rounded-full bg-cyan-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-[#111827]/40 sm:rounded-3xl sm:p-8">
            <div className="mb-8 flex w-full items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-400">
                  Secure checkout
                </span>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Complete Your Subscription
                </h1>
                <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                  Finish your upgrade through Razorpay's secure checkout.
                </p>
              </div>

              <div className="hidden shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-500 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300 sm:flex">
                <CreditCard size={20} aria-hidden="true" />
              </div>
            </div>

            <div className="mb-6 w-full rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-cyan-400/10 dark:bg-cyan-400/5 sm:rounded-2xl sm:p-5">
              <div className="flex w-full items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Selected Plan
                  </p>
                  <h2 className="mt-1 truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
                    {planLabel} Plan
                  </h2>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xl font-extrabold tracking-tight text-cyan-600 dark:text-cyan-400 sm:text-2xl">
                    {displayAmount}
                  </p>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 sm:text-xs">
                    per month
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck size={18} aria-hidden="true" />
                  Continue to Secure Payment
                </>
              )}
            </button>

            <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
              Card details are collected and processed securely by Razorpay and
              are never stored on our servers.
            </p>

            <div className="mt-6 w-full border-t border-slate-100 pt-4 dark:border-white/5">
              <Link
                to="/pricing"
                className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 sm:text-sm"
              >
                <ArrowLeft
                  size={14}
                  className="transition-transform duration-200 group-hover:-translate-x-0.5"
                  aria-hidden="true"
                />
                Back to Pricing
              </Link>
            </div>
          </section>

          <aside className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#111827]/20 sm:rounded-3xl sm:p-8">
            <div className="mb-6 flex w-full items-center gap-3">
              <div className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-400">
                <CheckCircle2 size={20} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  What you get
                </h2>
                <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  A quick summary before you confirm.
                </p>
              </div>
            </div>

            <div className="w-full space-y-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 sm:rounded-2xl sm:p-5">
              <div className="flex w-full items-center justify-between gap-4">
                <span className="truncate text-xs font-bold tracking-tight text-slate-700 dark:text-slate-300 sm:text-sm">
                  {planLabel} subscription
                </span>
                <span className="shrink-0 text-base font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-lg">
                  {displayAmount}/mo
                </span>
              </div>

              <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />

              <ul className="m-0 list-none space-y-3 p-0 text-xs font-medium text-slate-600 dark:text-slate-300 sm:text-sm">
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-cyan-500 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>Unlimited AI writing tools</span>
                </li>
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-cyan-500 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>Priority access to premium features</span>
                </li>
                <li className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2
                    size={14}
                    className="mt-0.5 shrink-0 text-cyan-500 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>Cancel anytime from your account settings</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 w-full rounded-xl border border-slate-100 bg-slate-50/30 p-4 dark:border-cyan-400/10 dark:bg-cyan-400/5 sm:rounded-2xl sm:p-5">
              <p className="text-xs font-bold tracking-tight text-slate-900 dark:text-cyan-400 sm:text-sm">
                Need help?
              </p>
              <p className="mt-1.5 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                If your payment fails, try again or contact platform support.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default PaymentComponent;
