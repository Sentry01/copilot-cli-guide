import { useState, useEffect } from 'react';
import CommandDetailView from './CommandDetailView';

function CommandsView({ onNavigateToTerminal }) {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/commands');
      const data = await response.json();
      setCommands(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(cmd => cmd.category))];
      setCategories(['all', ...uniqueCategories]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching commands:', error);
      setLoading(false);
    }
  };

  const filteredCommands = commands
    .filter(cmd => selectedCategory === 'all' || cmd.category === selectedCategory)
    .filter(cmd => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return cmd.name.toLowerCase().includes(search) || 
             cmd.description.toLowerCase().includes(search);
    });

  // Group commands by category
  const commandsByCategory = {};
  filteredCommands.forEach(cmd => {
    if (!commandsByCategory[cmd.category]) {
      commandsByCategory[cmd.category] = [];
    }
    commandsByCategory[cmd.category].push(cmd);
  });

  // Show detail view if command is selected
  if (selectedCommand) {
    return (
      <CommandDetailView
        commandName={selectedCommand}
        onBack={() => setSelectedCommand(null)}
        onTryIt={() => {
          if (onNavigateToTerminal) {
            onNavigateToTerminal(selectedCommand);
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading commands...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Command Reference
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Complete reference for GitHub Copilot CLI commands
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search commands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute right-3 top-3.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-10 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category === 'all' ? 'All Commands' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Commands List */}
      {filteredCommands.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(commandsByCategory).map(([category, cmds]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {category}
              </h2>
              <div className="space-y-4">
                {cmds.map(command => (
                  <CommandCard 
                    key={command.id} 
                    command={command}
                    onViewDetail={() => setSelectedCommand(command.name)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="mx-auto w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-2">
            No commands found
          </p>
          <p className="text-gray-400 dark:text-gray-500">
            {searchTerm ? `No commands match "${searchTerm}"` : 'No commands in this category'}
          </p>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function CommandCard({ command, onViewDetail }) {
  const [showExamples, setShowExamples] = useState(false);
  const examples = command.examples ? JSON.parse(command.examples) : [];

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onViewDetail}
    >
      {/* Command Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        <code className="font-mono text-blue-600 dark:text-blue-400">
          {command.name}
        </code>
      </h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {command.description}
      </p>

      {/* Syntax */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
          Syntax
        </h4>
        <div className="bg-gray-900 dark:bg-black rounded-md p-3">
          <code className="text-sm text-green-400 font-mono">
            {command.syntax}
          </code>
        </div>
      </div>

      {/* View Details Link */}
      <div className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
        View Full Documentation →
      </div>

      {/* Examples Toggle (stop propagation to prevent navigation) */}
      {examples.length > 0 && (
        <div className="mt-3" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
          >
            {showExamples ? '▼' : '▶'} {examples.length} Example{examples.length > 1 ? 's' : ''}
          </button>

          {showExamples && (
            <div className="mt-3 space-y-3">
              {examples.map((example, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-md p-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {example.description}
                  </p>
                  <div className="bg-gray-900 dark:bg-black rounded p-2">
                    <code className="text-xs text-green-400 font-mono">
                      {example.command}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommandsView;
