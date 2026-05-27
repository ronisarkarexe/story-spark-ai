"use client";
import { motion } from 'framer-motion';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';

const ExploreOther = ({ 
  title, 
  links, 
  columns = "4",
  icon = <FiArrowRight />,
  showExternalIcon = true
}) => {
  // Responsive grid columns mapping
  const gridColumns = {
    "1": "sm:grid-cols-1",
    "2": "sm:grid-cols-2",
    "3": "sm:grid-cols-2 lg:grid-cols-3",
    "4": "sm:grid-cols-2 lg:grid-cols-4",
    "5": "sm:grid-cols-2 lg:grid-cols-5",
  }[columns] || "sm:grid-cols-2 lg:grid-cols-4";

  // Check if links should open in new tab
  const isExternal = (url) => url.startsWith('http') || url.startsWith('www');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white max-w-4xl mx-auto dark:bg-neutral-950 rounded-xl shadow-sm border border-gray-200/80 dark:border-gray-700/80 overflow-hidden mt-6 transition-all duration-300 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: '-0.03em' }}>
            <span className="w-2 h-6 bg-gradient-to-b from-[#a435f0] to-[#7c3aed] rounded-full flex-shrink-0"></span>
            {title}
          </h2>
        </div>
        
        <div className={`grid grid-cols-1 ${gridColumns} gap-3`}>
          {links.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              target={isExternal(link.url) ? "_blank" : "_self"}
              rel={isExternal(link.url) ? "noopener noreferrer" : ""}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="group relative block p-4 rounded-lg border border-gray-200/70 dark:border-gray-700/70 hover:border-[#a435f0]/70 dark:hover:border-[#a435f0]/70 transition-all duration-200 bg-gradient-to-b from-white/50 to-white/0 dark:from-gray-700/20 dark:to-gray-700/5 hover:from-[#faf5ff]/50 hover:to-[#faf5ff]/10 dark:hover:from-[#a435f0]/10 dark:hover:to-[#a435f0]/5 overflow-hidden"
            >
              {/* Animated hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#a435f0]/0 via-[#a435f0]/5 to-[#a435f0]/0 opacity-0 group-hover:opacity-100 dark:via-[#a435f0]/10 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center gap-3">
                {/* Custom icon or default */}
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#faf5ff] dark:bg-[#a435f0]/10 flex items-center justify-center text-[#a435f0] dark:text-[#c084fc] group-hover:bg-[#f3e8ff] dark:group-hover:bg-[#a435f0]/20 transition-colors shadow-inner">
                  {link.icon || icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 dark:text-gray-200 group-hover:text-[#a435f0] dark:group-hover:text-[#c084fc] font-medium transition-colors truncate">
                    {link.text}
                  </p>
                  {link.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {link.description}
                    </p>
                  )}
                </div>
                
                {/* External link indicator */}
                {showExternalIcon && isExternal(link.url) && (
                  <FiExternalLink className="flex-shrink-0 text-gray-400 dark:text-gray-500 group-hover:text-[#a435f0] dark:group-hover:text-[#c084fc] transition-colors" />
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ExploreOther;