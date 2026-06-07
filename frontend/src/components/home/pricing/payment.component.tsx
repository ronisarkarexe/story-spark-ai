import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { getBaseUrl } from "../../../helpers/config";

const API_BASE_URL = getBaseUrl();

const PLANS: Record<string, { label: string; price: number }> = {
  basic: { label: "Basic", price: 499 },
  pro: { label: "Pro", price: 999 },
  premium: { label: "Premium", price: 1999 },
};

const PaymentComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const plan = "pro";
  const { label: planName, price: planPrice } = PLANS[plan];

  const formatCardNumber = (val: string) =>
    val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const isFormValid = name.trim() && cardNumber.length === 19 && expiry.length === 5 && cvv.length === 3;

  const handlePay = async () => {
    setError(null);
    setLoading(true);
    try {
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
      window.location.href = "/dashboard?upgraded=true";
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 px-4 py-10 relative overflow-hidden transition-colors duration-300 w-full box-border sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none select-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center justify-center w-full box-border relative z-10">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] items-start box-border">

          <section className="bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm w-full box-border">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/10 bg-cyan-500/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 select-none">
                  Secure checkout
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Complete Your Subscription
                </h1>
                <p className="mt-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                  Finish your upgrade with secure Razorpay payment integration.
                </p>
              </div>
              <div className="hidden rounded-xl border border-slate-200 dark:border-cyan-400/20 bg-slate-50 dark:bg-cyan-400/10 p-3 text-slate-500 dark:text-cyan-300 sm:flex shrink-0">
                <CreditCard size={20} />
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-slate-100 dark:border-cyan-400/10 bg-slate-50/50 dark:bg-cyan-400/5 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider select-none">Selected Plan</p>
                  <h2 className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{planName} Plan</h2>
                </div>
                <div className="text-right">
                  <p className="text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">₹{planPrice}</p>
                  <p className="text-xs font-medium text-slate-400 select-none">per month</p>
                </div>
              </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handlePay(); }}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Cardholder Name</label>
                <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-4 text-sm outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Card Number</label>
                <div className="relative">
                  <CreditCard className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="1234 5678 9012 3456" value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 py-4 pl-11 pr-4 text-sm outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Expiry Date</label>
                  <input type="text" placeholder="MM/YY" value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-4 text-sm outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">CVC</label>
                  <input type="password" placeholder="123" value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/70 px-4 py-4 text-sm outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20" />
                </div>
              </div>

              <button type="submit" disabled={loading || !isFormValid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-4 text-base font-semibold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50">
                {loading ? "Processing..." : <><ShieldCheck size={18} /> Pay ₹{planPrice}/mo</>}
              </button>

              <p className="text-xs text-slate-400">Your payment information is protected with encrypted processing.</p>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
              <Link to="/pricing" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group">
                <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                Back to Pricing
              </Link>
            </div>
          </section>

          <aside className="bg-white dark:bg-[#111827]/20 border border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm w-full box-border">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-emerald-400/20 bg-slate-50 dark:bg-emerald-400/10 p-2.5 text-slate-500 dark:text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">What you get</h2>
                <p className="text-xs font-medium text-slate-400 mt-0.5">A quick summary before you confirm.</p>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">{planName} subscription</span>
                <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">₹{planPrice}/mo</span>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800" />
              <ul className="space-y-3 list-none p-0 m-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-cyan-500 shrink-0 mt-0.5" /><span>Unlimited AI writing tools</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-cyan-500 shrink-0 mt-0.5" /><span>Priority access to premium features</span></li>
                <li className="flex items-start gap-2.5"><CheckCircle2 size={14} className="text-cyan-500 shrink-0 mt-0.5" /><span>Cancel anytime from your account settings</span></li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-slate-100 dark:border-cyan-400/10 bg-slate-50/30 dark:bg-cyan-400/5 p-4 sm:p-5">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-cyan-400 select-none">Need help?</p>
              <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
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