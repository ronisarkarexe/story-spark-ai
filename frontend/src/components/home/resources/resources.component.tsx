import React from "react";
import { Link } from "react-router-dom";

const resources = [
  {
    icon: "fas fa-magic",
    title: "AI Writing Assistant",
    description:
      "Write faster with AI-powered suggestions, grammar fixes, and creative support.",
    highlights: [
      "Grammar correction",
      "Tone improvement",
      "Writer's block assistance",
    ],
    stats: "10,000+ writers assisted",
    cta: "Try AI Assistant",
    link: "/writing-assistant",
    featured: true,
  },
  {
    icon: "fas fa-book",
    title: "Writing Templates",
    description:
      "Professional templates designed to help you start writing immediately.",
    highlights: [
      "Professional templates",
      "Multiple writing formats",
      "Ready-to-use examples",
    ],
    stats: "250+ templates available",
    cta: "Browse Templates",
    link: "/templates",
  },
  {
    icon: "fas fa-users",
    title: "Writing Community",
    description:
      "Connect with writers globally, share constructive feedback, and grow your skills together.",
    highlights: [
      "Collaborative feedback",
      "Interactive discussions",
      "Growth opportunities",
    ],
    stats: "5,000+ community members",
    cta: "Join Community",
    link: "/community",
  },
];

const ResourceComponent = () => {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">
            <i className="fa-solid fa-pen-nib"></i>
            Writing Toolkit
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Writing Tools That Help You Write Faster
          </h2>

          <p className="mt-5 text-sm sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI-powered assistance, professional templates, and a thriving writer
            community designed to help you create better content with less
            effort.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {resources.map((resource) => (
            <div
              key={resource.title}
              className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                resource.featured
                  ? "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 border-blue-500 text-white lg:scale-105 shadow-xl"
                  : "bg-white dark:bg-slate-900/70 backdrop-blur-xl border-slate-200 dark:border-slate-800 hover:border-blue-500/40"
              }`}
            >
              {/* Hover Gradient */}
              {!resource.featured && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}

              <div className="relative z-10 p-7 sm:p-8 h-full flex flex-col">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                    resource.featured
                      ? "bg-white/15 backdrop-blur-md"
                      : "bg-blue-50 dark:bg-blue-500/10"
                  }`}
                >
                  <i
                    className={`${resource.icon} text-2xl ${
                      resource.featured
                        ? "text-white"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  />
                </div>

                {/* Badge */}
                {resource.featured && (
                  <div className="mb-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-2xl font-bold mb-3 tracking-tight">
                  {resource.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    resource.featured
                      ? "text-blue-100"
                      : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {resource.description}
                </p>

                {/* Highlights */}
                <ul className="space-y-3 mb-8">
                  {resource.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-sm font-medium"
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          resource.featured
                            ? "bg-white/15"
                            : "bg-green-100 dark:bg-green-500/10"
                        }`}
                      >
                        <i className="fa-solid fa-check text-[10px]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Social Proof */}
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                      resource.featured
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {resource.stats}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    to={resource.link}
                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 ${
                      resource.featured
                        ? "bg-white text-blue-700 hover:bg-blue-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {resource.cta}

                    <i className="fa-solid fa-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceComponent;
