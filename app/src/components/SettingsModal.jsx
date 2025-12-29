import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'editor', name: 'Editor', icon: '⚙️' },
    { id: 'data', name: 'Data', icon: '💾' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 id="settings-title" className="text-2xl font-bold text-gray-900 dark:text-white">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close settings"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 min-h-[400px]">
            {activeTab === 'appearance' && <AppearanceTab />}
            {activeTab === 'editor' && <EditorTab />}
            {activeTab === 'data' && <DataTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="theme" 
              value="light" 
              className="w-4 h-4 text-blue-600" 
              checked={theme === 'light'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="theme" 
              value="dark" 
              className="w-4 h-4 text-blue-600"
              checked={theme === 'dark'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="theme" 
              value="auto" 
              className="w-4 h-4 text-blue-600"
              checked={theme === 'auto'}
              onChange={(e) => setTheme(e.target.value)}
            />
            <span className="text-gray-700 dark:text-gray-300">Auto (System)</span>
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Color Scheme
        </h3>
        <select className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option>Blue (Default)</option>
          <option>Purple</option>
          <option>Green</option>
          <option>Red</option>
        </select>
      </div>
    </div>
  );
}

function EditorTab() {
  const { fontSize, setFontSize, codeTheme, setCodeTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Font Size
        </h3>
        <select 
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="small">Small</option>
          <option value="medium">Medium (Default)</option>
          <option value="large">Large</option>
          <option value="xlarge">Extra Large</option>
        </select>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Code Theme
        </h3>
        <select 
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          value={codeTheme}
          onChange={(e) => setCodeTheme(e.target.value)}
        >
          <option value="vscode-dark">VS Code Dark (Default)</option>
          <option value="github-light">GitHub Light</option>
          <option value="monokai">Monokai</option>
          <option value="dracula">Dracula</option>
        </select>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Options
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            <span className="text-gray-700 dark:text-gray-300">Show line numbers in code blocks</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
            <span className="text-gray-700 dark:text-gray-300">Enable syntax highlighting</span>
          </label>
        </div>
      </div>
    </div>
  );
}

function DataTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Export Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Download all your progress, bookmarks, and settings as a JSON file.
        </p>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
          Export All Data
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Import Data
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Restore your data from a previously exported JSON file.
        </p>
        <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
          Import Data
        </button>
      </div>

      <div className="border-t border-red-200 dark:border-red-900 pt-6">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
          Danger Zone
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Clear all your progress and reset the application to its initial state.
        </p>
        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
          Reset All Data
        </button>
      </div>
    </div>
  );
}
