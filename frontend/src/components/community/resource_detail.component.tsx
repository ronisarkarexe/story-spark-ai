import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { resources } from './community.data';

const ResourceDetailComponent: React.FC = () => {
  const { resourceName } = useParams<{ resourceName: string }>();
  const resource = resources.find((res) => res.slug === resourceName);

  if (!resource) {
    return (
      <div className="min-h-screen bg-white text-slate-900 pt-32 pb-20 flex flex-col items-center justify-center transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Resource Not Found</h2>
        <p className="text-slate-600 mb-8 dark:text-gray-400">The writing resource you are looking for does not exist.</p>
        <Link to="/resources">
          <button className="!rounded-button bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 font-bold transition-colors cursor-pointer">
            Back to Resources
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-32 pb-20 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link to="/resources" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Resources
          </Link>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full dark:text-blue-400">
            {resource.category}
          </span>
        </div>

        {/* Header Section */}
        <div className="flex items-start gap-6 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 border border-blue-500/20 dark:text-blue-400">
            <i className={`fa-solid ${resource.icon} text-3xl`}></i>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900 dark:text-white">
              {resource.title}
            </h1>
            <div className="flex items-center text-slate-600 text-sm dark:text-gray-400">
              <i className="fa-regular fa-clock mr-2 text-blue-400"></i>
              {resource.readTime} read time
            </div>
          </div>
        </div>

        <hr className="border-gray-200 mb-10 dark:border-white/10" />

        {/* Core Content Layout */}
        <div className="space-y-12">
          {/* Overview */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Overview</h2>
            <p className="text-slate-600 leading-relaxed text-base md:text-lg dark:text-gray-300">
              {resource.overview}
            </p>
          </div>

          {/* Beginner-Friendly Guidance */}
          <div className="p-6 md:p-8 rounded-2xl bg-gray-50 border border-gray-200 text-slate-900 dark:bg-slate-900/40 dark:border-white/5 dark:text-white">
            <h2 className="text-lg font-bold mb-3 text-blue-600 dark:text-blue-400">Beginner-Friendly Guidance</h2>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base dark:text-gray-300">
              {resource.guidance}
            </p>
          </div>

          {/* Quick Tips */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Quick Tips</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-600 bg-gray-50 p-4 rounded-xl border border-gray-200 dark:text-gray-300 dark:bg-white/5 dark:border-white/5">
                  <i className="fa-solid fa-circle-check text-blue-400 mt-1 shrink-0"></i>
                  <span className="text-sm md:text-base">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Examples/Templates */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Concise Templates & Examples</h2>
            <div className="space-y-6">
              {resource.examples.map((ex, index) => (
                <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-6 text-slate-900 dark:bg-slate-950/60 dark:border-white/5 dark:text-white">
                  <div className="font-semibold text-blue-600 mb-3 text-sm md:text-base dark:text-blue-400">{ex.label}</div>
                  <pre className="text-slate-600 text-sm whitespace-pre-wrap font-sans bg-gray-100 p-4 rounded-lg border border-gray-200 leading-relaxed dark:text-gray-300 dark:bg-black/40 dark:border-white/5">
                    {ex.prompt}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailComponent;
