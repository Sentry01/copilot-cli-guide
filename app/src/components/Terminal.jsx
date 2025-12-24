import React, { useState, useRef, useEffect } from 'react';

export default function Terminal({ scenarioId, onCommand }) {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add command to output
    setOutput(prev => [...prev, { type: 'command', text: input }]);
    
    // Add to history
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Call onCommand callback if provided
    if (onCommand) {
      const response = onCommand(input);
      if (response) {
        setOutput(prev => [...prev, { type: 'output', text: response }]);
      }
    } else {
      // Default response
      setOutput(prev => [...prev, { 
        type: 'output', 
        text: `Command not recognized: ${input}` 
      }]);
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    }
    
    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  const handleClear = () => {
    setOutput([]);
  };

  const handleReset = () => {
    setOutput([]);
    setInput('');
    setHistory([]);
    setHistoryIndex(-1);
  };

  const copyOutput = () => {
    const text = output
      .map(line => line.type === 'command' ? `$ ${line.text}` : line.text)
      .join('\n');
    navigator.clipboard.writeText(text);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className={`bg-[#0C0C0C] rounded-lg overflow-hidden border border-gray-700 ${
        isFullscreen ? 'h-screen' : 'h-96'
      }`}>
        {/* Terminal header with controls */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-3 text-gray-400 text-sm font-mono">Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyOutput}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              title="Copy output"
            >
              📋 Copy
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              title="Clear terminal"
            >
              🗑️ Clear
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              title="Reset terminal"
            >
              ↻ Reset
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              title="Toggle fullscreen"
            >
              {isFullscreen ? '⊡ Exit' : '⛶ Fullscreen'}
            </button>
          </div>
        </div>

        {/* Terminal output area */}
        <div 
          ref={outputRef}
          className="p-4 font-mono text-sm overflow-y-auto"
          style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '320px' }}
          onClick={() => inputRef.current?.focus()}
        >
          {/* Welcome message */}
          {output.length === 0 && (
            <div className="text-green-400 mb-4">
              <div>Welcome to GitHub Copilot CLI Interactive Terminal</div>
              <div className="text-gray-500 mt-1">Type a command and press Enter to execute</div>
            </div>
          )}

          {/* Command history */}
          {output.map((line, index) => (
            <div key={index} className="mb-1">
              {line.type === 'command' ? (
                <div className="text-green-400">
                  <span className="text-gray-500">$</span> {line.text}
                </div>
              ) : (
                <div className="text-gray-300 whitespace-pre-wrap">{line.text}</div>
              )}
            </div>
          ))}

          {/* Current input line */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-gray-500 mr-2">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-400 outline-none font-mono caret-green-400"
              spellCheck={false}
              autoComplete="off"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
