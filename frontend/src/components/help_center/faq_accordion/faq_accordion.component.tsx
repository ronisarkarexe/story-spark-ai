import { FC, useState } from "react";
import { FAQItem } from "../help_center.utils";

interface FAQAccordionProps {
  items: FAQItem[];
}

const FAQAccordion: FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(items.length > 0 ? 0 : null);

  const toggleAccordion = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq-section" className="scroll-mt-28 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">FAQ</p>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">Common Questions</h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Find answers to the most frequently asked StorySparkAI support and setup questions.
          </p>
        </div>

        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-8 text-center">
              <p className="text-slate-600 dark:text-slate-400">No FAQs available.</p>
            </div>
          ) : (
            items.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.id} className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between"
                  >
                    <span className="text-base font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                    <span className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
