import React, { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialQuery?: string;
  suggestions: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, initialQuery, suggestions }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userInput = e.currentTarget.value;
    const newFilteredSuggestions = userInput.length > 0
      ? suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(userInput.toLowerCase())
        )
      : [];

    setQuery(userInput);
    setFilteredSuggestions(newFilteredSuggestions);
    setShowSuggestions(newFilteredSuggestions.length > 0);
    setActiveSuggestionIndex(-1);
  };

  const handleClick = (suggestion: string) => {
    setQuery(suggestion);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    onSearch(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex =>
          prevIndex > 0 ? prevIndex - 1 : 0
        );
      } else if (e.key === 'Enter') {
        if (activeSuggestionIndex > -1) {
          e.preventDefault();
          handleClick(filteredSuggestions[activeSuggestionIndex]);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto" ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleChange}
          placeholder="e.g., 'Frontend Developer' or 'Data Scientist'"
          disabled={isLoading}
          className="w-full pl-5 pr-32 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
          autoComplete="off"
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-lg animate-fade-in-fast">
            {filteredSuggestions.map((suggestion, index) => {
              const isActive = index === activeSuggestionIndex;
              return (
                <li
                  className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${isActive ? 'bg-teal-100 dark:bg-teal-500/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/60'}`}
                  key={suggestion}
                  onClick={() => handleClick(suggestion)}
                  onMouseEnter={() => setActiveSuggestionIndex(index)}
                >
                  {suggestion}
                </li>
              );
            })}
          </ul>
        )}
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