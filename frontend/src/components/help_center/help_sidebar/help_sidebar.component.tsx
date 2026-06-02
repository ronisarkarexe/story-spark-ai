
import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HELP_SECTIONS } from "../help_center.utils";

const HelpSidebar: FC = () => {

  const [activeSection, setActiveSection] = useState<string>(
    HELP_SECTIONS[0]?.id ?? "help-categories"
  );

  useEffect(() => {
    const sectionIds = HELP_SECTIONS.map((section) => section.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id);
        }
      },
      {

        rootMargin: "-20% 0px -55% 0px",
        threshold: [0.1, 0.25, 0.5],

      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;



      if (scrollBottom >= documentHeight - 80) {
        setActiveSection("support-links-section");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const yOffset = -100;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav className="hidden lg:block w-72 flex-shrink-0" aria-label="Help center sections">
        <div className="sticky top-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl shadow-xl p-6"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 rounded-[2rem] border border-white/30 dark:border-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-500/20 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300">
                    Quick Navigation
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Help Center</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  Navigate through guides, troubleshooting, setup instructions, and support resources.
                </p>
              </div>


            <div className="space-y-3">
              {HELP_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`relative w-full text-left px-4 py-4 rounded-2xl transition-all duration-300 overflow-hidden border ${isActive
                      ? "border-blue-300 dark:border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15"
                      : "border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.03] hover:border-blue-200 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${isActive
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                        }`}>
                        <i className={`fa-solid ${section.icon}`} aria-hidden="true" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm transition-colors duration-300 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {section.label}
                        </p>
                        {/* The 'Jump to section' text has been safely removed from here! */}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Support CTA Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden mt-8 rounded-3xl border border-blue-200 dark:border-indigo-500/20 bg-gradient-to-br from-blue-50 via-indigo-50 to-white dark:from-indigo-500/10 dark:via-blue-500/10 dark:to-slate-900/30 p-6"
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-sparkles text-lg" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">Need More Help?</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Contact support</p>

                  </div>
                  <button
                    onClick={() => scrollToSection("support-links-section")}
                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/20"
                  >
                    Support Links
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </nav>


      {/* Mobile sticky nav */}
      <nav className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-white/10 mb-8" aria-label="Help center sections">

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeSection === section.id
                ? "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/40"
                : "bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default HelpSidebar;