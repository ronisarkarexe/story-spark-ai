import { FC, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HELP_SECTIONS } from "../help_center.utils";

const HelpSidebar: FC = () => {
  const [activeSection, setActiveSection] = useState<string>("categories");

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
        rootMargin: "-15% 0px -45% 0px",
        threshold: [0.1, 0.2, 0.4, 0.6],
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollBottom >= documentHeight - 120) {
        setActiveSection("support-links-section");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      HELP_SECTIONS.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.unobserve(element);
        }
      });
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className="lg:w-80 shrink-0 w-full">
      <div className="sticky top-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6"
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
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Help Center
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Navigate through guides, troubleshooting, setup instructions, and support resources.
              </p>
            </div>

            <div className="relative space-y-3">
              {HELP_SECTIONS.map((section) => {
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`
                      relative group w-full flex items-center gap-4
                      px-4 py-3.5 rounded-2xl
                      transition-all duration-300
                      overflow-hidden border focus:outline-none
                      ${isActive
                        ? "border-blue-300 dark:border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15"
                        : "border-slate-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/10 bg-white/50 dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20"
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 24,
                        }}
                      />
                    )}

                    <div
                      className={`
                        relative z-10 flex items-center justify-center
                        w-10 h-10 rounded-xl transition-all duration-300
                        ${isActive
                          ? `bg-gradient-to-br ${section.color || 'from-blue-500 to-indigo-600'} text-white shadow-md`
                          : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                        }
                      `}
                    >
                      <i className={`fa-solid ${section.icon}`} aria-hidden="true" />
                    </div>

                    <div className="relative z-10 flex-1 text-left">
                      <p className={`font-semibold text-sm transition-colors duration-300 ${
                        isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                      }`}>
                        {section.label}
                      </p>
                    </div>

                    <div className="relative z-10">
                      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive ? "bg-blue-500 scale-125" : "bg-slate-300 dark:bg-slate-700"
                      }`} />
                    </div>
                  </button>
                );
              })}
            </div>

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
                </div>
                <button
                  type="button"
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
    </aside>
  );
};

export default HelpSidebar;
