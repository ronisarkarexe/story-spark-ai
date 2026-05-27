'use client';
import { useState, useEffect } from 'react';

const SearchBar = ({ sections, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!query) {
      onSearchResults(sections);
      return;
    }

    const filtered = sections.map(section => {
      const sectionTitleMatch = section.title.toLowerCase().includes(query);
      
      const subsectionMatches = section.subsections?.map(subsection => {
        const subsectionTitleMatch = subsection.title.toLowerCase().includes(query);
        const itemMatches = subsection.items.filter(item => 
          item.name.toLowerCase().includes(query)
        );
        return {
          ...subsection,
          items: subsectionTitleMatch ? subsection.items : itemMatches,
          isHighlighted: subsectionTitleMatch || itemMatches.length > 0
        };
      }).filter(subsection => subsection.items.length > 0);

      const itemMatches = section.items?.filter(item => 
        item.name.toLowerCase().includes(query)
      );

      return {
        ...section,
        subsections: section.subsections ? subsectionMatches : undefined,
        items: section.subsections ? undefined : (itemMatches?.length > 0 ? itemMatches : undefined),
        isHighlighted: sectionTitleMatch || 
                      (subsectionMatches?.length > 0) || 
                      (itemMatches?.length > 0)
      };
    }).filter(section => 
      section.isHighlighted || 
      section.subsections?.length > 0 || 
      section.items?.length > 0
    );

    onSearchResults(filtered);
  };

  return (
    <div className="mt-4 max-w-2xl mx-auto relative">
      <input
        type="text"
        placeholder="Search algorithms, data structures..."
        className="w-full px-6 py-3.5 rounded-full border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-50 placeholder-surface-400 dark:placeholder-surface-500 text-[15px] transition-all shadow-sm"
        value={searchQuery}
        onChange={handleSearch}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 absolute right-5 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
  );
};

export default SearchBar;