import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Cmd', 'K'], description: 'Open command palette' },
        { keys: ['/'], description: 'Focus search bar' },
        { keys: ['Esc'], description: 'Close modals / Clear search' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['g', 'h'], description: 'Go to home' },
        { keys: ['g', 'c'], description: 'Go to commands' },
        { keys: ['g', 'e'], description: 'Go to examples' },
        { keys: ['g', 'b'], description: 'Go to bookmarks' },
        { keys: ['g', 'p'], description: 'Go to progress' },
      ]
    },
    {
      category: 'Lesson Navigation',
      items: [
        { keys: ['←'], description: 'Previous lesson' },
        { keys: ['→'], description: 'Next lesson' },
        { keys: ['m'], description: 'Mark lesson as complete' },
        { keys: ['b'], description: 'Toggle bookmark' },
      ]
    },
    {
      category: 'Interface',
      items: [
        { keys: ['['], description: 'Toggle sidebar' },
        { keys: [','], description: 'Open settings' },
        { keys: ['t'], description: 'Toggle theme' },
      ]
    },
    {
      category: 'Terminal',
      items: [
        { keys: ['Cmd', 'Enter'], description: 'Execute command' },
        { keys: ['Ctrl', 'C'], description: 'Clear terminal' },
        { keys: ['↑'], description: 'Previous command in history' },
        { keys: ['↓'], description: 'Next command in history' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl shadow-2xl ${
          isDark ? 'bg-[#161B22]' : 'bg-white'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
      >
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b ${
          isDark ? 'bg-[#161B22] border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <h2 
              id="shortcuts-title"
              className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}
            >
              ⌨️ Keyboard Shortcuts
            </h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
              }`}
              aria-label="Close keyboard shortcuts"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {section.category}
              </h3>
              <div className="space-y-2">
                {section.items.map((shortcut, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                      isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <span key={keyIdx} className="flex items-center gap-1">
                          <kbd className={`px-2.5 py-1.5 text-xs font-semibold rounded border ${
                            isDark 
                              ? 'bg-gray-800 text-gray-200 border-gray-600' 
                              : 'bg-gray-100 text-gray-800 border-gray-300'
                          }`}>
                            {key}
                          </kbd>
                          {keyIdx < shortcut.keys.length - 1 && (
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {shortcut.keys.length === 2 && keyIdx === 0 ? '+' : ' then '}
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Press <kbd className={`px-2 py-1 text-xs rounded ${
              isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
            }`}>Esc</kbd> or <kbd className={`px-2 py-1 text-xs rounded ${
              isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
            }`}>?</kbd> to close this dialog
          </p>
        </div>
      </div>
    </div>
  );
}
