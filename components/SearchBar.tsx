import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'Frontend Developer' or 'Data Scientist'"
          disabled={isLoading}
          className="w-full pl-5 pr-32 py-4 text-lg bg-gray-800 border-2 border-gray-700 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className="fas fa-search mr-2"></i>
              Analyze
            </>
          )}
        </button>
      </div>
    </form>
  );
};
