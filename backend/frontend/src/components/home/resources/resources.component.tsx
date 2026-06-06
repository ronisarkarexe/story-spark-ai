import React from "react";
import { Link } from "react-router-dom";

const resources = [
  {
    icon: "fas fa-magic",
    title: "AI Writing Assistant",
    description:
      "Get smart suggestions and overcome writer's block with AI-powered assistance.",
    linkText: "Learn more",
    link: "/writing-assistant",
  },
  {
    icon: "fas fa-book",
    title: "Writing Templates",
    description:
      "Access professional templates for various writing styles and formats.",
    linkText: "Browse templates",
    link: "/templates",
  },
  {
    icon: "fas fa-users",
    title: "Writing Community",
    description:
      "Connect with fellow writers, share feedback, and grow together.",
    linkText: "Join now",
    link: "/community",
  },
];

const ResourceComponent = () => (
  <section className="w-full box-border py-12 sm:py-16 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none select-none" />
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none select-none" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border relative z-10">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-16 px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/10 dark:border-white/10 bg-blue-500/5 text-blue-600 dark:text-blue-400 mb-4 select-none shadow-sm dark:shadow-none">
          <i className="fa-solid fa-cubes text-xs"></i>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Workspace Toolkit</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Writing Tools &amp; Resources
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto leading-relaxed">
          Accelerate your configuration workflows using integrated creative operational resource primitives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full box-border items-stretch">
        {resources.map((resource) => (
          <div 
            key={resource.title} 
            className="w-full text-left bg-white dark:bg-[#111827]/40 border border-slate-200 dark:border-white/10 p-6 sm:p-7 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-200 hover:scale-[1.005] hover:border-blue-500/20 dark:hover:border-blue-500/30 flex flex-col justify-between box-border group"
          >
            <div className="w-full box-border">
              <h3 className="mb-2.5 text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight truncate max-w-full">
                {resource.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                {resource.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5 w-full box-border">
              <Link 
                to={resource.link} 
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 tracking-tight uppercase tracking-wider select-none"
              >
                {resource.linkText}
                <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5 shrink-0" aria-hidden="true" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ResourceComponent;