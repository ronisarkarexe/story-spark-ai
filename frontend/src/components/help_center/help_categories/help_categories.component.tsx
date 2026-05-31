import { FC } from "react";
import HelpCategoryCard from "../help_category_card/help_category_card.component";
import { motion } from "framer-motion";

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  return (
    <motion.section
      id="help-categories"
      className="scroll-mt-28 transition-colors duration-300"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="categories-heading"
    >
      {/* Section Header */}
      <div className="mb-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300 mb-4">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 mb-4">
          <i className="fa-solid fa-layer-group" aria-hidden="true"></i>
          <span className="text-sm font-semibold">HELP CATEGORIES</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Explore by Category
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Browse support topics designed to help you quickly understand
          StorySparkAI features, workflows, and troubleshooting steps.
<<<<<<< HEAD
        </p>
      </div>

      {/* Categories Content Matrix */}
      {categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.03] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <i className="fa-solid fa-magnifying-glass text-3xl text-slate-500"></i>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Categories Found
          </h3>

          <p className="text-slate-600 dark:text-slate-400">
            Try adjusting your search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: index * 0.08,
              }}
              whileHover={{
                y: -6,
              }}
              className="
                group relative overflow-hidden
                rounded-3xl
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-white/[0.04]
                backdrop-blur-2xl
                hover:border-blue-500/40
                transition-all duration-300
                shadow-lg hover:shadow-2xl
              "
            >
              {/* Glow effects */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 p-7">
                {/* Icon Layout */}
                <div
                  className="
                    w-16 h-16 rounded-2xl
                    bg-gradient-to-br from-blue-500/20 to-indigo-500/20
                    border border-blue-500/20
                    flex items-center justify-center
                    text-2xl text-blue-600 dark:text-blue-300
                    mb-6
                    group-hover:scale-110
                    transition-transform duration-300
                  "
                >
                  <i className={`fa-solid ${category.icon}`}></i>
                </div>

                {/* Content Elements */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-500 dark:group-hover:text-blue-300 transition-colors">
                  {category.title}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {category.description}
                </p>

                {/* Card Action Link */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-blue-600 dark:text-blue-300 text-sm font-semibold">
                    Learn More
                  </span>

                  <div
                    className="
                      w-10 h-10 rounded-xl
                      bg-slate-100 dark:bg-white/5
                      border border-slate-200 dark:border-white/10
                      flex items-center justify-center
                      text-slate-400
                      group-hover:text-white
                      group-hover:bg-blue-500/20
                      group-hover:border-blue-500/30
                      transition-all duration-300
                    "
                  >
                    <i className="fa-solid fa-arrow-right"></i>
                  </div>
                </div>
              </div>

              {/* Top border ambient gradient highlight */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      )}
    </section>
      <div className="text-center mb-10">
        
        <h2
          id="categories-heading"
          className="text-3xl font-bold text-slate-800 dark:text-gray-300"
        >
          Quick Help Categories
        </h2>

        <p className="mt-3 text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
          Jump into the topic you need — from your first story to contributing code.
=======
>>>>>>> upstream/main
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </motion.section>
  );
};

export default HelpCategories;
