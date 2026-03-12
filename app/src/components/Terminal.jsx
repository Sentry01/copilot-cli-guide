import React, { useState, useRef, useEffect } from 'react';

export default function Terminal({ onCommand }) {
  const [output, setOutput] = useState([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [typingIndex, setTypingIndex] = useState(-1); // Index of line being typed
  const [typedText, setTypedText] = useState(''); // Current typed text
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, typedText]);

  // Focus input on mount (without scrolling to it)
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // Typing animation effect
  useEffect(() => {
    if (typingIndex === -1 || typingIndex >= output.length) return;
    
    const currentLine = output[typingIndex];
    // Removed redundant check for type !== 'output' to avoid synchronous setState warning

    const fullText = currentLine.text;
    if (typedText.length < fullText.length) {
      typingTimeoutRef.current = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 20); // 20ms per character for natural typing speed
    } else {
      // Typing complete
      setTimeout(() => {
        setTypingIndex(-1);
        setTypedText('');
      }, 0);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [typingIndex, typedText, output]);

  const skipTyping = () => {
    if (typingIndex !== -1) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTypingIndex(-1);
      setTypedText('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Skip any ongoing typing animation
    skipTyping();

    // Add command to output
    setOutput(prev => [...prev, { type: 'command', text: input }]);
    
    // Add to history
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Call onCommand callback if provided
    if (onCommand) {
      const response = onCommand(input);
      if (response) {
        const newOutputIndex = output.length + 1; // +1 for the command we just added
        setOutput(prev => [...prev, { type: 'output', text: response }]);
        setTypingIndex(newOutputIndex);
        setTypedText('');
      }
    } else {
      // Default response
      const newOutputIndex = output.length + 1;
      setOutput(prev => [...prev, { 
        type: 'output', 
        text: `Command not recognized: ${input}` 
      }]);
      setTypingIndex(newOutputIndex);
      setTypedText('');
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
    skipTyping();
    setOutput([]);
  };

  const handleReset = () => {
    skipTyping();
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
        <div className="bg-gray-800 border-b border-gray-700 px-2 sm:px-3 md:px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="ml-2 sm:ml-3 text-gray-400 text-xs sm:text-sm font-mono">Terminal</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={copyOutput}
              className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
              title="Copy output"
              aria-label="Copy terminal output to clipboard"
            >
              <span className="hidden sm:inline">📋 Copy</span>
              <span className="sm:hidden">📋</span>
            </button>
            <button
              onClick={handleClear}
              className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
              title="Clear terminal"
              aria-label="Clear terminal output"
            >
              <span className="hidden sm:inline">🗑️ Clear</span>
              <span className="sm:hidden">🗑️</span>
            </button>
            <button
              onClick={handleReset}
              className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
              title="Reset terminal"
              aria-label="Reset terminal to initial state"
            >
              <span className="hidden sm:inline">↻ Reset</span>
              <span className="sm:hidden">↻</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-2 py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors touch-manipulation"
              title="Toggle fullscreen"
              aria-label={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
            >
              <span className="hidden sm:inline">{isFullscreen ? '⊡ Exit' : '⛶ Fullscreen'}</span>
              <span className="sm:hidden">{isFullscreen ? '⊡' : '⛶'}</span>
            </button>
          </div>
        </div>

        {/* Terminal output area */}
        <div 
          ref={outputRef}
          className="p-2 sm:p-3 md:p-4 font-mono text-xs sm:text-sm overflow-y-auto overflow-x-auto touch-pan-y"
          style={{ height: isFullscreen ? 'calc(100vh - 120px)' : '320px' }}
          onClick={() => {
            skipTyping(); // Skip animation on click
            inputRef.current?.focus();
          }}
        >
          {/* Welcome message */}
          {output.length === 0 && (
            <div className="text-green-400 mb-4">
              <div className="text-sm sm:text-base">Welcome to GitHub Copilot CLI Interactive Terminal</div>
              <div className="text-gray-500 mt-1 text-xs sm:text-sm">Type a command and press Enter to execute</div>
            </div>
          )}

          {/* Command history */}
          {output.map((line, index) => (
            <div key={index} className="mb-1">
              {line.type === 'command' ? (
                <div className="text-green-400 break-words">
                  <span className="text-gray-500">$</span> {line.text}
                </div>
              ) : (
                <div className="text-gray-300 whitespace-pre-wrap break-words">
                  {index === typingIndex ? typedText : line.text}
                  {index === typingIndex && (
                    <span className="animate-pulse">▋</span>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Current input line */}
          <form onSubmit={handleSubmit} className="flex items-center">
            <span className="text-gray-500 mr-2" aria-hidden="true">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-green-400 outline-none font-mono caret-green-400 text-xs sm:text-sm touch-manipulation"
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command input"
              placeholder=""
            />
          </form>
        </div>
      </div>
    </div>
  );
}
