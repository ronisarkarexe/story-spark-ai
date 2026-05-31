import { FC } from "react";
import { motion } from "framer-motion";
import { SupportLink } from "../help_center.utils";

interface SupportLinksProps {
  links: SupportLink[];
}

const SupportLinks: FC<SupportLinksProps> = ({ links }) => {
  return (
    <motion.section
      id="support"
      className="scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="support-heading"
    >
      <div className="text-center mb-10">
        <h2 id="support-heading" className="text-3xl font-bold text-gray-300">
          Support &amp; Community
        </h2>
        <p className="mt-3 text-gray-400 max-w-2xl mx-auto">
          Need more help? Connect with the StorySparkAI open-source community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group flex items-start gap-5 bg-blue-500/10 hover:bg-blue-500/20 border border-white/5 hover:border-indigo-500/30 p-6 rounded-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition-colors">
              <i className={`${link.icon} text-xl`} aria-hidden="true"></i>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-300 group-hover:text-white transition-colors flex items-center gap-2">
                {link.title}
                {link.external && (
                  <i
                    className="fas fa-external-link-alt text-xs text-gray-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  ></i>
                )}
              </h3>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                {link.description}
              </p>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
};

export default SupportLinks;
