import { FC, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQItem } from "../help_center.utils";

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion: FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(items.length > 0 ? 0 : null);
  const baseId = useId();

  const toggleAccordion = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  if (items.length === 0) {
    return (
      <section id="faq-section" className="scroll-mt-28">
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-question text-3xl text-slate-500" aria-hidden="true"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No FAQs Found</h3>
          <p className="text-slate-600 dark:text-slate-400">Try searching with different keywords.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="faq-section" className="scroll-mt-28 transition-colors duration-300">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 mb-4 mx-auto">
          <i className="fa-solid fa-circle-question" aria-hidden="true"></i>
          <span className="text-sm font-semibold">FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2
          id="faq-heading"
          className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4"
        >
          Common Questions
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          Find quick answers to the most common StorySparkAI questions, workflows, and troubleshooting topics.
        </p>
      </div>

      <div className="space-y-5 max-w-3xl mx-auto">
        {items.map((faq, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${baseId}-faq-button-${faq.id}`;
          const panelId = `${baseId}-faq-panel-${faq.id}`;

          return (
            <motion.article
              key={faq.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
              className="group overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827]/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-all duration-300 w-full box-border"
            >
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 sm:px-6 sm:py-5 text-left transition-all duration-200 hover:bg-slate-50 dark:hover:bg-white/[0.02] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 select-none"
              >
                <span className="text-sm sm:text-base text-slate-900 dark:text-slate-200 font-bold pr-4 tracking-tight leading-snug">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-all duration-300 ${
                    isOpen ? "rotate-180 bg-blue-500/10 text-blue-600 dark:text-blue-400" : ""
                  }`}
                  aria-hidden="true"
                >
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key={panelId}
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 p-4 sm:p-5 mt-1 sm:mt-2">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
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