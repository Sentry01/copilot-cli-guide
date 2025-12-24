import { useState, useEffect } from 'react';
import { ExamplesLoadingSkeleton } from './LoadingStates';
import { delay, LOADING_DELAY } from '../utils/delay';

function ExamplesView() {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [categories, setCategories] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      const [response] = await Promise.all([
        fetch('http://localhost:3000/api/examples'),
        delay(LOADING_DELAY)
      ]);
      const data = await response.json();
      setExamples(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(ex => ex.category))];
      setCategories(['all', ...uniqueCategories]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching examples:', error);
      setLoading(false);
    }
  };

  const filteredExamples = examples.filter(ex => {
    const categoryMatch = selectedCategory === 'all' || ex.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (loading) {
    return <ExamplesLoadingSkeleton />;
  }

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          💡 Code Examples
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Real-world examples of GitHub Copilot CLI usage
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Difficulty
          </label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-end">
          <span className="text-sm text-gray-600 dark:text-gray-400 pb-2">
            {filteredExamples.length} example{filteredExamples.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory !== 'all' || selectedDifficulty !== 'all') && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Examples Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExamples.map(example => (
          <ExampleCard 
            key={example.id} 
            example={example}
            isExpanded={expandedId === example.id}
            onToggle={() => setExpandedId(expandedId === example.id ? null : example.id)}
            getDifficultyColor={getDifficultyColor}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredExamples.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            No examples found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}

function ExampleCard({ example, isExpanded, onToggle, getDifficultyColor }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(example.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition-all cursor-pointer"
      onClick={onToggle}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          {example.title}
        </h3>
        <div className="flex gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(example.difficulty)}`}>
            {example.difficulty}
          </span>
          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {example.category}
          </span>
        </div>
      </div>

      {/* Code Preview or Full */}
      {!isExpanded ? (
        <div className="bg-gray-900 dark:bg-black rounded-md p-3 overflow-hidden">
          <code className="text-xs text-green-400 font-mono line-clamp-2">
            {example.code}
          </code>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-gray-900 dark:bg-black rounded-md p-3 relative">
            <code className="text-sm text-green-400 font-mono break-all">
              {example.code}
            </code>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      {/* Expand Indicator */}
      <div className="mt-3 text-center text-xs text-gray-500 dark:text-gray-400">
        {isExpanded ? '▲ Click to collapse' : '▼ Click to expand'}
      </div>
    </div>
  );
}

export default ExamplesView;
