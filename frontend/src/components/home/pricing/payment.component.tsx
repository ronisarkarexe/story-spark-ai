import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
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

  // State variables requested by user
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Razorpay payment handler
  const handlePayment = async () => {
    // Load Razorpay SDK
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Failed to load Razorpay SDK.");
      return;
    }

    try {
      setLoading(true);
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
              alert("Payment verification failed.");
            }
          } catch (error) {
            console.error(error);
            alert("Verification failed.");
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
          alert(response.error?.description || "Payment failed.");
          setLoading(false);
        }
      );

      paymentObject.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-10 relative overflow-hidden transition-colors duration-300 w-full box-border sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center w-full box-border relative z-10">
        <section className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 w-full box-border">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 dark:border-cyan-400/20 bg-cyan-500/5 dark:bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 select-none">
              Secure checkout
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Complete Your Subscription
            </h1>

            <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              Upgrade to the {planName} plan for ₹{planPrice}/month.
            </p>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment();
            }}
          >
            {/* Pay Button */}
            <button
              type="submit"
              disabled={loading}
              className="motion-cta inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:shadow-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin text-white"
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

            <p className="text-xs leading-5 text-slate-400 text-center">
              Your payment information is protected by secure encryption processing and is never stored on our servers.
            </p>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 w-full box-border text-center">
            <Link
              to="/pricing"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors select-none group"
            >
              <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to Pricing
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentComponent;

