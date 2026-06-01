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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
<<<<<<< HEAD
      {/* Section Header */}
=======
>>>>>>> upstream/main
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

<<<<<<< HEAD
      {/* Accordion Wrapper / Empty State Handler */}
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-question text-3xl text-slate-500"></i>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No FAQs Found
          </h3>

          <p className="text-slate-600 dark:text-slate-400">
            Try searching with different keywords.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {items.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="
                  group overflow-hidden
                  rounded-3xl
                  border border-slate-200 dark:border-white/10
                  bg-white dark:bg-white/[0.04]
                  backdrop-blur-xl
                  shadow-md hover:shadow-xl
                  transition-all duration-300
                "
              >
                {/* Accordion Header Trigger */}
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                    className="
                      w-full flex items-center justify-between
                      px-6 py-5 text-left
                      transition-all duration-300
                      hover:bg-slate-50 dark:hover:bg-white/[0.03]
                      cursor-pointer
                    "
                  >
                    <span className="text-slate-900 dark:text-slate-100 font-bold pr-4">
                      {item.question}
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

                {/* Animated Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6">
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-white/5 p-5">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                            {item.answer}
                          </p>
                        </div>
                {/* Question Button */}
      <div className="text-center mb-10">
        <h2
          id="faq-heading"
          className="text-3xl font-bold text-slate-800 dark:text-gray-300"
        >
          Frequently Asked Questions
        </h2>

        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Quick answers to the most common StorySparkAI questions.
        </p>
      </div>

      <div className="space-y-5 max-w-3xl mx-auto">
=======
      <div className="space-y-5">
>>>>>>> upstream/main
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
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 cursor-pointer"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleItem(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
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
<<<<<<< HEAD
                    <div className="px-6 pb-6">
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 p-4 mt-2">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Top/Bottom Interactive Accent Line */}
                <div
                  className={`
                    h-[2px] w-full bg-gradient-to-r
                    from-indigo-500 via-blue-500 to-purple-500
                    transition-opacity duration-300
                    ${isOpen ? "opacity-100" : "opacity-0"}
                  `}
                />
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!isOpen}
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? "pb-5 max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-slate-600 dark:text-gray-400 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-4">
                  {item.answer}
                </p>
              </div>
            </article>
=======
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 p-4">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
>>>>>>> upstream/main
          );
        })}
      </div>
    </section>
  );
};

export default FAQAccordion;

