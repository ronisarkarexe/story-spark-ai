import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HELP_SECTIONS = [
  { id: "help-categories", label: "Categories", description: "Browse topics", icon: "fa-layer-group", color: "from-blue-500 to-cyan-500" },
  { id: "faq-section", label: "FAQs", description: "Common answers", icon: "fa-circle-question", color: "from-indigo-500 to-purple-500" },
  { id: "troubleshoot-section", label: "Troubleshooting", description: "Fix frequent issues", icon: "fa-screwdriver-wrench", color: "from-orange-500 to-red-500" },
  { id: "setup-guide-section", label: "Setup Guide", description: "Get started faster", icon: "fa-rocket", color: "from-emerald-500 to-teal-500" },
  { id: "support-links-section", label: "Support", description: "Reach our team", icon: "fa-headset", color: "from-pink-500 to-rose-500" },
];

const HelpSidebar = () => {
  const [activeSection, setActiveSection] = useState("help-categories");

  useEffect(() => {
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

    HELP_SECTIONS.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
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
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav className="sticky top-24 hidden h-fit max-h-[calc(100vh-7rem)] w-full max-w-[15.5rem] self-start overflow-y-auto pr-1 lg:block xl:max-w-[16rem]" aria-label="Help center sections">
        <div>
          <motion.div
            className="relative w-full max-w-full overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/90 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/75 xl:p-5"
          >
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 rounded-[2rem] border border-white/30 dark:border-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-3 py-1 dark:border-blue-500/20">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-semibold tracking-wide uppercase text-blue-700 dark:text-blue-300">
                    Quick Navigation
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Help Center</h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  Navigate through guides, troubleshooting, setup instructions, and support resources.
                </p>
              </div>

              <div className="relative w-full max-w-full space-y-2">
                {HELP_SECTIONS.map((section) => {
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`relative group flex w-full max-w-full box-border items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-300 ${
                        isActive
                          ? "border-blue-300 shadow-[0_4px_14px_rgba(37,99,235,0.10)] dark:border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15"
                          : "border-slate-200 dark:border-white/5 bg-white/60 dark:bg-white/[0.03] hover:border-blue-200 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.05] hover:shadow-[0_5px_14px_rgba(15,23,42,0.08)]"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20"
                          transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        />
                      )}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-br ${section.color} text-white shadow-lg`
                            : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                        }`}
                      >
                        <i className={`fa-solid ${section.icon}`} aria-hidden="true" />
                      </div>
                      <div className="relative z-10 min-w-0 flex-1">
                        <p className={`font-semibold text-xs leading-tight transition-colors duration-300 ${isActive ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                          {section.label}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] leading-tight text-slate-500 dark:text-slate-500">
                          {section.description}
                        </p>
                      </div>
                      <div className="relative z-10">
                        <div className={`h-2 w-2 rounded-full transition-all duration-300 ${isActive ? "bg-blue-500 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.7)]" : "bg-slate-300 dark:bg-slate-700"}`} />
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
                </div>

                <button
                  type="button"
                  onClick={() => scrollToSection("support-links-section")}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 text-sm transition-all duration-300 shadow-md shadow-blue-500/10"
                >
                  Open Support Hub
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </nav>


      {/* Mobile horizontal scroll nav */}
      <nav
        className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-white/10 mb-8 overflow-hidden select-none"

        aria-label="Help center mobile navigation"
      >
        <div 
          ref={mobileNavRef} 
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none w-full items-center box-border touch-pan-x"
        >
          {HELP_SECTIONS.map((section) => {
            const isSelected = activeSection === section.id;
            return (
              <button
                key={section.id}
                type="button"
                data-section-id={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  isSelected
                    ? "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/40 shadow-sm"
                    : "bg-white dark:bg-white/5 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                }`}
                aria-current={isSelected ? "true" : undefined}
              >
                {section.label}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default HelpSidebar;