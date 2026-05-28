import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
  {
    id: "help-categories",
    label: "Categories",
    icon: "fa-layer-group",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "faq-section",
    label: "FAQs",
    icon: "fa-circle-question",
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "troubleshoot-section",
    label: "Troubleshooting",
    icon: "fa-screwdriver-wrench",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "setup-guide-section",
    label: "Setup Guide",
    icon: "fa-rocket",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "support-links-section",
    label: "Support",
    icon: "fa-headset",
    color: "from-pink-500 to-rose-500",
  },
];

const HelpSidebar = () => {
  const [activeSection, setActiveSection] =
    useState("help-categories");

  useEffect(() => {
    
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveSection(
            visibleSections[0].target.id
          );
        }
      },
  {
    rootMargin: "-15% 0px -45% 0px",
    threshold: [0.1, 0.2, 0.4, 0.6],
  }
);



    sections.forEach((section) => {
      const element = document.getElementById(
        section.id
      );

      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      const scrollBottom =
        window.innerHeight + window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight;

      // Near bottom of page → activate support
      if (scrollBottom >= documentHeight - 80) {
        setActiveSection("support-links-section");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(
          section.id
        );

        if (element) {
          observer.unobserve(element);
        }
      });

      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      const yOffset = -100;

      const y =
        element.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  return (
    <aside className="lg:w-80 shrink-0">
      <div className="sticky top-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="
            relative overflow-hidden
            rounded-[2rem]
            border border-slate-200/70 dark:border-white/10
            bg-white/80 dark:bg-slate-900/70
            backdrop-blur-2xl
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]
            p-6
          "
        >
          {/* Background Glow */}
          <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Floating Border */}
          <div className="absolute inset-0 rounded-[2rem] border border-white/30 dark:border-white/5 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
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
                Navigate through guides,
                troubleshooting, setup instructions,
                and support resources.
              </p>
            </div>

            {/* Navigation */}
            <div className="relative space-y-3">
              {sections.map((section) => {
                const isActive =
                  activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() =>
                      scrollToSection(section.id)
                    }
                    className={`
                      relative group w-full flex items-center gap-4
                      px-4 py-4 rounded-2xl
                      transition-all duration-300
                      overflow-hidden border
                      ${
                        isActive
                          ? "border-blue-300 dark:border-blue-500/30"
                          : "border-slate-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/10"
                      }
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/15 dark:to-indigo-500/15"
                          : "bg-white/50 dark:bg-white/[0.03] hover:bg-slate-50 dark:hover:bg-white/[0.05]"
                      }
                    `}
                  >
                    {/* Active Sliding Background */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active-pill"
                        className="
                          absolute inset-0 rounded-2xl
                          bg-gradient-to-r
                          from-blue-500/10
                          to-indigo-500/10
                          dark:from-blue-500/20
                          dark:to-indigo-500/20
                        "
                        transition={{
                          type: "spring",
                          stiffness: 260,
                          damping: 24,
                        }}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={`
                        relative z-10
                        flex items-center justify-center
                        w-12 h-12 rounded-2xl
                        transition-all duration-300
                        ${
                          isActive
                            ? `bg-gradient-to-br ${section.color} text-white shadow-lg`
                            : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                        }
                      `}
                    >
                      <i
                        className={`fa-solid ${section.icon}`}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Text */}
                    <div className="relative z-10 flex-1 text-left">
                      <p
                        className={`
                          font-semibold text-sm transition-colors duration-300
                          ${
                            isActive
                              ? "text-slate-900 dark:text-white"
                              : "text-slate-700 dark:text-slate-300"
                          }
                        `}
                      >
                        {section.label}
                      </p>

                      <p className="text-xs mt-1 text-slate-500 dark:text-slate-500">
                        Jump to section
                      </p>
                    </div>

                    {/* Active Indicator */}
                    <div className="relative z-10">
                      <div
                        className={`
                          w-2.5 h-2.5 rounded-full transition-all duration-300
                          ${
                            isActive
                              ? "bg-blue-500 scale-125 shadow-[0_0_12px_rgba(59,130,246,0.7)]"
                              : "bg-slate-300 dark:bg-slate-700"
                          }
                        `}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Support Card */}
            <motion.div
              whileHover={{ y: -2 }}
              className="
                relative overflow-hidden
                mt-8 rounded-3xl
                border border-blue-200 dark:border-indigo-500/20
                bg-gradient-to-br
                from-blue-50
                via-indigo-50
                to-white
                dark:from-indigo-500/10
                dark:via-blue-500/10
                dark:to-slate-900/30
                p-6
              "
    <>
      {/* Desktop sticky sidebar */}
      <nav
        className="hidden lg:block w-56 flex-shrink-0"
        aria-label="Help center sections"
      >
        <div className="sticky top-24 space-y-1">

          <p className="text-xs font-bold text-gray-700 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">

            On this page
          </p>
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}

              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${

                activeSection === section.id

                  ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 dark:border-indigo-500 shadow-sm dark:shadow-none"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5 border-l-4 border-transparent"

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

        className="lg:hidden sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 mb-8"

        aria-label="Help center sections"
      >
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollToSection(section.id)}

              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${

                activeSection === section.id

                  ? "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/40 shadow-sm dark:shadow-none"
                  : "bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"

              }`}
              aria-current={activeSection === section.id ? "true" : undefined}
            >
              <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <i className="fa-solid fa-sparkles text-lg"></i>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">
                      Need More Help?
                    </h3>

                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Contact StorySparkAI support
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    scrollToSection(
                      "support-links-section"
                    )
                  }
                  className="
                    w-full rounded-2xl
                    bg-gradient-to-r
                    from-blue-600 to-indigo-600
                    hover:from-blue-700 hover:to-indigo-700
                    text-white font-semibold py-3
                    transition-all duration-300
                    hover:scale-[1.02]
                    shadow-lg shadow-blue-500/20
                  "
                >
                  Open Support Links
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