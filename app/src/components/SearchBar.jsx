import React, { useState, useEffect, useRef } from 'react';

export default function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    // Debounce search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          setResults(data.results || []);
          setIsOpen(data.results.length > 0);
          setLoading(false);
        })
        .catch(err => {
          console.error('Search error:', err);
          setLoading(false);
        });
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const handleResultClick = (result) => {
    if (result.type === 'lesson' && onNavigate) {
      onNavigate(result.id);
      setIsOpen(false);
      setQuery('');
    }
  };

  const highlightMatch = (text, searchTerm) => {
    if (!text || !searchTerm) return text;
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 dark:bg-yellow-600 font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'lesson':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'command':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'example':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
          placeholder="Search lessons, commands..."
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Search lessons, commands, and examples"
          role="searchbox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={isOpen ? "search-results" : undefined}
        />
        <svg 
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto"
          role="listbox"
        >
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}-${index}`}
                onClick={() => handleResultClick(result)}
                role="option"
                aria-selected={false}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-start gap-3"
              >
                <div className="text-gray-500 dark:text-gray-400 mt-1">
                  {getResultIcon(result.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {highlightMatch(result.title || result.name, query)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                      {getTypeLabel(result.type)}
                    </span>
                  </div>
                  {result.snippet && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {highlightMatch(result.snippet, query)}
                    </p>
                  )}
                  {result.module_name && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {result.module_name}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
