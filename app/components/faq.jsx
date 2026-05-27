"use client";
import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiMail,
} from "react-icons/fi";
import Support from "@/app/components/support";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is AlgoBuddy?",
      answer:
        "AlgoBuddy is an interactive learning tool that helps you understand Data Structures and Algorithms through visual representations. It provides step-by-step animations of how different algorithms work.",
    },
    {
      question: "Is this tool suitable for beginners?",
      answer:
        "Absolutely! Our visualizations are designed to make complex concepts accessible to learners at all levels. Beginners can see exactly how data structures operate, while advanced users can use it to refine their understanding.",
    },
    {
      question: "Can I use this to prepare for coding interviews?",
      answer:
        "Yes! Many users find our visualizations particularly helpful for interview preparation. Seeing algorithms in action helps reinforce understanding better than just reading pseudocode.",
    },
    {
      question: "Are there plans to add more data structures?",
      answer:
        "We're continuously expanding our collection. Currently working on adding Trees and Graphs visualizations - stay tuned for updates!",
    },
  ];

  return (
    <section className="relative py-6 bg-udemy-surface dark:bg-udemy-dark-bg overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <span className="inline-flex items-center justify-center gap-2 text-udemy-purple dark:text-udemy-purple-light text-sm font-bold tracking-wider uppercase mb-4">
            <FiHelpCircle className="w-5 h-5" />
            Need Help?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-6">
            Frequently{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-udemy-purple to-udemy-purple-dark dark:from-udemy-purple-light dark:to-udemy-purple">
              Asked Questions
            </span>
          </h2>
          <p className="text-xl text-udemy-muted dark:text-udemy-dark-muted leading-relaxed">
            Quick answers to common questions about our platform
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-udemy-dark-surface backdrop-blur-sm border border-udemy-border dark:border-udemy-dark-border rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? "shadow-lg" : "shadow-sm hover:shadow-md"}`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => toggleAccordion(index)}
              >
                <h3 className="text-xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text">
                  <span className="text-udemy-purple mr-3">Q{index + 1}.</span>
                  {faq.question}
                </h3>
                <span className="text-udemy-purple dark:text-udemy-purple-light ml-4">
                  {activeIndex === index ? (
                    <FiChevronUp className="w-6 h-6" />
                  ) : (
                    <FiChevronDown className="w-6 h-6" />
                  )}
                </span>
              </button>
              <div
                className={`px-6 pb-6 pt-0 text-udemy-muted dark:text-udemy-dark-muted transition-all duration-300 ${activeIndex === index ? "block opacity-100" : "hidden opacity-0"}`}
              >
                <div className="pl-8 border-l-2 border-udemy-purple/30">
                  <p className="flex">
                    <span className="text-udemy-purple font-bold mr-2">A.</span>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="max-w-3xl mx-auto mt-16 text-center bg-white dark:bg-udemy-dark-surface backdrop-blur-sm border border-udemy-border dark:border-udemy-dark-border rounded-2xl p-8 shadow-sm">
          <div className="w-16 h-16 bg-purple-100 dark:bg-udemy-purple/20 rounded-full flex items-center justify-center text-udemy-purple dark:text-udemy-purple-light mx-auto mb-6">
            <FiMail className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold font-serif text-udemy-text dark:text-udemy-dark-text mb-4">
            Still have questions?
          </h3>
          <p className="text-udemy-muted dark:text-udemy-dark-muted mb-6 max-w-md mx-auto">
            Our team is ready to help you with any additional questions you
            might have.
          </p>
          <div className="mt-20 flex justify-center items-center">
            <Support />
          </div>
        </div>

        {/* Divider */}
        <div className="mt-20 mx-auto h-[1px] max-w-4xl bg-gradient-to-r rounded-sm from-transparent via-udemy-purple/20 dark:via-udemy-purple/30 to-transparent"></div>
      </div>
    </section>
  );
};

export default FAQSection;
