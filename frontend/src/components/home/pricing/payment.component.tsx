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
  const [searchParams] = useSearchParams();

  const planName = searchParams.get("plan") || "Pro";
  const planPrice = Number(searchParams.get("price") || "19.99");

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

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
    name.trim().length > 0 &&
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length === 3;

  // ✅ RAZORPAY PAYMENT
  const handlePayment = async () => {
    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    try {
      const res = await fetch("/api/v1/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(planPrice * 100),
        }),
      });

      const data: RazorpayOrderResponse = await res.json();

      if (!data.success) {
        alert("Order creation failed");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "StorySparkAI",
        description: `${planName} Plan`,
        order_id: data.order.id,

        handler: async (response: RazorpayResponse) => {
          const verifyRes = await fetch("/api/v1/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment successful!");
            navigate("/dashboard");
          } else {
            alert("Payment verification failed");
          }
        },

        prefill: {
          name,
          email: "",
          contact: "",
        },

        theme: {
          color: "#06b6d4",
        },
      };

      const razor = new (window as unknown as RazorpayWindow).Razorpay(options);

      razor.on("payment.failed", (response: RazorpayFailureResponse) => {
        alert(response.error?.description || "Payment failed");
      });

      razor.open();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const handlePay = () => {
    if (!isFormValid) return;

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      handlePayment();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-6xl flex items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">

          {/* LEFT */}
          <section className="bg-white dark:bg-[#111827]/40 p-6 rounded-2xl border">
            <h1 className="text-2xl font-bold mb-4">
              Complete Subscription
            </h1>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Plan</p>
              <h2 className="text-xl font-bold">{planName}</h2>
              <p className="text-cyan-500 font-bold">₹{planPrice}/mo</p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePay();
              }}
              className="space-y-4"
            >
              <input
                className="w-full p-3 border rounded"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                className="w-full p-3 border rounded"
                placeholder="Card Number"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
              />

              <div className="flex gap-2">
                <input
                  className="w-full p-3 border rounded"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) =>
                    setExpiry(formatExpiry(e.target.value))
                  }
                />

                <input
                  className="w-full p-3 border rounded"
                  placeholder="CVV"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
                  }
                />
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full bg-cyan-600 text-white py-3 rounded"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </form>

            <Link to="/pricing" className="text-sm text-blue-500 mt-4 block">
              ← Back to Pricing
            </Link>
          </section>

          {/* RIGHT */}
          <aside className="bg-white dark:bg-[#111827]/30 p-6 rounded-2xl border">
            <h2 className="font-bold mb-3">What you get</h2>

            <ul className="space-y-2 text-sm">
              <li>✔ Unlimited AI writing tools</li>
              <li>✔ Premium features access</li>
              <li>✔ Cancel anytime</li>
            </ul>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;