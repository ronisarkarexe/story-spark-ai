"use client";
import React, { useState } from "react";
import { FiCpu, FiBookOpen, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";

const FeaturesSection = () => {
  const features = [
    {
      title: "Interactive Visualizations",
      description:
        "See algorithms in action with step-by-step animations that turn complex concepts into clear, interactive visuals.",
      icon: <FiCpu className="w-6 h-6" />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      benefits: [
        "Real-time algorithm tracing",
        "Adjustable animation speeds",
        "Interactive node manipulation",
      ],
    },
    {
      title: "Comprehensive Learning",
      description:
        "Master DSA from basic arrays to advanced graph algorithms with structured learning paths.",
      icon: <FiBookOpen className="w-6 h-6" />,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      benefits: [
        "100+ DSA topics covered",
        "Beginner to advanced levels",
        "Practical implementation examples",
      ],
    },
    {
      title: "Knowledge Testing",
      description:
        "Reinforce learning with inbuilt quizzes and get immediate feedback on your progress.",
      icon: <FiAward className="w-6 h-6" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      benefits: [
        "Topic-specific challenges",
        "Performance analytics",
        "Progress tracking",
      ],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="py-15 bg-udemy-surface dark:bg-udemy-dark-bg overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-100/30 dark:bg-blue-900/10 rounded-full filter blur-3xl animate-float-slow"></div>
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-100/30 dark:bg-blue-900/10 rounded-full filter blur-3xl animate-float-slower"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="flex items-center justify-center gap-2 text-udemy-purple dark:text-udemy-purple-light text-sm font-bold tracking-wider uppercase mb-4">
            <HiSparkles className="text-xl" />
            Features we offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-4">
            Elevate Your{" "}
            <span className="text-udemy-purple dark:text-udemy-purple-light">
              DSA Mastery
            </span>
          </h2>
          <p className="text-xl text-udemy-muted dark:text-udemy-dark-muted max-w-3xl mx-auto">
            Modern tools designed to transform how you understand algorithms
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white dark:bg-udemy-dark-surface rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-udemy-border dark:border-udemy-dark-border"
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white dark:from-udemy-purple/10 dark:to-udemy-dark-surface opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center ${feature.color} mb-6 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110`}
                >
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold tracking-wider text-udemy-purple dark:text-udemy-purple-light uppercase">
                      Feature 0{index + 1}
                    </span>
                    <h3 className="text-2xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mt-2">
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-udemy-muted dark:text-udemy-dark-muted">
                    {feature.description}
                  </p>

                  <ul className="space-y-3 mt-4">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 mt-1 w-5 h-5 ${feature.color} rounded-full flex items-center justify-center bg-purple-100 dark:bg-udemy-purple/20`}
                        >
                          <svg
                            className="w-3 h-3 text-current"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        </div>
                        <span className="text-udemy-text dark:text-udemy-dark-muted">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {features.map((feature, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2">
                <div className="bg-white dark:bg-udemy-dark-surface rounded-xl p-6 shadow-sm border border-udemy-border dark:border-udemy-dark-border">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center ${feature.color} mb-6`}
                  >
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-udemy-purple dark:text-udemy-purple-light uppercase">
                        Feature 0{index + 1}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mt-2">
                        {feature.title}
                      </h3>
                    </div>

                    <p className="text-udemy-muted dark:text-udemy-dark-muted">
                      {feature.description}
                    </p>

                    <ul className="space-y-3 mt-4">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 mt-1 w-5 h-5 ${feature.color} rounded-full flex items-center justify-center bg-purple-100 dark:bg-udemy-purple/20`}
                          >
                            <svg
                              className="w-3 h-3 text-current"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              ></path>
                            </svg>
                          </div>
                          <span className="text-udemy-text dark:text-udemy-dark-muted">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  currentSlide === index
                    ? "bg-udemy-purple dark:bg-udemy-purple-light"
                    : "bg-udemy-border dark:bg-udemy-dark-border"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 mx-auto h-[1px] max-w-4xl bg-gradient-to-r rounded-sm from-transparent via-udemy-purple/20 dark:via-udemy-purple/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default FeaturesSection;
