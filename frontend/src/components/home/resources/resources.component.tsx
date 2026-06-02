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

const ResourceComponent = () => {
  return (
    <div className="mx-5">
      <section className="mb-8 py-12 rounded-lg">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Writing Tools &amp; Resources
          </h2>
          <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Enhance your writing with our powerful tools and resources
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="group h-full p-8 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.02] flex flex-col"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-500/10 text-blue-300 transition-transform duration-300 group-hover:scale-105">
                <i className={`${resource.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors">
                {resource.title}
              </h3>
              <p className="text-slate-600 dark:text-gray-400 mb-6 flex-grow leading-relaxed">
                {resource.description}
              </p>
              {resource.link.startsWith("/") ? (
                <Link
                  to={resource.link}
                  className="inline-flex items-center font-semibold text-blue-300 transition-colors hover:text-blue-200 group/link"
                >
                  {resource.linkText}
                  <i className="fa-solid fa-arrow-right ml-2 group-hover/link:translate-x-1 transition-transform"></i>
                </Link>
              ) : (
                <a
                  href={resource.link}
                  className="inline-flex items-center font-semibold text-blue-300 transition-colors hover:text-blue-200 group/link"
                >
                  {resource.linkText}
                  <i className="fa-solid fa-arrow-right ml-2 group-hover/link:translate-x-1 transition-transform"></i>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResourceComponent;
