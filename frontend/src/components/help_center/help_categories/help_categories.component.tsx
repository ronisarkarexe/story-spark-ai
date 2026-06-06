import { FC } from "react";
import { HelpCategory } from "../help_center.utils";
import HelpCategoryCard from "../help_category_card/help_category_card.component";

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

const HelpCategories: FC<HelpCategoriesProps> = ({ categories }) => {
  return (
    <motion.section
      id="help-categories"
      className="scroll-mt-28 transition-colors duration-300 w-full box-border"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      aria-labelledby="categories-heading"
    >
      {/* Section Header */}
      <div className="mb-12 text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300 mb-4 select-none">
          <i className="fa-solid fa-layer-group"></i>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider">Help Categories</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
          Explore by Category
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">


        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">

          Browse support topics designed to help you quickly understand
          StorySparkAI features, workflows, and troubleshooting steps.

        </p>
      </div>


      {!categories || categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.02] p-8 sm:p-12 text-center max-w-4xl mx-auto box-border">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-5 border border-slate-200/60 dark:border-white/5">
            <i className="fa-solid fa-magnifying-glass text-2xl sm:text-3xl text-slate-400 dark:text-slate-500"></i>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
            No Categories Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Try adjusting your search keywords to locate sections.

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 px-4 sm:px-0 w-full box-border">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.08, 0.3),
              }}
              whileHover={{
                y: -6,
              }}
              className="
                group relative overflow-hidden
                rounded-2xl sm:rounded-3xl
                border border-slate-200 dark:border-white/10
                bg-white dark:bg-[#111827]/40
                backdrop-blur-2xl
                hover:border-blue-500/40 dark:hover:border-blue-500/30
                transition-all duration-300

                shadow-sm hover:shadow-xl
                p-6 sm:p-7
                w-full box-border flex flex-col justify-between
              "
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10 w-full box-border">

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
                    w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl
                    bg-gradient-to-br from-blue-500/10 to-indigo-500/10
                    border border-blue-500/20
                    flex items-center justify-center

                    text-xl sm:text-2xl text-blue-500 dark:text-blue-400
                    mb-5 sm:mb-6 select-none
                    group-hover:scale-105

                    text-2xl text-blue-600 dark:text-blue-300
                    mb-6
                    group-hover:scale-110

                    transition-transform duration-300
                  "
                >
                  <i className={`fa-solid ${category.icon}`}></i>
                </div>


                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2 sm:mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-full">
                  {category.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs sm:text-sm font-medium">
                  {category.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-center justify-between select-none">
                <span className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-bold tracking-tight">
                  Learn More
                </span>
                <div
                  className="
                    w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl
                    bg-slate-100 dark:bg-white/5
                    border border-slate-200/60 dark:border-white/10
                    flex items-center justify-center
                    text-slate-400 text-xs sm:text-sm
                    group-hover:text-white
                    group-hover:bg-blue-500
                    group-hover:border-blue-500/20
                    transition-all duration-200
                  "
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
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


        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <HelpCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default HelpCategories;
