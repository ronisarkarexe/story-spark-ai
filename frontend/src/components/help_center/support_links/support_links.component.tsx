import { FC } from "react";
import { motion } from "framer-motion";
import { SupportLink } from "../help_center.utils";

interface SupportLinksProps {
  links: SupportLink[];
}

const SupportLinks: FC<SupportLinksProps> = ({ links }) => {
  return (
    <motion.section
      id="support-links-section"
      className="scroll-mt-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="support-heading"
    >
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-300 mb-4">
          <i className="fa-solid fa-headset"></i>
          COMMUNITY & SUPPORT
        </div>
        <h2
          id="support-heading"
          className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-gray-300"
        >
          Support & Community
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
          Connect with the StorySparkAI community, report issues, explore
          documentation, and collaborate with contributors worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {links.map((link, index) => (
          <motion.a
            key={link.id}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group flex items-start gap-5 bg-white dark:bg-blue-500/10 hover:bg-gray-50 dark:hover:bg-blue-500/20 border border-gray-200 dark:border-white/5 hover:border-indigo-400 dark:hover:border-indigo-500/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">
              <i className={`${link.icon} text-xl`} aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-300 group-hover:text-indigo-900 dark:group-hover:text-white transition-colors flex items-center gap-2">
                {link.title}
                {link.external && (
                  <i
                    className="fas fa-external-link-alt text-xs text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    aria-hidden="true"
                  ></i>
                )}
              </h3>
              <p className="text-gray-600 dark:text-gray-500 text-sm mt-1 leading-relaxed">
                {link.description}
              </p>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-6 py-3 text-sm font-semibold text-indigo-600 transition-all duration-300 hover:scale-105 hover:bg-indigo-500/20 dark:text-indigo-300"
        >
          <i className="fa-brands fa-github text-lg"></i>
          Contribute Now
        </a>
      </div>
    </motion.section>
  );
};

export default SupportLinks;