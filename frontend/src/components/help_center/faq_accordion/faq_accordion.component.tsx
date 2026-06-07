import { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaqItem } from "../help_center.utils";

interface FAQAccordionProps {
  items: FaqItem[];
}

const FAQAccordion: FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!items || items.length === 0) {
    return (
      <section id="faq-section" className="scroll-mt-28 transition-colors duration-300">
        <div className="text-center py-12 bg-gray-50 dark:bg-blue-500/5 rounded-xl border border-gray-200 dark:border-white/5">
          <p className="text-gray-600 dark:text-gray-400">No FAQ items match your search.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="faq-section" className="scroll-mt-28 transition-colors duration-300">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 mb-4">
          <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
          <span className="text-sm font-semibold">FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Common Questions
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Find quick answers to the most common StorySparkAI questions,
          workflows, and troubleshooting topics.
        </p>
      </div>

      <div className="space-y-5">
        {items.map((faq, index) => {
          const isOpen = openIndex === index;
          const buttonId = `faq-button-${faq.id}`;
          const panelId = `faq-panel-${faq.id}`;

          return (
            <motion.article
              key={faq.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 w-full box-border"
            >
              <div
                className={`h-[2px] w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-purple-500 transition-opacity duration-300 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Question Button */}
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between px-6 py-5 text-left transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/[0.03] cursor-pointer"
                >
                  <span className="text-slate-900 dark:text-slate-100 font-bold pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </span>
                </button>
              </h3>

              {/* Animated Answer Panel */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6">
                      <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-5">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;
