import { useState, useEffect } from 'react';

function CommandDetailView({ commandName, onBack, onTryIt }) {
  const [command, setCommand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommandDetail();
  }, [commandName]);

  const fetchCommandDetail = async () => {
    try {
      const encodedName = encodeURIComponent(commandName);
      const response = await fetch(`http://localhost:3000/api/commands/${encodedName}`);
      const data = await response.json();
      setCommand(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching command detail:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-gray-600 dark:text-gray-400">Loading command...</div>
      </div>
    );
  }

  if (!command) {
    return (
      <div className="p-8">
        <div className="text-red-600 dark:text-red-400">Command not found.</div>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Commands
        </button>
      </div>
    );
  }

  const flags = command.flags ? JSON.parse(command.flags) : [];
  const examples = command.examples ? JSON.parse(command.examples) : [];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const relatedCommands = command.relatedCommands || [];

  const handleRelatedCommandClick = (commandName) => {
    // Trigger a re-fetch by updating the parent component
    window.location.hash = `#command-${encodeURIComponent(commandName)}`;
    window.location.reload();
  };

  return (
    <div className="flex gap-6 p-8 max-w-7xl">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Commands
        </button>

      {/* Command Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 font-mono">
          {command.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {command.description}
        </p>
        <div className="mt-4">
          <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
            {command.category}
          </span>
        </div>
      </div>

      {/* Syntax Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Syntax
        </h2>
        <div className="relative bg-gray-900 dark:bg-black rounded-lg p-4">
          <code className="text-green-400 font-mono text-lg">
            {command.syntax}
          </code>
          <button
            onClick={() => handleCopy(command.syntax)}
            className="absolute top-2 right-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Flags/Options Section */}
      {flags.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Flags & Options
          </h2>
          <div className="bg-white dark:bg-gh-dark-surface rounded-lg border border-gray-200 dark:border-gh-dark-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gh-dark-bg">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Flag
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {flags.map((flag, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    <td className="px-4 py-3">
                      <code className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                        {flag.flag}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-sm">
                      {flag.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Examples Section */}
      {examples.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Examples
          </h2>
          <div className="space-y-4">
            {examples.map((example, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gh-dark-surface rounded-lg border border-gray-200 dark:border-gh-dark-border p-4"
              >
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  {example.description}
                </p>
                <div className="relative bg-gray-900 dark:bg-black rounded-md p-3">
                  <code className="text-green-400 font-mono text-sm">
                    {example.command}
                  </code>
                  <button
                    onClick={() => handleCopy(example.command)}
                    className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded"
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Try It Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onTryIt}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Try it in Terminal
        </button>
      </div>
    </div>

    {/* Sidebar - Related Commands */}
    {relatedCommands.length > 0 && (
      <aside className="w-80 flex-shrink-0">
        <div className="sticky top-8 bg-white dark:bg-gh-dark-surface rounded-lg border border-gray-200 dark:border-gh-dark-border p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Related Commands
          </h3>
          <div className="space-y-3">
            {relatedCommands.map((relatedCmd, idx) => (
              <button
                key={idx}
                onClick={() => handleRelatedCommandClick(relatedCmd.name)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gh-dark-border hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1 group-hover:underline">
                  {relatedCmd.name}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {relatedCmd.description}
                </div>
                {relatedCmd.category && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs">
                      {relatedCmd.category}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </aside>
    )}
  </div>
  );
}

export default CommandDetailView;
