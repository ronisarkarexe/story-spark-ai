'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiChevronRight, FiSearch, FiInfo } from 'react-icons/fi';
import { useState } from 'react';

const InfoPopup = ({ info }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-700 p-4 z-10">
      {Object.entries(info).map(([key, value]) => (
        <div key={key} className="mb-2 last:mb-0">
          <span className="font-semibold text-surface-900 dark:text-surface-50">{key}: </span>
          <span className="text-surface-600 dark:text-surface-400">{value}</span>
        </div>
      ))}
    </div>
  );
};

const SectionsDisplay = ({ sections, searchQuery }) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-1">
      {sections.map((section, sectionIndex) => (
        <motion.div
          key={sectionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: sectionIndex * 0.05 }}
          className="group relative bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/30"
        >
          {/* Section Header */}
          <div className="px-6 py-5 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between bg-surface-50 dark:bg-surface-900">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/5 dark:bg-primary/20 flex items-center justify-center text-primary">
                {section.icon}
              </div>
              <h2 className="text-xl font-bold tracking-tighter text-surface-900 dark:text-surface-50">{section.title}</h2>
            </div>
            {section.info && (
              <div
                className="relative"
                onMouseEnter={() => setHoveredSection(sectionIndex)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <FiInfo className="h-5 w-5 text-surface-400 hover:text-primary cursor-pointer transition-colors" />
                {hoveredSection === sectionIndex && (
                  <InfoPopup info={section.info} />
                )}
              </div>
            )}
          </div>

          {/* Section Content */}
          <div className="p-6">
            {section.subsections ? (
              <div className="space-y-7">
                {section.subsections.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h3 className="text-[15px] font-semibold text-surface-900 dark:text-surface-50 mb-4 pl-3 border-l-[3px] border-primary">
                      {subsection.title}
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                      {subsection.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.path}
                          className="group/item relative block p-4 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 bg-white dark:bg-surface-900 hover:bg-primary/5 dark:hover:bg-primary/10 overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-surface-700 dark:text-surface-300 group-hover/item:text-primary dark:group-hover/item:text-primary-light font-medium text-[14px] transition-colors">
                              {item.name}
                            </span>
                            <FiChevronRight className="h-4 w-4 text-surface-300 dark:text-surface-600 group-hover/item:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.items?.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    href={item.path}
                    className="group/item relative block p-4 rounded-xl border border-surface-200 dark:border-surface-800 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200 bg-white dark:bg-surface-900 hover:bg-primary/5 dark:hover:bg-primary/10 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-surface-700 dark:text-surface-300 group-hover/item:text-primary dark:group-hover/item:text-primary-light font-medium text-[14px] transition-colors">
                        {item.name}
                      </span>
                      <FiChevronRight className="h-4 w-4 text-surface-300 dark:text-surface-600 group-hover/item:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Empty State */}
      {sections.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-primary/5 dark:bg-primary/10 rounded-full flex items-center justify-center">
            <FiSearch className="h-9 w-9 text-primary" />
          </div>
          <h3 className="text-2xl font-bold tracking-tighter text-surface-900 dark:text-surface-50 mb-3">
            No results found
          </h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto">
            Try searching for different terms or browse our categories
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SectionsDisplay;