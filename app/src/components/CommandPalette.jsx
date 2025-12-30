import React, { useState, useEffect, useRef } from 'react';

export default function CommandPalette({ isOpen, onClose, onNavigate, onOpenSettings }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(results.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(results.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(getDefaultCommands());
      setSelectedIndex(0);
      return;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    setLoading(true);
    debounceTimer.current = setTimeout(() => {
      fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(data => {
          const searchResults = data.results || [];
          const allResults = [
            ...getActionCommands(query),
            ...searchResults
          ];
          setResults(allResults);
          setSelectedIndex(0);
          setLoading(false);
        })
        .catch(err => {
          console.error('Search error:', err);
          setResults(getActionCommands(query));
          setLoading(false);
        });
    }, 150);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  const getDefaultCommands = () => [
    { type: 'action', id: 'settings', name: 'Open Settings', description: 'View and change preferences', icon: 'settings' },
    { type: 'action', id: 'commands', name: 'View Commands', description: 'Browse command reference', icon: 'terminal' },
    { type: 'action', id: 'examples', name: 'View Examples', description: 'Browse code examples', icon: 'code' },
    { type: 'action', id: 'bookmarks', name: 'View Bookmarks', description: 'See your saved lessons', icon: 'bookmark' },
    { type: 'action', id: 'progress', name: 'View Progress', description: 'Check your learning progress', icon: 'chart' },
  ];

  const getActionCommands = (searchTerm) => {
    const actions = [
      { type: 'action', id: 'settings', name: 'Open Settings', description: 'View and change preferences', icon: 'settings', keywords: ['settings', 'preferences', 'config', 'options'] },
      { type: 'action', id: 'commands', name: 'View Commands', description: 'Browse command reference', icon: 'terminal', keywords: ['commands', 'reference', 'docs'] },
      { type: 'action', id: 'examples', name: 'View Examples', description: 'Browse code examples', icon: 'code', keywords: ['examples', 'code', 'samples'] },
      { type: 'action', id: 'bookmarks', name: 'View Bookmarks', description: 'See your saved lessons', icon: 'bookmark', keywords: ['bookmarks', 'saved', 'favorites'] },
      { type: 'action', id: 'progress', name: 'View Progress', description: 'Check your learning progress', icon: 'chart', keywords: ['progress', 'stats', 'dashboard'] },
    ];

    if (!searchTerm) return actions;

    const term = searchTerm.toLowerCase();
    return actions.filter(action => 
      action.name.toLowerCase().includes(term) ||
      action.description.toLowerCase().includes(term) ||
      action.keywords.some(keyword => keyword.includes(term))
    );
  };

  const handleSelect = (result) => {
    if (result.type === 'action') {
      handleAction(result.id);
    } else if (result.type === 'lesson' && onNavigate) {
      onNavigate(result.id);
      onClose();
    } else if (result.type === 'command' || result.type === 'example') {
      // Navigate to respective view
      handleAction(result.type === 'command' ? 'commands' : 'examples');
    }
    setQuery('');
  };

  const handleAction = (actionId) => {
    switch (actionId) {
      case 'settings':
        onOpenSettings?.();
        onClose();
        break;
      case 'commands':
        onNavigate?.('commands');
        onClose();
        break;
      case 'examples':
        onNavigate?.('examples');
        onClose();
        break;
      case 'bookmarks':
        onNavigate?.('bookmarks');
        onClose();
        break;
      case 'progress':
        onNavigate?.('progress');
        onClose();
        break;
      default:
        break;
    }
  };

  const getIcon = (result) => {
    const iconType = result.icon || result.type;
    const iconClass = "w-5 h-5";

    switch (iconType) {
      case 'settings':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'terminal':
      case 'command':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'code':
      case 'example':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        );
      case 'bookmark':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        );
      case 'chart':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'lesson':
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'action':
        return 'Action';
      case 'lesson':
        return 'Lesson';
      case 'command':
        return 'Command';
      case 'example':
        return 'Example';
      default:
        return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="command-palette-title">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-start justify-center p-4 pt-[10vh]">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gh-dark-surface rounded-lg shadow-2xl">
          {/* Search Input */}
          <div className="border-b border-gray-200 dark:border-gh-dark-border p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                id="command-palette-title"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands, lessons, or actions..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-gh-dark-text placeholder-gray-400 dark:placeholder-gray-500"
                aria-label="Command palette search"
              />
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gh-dark-surface rounded">
                ESC
              </kbd>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto" ref={resultsRef}>
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                {query ? 'No results found' : 'Start typing to search...'}
              </div>
            ) : (
              <div className="py-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleSelect(result)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary bg-opacity-10 border-l-4 border-primary'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${
                      index === selectedIndex 
                        ? 'text-primary' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {getIcon(result)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-gh-dark-text truncate">
                        {result.name || result.title}
                      </div>
                      {(result.description || result.module_name) && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {result.description || result.module_name}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      {getTypeLabel(result.type)}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gh-dark-border px-4 py-3 bg-gray-50 dark:bg-gh-dark-bg rounded-b-lg">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-gh-dark-surface rounded border border-gray-300 dark:border-gh-dark-border">↑</kbd>
                  <kbd className="px-2 py-1 bg-white dark:bg-gh-dark-surface rounded border border-gray-300 dark:border-gh-dark-border">↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 bg-white dark:bg-gh-dark-surface rounded border border-gray-300 dark:border-gh-dark-border">↵</kbd>
                  <span>Select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white dark:bg-gh-dark-surface rounded border border-gray-300 dark:border-gh-dark-border">ESC</kbd>
                <span>Close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
