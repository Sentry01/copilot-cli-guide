import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'auto';
    }
    return 'light';
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved || 'medium';
  });

  const [codeTheme, setCodeTheme] = useState(() => {
    const saved = localStorage.getItem('codeTheme');
    return saved || 'vscode-dark';
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Apply theme to document
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else if (theme === 'auto') {
      // Auto mode - follow system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Apply font size to document
  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    const root = document.documentElement;
    
    // Use CSS custom property for font size
    const fontSizeValues = {
      small: '14px',
      medium: '16px',
      large: '18px',
      xlarge: '20px'
    };
    
    root.style.setProperty('--base-font-size', fontSizeValues[fontSize]);
    document.body.style.fontSize = fontSizeValues[fontSize];
  }, [fontSize]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Apply code theme
  useEffect(() => {
    localStorage.setItem('codeTheme', codeTheme);
    document.documentElement.setAttribute('data-code-theme', codeTheme);
  }, [codeTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize, codeTheme, setCodeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
