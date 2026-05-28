import { FC, useEffect, useState } from "react";
import { HELP_SECTIONS, scrollToSection } from "../help_center.utils";

const HelpSidebar: FC = () => {
  const [activeSection, setActiveSection] = useState<string>("categories");

  useEffect(() => {
    const sectionIds = HELP_SECTIONS.map((s) => s.id);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav
        className="hidden lg:block w-56 flex-shrink-0"
        aria-label="Help center sections"
      >
        <div className="sticky top-24 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3 dark:text-gray-500">
            On this page
          </p>
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeSection === section.id
                  ? "bg-indigo-50 text-indigo-700 border-l-2 border-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-white/5"
              }`}
              aria-current={activeSection === section.id ? "true" : undefined}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile horizontal scroll nav */}
      <nav
        className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-sm border-b border-slate-200 mb-8 dark:bg-slate-900/90 dark:border-white/10"
        aria-label="Help center sections"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                activeSection === section.id
                  ? "bg-indigo-100 text-indigo-700 border border-indigo-300 dark:bg-indigo-500/30 dark:text-indigo-200 dark:border-indigo-500/40"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 dark:bg-white/5 dark:text-gray-400 dark:border-white/10 dark:hover:bg-white/10"
              }`}
              aria-current={activeSection === section.id ? "true" : undefined}
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
