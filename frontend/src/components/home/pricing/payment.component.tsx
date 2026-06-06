import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getBaseUrl } from "../../../helpers/config";
import { getUserInfo } from "../../../services/auth.service";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const API_BASE_URL = getBaseUrl();

interface PaymentProps {
  plan: "basic" | "pro" | "premium";
  planLabel: string;
  displayAmount: string; // e.g. "₹499"
}

export const PaymentComponent = ({ plan: propPlan, planLabel: propPlanLabel, displayAmount: propDisplayAmount }: Partial<PaymentProps>) => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = getUserInfo();

  // Resolve values from query parameters if not provided in props
  const planParam = searchParams.get("plan")?.toLowerCase() || "pro";
  const plan = (propPlan || (planParam === "basic" || planParam === "pro" || planParam === "premium" ? planParam : "pro")) as "basic" | "pro" | "premium";
  const planLabel = propPlanLabel || (plan.charAt(0).toUpperCase() + plan.slice(1));
  const priceParam = searchParams.get("price") || (plan === "basic" ? "9" : plan === "pro" ? "19" : "49");
  const displayAmount = propDisplayAmount || `₹${priceParam}`;

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
        description: `${planLabel} Plan`,
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
            // Subscription upgraded — reload user session or redirect
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
    <div className="flex flex-col items-center gap-3">
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full py-2 px-6 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Processing…" : `Pay ${displayAmount}`}
      </button>
    </div>
  );
};

export default PaymentComponent;
