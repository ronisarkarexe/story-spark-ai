import React from "react";
import { Link } from "react-router-dom";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />

        {/* Content Container */}
        <div className="relative p-6 md:p-8 flex flex-col items-center text-center text-slate-100">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <i className="fas fa-times text-lg" />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 mb-6 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <i className="fas fa-gem text-3xl animate-pulse" />
          </div>

          {/* Heading */}
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-2">
            Monthly Quota Reached!
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mb-6">
            You've reached your monthly limit for this action on the <span className="font-semibold text-indigo-400">{plan.toUpperCase()}</span> plan. Upgrade to unlock higher limits and supercharge your creativity!
          </p>

          {/* Plan Comparison Table */}
          <div className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6 text-left">
            <div className="grid grid-cols-3 gap-2 px-4 py-2.5 bg-white/5 border-b border-white/5 text-xs font-semibold text-slate-400">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center text-indigo-400">Pro</span>
            </div>
            
            <div className="divide-y divide-white/5 text-xs text-slate-300">
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                <span>Story Generations</span>
                <span className="text-center text-slate-400">5 / mo</span>
                <span className="text-center text-indigo-300 font-semibold">50 / mo</span>
              </div>
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                <span>Story Continuations</span>
                <span className="text-center text-slate-400">3 / mo</span>
                <span className="text-center text-indigo-300 font-semibold">30 / mo</span>
              </div>
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                <span>Fast AI Models</span>
                <span className="text-center text-slate-400"><i className="fas fa-check text-indigo-500/50" /></span>
                <span className="text-center text-indigo-400"><i className="fas fa-check" /></span>
              </div>
              <div className="grid grid-cols-3 gap-2 px-4 py-2.5">
                <span>Priority Support</span>
                <span className="text-center text-slate-500"><i className="fas fa-times" /></span>
                <span className="text-center text-indigo-400"><i className="fas fa-check" /></span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-xl transition-all"
            >
              Keep Writing Drafts
            </button>
            <Link
              to="/pricing"
              onClick={onClose}
              className="flex-1 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-medium rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_20px_rgba(99,102,241,0.4)] transition-all text-center flex items-center justify-center gap-1.5"
            >
              <span>View Pricing Plans</span>
              <i className="fas fa-arrow-right text-xs" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
