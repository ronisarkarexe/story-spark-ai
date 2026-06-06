import React from "react";
import aiWriter from "../../../assets/aiwriter.webp";
import { Link } from "react-router-dom";

const StartWritingComponent = () => {
  return (
    <section className="mb-24 px-4 sm:px-6 lg:px-8 w-full box-border">
      <div className="relative group max-w-6xl mx-auto overflow-hidden rounded-3xl sm:rounded-[2.5rem] bg-white dark:bg-[#111827]/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-blue-500/20 dark:hover:border-blue-500/30 transition-all duration-300 w-full box-border">
        <div className="absolute inset-0 border-t border-slate-200 dark:border-white/10 rounded-3xl sm:rounded-[2.5rem] pointer-events-none z-20" />

        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -z-10 group-hover:bg-blue-500/15 transition-colors duration-500 pointer-events-none select-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] -z-10 pointer-events-none select-none" />
        
        <div className="px-6 py-12 sm:px-12 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 w-full box-border">
          <div className="flex-1 text-center md:text-left min-w-0 w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 sm:mb-6 leading-tight tracking-tight">
              Ready to <br className="hidden md:block" /> Start Writing?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 leading-relaxed max-w-lg mx-auto md:mx-0 font-medium">
              Join thousands of writers who are already creating amazing content
              with our AI-powered platform pipelines.
            </p>
            <Link to="/stories" className="w-full sm:w-auto inline-block">
              <button className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/10 transition-all duration-150 active:scale-[0.98] cursor-pointer group/btn uppercase tracking-wider select-none">
                Get Started Free
                <i className="fa-solid fa-wand-magic-sparkles text-xs ml-2.5 transition-transform duration-200 group-hover/btn:rotate-12 shrink-0"></i>
              </button>
            </Link>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end w-full shrink-0 select-none">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl -z-10 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <img
                src={aiWriter}
                alt="Writing Illustration"
                className="w-full max-w-[260px] sm:max-w-sm lg:max-w-md object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartWritingComponent;