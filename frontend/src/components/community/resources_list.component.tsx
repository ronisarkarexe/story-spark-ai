import React from 'react';
import { Link } from 'react-router-dom';
import { resources } from './community.data';

const ResourcesListComponent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pt-32 pb-20 transition-colors duration-300 dark:bg-[#0b1329] dark:text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/community" className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Community
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            Writing Resources
          </h1>
          <p className="text-slate-600 max-w-2xl dark:text-gray-400">
            Explore guides, tutorials, and templates designed to spark your storytelling and master AI-assisted writing.
          </p>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, idx) => (
            <Link
              key={idx}
              to={`/resources/${resource.slug}`}
              className="p-8 rounded-2xl bg-gray-50 border border-gray-200 hover:border-blue-500/30 transition-all group cursor-pointer block text-left text-slate-900 dark:bg-slate-900/50 dark:border-white/5 dark:text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <i className={`fa-solid ${resource.icon} text-xl`}></i>
              </div>
              <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">
                {resource.category}
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                {resource.title}
              </h3>
              <p className="text-sm text-slate-600 mb-6 line-clamp-2 dark:text-gray-400">
                {resource.overview}
              </p>
              <div className="flex items-center text-slate-500 text-sm font-medium dark:text-gray-500">
                <i className="fa-regular fa-clock mr-2 text-blue-400"></i> {resource.readTime} read
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesListComponent;
