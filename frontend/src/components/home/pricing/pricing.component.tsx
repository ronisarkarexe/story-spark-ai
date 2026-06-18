import { Link } from "react-router-dom";

const PricingComponent = () => {
  return (
    <section className="w-full py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm sm:text-base">
          Start for free, upgrade when you need more.
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all duration-150"
        >
          View all plans
        </Link>
      </div>
    </section>
  );
};

export default PricingComponent;
