'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

const PopularTopics = ({ tags, onTagClick }) => {
  const [showFilters, setShowFilters] = useState(false);
  return (
    <section className="mt-20 mb-5">
      <h2 className="text-3xl font-medium text-surface-800 dark:text-white mb-2">
        Explore Popular Topics
      </h2>
      <div className='h-px bg-surface-200 dark:bg-surface-700 mb-6'></div>
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto">
        <div className="relative w-full md:w-2/3">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-surface-500 dark:text-surface-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search articles..."
            onChange={(e) => onTagClick(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark transition w-full md:w-auto"
        >
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 justify-center mb-4">
          {tags.map((tag) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onTagClick(tag)}
              className="px-5 py-2 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-full text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-700 border border-surface-200 dark:border-surface-700 shadow-sm hover:shadow-md transition-all"
            >
              #{tag}
            </motion.button>
          ))}
        </div>
      )}
    </section>
  );
};

export default PopularTopics;
