import { FC } from "react";
import { Link } from "react-router-dom";
import HelpSearchBar from "../help_search_bar/help_search_bar.component";

interface HelpHeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resultCount?: number;
}

const HelpHero: FC<HelpHeroProps> = ({ searchQuery, onSearchChange, resultCount }) => {
  return (
    <section id="help-hero" className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 py-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Support & Guidance</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">How can we help you today?</h1>
        <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
          Find answers, troubleshoot workspace issues, and get guidance for your StorySparkAI workflow.
        </p>
        <div className="mt-10">
          <HelpSearchBar value={searchQuery} onChange={onSearchChange} resultCount={resultCount} />
        </div>
        <Link to="/" className="mt-8 inline-block text-sm font-medium text-blue-600 hover:text-blue-800">
          ← Back to Home
        </Link>
      </div>
    </section>
  );
};

export default HelpHero;
