import { useState, useEffect } from 'react';

function CommandsView() {
  const [commands, setCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

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

  const filteredCommands = selectedCategory === 'all' 
    ? commands 
    : commands.filter(cmd => cmd.category === selectedCategory);

  // Group commands by category
  const commandsByCategory = {};
  filteredCommands.forEach(cmd => {
    if (!commandsByCategory[cmd.category]) {
      commandsByCategory[cmd.category] = [];
    }
    commandsByCategory[cmd.category].push(cmd);
  });

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

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
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

      {/* Commands List */}
      <div className="space-y-8">
        {Object.entries(commandsByCategory).map(([category, cmds]) => (
          <div key={category}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {category}
            </h2>
            <div className="space-y-4">
              {cmds.map(command => (
                <CommandCard key={command.id} command={command} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCommands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No commands found in this category.
          </p>
        </div>
      )}
    </div>
  );
}

function CommandCard({ command }) {
  const [showExamples, setShowExamples] = useState(false);
  const examples = command.examples ? JSON.parse(command.examples) : [];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
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

      {/* Examples Toggle */}
      {examples.length > 0 && (
        <div>
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
