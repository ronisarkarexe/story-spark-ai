import { FC, FormEvent } from "react";

interface HelpSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
}

const HelpSearchBar: FC<HelpSearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search help articles, FAQs, and troubleshooting...",
  resultCount,
}) => {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
      <label htmlFor="help-search" className="sr-only">
        Search help center
      </label>
<<<<<<< HEAD
      <div className="relative before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-purple-500/20 before:via-indigo-500/20 before:to-blue-500/20 before:blur-xl before:rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <i className="fas fa-search text-gray-400 dark:text-gray-300" aria-hidden="true"></i>
=======

      <div className="relative before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-purple-500/10 before:via-indigo-500/10 before:to-blue-500/10 before:blur-xl before:rounded-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none select-none">
          <i className="fas fa-search text-slate-500 dark:text-gray-400 text-sm sm:text-base" aria-hidden="true"></i>
>>>>>>> upstream/main
        </div>

        <input
          id="help-search"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
<<<<<<< HEAD
          className="w-full bg-white border border-gray-300 text-gray-800 placeholder-gray-400 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/20 dark:text-gray-200 dark:placeholder-gray-500 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
=======
          className="w-full bg-white border border-slate-300 text-slate-800 placeholder-slate-400 dark:bg-slate-900/40 dark:backdrop-blur-md dark:border-white/10 dark:text-slate-100 dark:placeholder-slate-500 rounded-2xl py-3.5 sm:py-4 pl-11 sm:pl-12 pr-11 sm:pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 box-border appearance-none [&::-webkit-search-cancel-button]:hidden"
>>>>>>> upstream/main
          autoComplete="off"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
<<<<<<< HEAD
            className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white transition-colors"
=======
            className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
>>>>>>> upstream/main
            aria-label="Clear search"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        )}
      </div>

      {value && resultCount !== undefined && (
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-500 text-center" aria-live="polite">
          {resultCount === 0
<<<<<<< HEAD
            ? "No results found — try different keywords"
            : `${resultCount} result${resultCount === 1 ? "" : "s"} found`}
=======
            ? "No results found — try filtering by different keywords"
            : `${resultCount} result${resultCount === 1 ? "" : "s"} uncovered inside ecosystem guides`}
>>>>>>> upstream/main
        </p>
      )}
    </form>
  );
};

export default HelpSearchBar;