import { FC, useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion: FC<FAQAccordionProps> = ({ items }) => {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(
    items.length > 0 ? 0 : null
  );

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

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No FAQs Found
          </h3>

          <p className="text-slate-600 dark:text-slate-400">
            Try searching with different keywords.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="faq-section"
      className="scroll-mt-28 transition-colors duration-300"
    >
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
          const buttonId = `${baseId}-faq-button-${faq.id}`;
          const panelId = `${baseId}-faq-panel-${faq.id}`;

          return (
            <motion.article
              key={faq.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <button
                id={buttonId}
                type="button"
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                >
                  <i className="fa-solid fa-chevron-down"></i>
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
                    className="overflow-hidden px-6 pb-6"
                  >
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 p-4">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
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

