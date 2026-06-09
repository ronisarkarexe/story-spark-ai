import { FC } from "react";
import { motion } from "framer-motion";
import { Support_Links } from "../help_center.utils";

interface SupportLinksProps {
  links: Support_Links[];
}

const SupportLinks: FC<SupportLinksProps> = ({ links }) => {
  return (
    <motion.section
      id="support-links-section"
      className="scroll-mt-28 w-full box-border"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="support-heading"
    >
      <div className="mb-10 text-center px-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-300 mb-4 select-none uppercase tracking-wider">
          <i className="fa-solid fa-headset" aria-hidden="true"></i>
          Community & Support
        </div>
        <h2
          id="support-heading"
          className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-gray-300 tracking-tight"
        >
          Support & Community
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
          Connect with the StorySparkAI community, report issues, explore documentation, and collaborate with contributors worldwide.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto px-4 sm:px-0 w-full box-border">
        {links && links.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.3) }}
            whileHover={{ y: -4 }}
            className="group flex items-start gap-4 sm:gap-5 bg-white dark:bg-blue-500/10 hover:bg-slate-50 dark:hover:bg-blue-500/20 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 w-full box-border focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-300 transition-all duration-200 select-none">
              <i className={`${link.icon} text-lg sm:text-xl`} aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0 w-full">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-white transition-colors flex items-center gap-2 tracking-tight truncate max-w-full">
                {link.title}
                {link.external && (
                  <i 
                    className="fas fa-external-link-alt text-[10px] sm:text-xs text-slate-400 dark:text-gray-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 shrink-0" 
                    aria-hidden="true" 
                  />
                )}
              </h3>
              <p className="text-slate-600 dark:text-gray-500 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
                {link.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      {/* GitHub CTA Container */}
      <div className="flex justify-center mt-10 text-center px-4">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:scale-105 hover:bg-indigo-500/20 dark:text-indigo-300 active:scale-[0.98] cursor-pointer select-none uppercase tracking-wider shadow-sm hover:shadow-md"
        >
          <i className="fa-brands fa-github text-base sm:text-lg" aria-hidden="true"></i>
          Contribute Now
        </a>
      </div>
    </motion.section>
  );
};

export default SupportLinks;